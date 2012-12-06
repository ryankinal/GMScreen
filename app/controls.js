(function(pubsub) {
    var blanket = dom.getById('blanket'),
        windowSetList = dom.getById('windowSets'),
        newWindowInterface = dom.getById('addWindow'),
        newWindowName = dom.getById('windowName'),
        newSetInterface = dom.getById('addSet'),
        newSetName = dom.getById('setName'),
        currentSetDisplay = dom.getById('currentSetName'),
        optionsList = dom.getById('currentSetOptions'),
        error = dom.create('div'),
        currentSetShaded = false,
        confirmBox = function(settings)
        {
            settings = settings || {};

            var box = dom.create('div'),
                okay = dom.create('input'),
                cancel = dom.create('input'),
                buttons = dom.create('div'),
                paragraph = dom.create('p'),
                parent = settings.parent || document.body;

            box.className = 'modal';

            okay.type = 'button';
            okay.value = settings.confirmText || 'Yes';

            cancel.type = 'button';
            cancel.value = settings.cancelText || 'No';

            paragraph.appendChild(dom.text(settings.message || 'Are you sure?'));

            buttons.appendChild(okay);
            buttons.appendChild(cancel);

            box.appendChild(paragraph);
            box.appendChild(buttons);

            okay.addEventListener('click', function(e) {
                var close, handlerReturnValue;

                if (typeof settings.onConfirm === 'function')
                {
                    handlerReturnValue = settings.onConfirm(e);
                    close = handlerReturnValue || typeof handlerReturnValue === 'undefined';
                }
                else
                {
                    close = true;
                }

                if (close)
                {
                    box.style.display = 'none';
                    blanket.style.display = 'none';
                    bos.parentNode.removeChild(box);
                }
            });

            cancel.addEventListener('click', function(e) {
                var close, handlerReturnValue;

                if (typeof settings.onCancel === 'function')
                {
                    handlerReturnValue = settings.onCancel(e);
                    close = handlerReturnValue || typeof handlerReturnValue === 'undefined';
                }
                else
                {
                    close = true;
                }

                if (close)
                {
                    box.style.display = 'none';
                    blanket.style.display = 'none';
                    box.parentNode.removeChild(box);
                }
            });

            parent.appendChild(box);
            box.style.display = 'block';
            blanket.style.display = 'block';
        },
        renderWindowSets = function(parent)
        {
            var i,
                fragment = dom.fragment(),
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

            for (i = 0; i < sets.length; i++)
            {
                item = dom.create('li');
                console.log(i, currentSet.index);
                item.className = (i === currentSet.index) ? 'window-set current' : 'window-set';
                item.dataset.index = i;
                item.appendChild(dom.text(sets[i].name));

                del = dom.create('input');
                del.type = 'button';
                del.className = 'delete';
                del.title = 'Delete ' + sets[i].name;
                del.value = 'Delete';
                del.dataset.index = i;
                item.appendChild(del);

                all.appendChild(item);
            }

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
                newSetInterface.style.display = 'block';
                blanket.style.display = 'block';
                setName.focus();
            }
            else if (target.className === 'delete')
            {
                confirmBox({
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
                confirmBox({
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
            var name = setName.value;

            if (name.replace(/(&\s+|\s+$)/g, '') === '')
            {
                dom.empty(error);
                error.appendChild('Give your new screen a name');
                newSetInterface.appendChild(error);
                return false;
            }
            else
            {
                ScreenController.addWindowSet(name);
                closeWindow(newSetInterface, setName);
            }
        },
        newSetClickHandler = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;

            if (target.className === 'okay')
            {
                newSet();
            }
            else if (target.className === 'cancel')
            {
                closeWindow(newSetInterface, setName);
            }
        },
        newSetKeypressHandler = function(e)
        {
            e = e || window.event;
            var key = e.keyCode || e.which,
                target = e.target || e.srcElement;

            if (target.tagName === 'INPUT' && target.type === 'text' && key === 13)
            {
                newSet();
            }
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
            }
            else if (target.className === 'cancel')
            {
                closeWindow(newWindowInterface, windowName);
            }
        };


    error.className = 'error';

    windowSetList.addEventListener('click', setListClickHandler);
    optionsList.addEventListener('click', optionsClickHandler);
    newSetInterface.addEventListener('click', newSetClickHandler);
    newSetInterface.addEventListener('keypress', newSetKeypressHandler);
    newWindowInterface.addEventListener('click', newWindowClickHandler);
    
    pubsub.sub('ScreenController.SetAdded', function(data) {
        var set = ScreenController.getCurrentWindowSet().set;

        if (set)
        {
            set.hide();
        }
        
        ScreenController.changeWindowSet(data.index).show();
        renderWindowSets(windowSetList);
    });

    window.addEventListener('load', function(e) {
        renderWindowSets(windowSetList);
        if (ScreenController.getWindowSets().length === 0)
        {
            blanket.style.display = 'block';
            newSetInterface.style.display = 'block';
            setName.focus();
        }
    });
})(efence);