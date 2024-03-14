import Hazard from './hazard'; // Import Hazard if it's in a separate module

//This is an array list object
export default class Control {
    constructor(hazardList, map, haztypes) {
        this.hazardList = hazardList
        this.hazTypes =haztypes
        this.size = hazardList.length;
        this.current = 0;
        var temp = this.size;
        console.log("testing in control hazTypes")
        console.log(this.hazTypes)
        // console.log(typeof hazTypes[0].created_at)
        this.container;
        this.map =map;
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
        this.currentDate= new Date()
        var twentyFourHoursAgo = new Date(this.currentDate.getTime() - (24 * 60 * 60 * 1000))
        this.filter(twentyFourHoursAgo,this.currentDate,"All")
    }
//inserts a hazard into the list
    insert(hazard) {
        //console.log("test")
        var newHazard = new Hazard(hazard, this.map, this.hazTypes);
        if (this.current == this.size) {
            this.grow();
        }
        this.container[this.current++] = newHazard;
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
    filter(minDate,maxDate,type){
        this.viewAll()
        this.filterByTime(minDate,maxDate)
        this.filterByType(type)
    }
//filter by time. This function will filter the data range, the constructor should default call this so that it is filted for the last 24 hours
    filterByTime(min,max){
        for (let i = 0; i < this.current; i++) {
            
            if(!(this.container[i].dateObject.getTime()>min.getTime() && this.container[i].dateObject.getTime()<max.getTime() ))
                this.container[i].remove();
        }
    }
//Filter by Type this functionw will filter the display by the hazard type selected
    filterByType(hazardType){
        if(hazardType!="All"){
            for (let i = 0; i < this.current; i++) {                
                if(!hazardType.includes(this.container[i].type))
                    this.container[i].remove();
            }
        }
    }
}