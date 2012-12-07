define(['utilities/dom'], function(dom) {
    var blanket = dom.getById('blanket'),
        cap = {},
        current,
        error = dom.create('div'),
        showCurrent = function(parent)
        {
            parent.appendChild(current);
            current.style.display = 'block';
            blanket.style.display = 'block';
        },
        closeCurrent = function()
        {
            if (current)
            {
                current.style.display = 'none';
                blanket.style.display = 'none';
                current.parentNode.removeChild(current);
            }
        };

    if (!blanket)
    {
        blanket = dom.create('div');
        blanket.id = 'blanket';
        blanket.className = 'blanket';
        document.body.appendChild(blanket);
    }

    cap.confirm = function(settings)
    {
        settings = settings || {};

        var box = dom.create('div'),
            okay = dom.create('input'),
            cancel = dom.create('input'),
            buttons = dom.create('div'),
            paragraph = dom.create('p'),
            parent = settings.parent || document.body;

        box.className = settings.className || 'modal';

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

            if (close && settings.hide !== false)
            {
                closeCurrent();
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

            if (close && settings.hide !== false)
            {
                closeCurrent();
            }
        });

        current = box;

        if (settings.show !== false)
        {
            showCurrent(parent);
        }

        return {
            element: box,
            blanket: blanket
        };
    }

    cap.alert = function(settings)
    {
        settings = settings || {};

        var box = dom.create('div'),
            content,
            okay = dom.create('input'),
            buttons = dom.create('div'),
            parent = settings.parent || document.body;

        box.className = settings.className || 'modal';

        okay.type = 'button';
        okay.className = 'okay';
        okay.value = settings.okayText || 'Okay';

        buttons.appendChild(okay);

        if (settings.contentType === 'html')
        {
            content = dom.create('div');
            content.innerHtml = settings.content;
        }
        else if (settings.contentType === 'node')
        {
            content = settings.content;
        }
        else
        {
            content = dom.create('p');
            content.appendChild(dom.text(settings.content));
        }

        box.appendChild(content);
        box.appendChild(buttons);

        okay.addEventListener('click', function(e) {
            var close,
                handlerReturnValue;

            if (typeof settings.onConfirm === 'function')
            {
                handlerReturnValue = settings.onConfirm(e);
                close = handlerReturnValue || typeof handlerReturnValue === 'undefined';
            }
            else
            {
                close = true;
            }

            if (close && settings.hide !== false)
            {
                closeCurrent();
            }
        });

        current = box;

        if (settings.show !== false)
        {
            showCurrent(parent);
        }

        return {
            element: box,
            blanket: blanket
        }
    }

    cap.prompt = function(settings)
    {
        settings = settings || {};

        var box = dom.create('div'),
            input = dom.create(settings.input || 'input'),
            okay = dom.create('input'),
            cancel,
            content,
            buttons = dom.create('div'),
            parent = settings.parent || document.body,
            trim = settings.trim !== false,
            trimRegex = /(^\s+|\s$)/g,
            validate = settings.validate || function(data) {
                return /.+/.test(data);
            },
            confirm = function(e) {
                var value = input.value,
                    handlerReturnValue,
                    close;

                if (trim)
                {
                    value = value.replace(trimRegex, '');
                }

                if (validate(value))
                {
                    if (typeof settings.onConfirm === 'function')
                    {
                        handlerReturnValue = settings.onConfirm(e, value);
                        close = handlerReturnValue || typeof handlerReturnValue === 'undefined';
                    }
                    else
                    {
                        close = true;
                    }

                    if (close && settings.hide !== false)
                    {
                        closeCurrent();
                    }
                }
                else
                {
                    dom.empty(error);
                    error.appendChild(dom.text(settings.invalidError || 'Invalid input'));
                    box.appendChild(error);
                }
            };

        box.className = settings.className || 'modal';

        if (!settings.input)
        {
            input.type = 'text';
        }

        input.className = 'prompt-input';

        okay.type = 'button';
        okay.className = 'okay';
        okay.value = settings.confirmText || 'Okay';

        buttons.appendChild(input);
        buttons.appendChild(okay);

        if (settings.contentType === 'html')
        {
            content = dom.create('div');
            content.innerHTML = settings.content;
        }
        else if (settings.contentType === 'node')
        {
            content = settings.content;
        }
        else
        {
            content = dom.create('p');
            content.appendChild(dom.text(settings.content));
        }

        box.appendChild(content);
        box.appendChild(buttons);

        okay.addEventListener('click', confirm);

        if (settings.submitOnEnter !== false)
        {
            input.addEventListener('keypress', function(e) {
                e = e || window.event;
                var key = e.keyCode || e.which;

                if (key === 13)
                {
                    confirm(e);
                }
            });
        }

        if (settings.allowCancel)
        {
             cancel = dom.create('input')
             cancel.type = 'button';
             cancel.className = 'cancel';
             cancel.value = settings.cancelText || 'Cancel';

             cancel.addEventListener('click', function(e) {
                var close,
                    handlerReturnValue;

                if (typeof settings.onCancel === 'function')
                {
                    handlerReturnValue = settings.onCancel(e);
                    close = handlerReturnValue || typeof handlerReturnValue === 'undefined';
                }
                else
                {
                    close = true;
                }

                if (close && settings.hide !== false)
                {
                    closeCurrent();
                }
             });

             buttons.appendChild(cancel);
        }

        current = box;

        if (settings.show !== false)
        {
            showCurrent(parent);
            input.focus();
        }

        return {
            element: box,
            blanket: blanket
        }
    }

    return cap;
});