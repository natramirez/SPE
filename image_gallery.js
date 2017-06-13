//Image Gallery JavaScript Code

window.onload = function(){
	//prompts a confirm window and deletes clicked on image from database(db) and uploads folder
	$(document).on("click", '.thumbnail button.delete', function() {
		var r = confirm("Delete image?");
	    if (r == true) {   //OK button pressed                 
	        $.post("delete_image.php", 
	        	{
	        		img_path_name: $(this).siblings('.img-responsive').attr('src')
	        	}, 
	        	function (data, success) {
	        	alert(data);
	        	window.location.reload(true); 
	        });
	    }	
	});
	//gets caption from db for THIS image and inserts it into textarea
	$(document).on("click", '.thumbnail button.edit', function() {
		$.post("get_caption.php", 
	        	{
	        		img_path_name: $(this).siblings('.img-responsive').attr('src')
	        	}, 
	        	function (data, success) {
	        		$('#edit-modal').modal();
	        		var img_info = data.split(';%'); //[0] = caption, [1] = image name
	        		$('textarea').html(img_info[0]); //inserts current caption into form textarea
	        		$('#img-name-field').val(img_info[1]); //inserts image name to form hidden input
	    });
	});

	//deletes any message from form when closing edit-modal window
	$(document).on("click", '#edit-modal .modal-header button.close, #edit-modal .modal-footer button.btn', function() {
		$('.edit-msg').remove(); 
		if ($('#edit-form').hasClass('updated')) { //refreshes page if caption was updated
			location.reload();
		}
	});

	//clears form data everytime you close edit-modal window
	$('.modal').on('hidden.bs.modal', function(){
	    $(this).find('#edit-form')[0].reset();
	});

	//executes post method upon clicking submit; lets you stay on same page and returns msg results from querying db
	$('#edit-form').submit( function() {
		$.post("edit_caption.php", 
			$(this).serialize(),
        	function (data, success) {
        		if (data == 'Caption successfully updated.') { //if successful, display blue message
        			$('.edit-msg').remove();
        			$('#edit-form').append('<p class="edit-msg" style="color:blue">' + data + '</p>');
        			$('#edit-form').addClass('updated'); 
        		}
        		else {												 //otherwise show red error message
        			$('.edit-msg').remove();
        			$('#edit-form').append('<p class="edit-msg" style="color:red">' + data + '</p>');
        		}
        		// var img_path_name = $(this).find('.img-responsive').attr('src');
	    }); return false;
	});

}

