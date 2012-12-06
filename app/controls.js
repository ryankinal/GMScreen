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
                currentSetDisplay.appendChild(dom.text(currentSet.set.name));
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
                ScreenController.removeWindowSet(index).hide();
                
                if (set = ScreenController.getCurrentWindowSet().set)
                {
                    set.show();
                }
                
                renderWindowSets();
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
                ScreenController.removeWindowSet(ScreenController.getCurrentWindowSet().index).hide();
                
                if (set = ScreenController.getCurrentWindowSet().set)
                {
                    set.show();
                }

                renderWindowSets(windowSetList);
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
        newSetClickHandler = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                name = setName.value;

            if (target.className === 'okay')
            {
                if (name.replace(/(^\s+|\s+$)/g, '') === '')
                {
                    error.appendChild(dom.text('Give your new screen a name'));
                    newSetInterface.appendChild(error);
                    return;
                }
                else
                {
                    ScreenController.addWindowSet(name);
                    closeWindow(newSetInterface, setName);
                }
            }
            else if (target.className === 'cancel')
            {
                closeWindow(newSetInterface, setName);
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