$(document).on('mouseenter', '.todo-task', function(){
	
	$('.todo-task').mousedown(function(){
		$('#delete-area').addClass('zoomIn').removeClass('invisible zoomOut');
		
		$(document).mouseup(function(){
			$('#delete-area').addClass('zoomOut').removeClass('zoomIn');
		});
	});

	$('#delete-area').hover(function(){
		$(this).removeClass('zoomIn').addClass('swing');
	});
});
