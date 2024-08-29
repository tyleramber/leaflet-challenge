// Initialize the map and set its view to the US
var map = L.map('map').setView([37.09, -95.71], 5); // Centered on the US

// Add a tile layer (the map background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// URL to the earthquake data (last 7 days)
var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the earthquake data using D3
d3.json(earthquakeDataUrl).then(function(data) {
    // Call the function to create markers
    createMarkers(data);
});
function createMarkers(earthquakeData) {
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 3; // Adjust the size multiplier as needed
    }

    // Function to determine marker color based on depth
    function getColor(depth) {
        return depth > 90 ? '#800026' :
               depth > 70 ? '#BD0026' :
               depth > 50 ? '#E31A1C' :
               depth > 30 ? '#FC4E2A' :
               depth > 10 ? '#FD8D3C' :
                            '#FEB24C';
    }

    // Create a GeoJSON layer with the earthquake data
    L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(map);
}

// Create a legend control
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        colors = ['#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

    // Create a gradient for the legend background
    div.innerHTML = '<div class="legend-title">Depth (km)</div>';
    for (var i = 0; i < depths.length - 1; i++) {
        div.innerHTML +=
            '<i style="background: linear-gradient(to right, ' + colors[i] + ', ' + colors[i + 1] + ');"></i> ' +
            depths[i] + '&ndash;' + depths[i + 1] + '<br>';
    }
    div.innerHTML += '<i style="background:' + colors[colors.length - 1] + '"></i> ' + depths[depths.length - 1] + '+';

    return div;
};

// Add the legend to the map
legend.addTo(map);
