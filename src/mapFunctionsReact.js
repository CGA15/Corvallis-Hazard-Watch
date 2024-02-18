    // import Hazard from './hazard';
    import Control from './hazardControl';


    export default class MapFunctions {
        constructor() {
            this.map = null;
            this.control = null;
            
            // this.map.on('click', (e) => this.onMapClick(e)); 
            this.setUpMap = this.setUpMap.bind(this);
            this.onMapClick = this.onMapClick.bind(this);
            this.updatePopupContent = this.updatePopupContent.bind(this);
            this.closePopup = this.closePopup.bind(this);
            this.submitData = this.submitData.bind(this);
            this.newHazard = this.newHazard.bind(this);
            this.getHazardType = this.getHazardType.bind(this);
            this.getRadius = this.getRadius.bind(this); 
        }
        setUpMap(map){
            this.map = map;
            this.map.on('click', (e) => this.onMapClick(e)); 
            this.setUpController() 
        }
        async setUpController() {
            try {
                const response = await fetch('/api/hazards');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Data from server:', data);
    
                // Process the data as needed
                // Example: Update the map based on the fetched data
                const control = new Control(data.data, this.map);
                this.control = control; // Set the control outside the function
    
                this.map.on('zoomend', () => {
                    const currentZoom = this.map.getZoom();
    
                    if (currentZoom >= 13) {
                        console.log('Zoom bound');
                        control.viewAll();
                    } else {
                        console.log('Zoom bound');
                        control.removeAll();
                    }
                });
    
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        }
        newHazard(lat, long, htype, time, rad) {
            // var marker = L.marker([lat,long]).addTo(map);
            // marker.bindPopup("<b>"+type+" reported at "+time+"<b>");
            if (rad==0)
                rad =null
            let hazard = {
                latitude: lat,
                longitude: long,
                created_at: time,
                type: htype,
                icon_type: null,
                text: "dummy",
                image: null,
                creator_id: 4,
                radius: rad
            }
            console.log(hazard)
            this.control.insert(hazard)
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
        onMapClick(e) {
            var popupContent = 
            `
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
                    <input type="radio" name="htype" id="pointRadio"> Point<br />
                    <input type="radio" name="htype" id="circleRadio"> Circle<br />
                    <div id="radiusSlider" style="display:none;">
                        <label for="radius">Radius:</label>
                        <input type="range" id="radius" name="radius" min="1" max="200" value="100">
                        <span id="radiusValue">50</span> meters
                    </div>
                    <button id="closeButton">Close</button>
                    <button id="submitButton">Submit</button>
                </div>`

                //fancy style

                // `<nav class="menu">
                // <input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open" />
                // <label class="menu-open-button" for="menu-open">
                // <span class="lines line-1"></span>
                // <span class="lines line-2"></span>
                // <span class="lines line-3"></span>
                // </label>

                // <a href="#" class="menu-item blue"> <i class="fa fa-balance-scale"></i> 
                // <div class="menu-item blue blue-content">
                // Police</div>
                // </a>
                // <a href="#" class="menu-item green"> <i class="fa fa-bolt"></i>
                // <div class="menu-item green green-content">
                //     Weather</div> 
                // </a>
                // <a href="#" class="menu-item red"> <i class="fa fa-road"></i>
                // <div class="menu-item red red-content">
                //     Vehicle</div> 
                // </a>
                // <a href="#" class="menu-item purple"> <i class="fa fa-map-signs"></i>
                // <div class="menu-item purple purple-content">
                // POI</div>
                // </a>
                // <a href="#" class="menu-item lightblue"> <i class="fa fa-hourglass-start"><i>
                // <div class="menu-item lightblue lightblue-content">
                //     Traffic</div> 
                // </a>
                // </nav>`
                
                ;
        
            L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(this.map);
        
            // Attach event listeners after the content is added to the DOM
            document.getElementById('pointRadio').addEventListener('click', () => this.updatePopupContent());
            document.getElementById('circleRadio').addEventListener('click', () => this.updatePopupContent());
            document.getElementById('closeButton').addEventListener('click', () => this.closePopup());
            document.getElementById('submitButton').addEventListener('click', () =>
                this.submitData(e.latlng.lat, e.latlng.lng, document.getElementById('hazard').value, new Date().toLocaleString(), this.getHazardType(), this.getRadius())
            );
        }
        updatePopupContent() {
            var circleRadio = document.getElementById('circleRadio');
            var radiusSlider = document.getElementById('radiusSlider');
        
            if (circleRadio.checked) {
            radiusSlider.style.display = 'block';
            } else {
            radiusSlider.style.display = 'none';
            }
        }
        getHazardType() {
            var pointRadio = document.getElementById('pointRadio');
            return pointRadio.checked ? 'Point' : 'Circle';
        }
        
        getRadius() {
            var circleRadio = document.getElementById('circleRadio');
            var radiusSlider = document.getElementById('radius');
        
            if (circleRadio.checked) {
            return radiusSlider.value;
            } else {
            return 0;
            }
        
        }
        
        closePopup() {
            this.map.closePopup();
        }
        
        submitData(lat, long, hazardType, time, type, rad) {
            // Handle submission logic here
            alert(`Data submitted!\nLat: ${lat}\nLong: ${long}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}`);
            console.log(rad)
            this.newHazard(lat, long, hazardType, time, rad)
            this.map.closePopup();
        }
        
        


    }