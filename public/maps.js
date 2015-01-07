function drawMap(x,y){
	var map = L.map('map').setView([x,y], 5);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

	L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
	return map;
	// var marker = L.marker([51.5, -0.09]).addTo(map);

	// map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

}


// function drawFavPlaces(x, y){
// 	L.mapbox.accessToken = 'pk.eyJ1IjoibGV2aXJvc3MiLCJhIjoiYTlobXlocyJ9.vN58Urs3q4vCMOIAItTCOQ';
// 		var map = L.mapbox.map('map', 'leviross.kglil6n5', {
// 			zoomControl: false
// 		}).setView([x,y], 2)
// 		// map.addControl(L.mapbox.legendControl());
// 		map.touchZoom.disable();
// 		map.doubleClickZoom.disable();
// 		map.scrollWheelZoom.disable();

// 		var layers = {
// 	      Streets: L.mapbox.tileLayer('examples.map-i87786ca'),
// 	      Outdoors: L.mapbox.tileLayer('examples.ik7djhcc'),
// 	      Satellite: L.mapbox.tileLayer('examples.map-igb471ik'),
	      
// 	  	};

// 	  	layers.Streets.addTo(map);
// 	  	L.control.layers(layers).addTo(map);
// 	  	L.control.zoomslider().addTo(map);
// }



// NOT USING THIS MAP, WENT WITH MAPBOX ABOVE
function drawFavPlaces(x,y){
	var map = L.map('map').setView([x,y], 2);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

	L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	return map;

}
// NOT USING THIS MAP, WENT WITH MAPBOX ON THE worldmap.ejs PAGE
// function drawWorldMap(x,y){
// 	var map = L.map('worldmap').setView([x,y], 3);
// 	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
// 	// added a new street map layer instead of mapbox
// 	// L.tileLayer('//{s}.tiles.mapbox.com/v3/leviross.kglil6n5/{z}/{x}/{y}.png', {
// 	//     zoomControl:true
// 	// }).addTo(map);
// 	L.tileLayer(
//             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '&copy; ' + mapLink + ' Contributors',
//             maxZoom: 18,
//             }).addTo(map);
	
// 	// map.dragging.disable();
// 	map.touchZoom.disable();
// 	map.doubleClickZoom.disable();
// 	map.scrollWheelZoom.disable();
// 	return map;
// }


