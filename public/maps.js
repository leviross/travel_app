function drawMap(x,y){
	var map = L.map('map').setView([x,y], 9);


	L.tileLayer('http://{s}.tiles.mapbox.com/v3/leviross.kglil6n5/{z}/{x}/{y}.png', {
	    zoomControl:true
	}).addTo(map);
	return map;
	// var marker = L.marker([51.5, -0.09]).addTo(map);

	// map.dragging.disable();
	// map.touchZoom.disable();
	// map.doubleClickZoom.disable();
	// map.scrollWheelZoom.disable();

}


function drawWorldMap(x,y){
	var map = L.map('world').setView([x,y], 2);


	L.tileLayer('http://{s}.tiles.mapbox.com/v3/leviross.kglil6n5/{z}/{x}/{y}.png', {
	    zoomControl:true
	}).addTo(map);
	return map;

}


