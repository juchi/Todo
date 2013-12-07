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

function updateElement(index, values) {
    jQuery.ajax('/update', {
        type: 'POST',
        data: {'id':index, 'data':JSON.stringify(values)}
    }).fail(function() {
        displayErrorMessage('Unable to update the item.');
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