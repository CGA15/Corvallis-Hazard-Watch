// import Hazard from './hazard';
// import Control from './hazardControl';



var map = L.map('map').setView([44.5646, -123.2620], 15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var controller
function testHazard(lat, long, time, htype) {
  // var marker = L.marker([lat,long]).addTo(map);
  // marker.bindPopup("<b>"+type+" reported at "+time+"<b>");
  hazard = {
    latitude: lat,
    longitude: long,
    created_at: time,
    type: htype,
    icon_type: null,
    text: "dummy",
    image: null,
    creator_id: 4
  }
  controller.insert(hazard)
  fetch('./api/addHazard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(hazard),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Server response:', data);
      // Handle the response data as needed
    })
    .catch(error => {
      console.error('Error:', error.message);
      // Handle errors
    });

}

function circleHazard(lat, long, time, type, radius) {
  var circle = L.circle([lat, long], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: radius

  }).addTo(map);
  circle.bindPopup("<b>" + type + " reported at " + time + "<b>")
}

function onMapClick(e) {
  var popupContent = `
  <div>
    <h3>Please select a type of issue</h3>
    <select name="hazard" id="hazard">
      <option value="crash">crash</option>
      <option value="Flood">Flood</option>
      <option value="Cop">Cop</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <div>
    <input type="radio" name="htype" id="pointRadio" onclick="updatePopupContent()"> Point<br />
    <input type="radio" name="htype" id="circleRadio" onclick="updatePopupContent()"> Circle<br />
    <div id="radiusSlider" style="display:none;">
      <label for="radius">Radius:</label>
      <input type="range" id="radius" name="radius" min="1" max="200" value="100">
      <span id="radiusValue">50</span> meters
    </div>
    <button onclick="closePopup()">Close</button>
    <button onclick="submitData(${e.latlng.lat}, ${e.latlng.lng}, document.getElementById('hazard').value, '${new Date().toLocaleString()}', getHazardType(), getRadius())">Submit</button>
  </div>
`;

  var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);
}

function updatePopupContent() {
  var circleRadio = document.getElementById('circleRadio');
  var radiusSlider = document.getElementById('radiusSlider');

  if (circleRadio.checked) {
    radiusSlider.style.display = 'block';
  } else {
    radiusSlider.style.display = 'none';
  }
}

function getHazardType() {
  var pointRadio = document.getElementById('pointRadio');
  return pointRadio.checked ? 'Point' : 'Circle';
}

function getRadius() {
  var circleRadio = document.getElementById('circleRadio');
  var radiusSlider = document.getElementById('radius');

  if (circleRadio.checked) {
    return radiusSlider.value;
  } else {
    return 0;
  }

}

function closePopup() {
  map.closePopup();
}

function submitData(lat, long, hazardType, time, type, rad) {
  // Handle submission logic here
  alert(`Data submitted!\nLat: ${lat}\nLong: ${long}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}`);
  if (type == "Circle") {
    circleHazard(lat, long, hazardType, time, rad)
  }
  else if (type == "Point")
    testHazard(lat, long, hazardType, time)
  map.closePopup();
}

map.on('click', onMapClick);

var datavals
async function fetchDataFromServer() {
  try {
    const response = await fetch('/api/hazards');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    datavals = data
    console.log('Data from server:', data);

    // Process the data as needed
    // Example: Update the map based on the fetched data
    controller = new Control(data.data, map)
    // map.on('zoomend', function () {
    //   // Get the current zoom level
    //   const currentZoom = map.getZoom();

    //   // Check if the zoom level is below a certain threshold
    //   if (currentZoom >= 13) {
    //       // Zoomed out, do something
    //       console.log('Zoom bound');
    //       controller.viewAll();
    //   }
    //   else
    //   {
    //       console.log('Zoom bound');
    //       controller.removeAll();
    //   }
    // });


  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

fetchDataFromServer()

