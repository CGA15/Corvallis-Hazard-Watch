/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L, { control } from 'leaflet';
// import MapFunctions from './mapFunctionsReact';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for styling
import { css } from '@emotion/react';
// import hazardTypes from "./hazardTypes.json"
import { useDispatch, useSelector } from 'react-redux';
import { selectStore, selectFetchedAt, fetchData } from '../redux/storeSlice';
import { selectSensor, fetchSensor } from '../redux/sensorSlice';
import { selectHazTypes } from '../redux/hazTypesRedux';
import { selectIcons } from '../redux/iconSlice';
import Control from './hazardControl';
import { add } from '../redux/storeSlice'
import { renderToString } from 'react-dom/server';
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import badWordsFilter from 'bad-words'






//This is the react page for the map page 
const MapPage = () => {
  var popup
  const dataAge = useSelector(selectFetchedAt)
  const mapContainerRef = useRef(null);
  // const haztypes = useSelector(selectHazTypes)
  const mapRef = useRef(null);
  // const [mapFunctions, setMapFunctions] = useState(null)
  const [dropDown, setDropDown] = useState(false)
  const currentTime = new Date();
  const currentDate = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [checkList, setCheckList] = useState(false)
  const [selectedHazards, setSelectedHazards] = useState({});
  const [map, setMap] = useState(null)
  const [setUpOnce, setSetUpOnce] = useState(false)
  const hazards = useSelector(selectStore)
  const hazardTypes = useSelector(selectHazTypes)
  const icons = useSelector(selectIcons)
  const sesnors = useSelector(selectSensor)
  //console.log("hazards" , hazards)
  //console.log("hazardTypes" , hazardTypes)
  //console.log("icons" , icons)

  const [controller, setController] = useState(null)
  const dispatch = useDispatch(); // Move useDispatch() outside of the component body
  const apiKey = 'bed1848ba67a4ff12b0e3c2f5c0421fe';
  const { lat, lon, time } = useParams();
  const [grouped, setGrouped] = useState(false)
  const [update, setUpdate] = useState()
  const [length, setLength] = useState(0)

  const { isAuthenticated } = useAuth0();




  // Function to request permission and get the user's location
  function getUserLocation() {
    if (navigator.permissions) {
      // Check if the Permissions API is supported
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'granted') {
          // Permission already granted, get the user's location
          getLocation();
        } else if (permissionStatus.state === 'prompt') {
          // Permission not yet granted, ask the user
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // User has granted permission, get the location
              getLocation();
            },
            (error) => {
              console.error('Error getting user location:', error.message);
            }
          );
        } else {
          // Permission denied or unavailable
          // map.setView([44.5646, -123.2620], 15);

          console.error('Geolocation permission denied or unavailable.');
        }
      });
    } else {
      // Permissions API not supported
      // map.setView([44.5646, -123.2620], 15);

      console.error('Permissions API is not supported in this browser.');
    }
  }

  // Function to get the user's location
  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        map.setView([latitude, longitude], 14);
        return latitude, longitude
      },
      (error) => {
        // map.setView([44.5646, -123.2620], 15);
        console.error('Error getting user location:', error.message);
      }
    );
  }

  //updates the content in the popup made, updates the radio check and the slider
  function updatePopupContent(randomNum) {
    var circleRadio = document.getElementById(`circleRadio${randomNum}`);
    var radiusSlider = document.getElementById(`radiusSlider${randomNum}`);

    if (circleRadio.checked) {
      radiusSlider.style.display = 'block';
    } else {
      radiusSlider.style.display = 'none';
    }
  }
  // returns the selected data type that was selected
  function getHazardType(randomNum) {
    var pointRadio = document.getElementById(`pointRadio${randomNum}`);
    return pointRadio.checked ? 'Point' : 'Circle';
  }
  // returns radius from radius slider.
  function getRadius(randomNum) {
    var circleRadio = document.getElementById(`circleRadio${randomNum}`);
    var radiusSlider = document.getElementById(`radius${randomNum}`);

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
  function submitData(lat, long, hazardType, time, type, rad, text, popup, randomNum) {
    // Handle submission logic here
    const badLength = document.getElementById(`bad-length${randomNum}`)
    var badWordsCaught = document.getElementById(`bad-words${randomNum}`)
    badWordsCaught.style.display = 'none'
    badLength.style.display = 'none'

    const filter = new badWordsFilter
    if (long < -180 || long > 180) {
      var lat = lat - Math.floor((lat + 90) / 180) * 180
      var long = long - Math.floor((long + 180) / 360) * 360
      map.setView([lat, long], 13)
    }
    if (text.length > 200) {
      const badLengthValue = document.getElementById(`bad-length-value${randomNum}`)
      badLength.style.display = 'block'
      badLengthValue.textContent = text.length - 200 + " characters over the limit"
      const mapSize = map.getSize();
      const latlng = { lat: lat, lng: long };
      const mapBounds = map.getBounds();

      // Calculate the vertical offset in pixels from the bottom
      const offsetY = 0//mapSize.y/2;

      // Convert the offset to geographical units
      const latLngBottomPoint = map.containerPointToLatLng([mapSize.x / 2, mapSize.y - offsetY]);

      // Calculate the new center latitude
      const centerLat = latlng.lat - (latLngBottomPoint.lat - mapBounds.getCenter().lat);

      // Pan the map to the new center
      map.panTo([centerLat, latlng.lng]);
    }
    //checks for bad language
    else if (filter.isProfane(text)) {
      const badWords = findCensoredWords(text, filter.clean(text));
      var badWordsId = document.getElementById(`bad-words-found${randomNum}`)
      badWordsId.textContent = badWords;
      badWordsCaught.style.display = 'block'
      const mapSize = map.getSize();
      const latlng = { lat: lat, lng: long };
      const mapBounds = map.getBounds();

      // Calculate the vertical offset in pixels from the bottom
      const offsetY = 0//mapSize.y/2;

      // Convert the offset to geographical units
      const latLngBottomPoint = map.containerPointToLatLng([mapSize.x / 2, mapSize.y - offsetY]);

      // Calculate the new center latitude
      const centerLat = latlng.lat - (latLngBottomPoint.lat - mapBounds.getCenter().lat);

      // Pan the map to the new center
      map.panTo([centerLat, latlng.lng]);

    }
    else {
      newHazard(lat, long, hazardType, time, rad, text)
      map.closePopup();
    }
  }
  // finds the words that were censored
  function findCensoredWords(original, censored) {
    const originalWords = original.split(' ');
    const censoredWords = censored.split(' ');
    var result = "";

    for (let i = 0; i < originalWords.length; i++) {
      if (censoredWords[i].includes('*')) {
        result += originalWords[i] + " ";
      }
    }

    return result;
  }
  //creates a new hazard icon on the map
  const newHazard = async (lat, long, htype, time, rad, textContent) => {
    var locdata = "N/A"
    try {
      const limit = 1;
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=${limit}&appid=${apiKey}`);
      const location = await response.json();
      //formats bassed off of US data
      if (location[0] && location[0].country && location[0].country === "US") {
        const locString = `${location[0].name},${location[0].state}, ${location[0].country}`
        locdata = locString;
      }
      //generic layout for location
      else {
        if (location[0] && location[0].country) {
          const locString = `${location[0].name}, ${location[0].country}`
          locdata = locString;
        }
        else {
          locdata = "N/A";
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching location data');
    }
    if (rad == 0)
      rad = null
    let hazard = {
      latitude: lat,
      longitude: long,
      created_at: time,
      type: parseInt(htype, 10),
      icon_type: null,
      text: textContent,
      image: null,
      creator_id: 10,
      radius: rad,
      location: locdata
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }
    //inserts hazard into the map
    controller.insert(hazard, start, end, hazards)
    hazard.created_at = hazard.created_at.toLocaleString()
    // adds the hazard itno local data
    dispatch(add(hazard))
    //adds hazard into db
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
        // //////console.log('Server response:', data);
        // Handle the response data as needed
      })
      .catch(error => {
        console.error('Error:', error.message);
        // Handle errors
      });

  }

  // Define the onMapClick function
  const onMapClick = (e) => {

    if (!isAuthenticated) {
      alert('You need to be signed in to post a hazard');
      return;
    } else {
      const randomNum = Math.floor(Math.random() * 100000000) + 1;
      var popupContent = `
                      <div>
                          <h3>Please select a type of issue</h3>
                          <select name="hazard" id="hazard${randomNum}">
                              ${hazardTypes.map(hazard => `
                                  <option value="${hazard.id}">${hazard.name}</option>
                              `).join('')}
                          </select>
                          <input type="text" id="textInput${randomNum}" placeholder= "description"> 
                          <div id ="bad-length${randomNum}" style="display:none;">
                            <p>The text entered exceeds character limit</p>
                            <p id = "bad-length-value${randomNum}" ></p>
                          </div>
                          <div id ="bad-words${randomNum}" style="display:none;">
                            <p id ="bad-words-caught${randomNum}" >The text you attempted to submit contains a word not allowed in our service</p>
                            <p id = "bad-words-found${randomNum}" ></p>
                          </div>
                      </div>
                      <div>
                          <input type="radio" name="htype" id="pointRadio${randomNum}" checked> Point<br />
                          <input type="radio" name="htype" id="circleRadio${randomNum}"> Circle<br />
                          <div id="radiusSlider${randomNum}" style="display:none;">
                              <label for="radius">Radius:</label>
                              <input type="range" id="radius${randomNum}" name="radius" min="1" max="200" value="100">
                              <span id="radiusValue${randomNum}">50</span> meters
                          </div>
                          <button id="closeButton${randomNum}">Close</button>
                          <button id="submitButton${randomNum}">Submit</button>
                      </div>
                  `;

      popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

      // Attach event listeners after the content is added to the DOM
      //make sure to attach after, as the this operation with html elements doesnt work well.
      document.getElementById(`pointRadio${randomNum}`).addEventListener('click', () => updatePopupContent(randomNum));
      document.getElementById(`circleRadio${randomNum}`).addEventListener('click', () => updatePopupContent(randomNum));
      document.getElementById(`closeButton${randomNum}`).addEventListener('click', () => closePopup(randomNum));
      document.getElementById(`radius${randomNum}`).addEventListener('input', () => {
        document.getElementById(`radiusValue${randomNum}`).textContent = document.getElementById(`radius${randomNum}`).value;
      });

      document.getElementById(`submitButton${randomNum}`).addEventListener('click', () =>
        submitData(e.latlng.lat, e.latlng.lng, document.getElementById(`hazard${randomNum}`).value, new Date(), getHazardType(randomNum), getRadius(randomNum), document.getElementById(`textInput${randomNum}`).value, popup, randomNum)
      );
    }

  }
  // gets the data from redux store
  const getData = async () => {
    dispatch(fetchSensor())
    dispatch(fetchData())
    setUpdate(true)
  }
  //use effect that will run when hazards, sensors and update are set, this is to update current displayed content
  useEffect(() => {
    if (update && hazards.length != length && controller) {
      // //console.log("update called")
      const start = new Date(startDate);
      const end = new Date(endDate);
      var hazardsTypes = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

      if (hazardsTypes.length === 0) {
        hazardsTypes = "All";
      }
      controller.update(hazards, start, end, hazardsTypes, sesnors)
      setLength(hazards.length)
      setUpdate(null)
    }
  }, [hazards, sesnors, update])
  //when the page loads, it will run this code to initialize the map
  useEffect(() => {
    // Function to initialize the map
    if (hazards.length > 0) {
      const initializeMap = () => {
        // Check if the map is already initialized

        if (!mapContainerRef.current._leaflet_id) {
          // Create a Leaflet map with an initial view
          if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon)) && !isNaN(parseFloat(time))) {
            const newStart = new Date(parseFloat(time) - 24 * 60 * 60 * 1000)
            const newEnd = new Date(parseFloat(time) + 24 * 60 * 60 * 1000)
            setStartDate(newStart.toISOString())
            setEndDate(newEnd.toISOString())
            setMap(L.map(mapContainerRef.current).setView([parseFloat(lat), parseFloat(lon)], 18));

          } else {
            setStartDate(twentyFourHoursAgo.toISOString())
            setEndDate(currentDate.toISOString())
            setMap(L.map(mapContainerRef.current).setView([44.564568, -123.262047], 15));
          }

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
  }, [hazards]); // dependent on the hazards array
  //adds tile layer to the map and creates the control object that runs the map
  useEffect(() => {
    if (map && !setUpOnce && sesnors) {
      setSetUpOnce(false)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      mapRef.current = map;

      const controller = new Control(hazards, map, hazardTypes, apiKey, icons, sesnors)
      setLength(hazards.length)
      setController(controller)
      if (isNaN(parseFloat(lat)))
        getUserLocation()
    }
  }, [map, setUpOnce, sesnors])//dependent on map and sesnors variables updating for this to be called

  //sets up the map functions and initial filter
  useEffect(() => {
    if (controller) {
      if (Date.now() - dataAge > 5 * 1000) {
        // //console.log("data too old")
        getData()

      }
      map.on('click', (e) => onMapClick(e))
      var start
      var endTime
      if (!isNaN(parseFloat(time))) {
        start = new Date(parseFloat(time) - 24 * 60 * 60 * 1000)
        endTime = new Date(parseFloat(time) + 24 * 60 * 60 * 1000)
      }
      else {
        start = twentyFourHoursAgo;
        endTime = currentDate
      }
      controller.filter(start, endTime, "All")
      map.on('zoomend', function () {
        // Get the current zoom level
        const currentZoom = map.getZoom();

        // Check if the zoom level is below a certain threshold
        if (currentZoom >= 13) {         
          unGroup();
        }
        else {
          group();
        }
      });
    }

  }, [controller])

  //gather filter data then filter the results
  const submitFilters = () => {
    // Gather filter values
    const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }

    // Pass filters to mapFunctions.filter()
    controller.filter(start, end, hazards);
  };
// updates when you change a selection in the checkbox
  const handleCheckboxChange = (hazardName) => {
    setSelectedHazards(prevState => ({
      ...prevState,
      [hazardName]: !prevState[hazardName],
    }));
  };
// hadnles logic to run the hazardControls group code
  const group = () => {

    controller.group()

  }
// hadnles logic to run the hazardControls ungroup code

  const unGroup = () => {

    const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }
    controller.unGroup(start, end, hazards, apiKey)
    submitFilters()
    //due to leaflet not wanting to update values, this was the best way I could get the program to work
    //these functions were passed statically I think which made it so in order to filter with new data, I needed to
    // use a click event so that it clicks the filter button rather then filtering with the method above
    const targetElement = document.getElementById('desperate');
    if (targetElement) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      targetElement.dispatchEvent(clickEvent);
    }

  }


  const filterBox = css`
 text-align: right;
 position: relative;
 z-index: 1000;
`;
  return (
    //current map, to change height, modify the height variable, likely you could modify width by adding that aas a field
    <div>
      <div css={filterBox}>
        {/* <button onClick={openFilters}>Filters</button> */}
        {/* {dropDown && ( */}
        {startDate && endDate && (<div>
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
          <button id='desperate' onClick={submitFilters}>Submit</button>
        </div>)}

        {/* )} */}

      </div>
      <div ref={mapContainerRef} id="map" style={{ height: '70vh' }}>

      </div>
      <p>To create a hazard, first be signed in, then click anywhere on the map</p>
    </div>
  );
};

export default MapPage;
