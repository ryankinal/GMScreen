define(['utilities/dom', 'utilities/efence', 'utilities/cap', './controller', './themes'], function(dom, pubsub, cap, ScreenController, ThemeManager) {
    var blanket = dom.getById('blanket'),
        windowSetList = dom.getById('windowSets'),
        newWindowInterface = dom.getById('addWindow'),
        newWindowName = dom.getById('windowName'),
        newSetInterface = dom.getById('addSet'),
        newSetName = dom.getById('setName'),
        currentSetDisplay = dom.getById('currentSetName'),
        optionsList = dom.getById('currentSetOptions'),
        themeList = dom.getById('themeList'),
        error = dom.create('div'),
        hotKeys = false,
        renderWindowSets = function(parent)
        {
            var fragment = dom.fragment(),
                current = dom.create('span'),
                all = dom.create('ul'),
                item,
                itemLink,
                del,
                sets = ScreenController.getWindowSets(),
                currentSet = ScreenController.getCurrentWindowSet(),
                newWindow = dom.create('li');

            current.appendChild(dom.text('Your Screens'));
            fragment.appendChild(current);

            sets.forEach(function(set, index) {
                item = dom.create('li');
                item.className = (index === currentSet.index) ? 'window-set current' : 'window-set';
                item.setAttribute('data-index', index);
                item.appendChild(dom.text(set.name));

                del = dom.create('input');
                del.type = 'button';
                del.className = 'delete';
                del.title = 'Delete ' + set.name;
                del.value = 'Delete';
                del.setAttribute('data-index', index);
                item.appendChild(del);

                all.appendChild(item);
            });

            newWindow.appendChild(dom.text('New Screen...'));
            newWindow.className = 'new-window-set';

            all.appendChild(newWindow);

            fragment.appendChild(all);
            dom.empty(windowSetList);
            windowSetList.appendChild(fragment);

            dom.empty(currentSetDisplay);

            if (sets.length)
            {
                currentSetDisplay.appendChild(dom.text('Showing: ' + currentSet.set.name));
                optionsList.style.display = 'block';
            }
            else
            {
                optionsList.style.display = 'none';
            }
        },
        renderThemeList = function()
        {
            var currentSet = ScreenController.getCurrentWindowSet().set;

            dom.empty(themeList);

            ThemeManager.themes.forEach(function(theme) {
                var item = dom.create('li');

                item.className = (currentSet && theme.name === currentSet.theme) ? 'theme current' : 'theme';
                item.setAttribute('data-name', theme.name);
                item.appendChild(dom.text(theme.display || theme.name));
                themeList.appendChild(item);
            });
        },
        setListClickHandler = function(e)
        {
            e = e || window.event;

            var target  = e.target || e.srcElement,
                sets = ScreenController.getWindowSets(),
                index = parseInt(target.getAttribute('data-index', 10)),
                set;

            if (target.className === 'window-set')
            {
                if (index !== ScreenController.getCurrentWindowSet().index)
                {
                    ScreenController.getCurrentWindowSet().set.hide();
                    ScreenController.changeWindowSet(index).show();
                    renderWindowSets(windowSetList);
                }
            }
            else if (target.className === 'new-window-set')
            {
                newSet();
            }
            else if (target.className === 'delete')
            {
                cap.confirm({
                    message: 'Are you sure you want to delete this screen?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    onConfirm: function(e) {
                        ScreenController.removeWindowSet(index).hide();
                        
                        if (set = ScreenController.getCurrentWindowSet().set)
                        {
                            set.show();
                        }
                        
                        renderWindowSets();        
                    }
                });
            }

            return false;
        },
        optionsClickHandler = function(e)
        {
            e = e || window.event;

            var target = e.target || e.srcElement,
                set,
                name;

            if (target.className === 'new-window')
            {
                newWindowInterface.style.display = 'block';
                blanket.style.display = 'block';
                newWindowName.focus();
            }
            else if (target.className === 'shade')
            {
                ScreenController.getCurrentWindowSet().set.shade(true);
            }
            else if (target.className === 'unshade')
            {
                ScreenController.getCurrentWindowSet().set.shade(false);
            }
            else if (target.className === 'delete')
            {
                cap.confirm({
                    message: 'Are you sure you want to delete this screen?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    onConfirm: function(e) {
                        ScreenController.removeWindowSet(ScreenController.getCurrentWindowSet().index).hide();
                
                        if (set = ScreenController.getCurrentWindowSet().set)
                        {
                            set.show();
                        }

                        renderWindowSets(windowSetList);
                    }
                });
            }
            else if (target.className === 'theme' || target.className === 'theme current')
            {
                ScreenController.getCurrentWindowSet().set.changeTheme(target.getAttribute('data-name'));
            }

            return false;
        },
        closeWindow = function(win, input)
        {
            blanket.style.display = 'none';
            win.style.display = 'none';
            dom.empty(error);
            input.value = '';

            if (error.parentNode)
            {
                error.parentNode.removeChild(error);
            }
        },
        newSet = function()
        {
            cap.prompt({
                content: '<h2>Add a Screen</h2><p>Enter a name for your new screen</p>',
                contentType: 'html',
                confirmText: 'Create',
                cancelText: 'Cancel',
                onConfirm: function(e, data) {
                    ScreenController.addWindowSet(data);
                }
            });
        },
        newWindowClickHandler = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                name = newWindowName.value,
                submitRex = /\b(table|ordered-list|unordered-list)\b/;

            if (submitRex.test(target.className))
            {
                if (name.replace(/(^\s+|\s+$)/g, '') === '')
                {
                    dom.empty(error);
                    error.appendChild(dom.text('Give your new window a name'));
                    newWindowInterface.appendChild(error);
                    return;
                }

                if (/\btable\b/.test(target.className))
                {
                    ScreenController.addTable(name, {
                        headers: [],
                        body: []
                    });
                }
                else if (/\bordered-list\b/.test(target.className))
                {
                    ScreenController.addOrderedList(name, []);
                }
                else if (/\bunordered-list\b/.test(target.className))
                {
                    ScreenController.addUnorderedList(name, []);
                }

                closeWindow(newWindowInterface, newWindowName);
                return false;
            }
            else if (target.className === 'cancel')
            {
                closeWindow(newWindowInterface, newWindowName);
                return false;
            }
        },
        hotKeyHandler = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                tagName = target.tagName.toLowerCase(),
                key = e.keyCode || e.which,
                character = String.fromCharCode(key).toLowerCase();

            if (tagName !== 'input' && tagName !== 'textarea' && blanket.style.display !== 'block')
            {
                if (character === 'w' && ScreenController.getCurrentWindowSet().set)
                {
                    newWindowInterface.style.display = 'block';
                    blanket.style.display = 'block';
                    newWindowName.focus();
                    return false;
                }
                else if (character === 's')
                {
                    newSet();
                    return false;
                }
            }
            else if (key === 27 && newWindowInterface.style.display === 'block')
            {
                newWindowInterface.style.display = 'none';
                blanket.style.display = 'none';
                newWindowName.value = '';
            }
        };


    error.className = 'error';

    windowSetList.addEventListener('click', setListClickHandler);
    optionsList.addEventListener('click', optionsClickHandler);
    newWindowInterface.addEventListener('click', newWindowClickHandler);
    window.addEventListener('keyup', hotKeyHandler);
    
    pubsub.sub('ScreenController.SetAdded', function(data) {
        var set = ScreenController.getCurrentWindowSet().set;

        if (set)
        {
            set.hide();
        }
        
        ScreenController.changeWindowSet(data.index).show();
        renderWindowSets(windowSetList);
    });

    ScreenController.load();
    
    pubsub.sub('*', function(data) {
        ScreenController.save();
    });

    pubsub.sub('UIWindowSet.ThemeChanged', function(data) {
        renderThemeList();
    });

    renderWindowSets(windowSetList);
    renderThemeList();
    
    if (ScreenController.getWindowSets().length === 0)
    {
        newSet();
    }
});