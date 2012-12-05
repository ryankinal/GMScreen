(function(pubsub) {
    var windowSetList = dom.getById('windowSets'),
        currentSetDisplay = dom.getById('currentSetName'),
        optionsList = dom.getById('currentSetOptions'),
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
                // show interface for adding new window set
            }
        },
        optionsClickHandler = function(e)
        {
            e = e || window.event;

            var target = e.target || e.srcElement,
                text;

            if (target.className === 'new-window')
            {
                // show interface for adding new window
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
        };


    windowSetList.addEventListener('click', setListClickHandler);
    optionsList.addEventListener('click', optionsClickHandler);
    
    
    window.addEventListener('load', function(e) {
        renderWindowSets(windowSetList);
    });
})(efence);