let Hazard = class{
    constructor(hazard){
        this.lat=hazard.lat
        this.date = hazard.date
        this.long=hazard.long
        this.type=hazard.type
        this.icon=hazard.icon
        this.text=hazard.text
        this.image=hazard.image
    }
}

let Control = class{
    constructor(hazardList){
        this.size = cards.length;
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
            var hazard = new Hazard(hazardList[i])
            this.insert(hazard)
        }

    }
    insert(hazard) {
        if (this.current==size){
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
}
