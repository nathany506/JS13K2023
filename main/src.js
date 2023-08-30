//Where to store spritesheet
const spriteSheet = new Image

//Game Canvas
let canvas = document.getElementById("c")
let ctx = canvas.getContext("2d")

//Buffer Canvas
let canv = document.getElementById("g")
let gfx = canv.getContext("2d")

//temp
canvas.width = 1200
canvas.height = 800

//Size of Perlin Noise Field
const GRID_SIZE = 2;

//Size of each cell
const cellSize = 20
const mapSize = 30

//stores all map data
let map = []


let origin = [600, 10]


//need to create map
//need to create tile object

//need to create trim function that merges tiles of the same height into a big tile
//clip tiles that have been combined

//generate content in map

//need to create draw function for map, then iso draw


class Cell{
    constructor(i,j,h){

        this.i = i
        this.j = j
        this.x = this.i * cellSize
        this.y = this.j * cellSize
        this.l = 1

        this.h = parseFloat(h)
        this.index = i*mapSize+j

        if(this.h == -0){
            this.h = 0
        }
        if(this.h > 0.3){
            this.h = 0.3
        }

        if(this.h < -0.4){
            this.h = -0.4
        }
    }

    //draws cell
    draw(){

        let isoX = makeIsoX(this.x,this.y)
        let isoY = makeIsoY(this.x,this.y,this.h*-cellSize)

        ctx.fillStyle = "#996d32"

        let add = cellSize

        if(this.h >= 0.3){
            ctx.fillStyle = "#27b9ad"
        }


        ctx.beginPath()
        ctx.moveTo(isoX+cellSize,isoY+cellSize/2)
        ctx.lineTo(isoX+cellSize,isoY+cellSize/2+this.h*-cellSize+add)
        ctx.lineTo(isoX-cellSize*(this.l-1), isoY+cellSize*((this.l+1)/2)+this.h*-cellSize+add)

        ctx.lineTo(isoX-cellSize*this.l,isoY+cellSize*((this.l+1)/2)-cellSize/2+this.h*-cellSize+add)
        ctx.lineTo(isoX-cellSize*this.l,isoY+cellSize*((this.l+1)/2)-cellSize/2)
        ctx.closePath()
        ctx.fill()


        let hue = Math.abs(this.h - 1.3)*40    
        ctx.fillStyle = "hsl(79,65%,"+hue+"%)"

        if(this.h >= 0.3){
            ctx.fillStyle = "#3de5de"
        }

        if(this.i == 0 && this.j == 0){
            ctx.fillStyle = "red"
        }

        // ctx.fillRect(
        //     this.x,
        //     this.y,
        //     cellSize*this.w,
        //     cellSize*this.l
        // );

        ctx.beginPath()
        ctx.moveTo(isoX, isoY)
        ctx.lineTo(isoX+cellSize,isoY+cellSize/2)
        ctx.lineTo(isoX-cellSize*(this.l-1), isoY+cellSize*((this.l+1)/2))
        ctx.lineTo(isoX-cellSize*this.l,isoY+cellSize*((this.l+1)/2)-cellSize/2)
        ctx.closePath()
        ctx.fill()
    }
}

createMap()

function createMap(){
    for(let i=0; i<mapSize; i++){
        map.push([])
    }
    //this will add terrain to our map
    for (let y = 0; y < GRID_SIZE; y += GRID_SIZE/mapSize){
        for (let x = 0; x < GRID_SIZE; x += GRID_SIZE/mapSize){
            if(Math.ceil(y*mapSize/GRID_SIZE) >= 30 || Math.ceil(x*mapSize/GRID_SIZE) >= 30){
                break
            }
            
            let v = perlin.get(x, y).toFixed(1)//height of tile

            map[Math.ceil(y*mapSize/GRID_SIZE)].push(new Cell(Math.ceil(y*mapSize/GRID_SIZE),Math.ceil(x*mapSize/GRID_SIZE),v))
        }
    }
}



function increasedPerform(){
    for(let i=0; i<mapSize; i++){
        for(let j=0; j<map[i].length; j++){
            if(j+1 >= map[i].length){
                break;
            }

            let current = map[i][j]
            let down = map[i][j+1]

            if(current.h == down.h){
                current.l ++
                clip(i,j+1)
                j--
            }

        }
    }
}

function clip(i,j){

    map[i].splice(j,1)

    for(let h=0; h<map[i].length; h++){
        map[i][h].j = h
    }
}


increasedPerform()

for(let i=0; i<mapSize; i++){
    for(let j=0; j<map[i].length; j++){
        map[i][j].draw()
    }
}

function makeIsoX(x,y){
    return (origin[0] + x - y)
}

function makeIsoY(x,y,h){
    return (origin[1]+x*0.5+y*0.5-h)
}