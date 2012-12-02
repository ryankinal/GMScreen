var windowSet = Object.create(UIWindowSet),
    table = Object.create(itemTypes.table),
    tableWindow = Object.create(UIWindow),
    list = Object.create(itemTypes.unorderedList),
    listWindow = Object.create(UIWindow),
    list2 = Object.create(itemTypes.orderedList),
    list2Window = Object.create(UIWindow);

windowSet.init('Fuck You, That\'s Why');
tableWindow.init('Initiative Order', dom.getById('screen'));
listWindow.init('Shopping List', dom.getById('screen'));
list2Window.init('Steps to success', dom.getById('screen'));

windowSet.addWindow(tableWindow);
windowSet.addWindow(listWindow);
windowSet.addWindow(list2Window);
windowSet.render();

table.load({
    headers:
    [
        'Character Name',
        'Initiative',
        'Perception'
    ],
    body:
    [
        [
            'JR',
            27,
            4
        ],
        [
            'Eric',
            14,
            30
        ]
    ]
});

table.render(tableWindow.content);

list.load([
    'Milk',
    'Eggs',
    'Rice',
    'Apples',
    'Tofu'
]);

list.render(listWindow.content);

list2.load([
    'Steal underpants',
    '...',
    'Profit'
]);

list2.render(list2Window.content);