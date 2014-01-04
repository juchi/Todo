jQuery(function($){
    $('.timezone .list')
    .sortable({
        items:"> li:not(.placeholder)",
        revert: 300,
        connectWith:".timezone .list",
        stop: function(event, ui) {
            var sectionTimezone = ui.item.closest('section').data('timezone');
            var taskUpdated = null;
            if (ui.item.data('timezone') != sectionTimezone) {
                ui.item.data('timezone', sectionTimezone);
                taskUpdated = ui.item.data('id');
            }
            var elements = ui.item.siblings('.task').addBack();
            var data = [];
            elements.each(function() {
                $this = $(this);
                data.push({
                    id:$this.data('id'),
                    position:$this.index(),
                    timezone:sectionTimezone
                });
            });
            updateElements(data, taskUpdated);
        }
    });

    $('.timezone .view').on('dblclick', function() {
        editTitle($(this).parent());
    });
    $('.task .remove').on('click', function() {
        var id = $(this).closest('.task').data('id');
        deleteElement(id);
        return false;
    });
    $('.task .edit').on('click', function() {
        var html = $('#task-options').html();
        var task = $(this).closest('.task').append(html);
        var getDate = function() {
            return $('#deadline').val();
        };

        (function() {
            var input = document.createElement('input');
            input.setAttribute('type', 'date');
            if (input.type == 'text') {
                var picker = $('.datepicker').datepicker();
                getDate = function() {
                    var date = picker.datepicker('getDate');
                    return $.datepicker.formatDate('yy-mm-dd', date);
                };
            }
        })();

        task.find('.options form').on('submit', function() {
            var element = {};
            element.id = $(this).closest('.task').data('id');
            element.deadline = getDate();
            updateElements(element);
            $(this).closest('.options').remove();
            return false;
        });

        return false;
    });
});

function editTitle(li) {
    li.find('.view').hide();
    var input = $('<input type="text" class="edit-task" required/>');
    input.val(li.find('.title').text());
    li.append(input);

    input.focus();
    input.on('blur', function() {updateTitle($(this));});
    input.on('keypress', function(e) {
        if (e.keyCode == 13) {
            updateTitle($(this));
        }
    });
}
function updateTitle(input) {
    var li = input.closest('li');

    if (input.val()) {
        var newTitle = input.val();
        updateElements({id:li.data('id'), title:newTitle});
        li.find('.title').text(newTitle);
    }
    input.remove();
    li.find('.view').show();
}

function deleteElement(index) {
    jQuery.ajax('/delete', {
        type: 'POST',
        data: {'id':index}
    }).done(function(data){
        jQuery('#todo'+index).remove();
    }).fail(function() {
        displayErrorMessage('Unable to delete the item.');
    });
}

function updateElements(elements, taskUpdated) {
    jQuery.ajax('/update', {
        type: 'POST',
        data: {
            'data':JSON.stringify(elements),
            'task_updated':taskUpdated
    }
    }).fail(function() {
        displayErrorMessage('Unable to update the items.');
    });
}

function displayErrorMessage(message) {
    alert(message);
}
