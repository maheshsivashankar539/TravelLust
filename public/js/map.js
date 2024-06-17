mapboxgl.accessToken = mapToken;
let pos= JSON.parse(coordinates);
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      center: pos, // starting position [lng, lat]
      zoom: 10 // starting zoom
  });

  const marker=new mapboxgl.Marker({color:"red"}).setLngLat(pos).addTo(map);