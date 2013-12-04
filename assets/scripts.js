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

function displayErrorMessage(message) {
	alert(message);
}
