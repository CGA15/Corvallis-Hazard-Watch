let Control = class{
    constructor(hazardList,map){
        this.size = hazardList.length;
        this.current= 0
        var temp = this.size
        this.container
        if (this.size<50)
        {
            this.size *=2
            this.container = new Array(2*this.size)
        }
        else
        {
            this.size=100
            this.container = new Array(100)
        }
        for(let i =0; i<temp; i++){
            var hazard = new Hazard(hazardList[i],map)
            this.insert(hazard)
        }
        

    }
    insert(hazard) {
        if (this.current==this.size){
            this.grow()
        }
        else{
            this.container[this.current++]=hazard
        }
    }
    grow(){
        var temp = this.container
        this.container=new Array(2*this.size)
        for(let i=0;i<this.size;i++){
            this.container[i]= temp[i]
        }
    }
    at(index){
        return this.container[index]
    }
    viewAll(){
        for(let i=0;i<this.current;i++){
            this.container[i].show()
        }
    }
    removeAll(){
        for(let i=0;i<this.current;i++){
            this.container[i].remove()
        }
    }
}
//TEST CODE BELOW

var hazlist = [
    {
        lat: 44.59,  
        date: "10:09",
        long: -123.2677,
        type: "flood",
        icon: null,
        text: "Text",
        image: null
    },
    {
        lat: 44.58,
        date: "10:09",
        long: -123.2677,
        type: "flood",
        icon: null,
        text: "Text",
        image: null
    },
    {
        lat: 44.57,
        date: "10:09",
        long: -123.2677,
        type: "flood",
        icon: null,
        text: "Text",
        image: null
    },
    {
        lat: 44.56,
        date: "10:09",
        long: -123.2677,
        type: "flood",
        icon: null,
        text: "Text",
        image: null
    }
];


// hazardList = new Control(hazlist,map)

// map.on('zoomend', function () {
//     // Get the current zoom level
//     const currentZoom = map.getZoom();

//     // Check if the zoom level is below a certain threshold
//     if (currentZoom > 13) {
//         // Zoomed out, do something
//         console.log('Zoom bound');
//         hazardList.viewAll();
//     }
//     else
//     {
//         console.log('Zoom bound');
//         hazardList.removeAll();
//     }
// });


// haz ={
//     lat:44.57200488893161,
//         date: "10:09",
//         long: -123.2820510864258,
//         type: "flood",
//         icon : null,
//         text: "Text",
//         image:null
//     }


//     hazard = new Hazard(haz,map)
//         hazardList.insert(hazard)