// import types from "./hazardTypes.json"
export default class Hazard {
    constructor(hazard,map,haztypes,icons){
        this.lat=hazard.latitude
        this.dateObject = hazard.created_at
        this.date=this.dateObject.toLocaleString()
        this.types = haztypes
        this.icons = icons
        // //console.log("icons in hazard",icons)
        // //console.log("haztypes in hazard",haztypes)
        this.long=hazard.longitude
        this.type=this.types.find(type => type.id === hazard.type)?.name || "Other";
        this.icon=icons.find(type => type.id === hazard.type) || icons.find(type=> type.id ===100);
        this.text=hazard.text
        this.image=hazard.image
        this.radius=hazard.radius
        this.marker=null
        this.map=map
        this.visible=false
        this.location= hazard.location
        this.show()
        
    }
    convertIsoToCustomFormat(isoString) {
        const dateTime = new Date(isoString);
        
        // Extract components
        const month = dateTime.getMonth() + 1; // Months are zero-based
        const day = dateTime.getDate();
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
    
        // Format the components
        const customFormat = `${month}/${day}/${year}, ${hours}:${minutes}`;
    
        return customFormat;
    }
    //removes itself from map
    remove(){
        if(this.visible)
        {
            this.marker.remove()
            this.visible=false  ;
        }
    }
    isVisible(){
        return this.visible
    }
    //adds itself to the map
    show(){
        if(!this.visible)
        {
            if (!this.marker)
            {
                if(this.radius)
                {
                    
                    this.marker = L.circle([this.lat, this.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: this.radius
                        
                    })
                }
                else{   
                    
                    //format to create a custon icon for popups
                    // if(this.icon === null) {

                    
                        var standardIcon = L.icon({
                            iconUrl: this.icon.iconUrl,
                            shadowUrl: this.icon.shadowUrl,                        
                            iconSize:this.icon.iconSize, // size of the icon
                            shadowSize:  this.icon.shadowSize, // size of the shadow
                            iconAnchor:  this.icon.iconAnchor, // point of the icon which will correspond to marker's location
                            shadowAnchor: this.icon.shadowAnchor,  // the same for the shadow
                            popupAnchor:  this.icon.popupAnchor // point from which the popup should open relative to the iconAnchor
                        });
                    // }
                    this.marker=L.marker([this.lat,this.long],{icon: standardIcon})
                }
            }
            this.marker.addTo(this.map);
            this.marker.bindPopup("<b>"+this.type+" reported at "+this.date+"<b>\n<p> Description: "+this.text+"</p>");
            this.visible=true;

        }
    }
}
// export default Hazard;


