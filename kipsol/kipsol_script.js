class Area{
    constructor() {
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    }
    append(x, y, r){
        this.minX = Math.min(this.minX, x-r);
        this.maxX = Math.max(this.maxX, x+r);
        this.minY = Math.min(this.minY, y-r);
        this.maxY = Math.max(this.maxY, y+r);
    }
}

function calcItemList(kipsol_settings, str, startX=0, startY=0){
    let cur = {
        X: startX,
        Y: startY,
        radius: 0,
        direction: 0
    };
    let area = new Area();
    let items = [];
    let clockwize = true;
    //console.log(area, items);
    Array.from(str).forEach((s)=>{
        s = s.toUpperCase();
        if("IOU".includes(s)){
            // vowel
            if(items.length===0){
                console.log("Error: unexpected input (initial vowel)");
                errState = -1;
                return errState;
            }
            if(items.slice(-1)[0].type==="vowel"){
                console.log("Error: unexpected input (continuous vowel)", s);
                errState = -1;
                return errState;
            }
            cur.direction = kipsol_settings.voweldir[s];
            if(cur.direction==undefined){
                console.log("Unexpected error", s);
                errState = -1;
                return errState;
            }
            items.push({
                type: "vowel",
                str: s,
                dir: cur.direction
            });
        }else if("ZDGBLNSTKP".includes(s)){
            // consonant
            const nextR = ("STKP".includes(s))? kipsol_settings.radiusVoiceless: kipsol_settings.radiusVoiced;
            let dist, nextX, nextY;
            if(items.length===0){
                dist = 0;
                nextX = cur.X;
                nextY = cur.Y;
            }else{
                dist = cur.radius + nextR;
                if(items.slice(-1)[0].type==="consonant"){
                    dist += kipsol_settings.consonantPadding;
                }
                nextX = cur.X + dist * Math.cos(cur.direction / 180 * Math.PI);
                nextY = cur.Y + dist * Math.sin(cur.direction / 180 * Math.PI);
            }
            if(items.length>0 && items.slice(-1)[0].type==="consonant"){
                items.push({
                    type: "line",
                    startX: cur.X,
                    startY: cur.Y,
                    endX: nextX,
                    endY: nextY
                });
                clockwize = !clockwize;
            }
            items.push({
                type: "consonant",
                str: s,
                centerX: nextX,
                centerY: nextY,
                radius: nextR,
                clockwize: clockwize
            });
            area.append(nextX, nextY, nextR);
            cur.X = nextX;
            cur.Y = nextY;
            cur.radius = nextR;
            cur.direction = kipsol_settings.voweldir["O"];
            clockwize = !clockwize;
        }else{
            console.log("Error: unexpected input", s);
            errState = -1;
            return errState;
        }
        //console.log(area, items.slice(-1)[0]);
    });
    {
        // end of word
        const nextR = kipsol_settings.radiusEOW;
        let dist, nextX, nextY;
        if(items.length===0){
            dist = 0;
            nextX = cur.X;
            nextY = cur.Y;
            console.log("Warning: blank word");
            errState = -1;
        }else{
            dist = cur.radius + nextR;
            if(items.slice(-1)[0].type==="consonant"){
                dist += kipsol_settings.consonantPadding;
            }
            nextX = cur.X + dist * Math.cos(cur.direction / 180 * Math.PI);
            nextY = cur.Y + dist * Math.sin(cur.direction / 180 * Math.PI);
        }
        if(items.length>0 && items.slice(-1)[0].type==="consonant"){
            _nxtX = cur.X + (dist - nextR) * Math.cos(cur.direction / 180 * Math.PI);
            _nxtY = cur.Y + (dist - nextR) * Math.sin(cur.direction / 180 * Math.PI);
            items.push({
                type: "line",
                startX: cur.X,
                startY: cur.Y,
                endX: _nxtX,
                endY: _nxtY
            });
        }
        items.push({
            type: "EOW",
            centerX: nextX,
            centerY: nextY,
            radius: nextR
        });
        area.append(nextX, nextY, nextR);
        //console.log(area, items.slice(-1)[0]);
    }
    return {
        items: items,
        area: area
    };
}

class KipsolCanvas{
    constructor(canvasName, kipsol_settings){
        this.canvas = new fabric.Canvas(canvasName);
        this.kipsol_settings = kipsol_settings;
    }

    strokeLine(startX, startY, endX, endY, strokeWidth=1, strokeColor="black", angle=0){
        const line = new fabric.Line([startX, startY, endX, endY], {
            strokeWidth: strokeWidth,
            stroke: strokeColor,
            angle: angle
        });
        this.canvas.add(line);
        return line;
    }

    strokeCircle(centerX, centerY, radius, strokeWidth=1, strokeColor="black", angle=0){
        const circle = new fabric.Circle({
            left: centerX - radius,
            top: centerY - radius,
            radius: radius,
            strokeWidth: strokeWidth,
            stroke: strokeColor,
            fill: null,
            angle: angle
        });
        this.canvas.add(circle);
        return circle;
    }

