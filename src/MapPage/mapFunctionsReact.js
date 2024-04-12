// // import Hazard from './hazard';
// import Control from './hazardControl';
// import hazardTypes from './hazardTypes.json'
// import { useDispatch } from 'react-redux'; // Import useDispatch hook to dispatch actions
// import store from '../redux/store'; // Path to your Redux store
// import {add} from '../redux/storeSlice'


// //This object controls the main page
// export default class MapFunctions {
//     constructor(haztypes) {
//         this.map = null;
//         this.control = null;
//         this.haztypes = haztypes
//         // //console.log(this.hazardTypes)
//         // this.map.on('click', (e) => this.onMapClick(e)); 
//         this.setUpMap = this.setUpMap.bind(this);
//         this.onMapClick = this.onMapClick.bind(this);
//         this.updatePopupContent = this.updatePopupContent.bind(this);
//         this.closePopup = this.closePopup.bind(this);
//         this.submitData = this.submitData.bind(this);
//         this.newHazard = this.newHazard.bind(this);
//         this.getHazardType = this.getHazardType.bind(this);
//         this.getRadius = this.getRadius.bind(this);
//         this.filter = this.filter.bind(this)
//     }
//     // initialize the map functions
//     setUpMap(map,hazards) {
//         this.map = map;
//         // this.map.on('click', (e) => this.onMapClick(e));
//         var hazlist = hazards
//         this.setUpController(hazlist)
//     }
//     //calls the server to get the data points then feeds it into the array list
//     setUpController(hazards) {
        
//             var data = hazards
            
//             //console.log("haz types test in map functions")
//             //console.log(this.haztypes)
//             const control = new Control(data, this.map,  this.haztypes);
//             this.control = control; // Set the control outside the function         

//     }
//     filter(start, end, types) {        
//         this.control.filter(start, end, types)
//     }
//     // creates a new hazard object and inserts it into the array list, then it sends it to the data base
//     newHazard(lat, long, htype, time, rad) {
//         if (rad == 0)
//             rad = null
//         let hazard = {
//             latitude: lat,
//             longitude: long,
//             created_at: time,
//             type: parseInt(htype, 10),
//             icon_type: null,
//             text: "dummy",
//             image: null,
//             creator_id: 4,
//             radius: rad
//         }
//         this.control.insert(hazard)
//         const dispatch = useDispatch()
//         dispatch(add(hazard))
//         fetch('./api/addHazard', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(hazard),
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 // //console.log('Server response:', data);
//                 // Handle the response data as needed
//             })
//             .catch(error => {
//                 console.error('Error:', error.message);
//                 // Handle errors
//             });

//     }
//     // when you click the map the pop up shows up
//     onMapClick(e) {
//         var popupContent = `
//                     <div>
//                         <h3>Please select a type of issue</h3>
//                         <select name="hazard" id="hazard">
//                             ${hazardTypes.data.map(hazard => `
//                                 <option value="${hazard.id}">${hazard.name}</option>
//                             `).join('')}
//                         </select>
//                     </div>
//                     <div>
//                         <input type="radio" name="htype" id="pointRadio"> Point<br />
//                         <input type="radio" name="htype" id="circleRadio"> Circle<br />
//                         <div id="radiusSlider" style="display:none;">
//                             <label for="radius">Radius:</label>
//                             <input type="range" id="radius" name="radius" min="1" max="200" value="100">
//                             <span id="radiusValue">50</span> meters
//                         </div>
//                         <button id="closeButton">Close</button>
//                         <button id="submitButton">Submit</button>
//                     </div>
//                 `;

//         L.popup()
//             .setLatLng(e.latlng)
//             .setContent(popupContent)
//             .openOn(this.map);

//         // Attach event listeners after the content is added to the DOM
//         //make sure to attach after, as the this operation with html elements doesnt work well.
//         document.getElementById('pointRadio').addEventListener('click', () => this.updatePopupContent());
//         document.getElementById('circleRadio').addEventListener('click', () => this.updatePopupContent());
//         document.getElementById('closeButton').addEventListener('click', () => this.closePopup());
//         document.getElementById('submitButton').addEventListener('click', () =>
//             this.submitData(e.latlng.lat, e.latlng.lng, document.getElementById('hazard').value, new Date(), this.getHazardType(), this.getRadius())
//         );
//     }
//     // function to display the radius slider, if you select circle 
//     updatePopupContent() {
//         var circleRadio = document.getElementById('circleRadio');
//         var radiusSlider = document.getElementById('radiusSlider');

//         if (circleRadio.checked) {
//             radiusSlider.style.display = 'block';
//         } else {
//             radiusSlider.style.display = 'none';
//         }
//     }
//     // returns the selected data type that was selected
//     getHazardType() {
//         var pointRadio = document.getElementById('pointRadio');
//         return pointRadio.checked ? 'Point' : 'Circle';
//     }
//     // returns radius from radius slider.
//     getRadius() {
//         var circleRadio = document.getElementById('circleRadio');
//         var radiusSlider = document.getElementById('radius');

//         if (circleRadio.checked) {
//             return radiusSlider.value;
//         } else {
//             return 0;
//         }

//     }

//     closePopup() {
//         this.map.closePopup();
//     }
//     //function for when you click the submit button. 
//     submitData(lat, long, hazardType, time, type, rad) {
//         // Handle submission logic here
//         alert(`Data submitted!\nLat: ${lat}\nLong: ${long}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}`);
//         ////console.log(rad)
//         this.newHazard(lat, long, hazardType, time, rad)
//         this.map.closePopup();
//     }
// }