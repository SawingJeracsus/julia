import { CTXEngineI } from './engine';
import {GPU} from 'gpu.js'
type sortFunc = (cn: ComplexPoint) => boolean
function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

const forEvryPoint = (width: number, height: number, sortFunc: sortFunc) => {
    let result = []
    for(let real = 0; real < width; real++){
        for(let imagine = 0; imagine < height; imagine++){
            if(sortFunc(new ComplexPoint(real, imagine))){
                result.push(new ComplexPoint(real, imagine))
            }
        }
    }
    return result
}

export class CTXObject {
    public payload: {[key: string]: any} = {}

    constructor(public name: string){}
    render(ctx: CanvasRenderingContext2D, drawer?: CTXEngineI): CTXObject | void {
        throw new Error("Render method is not asigned")
    }
}

export class ShapesArray extends CTXObject{
    constructor(public readonly objects: CTXObject[]){
        super('Shapes Array')
    }
    
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        console.log('start');
        
        this.objects.forEach(obj => drawer.pushObj(obj))
        console.log('end');
        
    }
}
export class ComplexPointsArray extends CTXObject{
    constructor(public readonly points: ComplexPoint[]){
        super('Points array')
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        const imageData = ctx.createImageData(drawer.xMax,drawer.yMax)
        const color = {
            red: 0,
            green: 0,
            blue: 0
        }
        console.log('begin');
        
        let pixelIndex
        for(let point of this.points){
            pixelIndex = point.real*4 + point.imagine*drawer.xMax*4
            imageData.data[pixelIndex    ] =   color.red;  // red   color
            imageData.data[pixelIndex + 1] =   color.green;  // green color
            imageData.data[pixelIndex + 2] =   color.blue;  // blue  color
            imageData.data[pixelIndex + 3] = 255
        }
        console.log('end');
        
        ctx.putImageData(imageData, 0, 0)
    }
}

export class ComplexPoint extends CTXObject{
    constructor(public real: number, public imagine: number, public color = "#eee"){
        super('Complex number')
    }
    static from(cn: ComplexPoint){
        return new ComplexPoint(cn.real, cn.imagine)
    }
    multiply(cn: ComplexPoint): ComplexPoint{
        return new ComplexPoint(this.real*cn.real - this.imagine*cn.imagine, this.imagine*cn.real + this.real*cn.imagine)
    }
    power(a: number){
        let first = this.multiply(this)
        for(let i = 2; i < a; i++){
            first = first.multiply(this)
        }
        return a === 1 ? ComplexPoint.from(this) : first
    }
    pow(): ComplexPoint{
        const real = this.real**2 - this.imagine**2
        const image = this.imagine*this.real*2

        this.real = real
        this.imagine = image

        return this
    }
    sum(cn: ComplexPoint): ComplexPoint{
        this.real = this.real + cn.real;
        this.imagine = this.imagine + cn.imagine

        return this
    }
    subtraction(cn: ComplexPoint){
        this.real = this.real - cn.real;
        this.imagine = this.imagine - cn.imagine

        return this
    }
    distanceTo(cn: ComplexPoint){
        return Math.sqrt((this.real-cn.real)**2 + (this.imagine - cn.imagine)**2)
    }
    module(){
        return Math.sqrt(this.real**2 + this.imagine**2)
    }
    render(ctx: CanvasRenderingContext2D) {
        const oldFillStyle = ctx.fillStyle
        ctx.fillStyle = this.color
        ctx.fillRect(this.real, this.imagine, 1, 1)
        ctx.fillStyle = oldFillStyle
    }
}
class Line extends CTXObject {
    constructor(
      public readonly begin: ComplexPoint,
      public readonly end: ComplexPoint,
    ) {
      super('Line');
    }
    render(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.moveTo(this.begin.real, this.begin.imagine)
        ctx.lineTo(this.end.real, this.end.imagine)
        ctx.strokeStyle = "#fff"
        ctx.stroke()
    }
    
  }
export class Circle extends CTXObject{
    constructor(
        public readonly z0: ComplexPoint,
        public readonly r: number,
        private renderType: 'main-points' | 'floor' | 'ceil' | 'round' = 'round'
    ){
        super('Circle')
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        let result: any[] = []
        switch(this.renderType){
            case "main-points":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => cn.subtraction(this.z0).module() === this.r)
            break;
            case "floor":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => Math.floor(cn.subtraction(this.z0).module()) === Math.round(this.r))
                break;
            case "ceil":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => Math.ceil(cn.subtraction(this.z0).module()) === Math.round(this.r))
                break;
            case 'round':
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => Math.round(cn.subtraction(this.z0).module()) === Math.round(this.r))
                break;
        }
        //@ts-ignore
        return new ShapesArray(result)
    }
}

export class Disc extends Circle{
    constructor(
        z0: ComplexPoint, r: number, renderType: 'main-points' | 'floor' | 'ceil' | 'round' = 'round'
    ){
        super(z0, r, renderType)
        this.name = "Disk"
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        return new ShapesArray(forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => cn.subtraction(this.z0).module() <= this.r))
    }
}

export class Elipse extends CTXObject{
    constructor(
        private focus1: ComplexPoint,
        private focus2: ComplexPoint,
        private mainVertex: number
    ){
        super('Ellipse')
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        let result = forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => {
            const a =ComplexPoint.from(cn).subtraction(this.focus1).module() + ComplexPoint.from(cn).subtraction(this.focus2).module()
            const res = Math.round(a) === Math.round(this.mainVertex*2)
            
            return res
        })
        return new ShapesArray(result)
    }
}

