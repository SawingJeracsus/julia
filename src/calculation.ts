export function toCanvasX(c: HTMLCanvasElement, e: MouseEvent) {
    var posx = 0;
     
    if (e.pageX)   {
      posx = e.pageX;
    } else if (e.clientX)   {
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
    }
    posx = posx - c.offsetLeft;
    return posx;
  }
   
export function toCanvasY(c: HTMLCanvasElement, e: MouseEvent) {
    var posy = 0;
     
    if (e.pageY)   {
      posy = e.pageY;
    } else if (e.clientY)   {
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    posy = posy - c.offsetTop;
     
    return posy;
  }