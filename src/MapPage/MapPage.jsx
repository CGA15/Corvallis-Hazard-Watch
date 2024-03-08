 /** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import MapFunctions from './mapFunctionsReact';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for styling
import { css } from '@emotion/react';
import hazardTypes from "./hazardTypes.json"


//This is the react page for the map page 
const MapPage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapFunctions, setMapFunctions] =  useState(null)
  const [dropDown, setDropDown] = useState(false)
  const currentDate = new Date();
  const twentyFourHoursAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);  
  const [startDate, setStartDate] = useState(twentyFourHoursAgo.toISOString());
  const [endDate, setEndDate] = useState(currentDate.toISOString()); 
  const [checkList, setCheckList] = useState(false)
  const [selectedHazards, setSelectedHazards] = useState({});
  const [map, setMap] = useState(null)
  const [setUpOnce, setSetUpOnce] = useState(false)
  




  //when the page loads, it will run this code to initialize the map
  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      // Check if the map is already initialized
      if (!mapContainerRef.current._leaflet_id) {
        // Create a Leaflet map with an initial view
        setMap(L.map(mapContainerRef.current).setView([44.5646, -123.2620], 15));

        // Add a tile layer to the map        
      }
    };

    // Check if the map container ref is defined before calling the function to not try to initialize a second time
    if (mapContainerRef.current) {      initializeMap();

    }

    // Specify any cleanup code if needed
    return () => {
      // Cleanup code, not currently needed
    };
  }, []); // Empty dependency array ensures that it runs only once on mount
  useEffect (() =>{
    if(map && !setUpOnce)
    {
      setSetUpOnce(false)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      mapRef.current = map;
      setMapFunctions(new MapFunctions())
    }
  },map, setUpOnce)
  useEffect (() => {
    if(mapFunctions)
    {
      console.log("setUp called")
      mapFunctions.setUpMap(map)
    }
  }, mapFunctions)
  const openFilters = () => {
    setDropDown(!dropDown)
  }
  const submitFilters = () => {
    // Gather filter values
    const start = new Date(startDate);
    const end = new Date(endDate);
    var hazards = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);

    if (hazards.length === 0) {
      hazards =  "All";
    }

    console.log(start, end, hazards);

    // Pass filters to mapFunctions.filter()
    mapFunctions.filter(start,end,hazards);
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
 const openCheckList = () =>{
  console.log("hello")
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
            <div id="list1" className="dropdown-check-list" tabindex="100">
              <span className="anchor" onClick={() => setCheckList(!checkList)}>Hazard Types</span>
              {checkList && (  
                <ul className="items">
                  {hazardTypes.data.map(hazard => (
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
