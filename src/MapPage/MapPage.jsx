import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import MapFunctions from './mapFunctionsReact';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for styling

//This is the react page for the map page
const MapPage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapFunctions = new MapFunctions()
    

  //when the page loads, it will run this code to initialize the map
  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      // Check if the map is already initialized
      if (!mapContainerRef.current._leaflet_id) {
        // Create a Leaflet map with an initial view
        const map = L.map(mapContainerRef.current).setView([44.5646, -123.2620], 15);
  
        // Add a tile layer to the map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        mapRef.current = map;
        
        mapFunctions.setUpMap(map)           
      }
    };
  
    // Check if the map container ref is defined before calling the function to not try to initialize a second time
    if (mapContainerRef.current) {
      initializeMap();
      
    }
  
    // Specify any cleanup code if needed
    return () => {
      // Cleanup code, not currently needed
    };
  }, []); // Empty dependency array ensures that it runs only once on mount
  
  return (
    //current map, to change height, modify the height variable, likely you could modify width by adding that aas a field
    <div ref={mapContainerRef} id="map" style={{ height: '500px' }}>
    </div>
  );
};

export default MapPage;
