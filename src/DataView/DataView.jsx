  import React, { useEffect, useRef, useState } from 'react';
  import { css } from '@emotion/react';
  // import hazardTypes from "./hazardTypes.json"
  import { useDispatch,useSelector } from 'react-redux';
  import { selectStore } from '../redux/storeSlice';
  import DataItem from './DataItem';
  import styled from "@emotion/styled";
  import { selectHazTypes } from '../redux/hazTypesRedux';
  import { useReactToPrint } from 'react-to-print';


  const DataView = () => {
      const hazards = useSelector(selectStore);
      const [hazardsData, setHazardsData] = useState([])
      const hazardTypes = useSelector(selectHazTypes)
      const currentDate = new Date();
      const [search, setSearch] = useState()
      const twentyFourHoursAgo = new Date(currentDate.getTime() - 3*31*24 * 60 * 60 * 1000);  
      const [startDate, setStartDate] = useState(twentyFourHoursAgo.toISOString());
      const [endDate, setEndDate] = useState(currentDate.toISOString()); 
      const [checkList, setCheckList] = useState(false)
      const [selectedHazards, setSelectedHazards] = useState({});
      const componentRef = useRef();

      const clearFilters = () => {
          setStartDate(twentyFourHoursAgo.toISOString())
          setEndDate(currentDate.toISOString())
          setCheckList(false)
          setSelectedHazards({});
          submitFilters();
      }
      const submitFilters = (searchString) => {
          // Gather filter values
          const start = new Date(startDate);
          const end = new Date(endDate);
          var hazardsTypes = Object.keys(selectedHazards).filter(hazardId => selectedHazards[hazardId]);
          console.log(searchString)
          if (hazardsTypes.length === 0) {
              hazardsTypes =  "All";
          }
      
          console.log(start, end, hazardsTypes);
      
          // Pass filters to mapFunctions.filter()
          var hazardsCopy = hazards.map(hazard => ({ ...hazard }));


          filter(start,end,hazardsTypes,hazardsCopy, searchString);
        };
      
        const handleCheckboxChange = (hazardName) => {
          setSelectedHazards(prevState => ({
            ...prevState,
            [hazardName]: !prevState[hazardName],
          }));
        };
      
      const TableHeader = styled.th`
      
      border-style: solid;
      padding: 8px;
      textAlign: left;
      `
      const Table = styled.table`
      border-collapse: collapse;
      width: 100%;
      @media print {
        color: black; /* Change font color to black */
    }
  `;

      useEffect(() =>{
          const sortedHazards = [...hazards].sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
          });
          setHazardsData(sortedHazards);
      },[hazards])
    //   const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    // })
      const filter = (minDate,maxDate,type, hazardsFilter,searchString) =>{
          // viewAll()
          console.log(searchString)

          hazardsFilter = filterByTime(minDate,maxDate,hazardsFilter)
          hazardsFilter = filterByType(type,hazardsFilter)
          if(searchString && searchString.length>0)
            hazardsFilter = filterByName(hazardsFilter,searchString)
          const sortedHazards = [...hazardsFilter].sort((a, b) => {
              return new Date(b.created_at) - new Date(a.created_at);
          });
          setHazardsData(sortedHazards);
          const searchElm = document.getElementById("locationSearch")
          searchElm.value = searchString
      }
      // const viewAll = () => {
      //     for (let i = 0; i < this.current; i++) {
      //         this.container[i].show();
      //     }
      // }
      const filterByName = (hazards,searchString) => {
        console.log("filter by name: ",searchString)

        var locationData = searchString.split(',').map(item => item.trim().toLowerCase());
        
        hazards = hazards.filter(item => {
          var locationData2 = item.location.split(',').map(item => item.trim().toLowerCase());
          let matches = 0;
      
          locationData.forEach(searchItem => {
            locationData2.forEach(hazardItem => {
              if (searchItem === hazardItem) {
                matches++;
              }
            });
          });
      
          return matches >= locationData.length;
        });
        return hazards
      }
      
      const filterByTime = (min,max, hazards) =>{
          // console.log(hazardsData[0])
          hazards = hazards.filter(item => new Date(item.created_at).getTime() > min.getTime() && new Date(item.created_at).getTime() < max.getTime());
          return hazards
      }
      const filterByType = (hazardType,hazards) => {
          if(hazardType!="All"){
              hazards = hazards.filter(item => hazardType.includes(item.type.toString()))    
          }
          console.log(hazards)
          return hazards
      }
      const navigate = (item) =>{
        const time = new Date(item.created_at).getTime()
        const navstring =`/map/${item.latitude}/${item.longitude}/${time}`
        window.location.href = navstring;

      }
      const saveAs = () => {
        // Format hazards data into CSV string
        var csvContent = "ID,Created At,Type,Location,Text,Radius,latitude,longitude\n";
        hazardsData.forEach((item) => {
          var { id, created_at, type, location, text, radius, latitude, longitude } = item;
          var typeString = hazardTypes.find(findType => findType.id === type)?.name || "Other"
          var row = `${id},"${created_at}","${typeString}","${location}","${text}",${radius},"${latitude},${longitude}"\n`;
            csvContent += row;
        });
    
        // Create Blob object
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        // Create temporary URL for the Blob
        var url = URL.createObjectURL(blob);
    
        // Create anchor element for download
        var a = document.createElement('a');
        a.href = url;
        a.download = 'hazards_data.csv';
        document.body.appendChild(a);
    
        // Trigger download
        a.click();
    
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const FilterBox = styled.div`
    position: relative;
    z-index: 1000;
   `;
      return (
          <FilterBox>
              <input id= "locationSearch" type="text" placeholder="EX: Corvallis, Oregon, US" />
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
                          value={hazard.id}
                          type="checkbox"
                          checked={selectedHazards[hazard.id] || false}
                          onChange={() => handleCheckboxChange(hazard.id)}
                        />
                        {hazard.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button onClick={() => {
                const location = document.getElementById("locationSearch")
                console.log(location.value)
                const searchString = location.value
                submitFilters(searchString)
              }}>Submit</button>
              <button onClick={clearFilters}>Clear Filters</button>
              <button onClick={saveAs}>Save</button>
            </div>
              <Table> 
                  <thead>
                      <tr>
                          <TableHeader>ID</TableHeader>
                          <TableHeader>Created At</TableHeader>
                          <TableHeader>Type</TableHeader>
                          <TableHeader>Location</TableHeader>
                          <TableHeader>Text</TableHeader>
                          {/* <th>Creator ID</th>
                          <th>Image</th>
                          <th>Icon</th> */}
                          <TableHeader>Radius</TableHeader>
                      </tr>
                  </thead>
                  <tbody>
                      {hazardsData.map(item => (
                        <DataItem onClick = {() =>navigate(item)}  key={item.id} {...item} />
                      ))}
                  </tbody>
              </Table>
              {/* <button onClick={handlePrint}>Print</button> */}
          </FilterBox>
      );
  };

  export default DataView;