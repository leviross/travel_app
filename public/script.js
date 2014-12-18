$(function(){
	$('.delete').on('click', function(event) {
		event.preventDefault();
		var id = $(this).data("id");
		var deleteThis = $(this);

		$.ajax({
			url:'/favplaces/' + deleteThis.data("id"),
			type: "DELETE",
			success:function(result) {
				deleteThis.closest('li').fadeOut('slow', function() {
					$(this).remove();
				})
			}
		});


	});
	$('.before').on('click', function(event) {
		//return;
		event.preventDefault();
		//alert('worked');
		var myButton = $(this);


		$.post('/favplaces', {
			name: myButton.data('name'), 
			capital: myButton.data('capital'),
			lat: myButton.data('lat'),
			lng: myButton.data('lng')
		}, function(returnData) {
				// console.log("THE RETURN DATA IS: "+	returnData);
				if(returnData.wasItCreated){
					// alert('it was created');
					myButton.fadeOut(550);
				$('#addedtofav').fadeIn(1000);
				}else{
					// console.log("THE RETURN DATA IS: "+	returnData);

					alert('it was already in your list');
					myButton.fadeOut(550);

				}
				// alert('is this working?');
				// console.log(returnData);


			});


	});//THINKING ABOUT DOING AJAX FOR POSTING EXPERIENCE 
	// $('#review').on('click', function(event) {
	// 	// alert('worked');

	// 	// return;
	// 	event.preventDefault();
	// 	var myButton = $(this);


	// 	$.post('/reviews', {
	// 		name: myButton.data('name'), 
	// 		capital: myButton.data('capital'),
	// 		lat: myButton.data('lat'),
	// 		lng: myButton.data('lng')
	// 	}, function(returnData) {
	// 			// console.log("THE RETURN DATA IS: "+	returnData);
	// 			if(returnData.wasItCreated){
	// 				// alert('it was created');
	// 				myButton.fadeOut(550);
	// 			$('#addedtofav').fadeIn(1000);
	// 			}else{
	// 				// console.log("THE RETURN DATA IS: "+	returnData);

	// 				alert('it was already in your list');
	// 				myButton.fadeOut(550);

	// 			}
	// 			// alert('is this working?');
	// 			// console.log(returnData);


	// 		});


	// });

});







