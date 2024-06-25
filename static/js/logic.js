const API_KEY = 'pk.eyJ1IjoiY29saW5yb2JlcnRzLWNvbnRhY3QiLCJhIjoiY2x4OXZ6b2MzMnZ0ZzJscG9vbzBqc2c1MyJ9.YCYZ4FXf9pOwfJEm1w';

// Function to determine marker size based on magnitude ---------------------------------------------------------------
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 5; 
}

// Function to determine marker color based on depth  ---------------------------------------------------------------
function markerColor(depth) {
  return depth > 90 ? '#ff5f65' :
         depth > 70 ? '#fca35d' :
         depth > 50 ? '#fdb72a' :
         depth > 30 ? '#f7db11' :
         depth > 10 ? '#dcf400' :
                      '#a3f600';
}

// map ---------------------------------------------------------------
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Base maps ---------------------------------------------------------------
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + API_KEY, {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: "mapbox/streets-v11"
}).addTo(myMap);

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + API_KEY, {
  id: "mapbox/satellite-v9",
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
});

var baseMaps = {
  "Street Map": streetMap,
  "Satellite Map": satelliteMap
};

// GeoJSON data  ---------------------------------------------------------------
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

d3.json(geoData).then(function(data) {
  // Debug: Check if data is loaded correctly
  console.log(data);

  // GeoJSON layer earthquakeData object ---------------------------------------------------------------
  L.geoJSON(data, {
    // Create circle markers ---------------------------------------------------------------
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style circles ---------------------------------------------------------------
    style: function(feature) {
      return {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      };
    },
    // Create popups for each marker ---------------------------------------------------------------
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`);
    }
  }).addTo(earthquakes);
});

d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
  L.geoJSON(data, {
    style: {
      color: "orange",
      weight: 2
    }
  }).addTo(tectonicPlates);
});

var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Add the layer control to the map  ---------------------------------------------------------------
var layerControl = L.control.layers(baseMaps, overlayMaps, {
  collapsed: false 
}).addTo(myMap);
 
earthquakes.addTo(myMap);

// Add legend  ---------------------------------------------------------------
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
      depths = [-10, 10, 30, 50, 70],
      labels = [];

  // bottom menu ---------------------------------------------------------------
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};

legend.addTo(myMap);
