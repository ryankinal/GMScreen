var controller = Object.create(ScreenController),
    windowSet = controller.addWindowSet('Testing'),
    tableWindow = controller.addTable('Initiative Order', {
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
    }),
    orderedlistWindow = controller.addUnorderedList('Shopping List', [
        'Milk',
        'Eggs',
        'Rice',
        'Apples',
        'Tofu'
    ]),
    unorderedListWindow = controller.addOrderedList('Steps to Success', [
        'Steal underpants',
        '...',
        'Profit'
    ]);

efence.sub('ScreenController.WindowAdded', function(data) {
    console.dir(data);
});

efence.sub('ScreenController.SetAdded', function(data) {
    console.dir(data);
});
efence.sub('UIWindow.Hidden', function(data) {
    console.dir(data);
});
efence.sub('UIWindow.Removed', function(data) {
    console.dir(data);
});

newWindow = controller.addTable('moar tables', {
    headers: [
        'condition',
        'modifier'
    ]
})
newSet = controller.addWindowSet('Moar Windoze');