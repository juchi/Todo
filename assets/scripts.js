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
            var elements = ui.item.siblings().andSelf();
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

    $('.timezone li').on('dblclick', function() {
        editTitle($(this));
    });
});

function editTitle(li) {
    li.find('.view').hide();
    var input = $('<input type="text" class="edit-task"/>');
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
    var li = input.parent();
    var newTitle = input.val();
    updateElements({id:li.data('id'), title:newTitle});
    input.hide();
    li.find('.title').text(newTitle);
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
