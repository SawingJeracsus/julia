import { ComplexPoint, Elipse, Parabola, Hiperbola, Gulia, Circle, GuliaSimplifined } from './shapes';
import CTXEngine from './engine'
import { toCanvasX, toCanvasY } from './calculation';

const canv: HTMLCanvasElement | null = document.querySelector("#app")
const canvEl: HTMLElement | null = canv

const scaleEl = document.getElementById('scale')
const biasXEl = document.getElementById('biasx')
const biasYEl = document.getElementById('biasy')

//@ts-ignore
const powerEl: HTMLInputElement = document.getElementById('power')
//@ts-ignore
const realEl: HTMLInputElement = document.getElementById('real')
//@ts-ignore
const imageinEl: HTMLInputElement = document.getElementById('imagein')

const form = document.getElementById('main_form')
const cordsFrom = document.getElementById('cords-from')

let power  = 2
let rez = 0
let imz = 0


if(canv){
    canv.width = window.innerHeight;
    canv.height = window.innerHeight;

    const ctx = canv.getContext('2d')
    
    if(ctx){
        const drawer = new CTXEngine({ctx, canvas: canv, objects: []})//new GuliaSimplifined(new ComplexPoint(0,0), 2, 15, 1,[0,0] )    new GuliaSimplifined(new ComplexPoint(0,0), 2, 15)
        
       
        let scale = 1
       let biasX = 0
       let biasY = 0
       let x = 0
       let y = 0 
       form?.addEventListener('submit', e => {
        e.preventDefault()
        // if(powerEl && realEl && imageinEl){
            power = parseFloat(powerEl?.value || '2')     
            rez = parseFloat(realEl?.value || '0')     
            imz = parseFloat(imageinEl?.value || '0')
            console.log(power, rez, imz);
            scale = 1
            biasX = 0
            biasY = 0
            x=0
            y=0
            //@ts-ignore
            scaleEl?.innerText = scale
            //@ts-ignore
            biasXEl?.innerText = biasX
            //@ts-ignore
            biasYEl?.innerText = biasY
            drawer.pushObj(new GuliaSimplifined(new ComplexPoint(rez,imz) ,power, 15, 1, [0,0]) )     
        // }
        
    })
    cordsFrom?.addEventListener('submit', (e) => {
        e.preventDefault()
        scale = parseFloat(document.querySelector<HTMLInputElement>('#scaleCords')?.value || "1") || 1
        biasX = parseFloat(document.querySelector<HTMLInputElement>('#biasxCord')?.value || "0") || 0
        biasY = parseFloat(document.querySelector<HTMLInputElement>('#biasyCord')?.value || "0") || 0
    
        drawer.pushObj(new GuliaSimplifined(new ComplexPoint(rez,imz) ,power, 15+scale*10, scale, [biasX, biasY]) )
        //@ts-ignore
        scaleEl?.innerText = scale
        //@ts-ignore
        biasXEl?.innerText = biasX
        //@ts-ignore
        biasYEl?.innerText = biasY
    })
       drawer.onSelect = (xB: number, yB: number, w: number, h: number) => {
                const realWidth = w/scale
                const realHeight = h/scale
                x += ((xB+w/2)/canv.width - 0.5)/scale
                y += ((yB+h/2)/canv.height- 0.5)/scale
                biasX = x*canv.width
                biasY = -(y*canv.height)

                scale = canv.width/realWidth 
                const bias: number[] = [biasX,biasY]
                console.log({scale, biasX,biasY,x,y});
                
                drawer.pushObj(new GuliaSimplifined(new ComplexPoint(rez,imz) ,power, 15+scale*10, scale, bias) )
                //@ts-ignore
                scaleEl?.innerText = scale
                //@ts-ignore
                biasXEl?.innerText = biasX
                //@ts-ignore
                biasYEl?.innerText = biasY

        }
    }
}



