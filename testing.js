var newTable = Object.create(itemTypes.table);

newTable.load({
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

newTable.render();

newList = Object.create(itemTypes.orderedList);

newList.load([
    'testing some good stuff here',
    'moar testing please!',
    'I can totally believe it\'s not butter'
]);

newList.render();

/*var textarea = document.createElement('textarea');

textarea.addEventListener('blur', function() {
    console.log('blurred');
});

document.body.appendChild(textarea);

textarea.focus();

document.body.removeChild(textarea);*/