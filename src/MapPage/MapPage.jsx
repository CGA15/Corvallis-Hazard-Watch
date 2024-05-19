/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import L, { control } from 'leaflet';
// import MapFunctions from './mapFunctionsReact';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for styling
import { css } from '@emotion/react';
// import hazardTypes from "./hazardTypes.json"
import { useDispatch, useSelector } from 'react-redux';
import { selectStore, selectFetchedAt, fetchData } from '../redux/storeSlice';
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
  const dataAge= useSelector(selectFetchedAt)
  const mapContainerRef = useRef(null);
  // const haztypes = useSelector(selectHazTypes)
  const mapRef = useRef(null);
  // const [mapFunctions, setMapFunctions] = useState(null)
  const [dropDown, setDropDown] = useState(false)
  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000 );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [checkList, setCheckList] = useState(false)
  const [selectedHazards, setSelectedHazards] = useState({});
  const [map, setMap] = useState(null)
  const [setUpOnce, setSetUpOnce] = useState(false)
  const hazards = useSelector(selectStore)
  const hazardTypes = useSelector(selectHazTypes)
  const icons = useSelector(selectIcons)
  console.log("hazards" , hazards)
  console.log("hazardTypes" , hazardTypes)
  console.log("icons" , icons)

  const [controller, setController] = useState(null)
  const dispatch = useDispatch(); // Move useDispatch() outside of the component body
  const apiKey = 'bed1848ba67a4ff12b0e3c2f5c0421fe';
 const {lat,lon,time } = useParams();
 const[grouped,setGrouped] = useState(false)
 const[update,setUpdate] = useState()
 const[length, setLength] = useState(0)

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
      //console.log('Latitude:', latitude);
      //console.log('Longitude:', longitude);
      // Now you can use latitude and longitude to center your map
      // For example, set it as the initial state in your component
      //console.log(`map.setView([${latitude}, ${longitude}], 12);`)
      //console.log(map)
      map.setView([latitude, longitude], 14);
      return latitude,longitude
    },
    (error) => {
      // map.setView([44.5646, -123.2620], 15);
      console.error('Error getting user location:', error.message);
    }
  );
}

