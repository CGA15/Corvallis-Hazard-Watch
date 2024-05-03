import Hazard from './hazard'; // Import Hazard if it's in a separate module

//This is an array list object
export default class Control {
    constructor(hazardList, map, haztypes, api, icons) {
        this.hazardList = hazardList
        this.icons = icons
        this.hazTypes = haztypes
        this.size = hazardList.length;
        this.current = 0;
        this.grouped = false
        this.filteredData
        this.groupedContainer = new Array() //structure [location, [hazards]]
        var temp = this.size;
        this.api = api
        //console.log("testing in control hazTypes")
        //console.log(this.hazTypes)
        ////console.log(typeof hazTypes[0].created_at)
        //console.log(this)
        this.container;
        this.map = map;
        if (this.size < 50) {
            this.size *= 2;
            this.container = new Array(2 * this.size);
        } else {
            this.size = 100;
            this.container = new Array(100);
        }
        for (let i = 0; i < temp; i++) {
            // Deep copy each object in hazardList
            let hazard = JSON.parse(JSON.stringify(this.hazardList[i]));
            hazard.created_at = new Date(hazard.created_at);
            this.insert(hazard);
        }
        this.currentDate = new Date()
        var twentyFourHoursAgo = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000))
        // this.filter(twentyFourHoursAgo,this.currentDate,"All")
    }
    //inserts a hazard into the list
    insert(hazard) {
        //////console.log("test")
        var newHazard = new Hazard(hazard, this.map, this.hazTypes, this.icons);
        if (this.current == this.size) {
            this.grow();
        }
        this.container[this.current++] = newHazard;

    }
    update(newhazardList, start, end, hazards) {
        // const newItems = newhazardList.filter(item => !this.hazardList.includes(item))
        // console.log("old List", this.hazardList)
        // console.log(newItems)
        // newItems.forEach(element => {
        //     this.insert(element)
        // });
        // delete this.container
        // console.log(this.container)
        this.container = new Array(2 * newhazardList.length)
        let temp = newhazardList.length
        this.current = 0;
        for (let i = 0; i < temp; i++) {
            // Deep copy each object in hazardList
            let hazard = JSON.parse(JSON.stringify(newhazardList[i]));
            // console.log(hazard)
            hazard.created_at = new Date(hazard.created_at);
            this.insert(hazard);
        }
        console.log(this.container)
        this.filter(start, end, hazards)

    }
    //grows the array list
    grow() {
        var temp = this.container;
        this.container = new Array(2 * this.size);
        for (let i = 0; i < this.size; i++) {
            this.container[i] = temp[i];
        }
    }
    //returns a hazard at a position
    at(index) {
        return this.container[index];
    }
    //makes all hazards visible on the map
    viewAll() {
        for (let i = 0; i < this.current; i++) {
            this.container[i].show();
        }
    }
    //makes none of the hazards visible on the map
    removeAll() {
        for (let i = 0; i < this.current; i++) {
            this.container[i].remove();
        }
    }
    // Filter, this function will reset all filters, then run filter by time and filter by type
    filter(minDate, maxDate, type) {
        //console.log("filter called" ,minDate, maxDate, type)
        //console.log("self", this)
        this.groupedContainer.forEach(item => {
            if(item[2]!=="loc")
            {
                item[3].remove()
            }

        });
        delete this.filteredData
        this.filteredData = new Array()
        this.viewAll()
        this.filterByTime(minDate, maxDate)
        this.filterByType(type)
        for (let i = 0; i < this.current; i++) {
            if (this.container[i].isVisible()) {
                this.filteredData.push(this.container[i])
            }
        }
        // console.log(this.filteredData)
        if(this.grouped)
        {
            this.grouped=false
            this.group()
        }
    }
    //filter by time. This function will filter the data range, the constructor should default call this so that it is filted for the last 24 hours
    filterByTime(min, max) {
        for (let i = 0; i < this.current; i++) {

            if (!(this.container[i].dateObject.getTime() > min.getTime() && this.container[i].dateObject.getTime() < max.getTime()))
                this.container[i].remove();
        }
    }
    //Filter by Type this functionw will filter the display by the hazard type selected
    filterByType(hazardType) {
        if (hazardType != "All") {
            for (let i = 0; i < this.current; i++) {
                if (!hazardType.includes(this.container[i].type))
                    this.container[i].remove();
            }
        }
    }
    unGroup(start, end, hazards, api) {
        if (this.grouped) {
            //console.log("ungroup")
            this.grouped = false
            this.filter(start, end, hazards)
            this.groupedContainer.forEach(item => {
                if(item[2]!=="loc")
                {
                    item[3].remove()
                }

            });

        }
    }
    async group() {
        if (!this.grouped) {
            //console.log("group")
            this.removeAll()
            this.grouped = true
            delete this.groupedContainer
            this.groupedContainer = new Array()

            this.filteredData.forEach(item => {
                var found = false
                for (let i = 0; i < this.groupedContainer.length; i++) {

                    if (this.groupedContainer[i][0] === item.location) {
                        this.groupedContainer[i][1].push(item)
                        found = true
                        continue
                    }
                }
                if (!found)
                    this.groupedContainer.push([item.location, [item], "loc", "marker"])

            })
            const fetchPromises = this.groupedContainer.map(item => {
                return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${item[0]}&limit=1&appid=${this.api}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Handle the response data here
                        console.log(data);
                        if (data[0])
                            item[2] = [data[0].lat, data[0].lon];
                    })
                    .catch(error => {
                        // Handle errors here
                        console.error('There was a problem with the fetch operation:', error);
                    });
            });

            // Wait for all fetch promises to resolve
            Promise.all(fetchPromises)
                .then(() => {
                    // All fetch requests have completed
                    // console.log(this.groupedContainer);
                    this.groupedContainer.forEach(item => {
                        if(item[2]!=="loc")
                        {
                            var standardIcon = L.icon({
                                iconUrl: '/assets/icons/marker-icon.png',
                                shadowUrl: '/assets/icons/marker-shadow.png',

                                iconSize: [25, 41], // size of the icon
                                shadowSize: [41, 41], // size of the shadow
                                iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
                                shadowAnchor: [12, 41],  // the same for the shadow
                                popupAnchor: [-3, -41] // point from which the popup should open relative to the iconAnchor
                            });
                            var marker = L.marker(item[2], { icon: standardIcon })
                            marker.addTo(this.map);
                            marker.bindPopup("<b>" + item[1].length+ " hazards reported in this area</p>");
                            item[3] = marker
                        }

                    });
                })

        }
    }
}