export class Parabola extends CTXObject{
    constructor(
        private focus: ComplexPoint,
        private zD: ComplexPoint,
        private horizontal: boolean = true
    ){
        super('Parabola')
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        const prop = this.horizontal ? "imagine" : "real"

        const res=  forEvryPoint(
            drawer.xMax, drawer.yMax, 
            (cn: ComplexPoint) => {
                const a = ComplexPoint.from(cn).distanceTo(this.focus)
                const b = Math.abs(ComplexPoint.from(cn).subtraction(this.zD)[prop])
                return Math.ceil(a) === Math.round(b)
            }
        )
        const derectriosa = new Line(new ComplexPoint(0, this.zD.imagine), new ComplexPoint(drawer.xMax, this.zD.imagine))
        
        return new ShapesArray([...res, derectriosa])
    }
} 
export class Hiperbola extends CTXObject{
    constructor(
        private focus1: ComplexPoint,
        private focus2: ComplexPoint,
        private vertex: number
    ){
        super('Hiperbola')
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
        return new ShapesArray(forEvryPoint(drawer.xMax, drawer.yMax, (cn: ComplexPoint) => {
            const a = ComplexPoint.from(cn).subtraction(this.focus1).module()
            const b = ComplexPoint.from(cn).subtraction(this.focus2).module()
            const y = Math.abs(a-b)
            return Math.floor(y) == Math.round(2*this.vertex)
        }))
    }
}
export class GuliaSimplifined extends CTXObject{
    private biasX: number
    private biasY: number

    constructor(
        private z: ComplexPoint,
        private power: number = 2,
        private depth: number = 15,
        public scale: number = 1,
        public bias: number[] = [0,0]
    ){
        super("Gulia")
        this.biasX = this.bias[0]*2
        this.biasY = this.bias[1]*2

    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI){
    const gpu = new GPU()
        
    const createGulia = gpu.createKernel(function(zReal: number, zImagine: number, power: number, depth: number, scale: number, bias: number[]) {
        //@ts-ignore
        const a: number = ((this.thread.x+bias[0]*scale-this.constants.width/2)/(this.constants.width/4) )/ scale
        //@ts-ignore
        const b: number = ((this.thread.y+bias[1]*scale-this.constants.height/2)/(this.constants.height/4))/ scale
        let zRealTemp = zReal 
        let zImagineTemp = zImagine 
        let trigered = false

        let i = 0
        let moduleOFNumber = 0
        do{
            for(let i =1;i<power;i++){
                let newzRealTemp = zRealTemp**2-zImagineTemp**2
                zImagineTemp = 2*zImagineTemp*zRealTemp
                zRealTemp = newzRealTemp
            }
            zRealTemp += a
            zImagineTemp += b
            moduleOFNumber = Math.sqrt(zRealTemp**2 + zImagineTemp**2)
            if(moduleOFNumber > 2){
                trigered = true
                break;
            }
            i++
        }while(i <= depth)

        if(!trigered){
            this.color(1,1,1,1)  
        }else{
            this.color((i/depth+0.25/moduleOFNumber),0.5/moduleOFNumber,(i/depth+0.5/moduleOFNumber)/2,1)
        }
    }).setOutput([drawer.xMax, drawer.yMax]).setGraphical(true).setConstants({
        width: drawer.xMax,
        height: drawer.yMax
    })
    createGulia(this.z.real,this.z.imagine,this.power, this.depth, this.scale, this.bias)
    const res = createGulia.getPixels()
    const imageData = ctx.createImageData(drawer.xMax,drawer.yMax)
    for(let i in imageData.data){
        //@ts-ignore
        imageData.data[i] = res[i]
    }
    ctx.putImageData(imageData,0, 0)
    }
}
export class Gulia extends CTXObject{
    constructor(
        private z: ComplexPoint,
        private power: number = 2,
        private depth: number = 15
    ){
        super("Gulia")
    }
    render(ctx: CanvasRenderingContext2D, drawer: CTXEngineI): ShapesArray{
        //@ts-ignore
        let res = /**/[];
        let i = 0
        let trigered = false
        for(let x= 0; x <= drawer.xMax; x++){
            for(let y =  0; y <= drawer.yMax; y++){
                const a =  (x - drawer.xMax/2)/(drawer.xMax/4)
                const b =  (y - drawer.yMax/2)/(drawer.yMax/4)     
                const c = new ComplexPoint(a,b)
                let z = ComplexPoint.from(this.z)

                trigered = false
                i = 0
                do{
                    z = z.power(this.power)
                    z = z.sum(c)
                    if(z.module() > 2){
                        trigered = true
                        break;
                    }
                    i++
                }while(i <= this.depth)

                if(trigered){
                    const depthOfIteration = i/this.depth
                    const distanseToGulia = 1-2/z.module()

                    const test = (depthOfIteration+ distanseToGulia)/2

                    if(depthOfIteration !== 1){
                        res.push(new ComplexPoint(x,y, `rgb(${test*255}, 0,0)`))
                    }
                }else{
                    res.push(new ComplexPoint(x,y))
                }

            }
        }
        return new ShapesArray(res)
    }
}