"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCanvasY = exports.toCanvasX = void 0;
function toCanvasX(c, e) {
    var posx = 0;
    if (e.pageX) {
        posx = e.pageX;
    }
    else if (e.clientX) {
        posx = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
    }
    posx = posx - c.offsetLeft;
    return posx;
}
exports.toCanvasX = toCanvasX;
function toCanvasY(c, e) {
    var posy = 0;
    if (e.pageY) {
        posy = e.pageY;
    }
    else if (e.clientY) {
        posy = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    posy = posy - c.offsetTop;
    return posy;
}
exports.toCanvasY = toCanvasY;
