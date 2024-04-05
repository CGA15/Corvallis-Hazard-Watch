/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import MapFunctions from './mapFunctionsReact';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for styling
import { css } from '@emotion/react';
// import hazardTypes from "./hazardTypes.json"
import { useDispatch, useSelector } from 'react-redux';
import { selectStore } from '../redux/storeSlice';
import { selectHazTypes } from '../redux/hazTypesRedux';
import Control from './hazardControl';
import hazardTypesJson from './hazardTypes.json'
import { add } from '../redux/storeSlice'
import MapPopUp from './mapPopUp';
import { renderToString } from 'react-dom/server';
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";




//This is the react page for the map page 
const MapPage = () => {
  const mapContainerRef = useRef(null);
  const haztypes = useSelector(selectHazTypes)
  const mapRef = useRef(null);
  const [mapFunctions, setMapFunctions] = useState(null)
  const [dropDown, setDropDown] = useState(false)
  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000*100 );
  const [startDate, setStartDate] = useState(twentyFourHoursAgo.toISOString());
  const [endDate, setEndDate] = useState(currentDate.toISOString());
  const [checkList, setCheckList] = useState(false)
  const [selectedHazards, setSelectedHazards] = useState({});
  const [map, setMap] = useState(null)
  const [setUpOnce, setSetUpOnce] = useState(false)
  const hazards = useSelector(selectStore)
  const hazardTypes = useSelector(selectHazTypes)
  const [controller, setController] = useState(null)
  const dispatch = useDispatch(); // Move useDispatch() outside of the component body






  // Define the renderReactComponentToHTML function to convert a React component to HTML string
  function renderReactComponentToHTML(component) {
    const htmlString = renderToString(component);
    return htmlString;
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
  // returns the selected data type that was selected
  function getHazardType() {
    var pointRadio = document.getElementById('pointRadio');
    return pointRadio.checked ? 'Point' : 'Circle';
  }
  // returns radius from radius slider.
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
  //function for when you click the submit button. 
  function submitData(lat, long, hazardType, time, type, rad) {
    // Handle submission logic here
    alert(`Data submitted!\nLat: ${lat}\nLong: ${long}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}`);
    ////console.log(rad)
    newHazard(lat, long, hazardType, time, rad)
    map.closePopup();
  }
  const newHazard =  (lat, long, htype, time, rad) =>{
    if (rad == 0)
        rad = null
    let hazard = {
        latitude: lat,
        longitude: long,
        created_at: time,
        type: parseInt(htype, 10),
        icon_type: null,
        text: "dummy",  
        image: null,
        creator_id: 4,
        radius: rad
    }
    console.log(controller)
    controller.insert(hazard)
    hazard.created_at= hazard.created_at.toLocaleString()
    // const dispatch = useDispatch()
    dispatch(add(hazard))
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
            // //console.log('Server response:', data);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error('Error:', error.message);
            // Handle errors
        });

}
  // Define the onMapClick function
  const onMapClick = (e) => {
    //const popupContent = renderReactComponentToHTML(<MapPopUp e={e} map={map} />);
    //console.log("set On Click")

    // L.popup()
    //   .setLatLng(e.latlng)
    //   .setContent(popupContent)
    //   .openOn(map);
    var popupContent = `
                    <div>
                        <h3>Please select a type of issue</h3>
                        <select name="hazard" id="hazard">
                            ${hazardTypes.map(hazard => `
                                <option value="${hazard.id}">${hazard.name}</option>
                            `).join('')}
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
                    </div>
                `;

    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);

    // Attach event listeners after the content is added to the DOM
    //make sure to attach after, as the this operation with html elements doesnt work well.
    document.getElementById('pointRadio').addEventListener('click', () => updatePopupContent());
    document.getElementById('circleRadio').addEventListener('click', () => updatePopupContent());
    document.getElementById('closeButton').addEventListener('click', () => closePopup());
    document.getElementById('submitButton').addEventListener('click', () =>
      submitData(e.latlng.lat, e.latlng.lng, document.getElementById('hazard').value, new Date(), getHazardType(), getRadius())
    );
  }

  //when the page loads, it will run this code to initialize the map
  useEffect(() => {
    // Function to initialize the map
    if (hazards.length > 0) {
      const initializeMap = () => {
        // Check if the map is already initialized
        if (!mapContainerRef.current._leaflet_id) {
          // Create a Leaflet map with an initial view
          setMap(L.map(mapContainerRef.current).setView([44.5646, -123.2620], 15));

          // Add a tile layer to the map        
        }
      };

      // Check if the map container ref is defined before calling the function to not try to initialize a second time
      if (mapContainerRef.current) {
        initializeMap();

      }
    }
    // Specify any cleanup code if needed
    return () => {
      // Cleanup code, not currently needed
    };
  }, [hazards]); // Empty dependency array ensures that it runs only once on mount
  useEffect(() => {
    if (map && !setUpOnce) {
      setSetUpOnce(false)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      mapRef.current = map;
     
      const controller = new Control(hazards,map,hazardTypes)
      setController(controller)
      console.log("check",controller)


      //console.log("haztypes check one")
      //console.log(haztypes)
    }
  }, [map, setUpOnce])
  useEffect (() => {
    if(controller)
      map.on('click', (e) => onMapClick(e))
    
  }, [controller])
  const openFilters = () => {
    setDropDown(!dropDown)

  }
  const submitFilters = () => {
    // Gather filter values
    const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }

    ////console.log(start, end, hazards);

    // Pass filters to mapFunctions.filter()
    controller.filter(start, end, hazards);
  };

  const handleCheckboxChange = (hazardName) => {
    setSelectedHazards(prevState => ({
      ...prevState,
      [hazardName]: !prevState[hazardName],
    }));
  };




  // var checkList = document.getElementById('list1');
  // checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  //   if (checkList.classList.contains('visible'))
  //     checkList.classList.remove('visible');
  //   else
  //     checkList.classList.add('visible');
  // }
  const openCheckList = () => {
    ////console.log("hello")
    setCheckList(!checkList)
  }
  const filterBox = css`
 text-align: right;
`;
  return (
    //current map, to change height, modify the height variable, likely you could modify width by adding that aas a field
    <div>
      <div css={filterBox}>
        {/* <button onClick={openFilters}>Filters</button> */}
        {/* {dropDown && ( */}
        <div>
          Start Date:
          <input
            type='date'
            id='startDate'
            value={startDate.split('T')[0]}  // Format the date string to 'YYYY-MM-DD'
            onChange={(e) => setStartDate(e.target.value)}
          />
          End Date:
          <input
            type='date'
            id='endDate'
            value={endDate.split('T')[0]}  // Format the date string to 'YYYY-MM-DD'
            onChange={(e) => setEndDate(e.target.value)}
          />
          {/* <button>Options</button> */}
          <div id="list1" className="dropdown-check-list" tabIndex="100">
            <span className="anchor" onClick={() => setCheckList(!checkList)}>Hazard Types</span>
            {checkList && (
              <ul className="items">
                {hazardTypes.map(hazard => (
                  <li key={hazard.id}>
                    <input
                      id={hazard.id}
                      value={hazard.name}
                      type="checkbox"
                      checked={selectedHazards[hazard.name] || false}
                      onChange={() => handleCheckboxChange(hazard.name)}
                    />
                    {hazard.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={submitFilters}>Submit</button>
        </div>
        {/* )} */}

      </div>
      <div ref={mapContainerRef} id="map" style={{ height: '500px' }}>
      </div>
    </div>
  );
};

export default MapPage;
