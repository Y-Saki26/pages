///////////////////////////////////////////////////////////////////////////////
/** TODO
 * [v] protptypeを書き換えるのではなくclassを作る
 * [v] 最初の要素の描画でlineが入ることがある(cf. subulok)．最初を分けて処理したほうが良い 
 * [v] 先にオブジェクトの相対位置の計算を済ませてからリストを参照して描画したほうが良さそう
 * [v] 語末文字に線が侵入する問題
 * 文章組版の実装
 * [v] 部位サイズ，キャンバスサイズ変更機能の実装
 * 数字，ピリオドの実装
 * [v] 歯車モチーフなので回したい
 */
///////////////////////////////////////////////////////////////////////////////

const inputElement = document.getElementById('inputText');
let kipsol_settings = {
    consonantPadding: 10,
    radiusPivot: 3,
    radiusVoiced: 50,
    radiusVoiceless: 25,
    radiusEOW: 7,
    voweldir: {
        "I": -45,
        "O": 0,
        "U": 45
    }
};
let mergin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
};
let animationSpeed = 0;//0.2 * 1000;
let rotateSpeed = 3 * animationSpeed / 1000;

function drawExample(){
    let kc = new KipsolCanvas('canvasExample', kipsol_settings);

    let textWidth = kipsol_settings.radiusVoiced*0.2;
    let x = textWidth*2;

    kc.canvas.setWidth(textWidth*18+kipsol_settings.radiusVoiced*12);
    kc.canvas.setHeight(textWidth*6+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless*2);

    kc.strokeTextbox("z", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("s", x+kipsol_settings.radiusVoiced-kipsol_settings.radiusVoiceless-textWidth, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    x += textWidth;
    kc.strokeZ(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    kc.strokeS(x + kipsol_settings.radiusVoiced, textWidth*4+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless);
    x += kipsol_settings.radiusVoiced*2 + textWidth;

    kc.strokeTextbox("d", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("t", x+kipsol_settings.radiusVoiced-kipsol_settings.radiusVoiceless-textWidth, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    x += textWidth;
    kc.strokeD(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    kc.strokeT(x + kipsol_settings.radiusVoiced, textWidth*4+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless);
    x += kipsol_settings.radiusVoiced*2 + textWidth;

    kc.strokeTextbox("g", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("k", x+kipsol_settings.radiusVoiced-kipsol_settings.radiusVoiceless-textWidth, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    x += textWidth;
    kc.strokeG(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    kc.strokeK(x + kipsol_settings.radiusVoiced, textWidth*4+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless);
    x += kipsol_settings.radiusVoiced*2 + textWidth;

    kc.strokeTextbox("b", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("p", x+kipsol_settings.radiusVoiced-kipsol_settings.radiusVoiceless-textWidth, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    x += textWidth;
    kc.strokeB(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    kc.strokeP(x + kipsol_settings.radiusVoiced, textWidth*4+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless);
    x += kipsol_settings.radiusVoiced*2 + textWidth;

    kc.strokeTextbox("l", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("end of word", x, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*15);
    x += textWidth;
    kc.strokeL(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    kc.strokeEOW(x + kipsol_settings.radiusVoiced, textWidth*4+kipsol_settings.radiusVoiced*2+kipsol_settings.radiusVoiceless);
    x += kipsol_settings.radiusVoiced*2 + textWidth;

    kc.strokeTextbox("n", x, textWidth, kipsol_settings.radiusVoiced*0.4, textWidth*2);
    kc.strokeTextbox("end of centence", x, textWidth*3+kipsol_settings.radiusVoiced*2, kipsol_settings.radiusVoiced*0.4, textWidth*15);
    x += textWidth;
    kc.strokeN(x + kipsol_settings.radiusVoiced, textWidth*2+kipsol_settings.radiusVoiced);
    x += kipsol_settings.radiusVoiced*2 + textWidth;
}

drawExample();

const kCanvas = new KipsolCanvas('canvas', kipsol_settings);
kCanvas.canvas.setWidth(800);
kCanvas.canvas.setHeight(500);
let rotate = 0;

function drawInputText(){
    kCanvas.canvas.remove(...kCanvas.canvas.getObjects())
    let inputText = inputElement.value;
    let cil = calcItemList(kipsol_settings, inputText);
    console.log(cil.area, cil.items);
    kCanvas.canvas.setWidth(mergin.left + mergin.right + cil.area.maxX - cil.area.minX);
    kCanvas.canvas.setHeight(mergin.top + mergin.bottom + cil.area.maxY - cil.area.minY);
    kCanvas.drawItems(cil.items, {X: mergin.left-cil.area.minX, Y: mergin.top-cil.area.minY, R: rotate});
    rotate += rotateSpeed;
    rotate %= 360;
}

drawInputText();
inputElement.addEventListener("change", drawInputText);



let settingElements = {};
let intervalId;

function setParams(){
    kipsol_settings = {
        consonantPadding: parseFloat(settingElements['inputPaddingLength'].value),
        radiusPivot: parseFloat(settingElements['inputPivotSize'].value),
        radiusVoiced: parseFloat(settingElements['inputVoisedSize'].value),
        radiusVoiceless: parseFloat(settingElements['inputVoiselessSize'].value),
        radiusEOW: parseFloat(settingElements['inputEOWSize'].value),
        voweldir: {
            "I": -parseFloat(settingElements['inputVowelDeg'].value),
            "O": 0,
            "U": parseFloat(settingElements['inputVowelDeg'].value)
        }
    };
    mergin = {
        top: parseFloat(settingElements['inputMarginTop'].value),
        bottom: parseFloat(settingElements['inputMarginBottom'].value),
        left: parseFloat(settingElements['inputMarginLeft'].value),
        right: parseFloat(settingElements['inputMarginRight'].value)
    };
    animationSpeed = parseFloat(settingElements['inputAnimationSpan'].value) * 1000;
    rotateSpeed = parseFloat(settingElements['inputRotationSpeed'].value) * animationSpeed / 1000;
    console.log(kipsol_settings, mergin, animationSpeed, rotateSpeed);
    kCanvas.kipsol_settings = kipsol_settings;
    drawInputText();
    
    if(intervalId)
        clearInterval(intervalId);
    if(animationSpeed>0){
        intervalId = setInterval(drawInputText, animationSpeed);
    }
}

[
    'inputPaddingLength','inputPivotSize','inputVoisedSize',
    'inputVoiselessSize','inputEOWSize','inputVowelDeg',
    "inputMarginTop","inputMarginBottom","inputMarginLeft","inputMarginRight",
    "inputRotationSpeed","inputAnimationSpan"
].forEach((id)=>{
    settingElements[id] = document.getElementById(id);
    settingElements[id].addEventListener("change", setParams);
})
settingElements["inputMarginAll"] = document.getElementById("inputMarginAll");
settingElements["inputMarginAll"].addEventListener("change", () => {
    ["inputMarginTop","inputMarginBottom","inputMarginLeft","inputMarginRight"].forEach((id) => {
        settingElements[id].value = settingElements["inputMarginAll"].value;
    })
});

function resetRotate(){
    rotate = parseFloat(document.getElementById("inputResetRotate").value);
    settingElements["inputAnimationSpan"].value = 0;
    if(intervalId)
        clearInterval(intervalId);
    drawInputText();
}

function downloadAsSVG(){
    downloadText(`${inputElement.value}.svg`, kCanvas.canvas.toSVG());
}
function downloadAsJSON(){
    downloadText(`${inputElement.value}.json`, JSON.stringify(kCanvas.canvas));
}