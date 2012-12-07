define(['utilities/dom', 'utilities/efence', 'utilities/cap', './controller'], function(dom, pubsub, cap, ScreenController) {
    var blanket = dom.getById('blanket'),
        windowSetList = dom.getById('windowSets'),
        newWindowInterface = dom.getById('addWindow'),
        newWindowName = dom.getById('windowName'),
        newSetInterface = dom.getById('addSet'),
        newSetName = dom.getById('setName'),
        currentSetDisplay = dom.getById('currentSetName'),
        optionsList = dom.getById('currentSetOptions'),
        error = dom.create('div'),
        hotKeys = false,
        currentSetShaded = false,
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
                item.dataset.index = index;
                item.appendChild(dom.text(set.name));

                del = dom.create('input');
                del.type = 'button';
                del.className = 'delete';
                del.title = 'Delete ' + set.name;
                del.value = 'Delete';
                del.dataset.index = index;
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
        setListClickHandler = function(e)
        {
            e = e || window.event;

            var target  = e.target || e.srcElement,
                sets = ScreenController.getWindowSets(),
                index = parseInt(target.dataset.index, 10),
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
                set;

            if (target.className === 'new-window')
            {
                newWindowInterface.style.display = 'block';
                blanket.style.display = 'block';
                windowName.focus();
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
                name = windowName.value,
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

                closeWindow(newWindowInterface, windowName);
                return false;
            }
            else if (target.className === 'cancel')
            {
                closeWindow(newWindowInterface, windowName);
                return false;
            }
        },
        hotKeyHandler = function(e)
        {
            e = e || window.event;
            var key = e.keyCode || e.which,
                character = String.fromCharCode(key);

            if (e.ctrlKey && key === 186)
            {
                hotKeys = true;
            }
            else if (key === 27)
            {
                dom.getById('blanket').style.display = 'none';
                Array.prototype.forEach.call(dom.qsa('.modal'), function(elem, index) {
                    elem.style.display = 'none';
                });
            }
        },
        commandHandler = function(e)
        {
            e = e || window.event;
            var key = e.keyCode || e.which,
                character = String.fromCharCode(key);

            if (hotKeys)
            {
                hotKeys = false;

                if (character === 'w' || character == 'W')
                {
                    newWindowInterface.style.display = 'block';
                    blanket.style.display = 'block';
                    windowName.focus();
                }
                else if (character === 's' || character === 'S')
                {
                    newSet();
                }

                e.preventDefault();
                return false;
            }
        };


    error.className = 'error';

    windowSetList.addEventListener('click', setListClickHandler);
    optionsList.addEventListener('click', optionsClickHandler);
    newWindowInterface.addEventListener('click', newWindowClickHandler);
    window.addEventListener('keydown', hotKeyHandler);
    window.addEventListener('keypress', commandHandler);
    
    pubsub.sub('ScreenController.SetAdded', function(data) {
        var set = ScreenController.getCurrentWindowSet().set;

        if (set)
        {
            set.hide();
        }
        
        ScreenController.changeWindowSet(data.index).show();
        renderWindowSets(windowSetList);
    });

    renderWindowSets(windowSetList);
    
    if (ScreenController.getWindowSets().length === 0)
    {
        newSet();
    }
});