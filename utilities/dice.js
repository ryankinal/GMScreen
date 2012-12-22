define(function() {
    var dice = {},
        diceRegex = /(?:^|\b)roll\(([\dd\+\-\s]+)(?:,\s*([vt\d]+))?\)/gi,
        bonusRegex = /^\d$/
        opRegex = /[\+\-]/g,
        diePartRegex = /d/i,
        parse = function(expression, threshold)
        {
            expression = expression.replace(/\s/g, '');

            var operators = expression.match(opRegex),
                expressions = expression.split(opRegex),
                expressionValues = [],
                total = 0,
                totalBonus = 0,
                dice = [];

            expressions.forEach(function(expression) {
                if (bonusRegex.test(expression))
                {
                    expressionValues.push(parseInt(expression, 10));
                }
                else if (expression === 0)
                {
                    expressionValues.push(0);
                }
                else
                {
                    expressionValues.push(die(expression)); 
                }
            });

            expressionValues.forEach(function(value, index) { 
                var expressionValue = 0;

                if (typeof value === 'object' && value.length)
                {
                    value.forEach(function(die) {
                        dice.push(die);

                        if (typeof threshold === 'undefined')
                        {
                            expressionValue += die;    
                        }
                        else
                        {
                            expressionValue += (die >= threshold) ? 1 : 0;
                        }
                    });
                }
                else
                {
                    expressionValue += value;
                }

                if (index > 0 && operators[index - 1] === '-')
                {
                    expressionValue = expressionValue * -1;
                }

                total += expressionValue;
            });

            return {
                dice: dice,
                total: total
            }
        },
        die = function(expression)
        {
            var parts = expression.split(diePartRegex),
                rolls = (parts[0] === '') ? 1 : parseInt(parts[0], 10),
                size = parseInt(parts[1], 10)
                values = [];

            while (rolls--)
            {
                values.push(Math.ceil(Math.random() * size));
            }

            return values;
        };

    dice.replace = function(value)
    {
        return value.replace(diceRegex, function(match, dievalue, flags) {
            var verbose = (flags && flags.indexOf('v') >= 0) ? true : false,
                threshold = (flags && flags.indexOf('t') >= 0) ? parseInt(flags.match(/t(\d+)/)[1], 10) : undefined,
                data = parse(dievalue, threshold),
                replacement = data.total;

            if (verbose)
            {
                replacement += ' [' + data.dice.join(',') + ']';
            }

            return replacement
        });
    }

    return dice;
});