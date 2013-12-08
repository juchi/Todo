jQuery(function($){
    $('.timezone .list').sortable({
        connectWith:".timezone .list",
        stop: function(event, ui) {
            var elements = ui.item.siblings().andSelf();
            var data = [];
            elements.each(function() {
                $this = $(this);
                data.push({
                    id:$this.data('id'),
                    position:$this.index(),
                    timezone:$this.closest('section').data('timezone')
                });
            });
            updateElements(data);
        }
    });
});

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

function updateElements(elements) {
    jQuery.ajax('/update', {
        type: 'POST',
        data: {'data':JSON.stringify(elements)}
    }).fail(function() {
        displayErrorMessage('Unable to update the items.');
    });
}

function displayErrorMessage(message) {
    alert(message);
}

function startDrag(taskId, event) {
    event.dataTransfer.setData('task', taskId);
}

function drop(event) {
    if (event.target.className != 'timezone') {
        return;
    }
    var timezone = event.target.dataset.timezone;
    var id = event.dataTransfer.getData('task');
    var todo = document.getElementById('todo'+id);
    jQuery(event.target).children('ul').append(todo);
    updateElement(id, {timezone:timezone});
}

function dragOver(event) {
    event.preventDefault();
}