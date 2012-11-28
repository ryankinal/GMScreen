var table = Object.create(itemTypes.table),
    tableWindow = Object.create(UIWindow),
    list = Object.create(itemTypes.unorderedList),
    listWindow = Object.create(UIWindow);

tableWindow.init('Initiative Order');
tableWindow.render();

listWindow.init('Shopping List');
listWindow.render();

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