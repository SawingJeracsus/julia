import { toCanvasX, toCanvasY } from './calculation';
import { CTXObject } from './shapes';

export interface CTXEngineI{  
    xMax: number,
    yMax: number,
    pushObj(obj: CTXObject): number,
    hardPushObj(obj: CTXObject): number,
}

interface CTXEngineConfig{
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    objects?: CTXObject[]
}

class CTXEngine implements CTXEngineI{
    private ctx
    private canvas
    private objects: CTXObject[]
    private xSel = 0
    private ySel = 0
    private mouseDown = false
    //@ts-ignore
    private imageData: ImageData

    constructor({ctx, canvas, objects}: CTXEngineConfig){
        this.ctx = ctx
        this.canvas = canvas  
        if(objects){
            this.objects = objects
        }else{
            this.objects = []
        }
        this.init()           
    }
    get xMax(){
        return this.canvas.width
    }
    get yMax(){
        return this.canvas.height
    }
    private refreshImageData(): void{
        this.imageData = this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height)
    }
    private init() {
        this.clear()
        this.render()
        this.refreshImageData()
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if(this.mouseDown){                
                this.ctx.putImageData(this.imageData,0,0)
                this.ctx.fillStyle="rgba(0,0,0,0.2)"
                this.ctx.fillRect(this.xSel,this.ySel, toCanvasX(this.canvas, e) -this.xSel, toCanvasX(this.canvas, e) -this.xSel)//e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop
                this.ctx.fill()        
            }
        })
        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            this.mouseDown = true
            this.xSel = toCanvasX(this.canvas, e)
            this.ySel = toCanvasY(this.canvas, e)
        })
        this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            this.mouseDown = false
            this.ctx.putImageData(this.imageData,0,0)
            this.onSelect(this.xSel, this.ySel, toCanvasX(this.canvas, e) -this.xSel, toCanvasX(this.canvas, e) -this.xSel)
        })
    }
    public onSelect = (xB: number, yB: number, w: number, h: number) => {}
    public clear(){
        const ctx = this.ctx
        const canv = this.canvas

        ctx.fillStyle="#232323"
        ctx.fillRect(0,0,canv?.width, canv?.height)
        ctx.fill()
        this.refreshImageData()
    }
    public render(){
        for(let object of this.objects){
            let result = object.render(this.ctx, this)
            while(result){
                result = result.render(this.ctx, this)
            }
        }
        this.refreshImageData()
    }

    public pushObj(obj: CTXObject){
        obj.payload.id = Date.now()
        this.objects.push(obj)


        let result = obj.render(this.ctx, this)
        while(result){
            result = result.render(this.ctx, this)
        }
        this.refreshImageData()
        return obj.payload.id
    }

    public hardPushObj(obj: CTXObject){
        const id = this.pushObj(obj)
        this.render()
        this.refreshImageData()
        return id
    }
    setMouseDown(x: number, y: number){
        this.mouseDown = true
        this.xSel = x
        this.ySel = y
    }
    setMouseUp(x: number, y: number){
        this.mouseDown = false
        // this.xSel = x
        // this.ySel = y
    }
}
export default CTXEngine