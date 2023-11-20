# キプソル語ジェネレーター

## 使用方法

+ 「文字を入力: 」欄に（キプソル語の単語のローマ字転写として有効な）文字列を入力してEnter押下すると対応する文字を出力します
  + 現在は数字・スペース・語頭の母音などには未対応で読み飛ばされます
+ Export JSON/SVGをクリックすると文字の画像情報がダウンロードされます
+ ▶ 設定を開くと文字の大きさや角度が変更できます
  + 「アニメーション間隔」を0以上にすると文字が回転するアニメーションが動作します
  + 0にするか停止ボタンでアニメーションが停止します

## 免責事項

試験的に作ったものなので異常な入力などはしないでください．
不具合がありましたら筆者の連絡先（[GitHub](https://github.com/Y-Saki26/KipsolGenerator)）までご連絡ください．

## 凡例

<p><canvas id="canvasExample" width="800" height="300" style="border:1px solid;"></canvas></p>

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
                <li><label><button type="button" onclick="resetRotate()">停止</button></label></li>
                <li><label>初期角度: <input type="number" id="inputResetRotate" name="inputResetRotate" maxlength="10" size="4" value="0"/> deg.</label></li>
            </ul>
        </li>
    </ul>
</details>
<label>文字を入力: <input type="text" id="inputText" name="inputText" maxlength="100" size="80" value="kipsol"/></label>
<p><canvas id="canvas" width="800" height="500" style="border:1px solid;"></canvas></p>
<p>
    <button type="button" onclick="downloadAsJSON()">Export JSON</button>
    <button type="button" onclick="downloadAsSVG()">Export SVG</button>
</p>

## 参考

+ [東大生なら未知の言語解読できる説【キプソル語】](https://www.youtube.com/watch?v=r4AKMeUhRf4)
+ [よくわかる！QuizKnockオリジナル言語「キプソル語」ガイド](https://web.quizknock.com/kipsil_lisok)

<iframe width="560" height="315" src="https://www.youtube.com/embed/r4AKMeUhRf4?si=tU2kELkOhcU4-aQ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
<script type="text/javascript" src="./kipsol_script.js"></script>
<script type="text/javascript" src="./interface_script.js"></script>
