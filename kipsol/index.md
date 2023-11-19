# キプソル語

## 使用方法

+ 「文字を入力: 」欄に（キプソル語の単語として有効な）文字列を入力すると対応する文字を出力します
+ Export JSON/SVGをクリックすると文字の画像情報がダウンロードされます
+ ▶ 設定を開くと文字の大きさや角度が変更できます
  + アニメーション間隔を0以上にすると文字が回転するアニメーションが動作します
  + アニメーション間隔を0にするか停止ボタンでアニメーションが停止します

## 免責事項

試験的に作ったものなので異常な入力などはしないでください．不具合がありましたらGitHubをはじめ筆者の連絡先までご連絡ください．

## 凡例

<canvas id="canvasExample" width="800" height="300" style="border:1px solid;"></canvas>

## キプソル文字出力

<details>
    <summary>設定</summary>
    <ul>
        <li>
            字母<br>
            <ul>
                <li><label>有声音円のサイズ: <input type="number" id="inputVoisedSize" name="inputVoisedSize" maxlength="10" size="4" value="50"/></label></li>
                <li><label>無声音円のサイズ: <input type="number" id="inputVoiselessSize" name="inputVoiselessSize" maxlength="10" size="4" value="25"/></label></li>
                <li><label>語末記号のサイズ: <input type="number" id="inputEOWSize" name="inputEOWSize" maxlength="10" size="4" value="7"/></label></li>
                <li><label>中心の点のサイズ: <input type="number" id="inputPivotSize" name="inputPivotSize" maxlength="10" size="4" value="3"/></label></li>
                <li><label>母音の角度: <input type="number" id="inputVowelDeg" name="inputVowelDeg" maxlength="10" size="4" value="45"/> deg.</label></li>
                <li><label>連続子音の離す距離: <input type="number" id="inputPaddingLength" name="inputPaddingLength" maxlength="10" size="4" value="10"/></label></li>
            </ul>
        </li>
        <li>
            余白<br>
            <ul>
                <li><label>全部: <input type="number" id="inputMarginAll" name="inputMarginAll" maxlength="10" size="4" value="25"/></label>
                    <ul>
                        <li><label>上: <input type="number" id="inputMarginTop" name="inputMarginTop" maxlength="10" size="4" value="25"/></label></li>
                        <li><label>下: <input type="number" id="inputMarginBottom" name="inputMarginBottom" maxlength="10" size="4" value="25"/></label></li>
                        <li><label>左: <input type="number" id="inputMarginLeft" name="inputMarginLeft" maxlength="10" size="4" value="25"/></label></li>
                        <li><label>右: <input type="number" id="inputMarginRight" name="inputMarginRight" maxlength="10" size="4" value="25"/></label></li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>
            アニメーション<br>
            <ul>
                <li><label>速度: <input type="number" id="inputRotationSpeed" name="inputRotationSpeed" maxlength="10" size="4" value="1"/> deg/sec</label></li>
                <li><label>アニメーション間隔: <input type="number" id="inputAnimationSpan" name="inputAnimationSpan" maxlength="10" size="4" value="0"/> sec</label></li>
                <li><button type="button" onclick="resetRotate()">停止</button>:  <input type="number" id="inputResetRotate" name="inputResetRotate" maxlength="10" size="4" value="0"/> deg.</label></li>
            </ul>
        </li>
    </ul>
</details>
<div>
    <label>文字を入力: <input type="text" id="inputText" name="inputText" maxlength="100" size="80" value="kipsol"/></label>
    <canvas id="canvas" width="800" height="500" style="border:1px solid;"></canvas>
</div>
<div>
    <p>
        <button type="button" onclick="downloadAsJSON()">Export JSON</button>
        <button type="button" onclick="downloadAsSVG()">Export SVG</button>
    </p>
</div>

## 参考

<iframe width="560" height="315" src="https://www.youtube.com/embed/r4AKMeUhRf4?si=tU2kELkOhcU4-aQ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[よくわかる！QuizKnockオリジナル言語「キプソル語」ガイド](https://web.quizknock.com/kipsil_lisok)

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
<script type="text/javascript" src="./kipsol_script.js"></script>
<script  type="text/javascript">

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
</script>
