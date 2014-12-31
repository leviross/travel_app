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
function drawWorldMap(x,y){
	var map = L.map('worldmap').setView([x,y], 3);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	// added a new street map layer instead of mapbox
	// L.tileLayer('//{s}.tiles.mapbox.com/v3/leviross.kglil6n5/{z}/{x}/{y}.png', {
	//     zoomControl:true
	// }).addTo(map);
	L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
	
	// map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	return map;
}


