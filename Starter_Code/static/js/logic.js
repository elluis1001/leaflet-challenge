//----------Part 1: Create the Earthquake Visualization----------//

//1.)  Get your dataset. To do so, follow these steps:
//      Use USGS to choose a dataset to visualize.
//      The url for all earthquakes the last 7 days:
//          "url":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson".

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

//2.)  Import and visualize the data by doing the following:
//      Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude:

//Create a map object:
let myMap = L.map("map").setView([39.8283, -98.5795], 5)
    console.log(myMap);

//Leaflet tile layer:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//Use d3.json to get data from URL:
d3.json(url).then(function(data) {
    console.log(data)
});

//Function to create earthquake markers = 
//  magnitude of the earthquake by their size and the depth of the earthquake by color:
function createEarthquakeMarkers(data) {
    //Set marker color based on earthquake depth
    function getColor(depth) {
      return depth > 300 ? '#7a0177' :
             depth > 100 ? '#c51b8a' :
             depth > 50 ? '#f768a1' :
             depth > 20 ? '#fbb4b9' :
                          '#feebe2';
    }
  
    //Set marker size based on earthquake magnitude
    function getRadius(magnitude) {
      return Math.sqrt(magnitude) * 5;
    }
  
    //Empty array to store markers
    let markers = [];
  
    // Loop through the earthquake data and create markers
    data.features.forEach(feature => {
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let lat = feature.geometry.coordinates[1];
      let lng = feature.geometry.coordinates[0];
  
      // Create a circle marker for each earthquake
      let marker = L.circleMarker([lat, lng], {
        radius: getRadius(magnitude),
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      // Popups that provide additional information about the earthquake when its associated marker is clicked:
      }).bindPopup(`<b>Location:</b> ${
        feature.properties.place}<br><b>Magnitude:</b>, ${magnitude}<br><b>Depth:</b> ${depth} km`);
      
      // Add the marker to the markers array:
      markers.push(marker); 
    });
    
    // Return the array of markers:
    return markers; 
  };
  
  // Use d3.json to get data from the URL
  d3.json(url)
    .then(function(data) {
      // Create earthquake markers:
      let earthquakeMarkers = createEarthquakeMarkers(data);
  
      // Add the markers to a Leaflet layer group and then add to the map
      L.layerGroup(earthquakeMarkers).addTo(myMap);
    });

// Legend:
function createLegend() {
  let legend = L.control({position: 'bottomright'});

  //Add legend to map:
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 20, 50, 100, 300];
    let labels = [];
  
    // Title/heading of the legend:
    div.innerHTML += '<h4>Earthquake Depth in km.</h4>';

    // Create the label with a colored square:
    //  Done by looping through the depth intervals:
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;

  };
  
    // d3.json to get data from URL:
    d3.json(url).then(function (data) {
      // Create earthquake markers:
      let legendQuake = createLegend(); 
      
      // Add the legend to the map
      legendQuake.addTo(myMap);
    });
  
  legend.addTo(map);
  
 };