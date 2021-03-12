"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shapes_1 = require("./shapes");
const engine_1 = __importDefault(require("./engine"));
const canv = document.querySelector("#app");
const canvEl = canv;
const scaleEl = document.getElementById('scale');
const biasXEl = document.getElementById('biasx');
const biasYEl = document.getElementById('biasy');
//@ts-ignore
const powerEl = document.getElementById('power');
//@ts-ignore
const realEl = document.getElementById('real');
//@ts-ignore
const imageinEl = document.getElementById('imagein');
const form = document.getElementById('main_form');
const cordsFrom = document.getElementById('cords-from');
let power = 2;
let rez = 0;
let imz = 0;
if (canv) {
    canv.width = window.innerHeight;
    canv.height = window.innerHeight;
    const ctx = canv.getContext('2d');
    if (ctx) {
        const drawer = new engine_1.default({ ctx, canvas: canv, objects: [] }); //new GuliaSimplifined(new ComplexPoint(0,0), 2, 15, 1,[0,0] )    new GuliaSimplifined(new ComplexPoint(0,0), 2, 15)
        let scale = 1;
        let biasX = 0;
        let biasY = 0;
        let x = 0;
        let y = 0;
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', e => {
            e.preventDefault();
            // if(powerEl && realEl && imageinEl){
            power = parseFloat((powerEl === null || powerEl === void 0 ? void 0 : powerEl.value) || '2');
            rez = parseFloat((realEl === null || realEl === void 0 ? void 0 : realEl.value) || '0');
            imz = parseFloat((imageinEl === null || imageinEl === void 0 ? void 0 : imageinEl.value) || '0');
            console.log(power, rez, imz);
            scale = 1;
            biasX = 0;
            biasY = 0;
            x = 0;
            y = 0;
            //@ts-ignore
            scaleEl === null || scaleEl === void 0 ? void 0 : scaleEl.innerText = scale;
            //@ts-ignore
            biasXEl === null || biasXEl === void 0 ? void 0 : biasXEl.innerText = biasX;
            //@ts-ignore
            biasYEl === null || biasYEl === void 0 ? void 0 : biasYEl.innerText = biasY;
            drawer.pushObj(new shapes_1.GuliaSimplifined(new shapes_1.ComplexPoint(rez, imz), power, 15, 1, [0, 0]));
            // }
        });
        cordsFrom === null || cordsFrom === void 0 ? void 0 : cordsFrom.addEventListener('submit', (e) => {
            var _a, _b, _c;
            e.preventDefault();
            scale = parseFloat(((_a = document.querySelector('#scaleCords')) === null || _a === void 0 ? void 0 : _a.value) || "1") || 1;
            biasX = parseFloat(((_b = document.querySelector('#biasxCord')) === null || _b === void 0 ? void 0 : _b.value) || "0") || 0;
            biasY = parseFloat(((_c = document.querySelector('#biasyCord')) === null || _c === void 0 ? void 0 : _c.value) || "0") || 0;
            drawer.pushObj(new shapes_1.GuliaSimplifined(new shapes_1.ComplexPoint(rez, imz), power, 15 + scale * 10, scale, [biasX, biasY]));
            //@ts-ignore
            scaleEl === null || scaleEl === void 0 ? void 0 : scaleEl.innerText = scale;
            //@ts-ignore
            biasXEl === null || biasXEl === void 0 ? void 0 : biasXEl.innerText = biasX;
            //@ts-ignore
            biasYEl === null || biasYEl === void 0 ? void 0 : biasYEl.innerText = biasY;
        });
        drawer.onSelect = (xB, yB, w, h) => {
            const realWidth = w / scale;
            const realHeight = h / scale;
            x += ((xB + w / 2) / canv.width - 0.5) / scale;
            y += ((yB + h / 2) / canv.height - 0.5) / scale;
            biasX = x * canv.width;
            biasY = -(y * canv.height);
            scale = canv.width / realWidth;
            const bias = [biasX, biasY];
            console.log({ scale, biasX, biasY, x, y });
            drawer.pushObj(new shapes_1.GuliaSimplifined(new shapes_1.ComplexPoint(rez, imz), power, 15 + scale * 10, scale, bias));
            //@ts-ignore
            scaleEl === null || scaleEl === void 0 ? void 0 : scaleEl.innerText = scale;
            //@ts-ignore
            biasXEl === null || biasXEl === void 0 ? void 0 : biasXEl.innerText = biasX;
            //@ts-ignore
            biasYEl === null || biasYEl === void 0 ? void 0 : biasYEl.innerText = biasY;
        };
    }
}
