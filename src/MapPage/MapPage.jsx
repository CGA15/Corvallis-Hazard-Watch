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





//This is the react page for the map page 
const MapPage = () => {
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
  function submitData(lat, long, hazardType, time, type, rad, text) {
    // Handle submission logic here
    //////console.log(rad)
    // console.log(typeof lat, lat)
    // console.log(typeof long, long)
    let lat2=lat - Math.floor((lat+90)/180)*180
    let long2=long - Math.floor((long+180)/360)*360
    map.setView([lat2,long2],13)
    // console.log(typeof lat2, lat2)
    // console.log(typeof long2, long2)
    // alert(`Data submitted!\nLat: ${lat2}\nLong: ${long2}\nType: ${hazardType}\nTime: ${time}\nRadius: ${rad}\nText: ${text}`);

    newHazard(lat2, long2, hazardType, time, rad ,text)
    map.closePopup();
  }
  const newHazard =  async (lat, long, htype, time, rad, textContent) =>{
    var locdata = "N/A"
    try {
      const limit = 1;
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=${limit}&appid=${apiKey}`);
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
    //const popupContent = renderReactComponentToHTML(<MapPopUp e={e} map={map} />);
    ////console.log("set On Click")

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
                        <input type="text" id="textInput" placeholder= "description"> 

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
      submitData(e.latlng.lat, e.latlng.lng, document.getElementById('hazard').value, new Date(), getHazardType(), getRadius(),document.getElementById('textInput').value)
    );
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
