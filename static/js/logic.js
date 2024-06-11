const API_KEY = 'pk.eyJ1IjoiY29saW5yb2JlcnRzLWNvbnRhY3QiLCJhIjoiY2x4OXZ6b2MzMnZ0ZzJscG9vbzBqc2c1MyJ9.YCYZ4FXf9BWu9pOwfJEm1w';

// MAP
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 4
});

// Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + API_KEY, {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11"
}).addTo(myMap);

// Get Geojson Data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// D3 Load Data
d3.json(geoData).then(function(data) {
  console.log(data);

  function markerSize(mag) {
    return mag * 10000; // Adjust the size multiplier as needed
  }

  // Loop through locations and create markers
  data.features.forEach(function(feature) {
    var coordinates = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;

    L.circle([coordinates[1], coordinates[0]], {
      stroke: false,
      fillOpacity: 0.75,
      color: "orange",
      fillColor: "red",
      radius: markerSize(magnitude)
    }).addTo(myMap);
  });
});
