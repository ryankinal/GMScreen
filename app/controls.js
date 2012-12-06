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
            currentSetDisplay.appendChild(dom.text(currentSet.set.name));
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
            }
        },
        optionsClickHandler = function(e)
        {
            e = e || window.event;

            var target = e.target || e.srcElement,
                text;

            if (target.className === 'new-window')
            {
                newWindowInterface.style.display = 'block';
                blanket.style.display = 'block';
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
                ScreenController.getCurrentWindowSet().set.show();
                renderWindowSets(windowSetList);
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
                    blanket.style.display = 'none';
                    newSetInterface.style.display = 'none';
                }
            }
            else if (target.className === 'cancel')
            {
                blanket.style.display = 'none';
                newSetInterface.style.display = 'none';
            }
        },
        newWindowClickHandler = function(e)
        {

        };


    error.className = 'error';

    windowSetList.addEventListener('click', setListClickHandler);
    optionsList.addEventListener('click', optionsClickHandler);
    newSetInterface.addEventListener('click', newSetClickHandler);
    newWindowInterface.addEventListener('click', newWindowClickHandler);
    
    pubsub.sub('ScreenController.SetAdded', function(data) {
        ScreenController.getCurrentWindowSet().set.hide();
        ScreenController.changeWindowSet(data.index).show();
        renderWindowSets(windowSetList);
    });

    window.addEventListener('load', function(e) {
        renderWindowSets(windowSetList);
        renderItemTypes();
    });
})(efence);