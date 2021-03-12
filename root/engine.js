"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculation_1 = require("./calculation");
class CTXEngine {
    constructor({ ctx, canvas, objects }) {
        this.xSel = 0;
        this.ySel = 0;
        this.mouseDown = false;
        this.onSelect = (xB, yB, w, h) => { };
        this.ctx = ctx;
        this.canvas = canvas;
        if (objects) {
            this.objects = objects;
        }
        else {
            this.objects = [];
        }
        this.init();
    }
    get xMax() {
        return this.canvas.width;
    }
    get yMax() {
        return this.canvas.height;
    }
    refreshImageData() {
        this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    init() {
        this.clear();
        this.render();
        this.refreshImageData();
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                this.ctx.putImageData(this.imageData, 0, 0);
                this.ctx.fillStyle = "rgba(0,0,0,0.2)";
                this.ctx.fillRect(this.xSel, this.ySel, calculation_1.toCanvasX(this.canvas, e) - this.xSel, calculation_1.toCanvasX(this.canvas, e) - this.xSel); //e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop
                this.ctx.fill();
            }
        });
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            this.xSel = calculation_1.toCanvasX(this.canvas, e);
            this.ySel = calculation_1.toCanvasY(this.canvas, e);
        });
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false;
            this.ctx.putImageData(this.imageData, 0, 0);
            this.onSelect(this.xSel, this.ySel, calculation_1.toCanvasX(this.canvas, e) - this.xSel, calculation_1.toCanvasX(this.canvas, e) - this.xSel);
        });
    }
    clear() {
        const ctx = this.ctx;
        const canv = this.canvas;
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, canv === null || canv === void 0 ? void 0 : canv.width, canv === null || canv === void 0 ? void 0 : canv.height);
        ctx.fill();
        this.refreshImageData();
    }
    render() {
        for (let object of this.objects) {
            let result = object.render(this.ctx, this);
            while (result) {
                result = result.render(this.ctx, this);
            }
        }
        this.refreshImageData();
    }
    pushObj(obj) {
        obj.payload.id = Date.now();
        this.objects.push(obj);
        let result = obj.render(this.ctx, this);
        while (result) {
            result = result.render(this.ctx, this);
        }
        this.refreshImageData();
        return obj.payload.id;
    }
    hardPushObj(obj) {
        const id = this.pushObj(obj);
        this.render();
        this.refreshImageData();
        return id;
    }
    setMouseDown(x, y) {
        this.mouseDown = true;
        this.xSel = x;
        this.ySel = y;
    }
    setMouseUp(x, y) {
        this.mouseDown = false;
        // this.xSel = x
        // this.ySel = y
    }
}
exports.default = CTXEngine;
