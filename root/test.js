"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shapes_1 = require("./shapes");
const gpu_js_1 = require("gpu.js");
const gpu = new gpu_js_1.GPU();
const test = function (x, y, maxX, maxY) {
    const a = (x - maxX / 2) / (maxX / 4);
    const b = (y - maxY / 2) / (maxY / 4);
    let zRealTemp = 0;
    let zImagineTemp = 0;
    let trigered = false;
    let i = 0;
    do {
        for (let i = 1; i < 2; i++) {
            let newzRealTemp = Math.pow(zRealTemp, 2) - Math.pow(zImagineTemp, 2);
            zImagineTemp = 2 * zImagineTemp * zRealTemp;
            zRealTemp = newzRealTemp;
        }
        zRealTemp += a;
        zImagineTemp += b;
        if (Math.sqrt(Math.pow(zRealTemp, 2) + Math.pow(zImagineTemp, 2)) > 2) {
            trigered = true;
            break;
        }
        i++;
    } while (i <= 15);
    return !trigered;
};
const normal = function (x, y, maxX, maxY) {
    const a = (x - maxX / 2) / (maxX / 4);
    const b = (y - maxY / 2) / (maxY / 4);
    const c = new shapes_1.ComplexPoint(a, b);
    let z = new shapes_1.ComplexPoint(0, 0);
    let trigered = false;
    let i = 0;
    do {
        z = z.power(2);
        z = z.sum(c);
        if (z.module() > 2) {
            trigered = true;
            break;
        }
        i++;
    } while (i <= 15);
    return !trigered;
};
const graph = gpu.createKernel(function () {
    this.color(0, 0, 0, 1);
}).setOutput([20, 20]).setGraphical(true);
graph();
const zoomIntensity = 0.2;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
//@ts-ignore    
// document.onmousewheel = function (event){
// console.log('loading');
// 
// const mousex = event.clientX - canv.offsetLeft;
// const mousey = event.clientY - canv.offsetTop;
// const wheel = event.wheelDelta/120;
// const zoom = Math.exp(wheel*zoomIntensity);
// drawer.clear()
// scale += zoom
// 
// const offsetXTemp = (mousex - canv.width/2)/(canv.width/4)/20
// const offsetYTemp = (mousey - canv.height/2)/(canv.height/4)/20
// offsetX +=  offsetXTemp
// offsetY +=  offsetYTemp
// 
// drawer.pushObj(new GuliaSimplifined(new ComplexPoint(0,0), 2, 15+scale, scale, [offsetX, offsetY]))
// console.log('complete');
// 
// }
// 
// }
// 
// }else{
// throw new Error("Canvas el don`t founded!")
// }
// 
// const guliaFunc = (a: ComplexPoint, c: ComplexPoint) => a.pow().subtraction(c).module()