    fillCircle(centerX, centerY, radius, strokeWidth=1, strokeColor="black", fillColor="black", angle=0){
        const circle = new fabric.Circle({
            left: centerX - radius,
            top: centerY - radius,
            radius: radius,
            strokeWidth: strokeWidth,
            stroke: strokeColor,
            fill: fillColor,
            angle: angle
        });
        this.canvas.add(circle);
        return circle;
    }

    strokeTextbox(text, x, y, fontSize=20, width=null){
        const textbox = new fabric.Textbox(text, {
            top: y,
            left: x,
            fontSize: fontSize,
            width: width
        });
        this.canvas.add(textbox);
        return textbox;
    }

    strokeRadialPattern(centerX, centerY, radius, split, startR){
        let elems = [];
        [...Array(split)].map((_, i) => {
            let deg = 360 / split * i;
            let rad=(-startR-deg)/180*Math.PI;
            elems.push(this.strokeLine(centerX, centerY, centerX+radius*Math.cos(rad), centerY+radius*Math.sin(rad)));
        })
        return elems;
    }

    strokeZ(centerX, centerY, rotate=0){
        let elems = [];
        elems.push(this.strokeCircle(centerX, centerY, this.kipsol_settings.radiusVoiced));
        elems.push(this.fillCircle(centerX, centerY, this.kipsol_settings.radiusPivot));
        return elems;
    }
    strokeD(centerX, centerY, rotate=0){
        let elems = this.strokeZ(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiced;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 3, 90-rotate);
        return elems.concat(elems2);
    }
    strokeG(centerX, centerY, rotate=0){
        let elems = this.strokeZ(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiced;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 4, 90-rotate);
        return elems.concat(elems2);
    }
    strokeB(centerX, centerY, rotate=0){
        let elems = this.strokeZ(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiced;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 6, 90-rotate);
    }
    strokeS(centerX, centerY, rotate=0){
        let elems = [];
        elems.push(this.strokeCircle(centerX, centerY, this.kipsol_settings.radiusVoiceless));
        elems.push(this.fillCircle(centerX, centerY, this.kipsol_settings.radiusPivot));
        return elems;
    }
    strokeT(centerX, centerY, rotate=0){
        let elems = this.strokeS(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiceless;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 3, 90-rotate);
        return elems.concat(elems2);
    }
    strokeK(centerX, centerY, rotate=0){
        let elems = this.strokeS(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiceless;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 4, 90-rotate);
        return elems.concat(elems2);
    }
    strokeP(centerX, centerY, rotate=0){
        let elems = this.strokeS(centerX, centerY);
        const radius = this.kipsol_settings.radiusVoiceless;
        let elems2 = this.strokeRadialPattern(centerX, centerY, radius, 6, 90-rotate);
        return elems.concat(elems2);
    }
    strokeL(centerX, centerY, rotate=0){
        let elems = this.strokeZ(centerX, centerY);
        elems.push(this.strokeCircle(centerX, centerY, this.kipsol_settings.radiusVoiceless));
        return elems;
    }
    strokeN(centerX, centerY, rotate=0){
        let elems = this.strokeD(centerX, centerY, rotate);
        elems.push(this.strokeCircle(centerX, centerY, this.kipsol_settings.radiusVoiceless));
        return elems;
    }
    strokeEOW(centerX, centerY, rotate=0){
        let elems = [];
        elems.push(this.strokeCircle(centerX, centerY, this.kipsol_settings.radiusEOW));
        return elems;
    }

    drawItems(itemList, offset){
        const func_map = {
            'Z': (x, y, rot) => this.strokeZ(x, y, rot),
            'D': (x, y, rot) => this.strokeD(x, y, rot),
            'G': (x, y, rot) => this.strokeG(x, y, rot),
            'B': (x, y, rot) => this.strokeB(x, y, rot),
            'L': (x, y, rot) => this.strokeL(x, y, rot),
            'N': (x, y, rot) => this.strokeN(x, y, rot),
            'S': (x, y, rot) => this.strokeS(x, y, rot),
            'T': (x, y, rot) => this.strokeT(x, y, rot),
            'K': (x, y, rot) => this.strokeK(x, y, rot),
            'P': (x, y, rot) => this.strokeP(x, y, rot),
        }
        let elems = [];
        let preItem = {type: null, radius: null};
        let rotateSpeed = 1;
        itemList.forEach((item)=>{
            if(item.type==="consonant"){
                if(preItem.type==="consonant"){
                    rotateSpeed *= preItem.radius/item.radius;
                }
                elems = elems.concat(func_map[item.str](item.centerX + offset.X, item.centerY + offset.Y, (item.clockwize? 1: -1)*rotateSpeed*offset.R));
            }else if(item.type==="EOW"){
                elems = elems.concat(this.strokeEOW(item.centerX + offset.X, item.centerY + offset.Y));
            }else if(item.type==="line"){
                elems.push(this.strokeLine(item.startX + offset.X, item.startY + offset.Y, item.endX + offset.X, item.endY + offset.Y));
            }
            if(item.type!="vowel")
                preItem = item;
        });
        return elems;
    }
}

function downloadText(fileName, text){
    const blob = new Blob([text], { type: 'text/plain' });
    const aTag = document.createElement('a');
    aTag.href = URL.createObjectURL(blob);
    aTag.target = '_blank';
    aTag.download = fileName;
    aTag.click();
    URL.revokeObjectURL(aTag.href);
}