var windowSet = Object.create(UIWindowSet),
    table = Object.create(itemTypes.table),
    tableWindow = Object.create(UIWindow),
    list = Object.create(itemTypes.unorderedList),
    listWindow = Object.create(UIWindow);

windowSet.init('Fuck You, That\'s Why');
tableWindow.init('Initiative Order');
listWindow.init('Shopping List');

windowSet.addWindow(tableWindow);
windowSet.addWindow(listWindow);
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