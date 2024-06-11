mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.5946, 12.9716], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker= new mapboxgl.Marker().setLngLat(coordinates).addTo(map);