// Call getUserLocation to initiate the process




  // Define the renderReactComponentToHTML function to convert a React component to HTML string
  function renderReactComponentToHTML(component) {
    const htmlString = renderToString(component);
    return htmlString;
  }
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
  function submitData(lat, long, hazardType, time, type, rad, text, popup,randomNum) {
    // Handle submission logic here
    //////console.log(rad)
    // console.log(typeof lat, lat)
    // console.log(typeof long, long)
    const badLength = document.getElementById(`bad-length${randomNum}`)
    var badWordsCaught= document.getElementById(`bad-words${randomNum}`)
    badWordsCaught.style.display ='none'
    badLength.style.display ='none'

    const filter = new badWordsFilter 
    if(long<-180 || long >180)
    {
      var lat=lat - Math.floor((lat+90)/180)*180
      var long=long - Math.floor((long+180)/360)*360
      map.setView([lat,long],13)
    } 
    // console.log(typeof lat2, lat2)
    // console.log(typeof long2, long2)
    // alert(`Data submitted!\nLat: ${lat2}\nLong: ${long2}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}\nText: ${text}`);
    if (text.length >200){
      const badLengthValue = document.getElementById(`bad-length-value${randomNum}`)
      badLength.style.display ='block'
      badLengthValue.textContent= text.length-200 +" characters over the limit"
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
    else if (filter.isProfane(text))
    {
      const badWords = findCensoredWords(text, filter.clean(text));
      var badWordsId = document.getElementById(`bad-words-found${randomNum}`)     
      badWordsId.textContent=badWords;    
      badWordsCaught.style.display ='block'
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
    else
    {
      newHazard(lat, long, hazardType, time, rad ,text)
      map.closePopup();
    }
  }
  function findCensoredWords(original, censored) {
    const originalWords = original.split(' ');
    const censoredWords = censored.split(' ');
    var result = "";

    for (let i = 0; i < originalWords.length; i++) {
        if (censoredWords[i].includes('*')) {
            result+=originalWords[i] + " ";
        }
    }

    return result;
}
  const newHazard =  async (lat, long, htype, time, rad, textContent) =>{
    var locdata = "N/A"
    try {
      const limit = 1;
      const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=${limit}&appid=${apiKey}`);
      const location = await response.json();
      //console.log(location);
      if(location[0] && location[0].country && location[0].country === "US")
            {
                const locString = `${location[0].name},${location[0].state}, ${location[0].country}`
                locdata=locString;
                 // put(hazards[i], hazards[i].id)
            }
            else
            {
                if(location[0] && location[0].country)
                {
                    const locString = `${location[0].name}, ${location[0].country}`
                    locdata=locString;
                }
                else{
                    locdata="N/A";
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
        creator_id: 4,
        radius: rad,
        location: locdata
    }
    //console.log(controller)
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
            // ////console.log('Server response:', data);
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
    }else{
      
       //const popupContent = renderReactComponentToHTML(<MapPopUp e={e} map={map} />);

      ////console.log("set On Click")

      // L.popup()
      //   .setLatLng(e.latlng)
      //   .setContent(popupContent)
      //   .openOn(map);
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
        submitData(e.latlng.lat, e.latlng.lng, document.getElementById(`hazard${randomNum}`).value, new Date(), getHazardType(randomNum), getRadius(randomNum),document.getElementById(`textInput${randomNum}`).value, popup,randomNum)
      );
    }

  }

 const getData = async () =>{
      dispatch(fetchData())
      setUpdate(true)
  }
  useEffect(() => {
    if(update && hazards.length!=length && controller){
      // console.log("update called")
      const start = new Date(startDate);
      const end = new Date(endDate);
      var hazardsTypes = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

      if (hazardsTypes.length === 0) {
        hazardsTypes = "All";
      }
      controller.update(hazards, start, end, hazardsTypes)
      setLength(hazards.length)
      setUpdate(null)
    }
  },[hazards, update])
  //when the page loads, it will run this code to initialize the map
  useEffect(() => {
    // Function to initialize the map
    if (hazards.length > 0) {
      const initializeMap = () => {
        // Check if the map is already initialized
       
        if (!mapContainerRef.current._leaflet_id) {
          // Create a Leaflet map with an initial view
        if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon)) && !isNaN(parseFloat(time))) {
            //console.log("they are numbers")
            const newStart = new Date(parseFloat(time)- 24 * 60 * 60 * 1000)
            const newEnd = new Date(parseFloat(time)+ 24 * 60 * 60 * 1000)
            setStartDate(newStart.toISOString())
            setEndDate(newEnd.toISOString())
            setMap(L.map(mapContainerRef.current).setView([parseFloat(lat), parseFloat(lon)], 18));

        } else {
          //console.log("they arent numbers", typeof lat)
          setStartDate(twentyFourHoursAgo.toISOString())
          setEndDate(currentDate.toISOString())
          setMap(L.map(mapContainerRef.current).setView([44.564568,-123.262047], 15));
        }
          // setMap(L.map(mapContainerRef.current).setView([44.5646, -123.2620], 15));

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
      
     
      const controller = new Control(hazards,map,hazardTypes,apiKey, icons)
      setLength(hazards.length)
      setController(controller)
      if(isNaN(parseFloat(lat)))
        getUserLocation()
      //console.log("check",controller)
     


      ////console.log("haztypes check one")
      ////console.log(haztypes)
    }
  }, [map, setUpOnce])
  useEffect (() => {
    if(controller)
    {
      if(Date.now() - dataAge > 5*1000*60)
      {
        // console.log("data too old")
        getData()
       
      }
      map.on('click', (e) => onMapClick(e))
      var start
      var endTime
      if (!isNaN(parseFloat(time))) {
         start = new Date(parseFloat(time) - 24 * 60 * 60 * 1000)
         endTime =new Date(parseFloat(time) + 24 * 60 * 60 * 1000)
      } 
      else
      {
        start = twentyFourHoursAgo;
        endTime = currentDate
      }
      //console.log("start",start)
      //console.log("end",endTime)
      controller.filter(start,endTime,"All")
      map.on('zoomend', function () {
        // Get the current zoom level
        const currentZoom = map.getZoom();
  
        // Check if the zoom level is below a certain threshold
        if (currentZoom >= 13) {
            // Zoomed out, do something
            // //console.log('Zoom bound');           
              unGroup();             
        }
        else
        {           
              group();              
        }
      });
    }
    
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

    //////console.log(start, end, hazards);

    // Pass filters to mapFunctions.filter()
    controller.filter(start, end, hazards);
  };

  const handleCheckboxChange = (hazardName) => {
    setSelectedHazards(prevState => ({
      ...prevState,
      [hazardName]: !prevState[hazardName],
    }));
  };

const group = () => {
  
  const start = new Date(startDate);
  const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }
    controller.group()
 
}

const unGroup = () =>{
  
  const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards = "All";
    }
    //console.log(controller)
    controller.unGroup(start,end,hazards, apiKey)
    submitFilters()
    //due to leaflet not wanting to update values, this was the best way I could get the program to work
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


  // var checkList = document.getElementById('list1');
  // checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  //   if (checkList.classList.contains('visible'))
  //     checkList.classList.remove('visible');
  //   else
  //     checkList.classList.add('visible');
  // }
  const openCheckList = () => {
    //////console.log("hello")
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
        {startDate && endDate &&( <div>
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
      <div ref={mapContainerRef} id="map" style={{ height: '500px' }}>
      </div>
    </div>
  );
};

export default MapPage;
