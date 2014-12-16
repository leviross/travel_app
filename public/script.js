$(function(){
	$('.deleteMovie').on('click', function(event) {
		event.preventDefault();
		var id = $(this).data("id");
		var deleteThis = $(this);

		$.ajax({
			url:'/watch_list/' + deleteThis.data("id"),
			type: "DELETE",
			success:function(result) {
				deleteThis.closest('li').fadeOut('slow', function() {
					$(this).remove();
				})
			}
		})


	})
	$('.before').on('click', function(event) {
		//return;
		event.preventDefault();
		//alert('worked');
		var myButton = $(this);


		$.post('/favplaces', {
			name: myButton.data('name'), 
			capital: myButton.data('capital')
		}, function(returnData) {
				console.log(returnData);
				if(returnData.wasItCreated){
					// alert('it was created');
					myButton.fadeOut(550);
				$('#addedtofav').fadeIn(1000);
				}else{
					alert('it was already in your list');
					myButton.fadeOut(550);

				}
				// alert('is this working?');
				// console.log(returnData);


			});


	});

});







