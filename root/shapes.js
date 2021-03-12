"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gulia = exports.GuliaSimplifined = exports.Hiperbola = exports.Parabola = exports.Elipse = exports.Disc = exports.Circle = exports.ComplexPoint = exports.ComplexPointsArray = exports.ShapesArray = exports.CTXObject = void 0;
const gpu_js_1 = require("gpu.js");
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
const forEvryPoint = (width, height, sortFunc) => {
    let result = [];
    for (let real = 0; real < width; real++) {
        for (let imagine = 0; imagine < height; imagine++) {
            if (sortFunc(new ComplexPoint(real, imagine))) {
                result.push(new ComplexPoint(real, imagine));
            }
        }
    }
    return result;
};
class CTXObject {
    constructor(name) {
        this.name = name;
        this.payload = {};
    }
    render(ctx, drawer) {
        throw new Error("Render method is not asigned");
    }
}
exports.CTXObject = CTXObject;
class ShapesArray extends CTXObject {
    constructor(objects) {
        super('Shapes Array');
        this.objects = objects;
    }
    render(ctx, drawer) {
        console.log('start');
        this.objects.forEach(obj => drawer.pushObj(obj));
        console.log('end');
    }
}
exports.ShapesArray = ShapesArray;
class ComplexPointsArray extends CTXObject {
    constructor(points) {
        super('Points array');
        this.points = points;
    }
    render(ctx, drawer) {
        const imageData = ctx.createImageData(drawer.xMax, drawer.yMax);
        const color = {
            red: 0,
            green: 0,
            blue: 0
        };
        console.log('begin');
        let pixelIndex;
        for (let point of this.points) {
            pixelIndex = point.real * 4 + point.imagine * drawer.xMax * 4;
            imageData.data[pixelIndex] = color.red; // red   color
            imageData.data[pixelIndex + 1] = color.green; // green color
            imageData.data[pixelIndex + 2] = color.blue; // blue  color
            imageData.data[pixelIndex + 3] = 255;
        }
        console.log('end');
        ctx.putImageData(imageData, 0, 0);
    }
}
exports.ComplexPointsArray = ComplexPointsArray;
class ComplexPoint extends CTXObject {
    constructor(real, imagine, color = "#eee") {
        super('Complex number');
        this.real = real;
        this.imagine = imagine;
        this.color = color;
    }
    static from(cn) {
        return new ComplexPoint(cn.real, cn.imagine);
    }
    multiply(cn) {
        return new ComplexPoint(this.real * cn.real - this.imagine * cn.imagine, this.imagine * cn.real + this.real * cn.imagine);
    }
    power(a) {
        let first = this.multiply(this);
        for (let i = 2; i < a; i++) {
            first = first.multiply(this);
        }
        return a === 1 ? ComplexPoint.from(this) : first;
    }
    pow() {
        const real = Math.pow(this.real, 2) - Math.pow(this.imagine, 2);
        const image = this.imagine * this.real * 2;
        this.real = real;
        this.imagine = image;
        return this;
    }
    sum(cn) {
        this.real = this.real + cn.real;
        this.imagine = this.imagine + cn.imagine;
        return this;
    }
    subtraction(cn) {
        this.real = this.real - cn.real;
        this.imagine = this.imagine - cn.imagine;
        return this;
    }
    distanceTo(cn) {
        return Math.sqrt(Math.pow((this.real - cn.real), 2) + Math.pow((this.imagine - cn.imagine), 2));
    }
    module() {
        return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imagine, 2));
    }
    render(ctx) {
        const oldFillStyle = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.real, this.imagine, 1, 1);
        ctx.fillStyle = oldFillStyle;
    }
}
exports.ComplexPoint = ComplexPoint;
class Line extends CTXObject {
    constructor(begin, end) {
        super('Line');
        this.begin = begin;
        this.end = end;
    }
    render(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.begin.real, this.begin.imagine);
        ctx.lineTo(this.end.real, this.end.imagine);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }
}
class Circle extends CTXObject {
    constructor(z0, r, renderType = 'round') {
        super('Circle');
        this.z0 = z0;
        this.r = r;
        this.renderType = renderType;
    }
    render(ctx, drawer) {
        let result = [];
        switch (this.renderType) {
            case "main-points":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => cn.subtraction(this.z0).module() === this.r);
                break;
            case "floor":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => Math.floor(cn.subtraction(this.z0).module()) === Math.round(this.r));
                break;
            case "ceil":
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => Math.ceil(cn.subtraction(this.z0).module()) === Math.round(this.r));
                break;
            case 'round':
                result = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => Math.round(cn.subtraction(this.z0).module()) === Math.round(this.r));
                break;
        }
        //@ts-ignore
        return new ShapesArray(result);
    }
}
exports.Circle = Circle;
class Disc extends Circle {
    constructor(z0, r, renderType = 'round') {
        super(z0, r, renderType);
        this.name = "Disk";
    }
    render(ctx, drawer) {
        return new ShapesArray(forEvryPoint(drawer.xMax, drawer.yMax, (cn) => cn.subtraction(this.z0).module() <= this.r));
    }
}
exports.Disc = Disc;
class Elipse extends CTXObject {
    constructor(focus1, focus2, mainVertex) {
        super('Ellipse');
        this.focus1 = focus1;
        this.focus2 = focus2;
        this.mainVertex = mainVertex;
    }
    render(ctx, drawer) {
        let result = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => {
            const a = ComplexPoint.from(cn).subtraction(this.focus1).module() + ComplexPoint.from(cn).subtraction(this.focus2).module();
            const res = Math.round(a) === Math.round(this.mainVertex * 2);
            return res;
        });
        return new ShapesArray(result);
    }
}
exports.Elipse = Elipse;
class Parabola extends CTXObject {
    constructor(focus, zD, horizontal = true) {
        super('Parabola');
        this.focus = focus;
        this.zD = zD;
        this.horizontal = horizontal;
    }
    render(ctx, drawer) {
        const prop = this.horizontal ? "imagine" : "real";
        const res = forEvryPoint(drawer.xMax, drawer.yMax, (cn) => {
            const a = ComplexPoint.from(cn).distanceTo(this.focus);
            const b = Math.abs(ComplexPoint.from(cn).subtraction(this.zD)[prop]);
            return Math.ceil(a) === Math.round(b);
        });
        const derectriosa = new Line(new ComplexPoint(0, this.zD.imagine), new ComplexPoint(drawer.xMax, this.zD.imagine));
        return new ShapesArray([...res, derectriosa]);
    }
}
exports.Parabola = Parabola;
class Hiperbola extends CTXObject {
    constructor(focus1, focus2, vertex) {
        super('Hiperbola');
        this.focus1 = focus1;
        this.focus2 = focus2;
        this.vertex = vertex;
    }
    render(ctx, drawer) {
        return new ShapesArray(forEvryPoint(drawer.xMax, drawer.yMax, (cn) => {
            const a = ComplexPoint.from(cn).subtraction(this.focus1).module();
            const b = ComplexPoint.from(cn).subtraction(this.focus2).module();
            const y = Math.abs(a - b);
            return Math.floor(y) == Math.round(2 * this.vertex);
        }));
    }
}
exports.Hiperbola = Hiperbola;
class GuliaSimplifined extends CTXObject {
    constructor(z, power = 2, depth = 15, scale = 1, bias = [0, 0]) {
        super("Gulia");
        this.z = z;
        this.power = power;
        this.depth = depth;
        this.scale = scale;
        this.bias = bias;
        this.biasX = this.bias[0] * 2;
        this.biasY = this.bias[1] * 2;
    }
    render(ctx, drawer) {
        const gpu = new gpu_js_1.GPU();
        const createGulia = gpu.createKernel(function (zReal, zImagine, power, depth, scale, bias) {
            //@ts-ignore
            const a = ((this.thread.x + bias[0] * scale - this.constants.width / 2) / (this.constants.width / 4)) / scale;
            //@ts-ignore
            const b = ((this.thread.y + bias[1] * scale - this.constants.height / 2) / (this.constants.height / 4)) / scale;
            let zRealTemp = zReal;
            let zImagineTemp = zImagine;
            let trigered = false;
            let i = 0;
            let moduleOFNumber = 0;
            do {
                for (let i = 1; i < power; i++) {
                    let newzRealTemp = Math.pow(zRealTemp, 2) - Math.pow(zImagineTemp, 2);
                    zImagineTemp = 2 * zImagineTemp * zRealTemp;
                    zRealTemp = newzRealTemp;
                }
                zRealTemp += a;
                zImagineTemp += b;
                moduleOFNumber = Math.sqrt(Math.pow(zRealTemp, 2) + Math.pow(zImagineTemp, 2));
                if (moduleOFNumber > 2) {
                    trigered = true;
                    break;
                }
                i++;
            } while (i <= depth);
            if (!trigered) {
                this.color(1, 1, 1, 1);
            }
            else {
                this.color((i / depth + 0.25 / moduleOFNumber), 0.5 / moduleOFNumber, (i / depth + 0.5 / moduleOFNumber) / 2, 1);
            }
        }).setOutput([drawer.xMax, drawer.yMax]).setGraphical(true).setConstants({
            width: drawer.xMax,
            height: drawer.yMax
        });
        createGulia(this.z.real, this.z.imagine, this.power, this.depth, this.scale, this.bias);
        const res = createGulia.getPixels();
        const imageData = ctx.createImageData(drawer.xMax, drawer.yMax);
        for (let i in imageData.data) {
            //@ts-ignore
            imageData.data[i] = res[i];
        }
        ctx.putImageData(imageData, 0, 0);
    }
}
exports.GuliaSimplifined = GuliaSimplifined;
class Gulia extends CTXObject {
    constructor(z, power = 2, depth = 15) {
        super("Gulia");
        this.z = z;
        this.power = power;
        this.depth = depth;
    }
    render(ctx, drawer) {
        //@ts-ignore
        let res = /**/ [];
        let i = 0;
        let trigered = false;
        for (let x = 0; x <= drawer.xMax; x++) {
            for (let y = 0; y <= drawer.yMax; y++) {
                const a = (x - drawer.xMax / 2) / (drawer.xMax / 4);
                const b = (y - drawer.yMax / 2) / (drawer.yMax / 4);
                const c = new ComplexPoint(a, b);
                let z = ComplexPoint.from(this.z);
                trigered = false;
                i = 0;
                do {
                    z = z.power(this.power);
                    z = z.sum(c);
                    if (z.module() > 2) {
                        trigered = true;
                        break;
                    }
                    i++;
                } while (i <= this.depth);
                if (trigered) {
                    const depthOfIteration = i / this.depth;
                    const distanseToGulia = 1 - 2 / z.module();
                    const test = (depthOfIteration + distanseToGulia) / 2;
                    if (depthOfIteration !== 1) {
                        res.push(new ComplexPoint(x, y, `rgb(${test * 255}, 0,0)`));
                    }
                }
                else {
                    res.push(new ComplexPoint(x, y));
                }
            }
        }
        return new ShapesArray(res);
    }
}
exports.Gulia = Gulia;
