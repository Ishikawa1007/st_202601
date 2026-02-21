// ============================================================
// ① 定数・設定
// ============================================================

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7],
  [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15],
  [15, 16], [0, 17], [17, 18], [18, 19], [19, 20]
];


const KEY_Y_OFFSET =  10; // キーY座標に追加するオフセット（px） 目的:指の先端に合わせるため
const FINGERTIP_RADIUS = 5; // 指先点の半径（px）
const FINGERTIP_INDICES = [8, 12, 16, 20]; // 入力対象の指先インデックス
const INPUT_DEBOUNCE = 300; // ミリ秒
const Z_TOLERANCE = 0.012; // 正規化Zの許容差（行ターゲットとの誤差がこれ以下でZ一致とみなす）

// 速度判定関連の定数
const FRAME_HISTORY_SIZE = 12; // 12フレーム前との比較
const SPEED_THRESHOLD = 0; // 速度の閾値（dy >= この値で入力と判定）

const timeLabels = {1:'1分',2:'2分',3:'3分',4:'4分',5:'5分'};
const levelLabels = {1:'1もじ',2:'みじかいことば',3:'ながいことば',4:'みじかい文',5:'ながい文'};

// キーボードの形（多角形方式）
  const keyboardLayout = {
  //0行目　-
  '-': { points: [ {x:537 ,y:137 }, {x:555,y:127}, {x:613,y:128}, {x:640,y:138} ]  },
  // 1行目
  'Q': { points: [ {x:0,y:117}, {x:32,y:108}, {x:81 ,y:109 }, {x:56 ,y:119 } ]  },
  'W': { points: [ {x:56 ,y:119}, {x:81,y:109}, {x:133,y:110}, {x:112,y:119} ]  },
  'e': { points: [ {x:112 ,y:119 }, {x:133 ,y:110 }, {x:183 ,y:111 }, {x:169 ,y:120 } ]  },
  'r': { points: [ {x:169 ,y:120 }, {x:183 ,y:111 }, {x:238 ,y:112 }, {x:228 ,y:121 } ]  },
  't': { points: [ {x:228 ,y:121 }, {x:238 ,y:112 }, {x:290 ,y:112 }, {x:286 ,y:122 } ]  },
  'y': { points: [ {x:286 ,y:122 }, {x:290 ,y:112 }, {x:343 ,y:113 }, {x:346 ,y:124 } ]  },
  'u': { points: [ {x:346 ,y:124 }, {x:343,y:113 }, {x:396 ,y:115 }, {x:403 ,y:124 } ]  },
  'i': { points: [ {x:403 ,y:124 }, {x:396 ,y:115 }, {x:450 ,y:116 }, {x:462 ,y:124 } ]  },
  'o': { points: [ {x:462 ,y:124 }, {x:450 ,y:116 }, {x:508 ,y:118 }, {x:525 ,y:127 } ]  },
  'p': { points: [ {x:508 ,y:118 }, { x:525 ,y:127 }, {x:585 ,y:127 }, {x:560 ,y:118 } ]  },
  // 2行目
  'a': { points: [ {x:47 ,y:108 }, {x:72 ,y:101 }, {x:118 ,y:103 }, {x:98 ,y:110 } ]  },
  's': { points: [ {x:98 ,y:110 }, {x:118 ,y:103 }, {x:165 ,y:103 } , {x:150 ,y:110 }]  },
  'd': { points: [ {x:150 ,y:110 }, {x:165 ,y:103 }, {x:213 ,y:103 }, {x:202 ,y:112 } ]  },
  'f': { points: [ {x:202 ,y:112 }, {x:213 ,y:103 }, {x:260 ,y:103 }, {x:251 ,y:113 } ]  },
  'g': { points: [ {x:251 ,y:113 }, {x:260 ,y:103 }, {x:304 ,y:104 }, {x:303 ,y:112 } ]  },
  'h': { points: [ {x:303 ,y:112 }, {x:304 ,y:104 }, {x:354 ,y:105 }, {x:355 ,y:113 } ]  },
  'j': { points: [ {x:355 ,y:113 }, {x:354 ,y:105 }, {x:402 ,y:104 }, {x:408 ,y:115 } ]  },
  'k': { points: [ {x:408 ,y:115 }, {x:402 ,y:104 }, {x:450 ,y:104 }, {x:460 ,y:117 } ]  },
  'l': { points: [ {x:460 ,y:117 }, {x:450 ,y:104 }, {x:497 ,y:105 }, {x:514 ,y:118 } ]  },
  // 3行目
  'z': { points: [ {x:97 ,y:102 }, {x:116 ,y:95 }, {x:158 ,y:96 }, {x:143 ,y:103 } ]  },
  'x': { points: [ {x:143 ,y:103 }, {x:158 ,y:96 },  {x:201 ,y:95 },{x:189 ,y:104 }, ]  },
  'c': { points: [ {x:189 ,y:104 }, {x:201 ,y:95 }, {x:245 ,y:95 }, {x:238 ,y:103 } ]  },
  'v': { points: [ {x:238 ,y:103 }, {x:245 ,y:95 }, {x:288 ,y:95 }, {x:284 ,y:104 } ]  },
  'b': { points: [ {x:284 ,y:104 }, {x:288 ,y:95 }, {x:331 ,y:94 }, {x:332 ,y:105} ]  },
  'n': { points: [ {x:332 ,y:105 }, {x:331 ,y:94 }, {x:375 ,y:94 }, {x:379 ,y:105 } ]  },
  'm': { points: [ {x:379 ,y:105 }, {x:375 ,y:94 }, {x:420 ,y:95 }, {x:428 ,y:105 } ]  },
  ',': { points: [ {x:428 ,y:105 }, {x:420 ,y:95 }, {x:466 ,y:97 }, {x:477 ,y:104 } ]  },
  '.': { points: [ {x:477 ,y:104 }, {x:466 ,y:97 }, {x:510 ,y:97 }, {x:528 ,y:106 } ]  },
  };

// 各行ごとのターゲットZ（normalized座標）
const ROW_TARGET_Z = {
  0: -0.130,
  1: -0.115,
  2: -0.102,
  3: -0.090
};

// キーごとの行番号マップ（小文字キーでマッピング）
const KEY_ROW = {
  '-': 0,
  'q': 1,'w':1,'e':1,'r':1,'t':1,'y':1,'u':1,'i':1,'o':1,'p':1,
  'a':2,'s':2,'d':2,'f':2,'g':2,'h':2,'j':2,'k':2,'l':2,
  'z':3,'x':3,'c':3,'v':3,'b':3,'n':3,'m':3,',':3,'.':3
};




// ============================================================
// MP準備・チェック
// ============================================================

async function waitForMediapipe(maxRetries = 1000) {
  console.log('waitForMediapipe: Checking for Mediapipe libraries (max wait: ' + (maxRetries * 100) + 'ms)');
  for (let i = 0; i < maxRetries; i++) {
    const handsReady = typeof Hands !== 'undefined';
    const cameraReady = typeof Camera !== 'undefined';
    const connectorsReady = typeof drawConnectors !== 'undefined';
    
    if (i % 10 === 0) {
      console.log(`  Attempt ${i+1}/${maxRetries}: Hands=${handsReady}, Camera=${cameraReady}, drawConnectors=${connectorsReady}`);
    }
    
    if (handsReady && cameraReady && connectorsReady) {
      console.log('✓ Mediapipe libraries ready after ' + ((i+1)*100) + 'ms');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.error('✗ Mediapipe libraries not loaded after ' + (maxRetries * 100) + 'ms');
  return false;
}

// ============================================================
// ③ ページ・UI要素
// ============================================================

const stButton = document.querySelector('.stbutton');
const backButton_a = document.querySelector('.backbutton_a');
const prepButton = document.querySelector('.prepbutton');
const backButton_b = document.querySelector('.backbutton_b');
const pracButton = document.querySelector('.pracbutton');
const stopbutton = document.querySelector('.stopbutton');
const homebutton = document.querySelector('.homebutton');

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const page4 = document.getElementById('page4');
const page5 = document.getElementById('page5');

const tslider = document.querySelector('.tslider');
const tsliderLabel = document.getElementById('tsliderLabel');
const lslider = document.querySelector('.lslider');
const lsliderLabel = document.getElementById('lsliderLabel');

console.log('Button selection results:');
console.log('stButton:', stButton);
console.log('backButton_a:', backButton_a);
console.log('prepButton:', prepButton);
console.log('backButton_b:', backButton_b);
console.log('pracButton:', pracButton);
console.log('stopbutton:', stopbutton);
console.log('homebutton:', homebutton);

// ============================================================
// ④ スライダー更新
// ============================================================

function updateSliderLabel(val) {
  if (tsliderLabel) tsliderLabel.textContent = `じかん: ${val} — ${timeLabels[val]||''}`;
}

function updateLevelLabel(val) {
  if (lsliderLabel) lsliderLabel.textContent = `レベル: ${val} — ${levelLabels[val]||''}`;
}

if (tslider) { 
  updateSliderLabel(tslider.value); 
  tslider.addEventListener('input', e => updateSliderLabel(e.target.value)); 
}
if (lslider) { 
  updateLevelLabel(lslider.value); 
  lslider.addEventListener('input', e => updateLevelLabel(e.target.value)); 
}

// ============================================================
// ⑤ キーボード座標・描画
// ============================================================

/**
 * キーボード座標（多角形頂点）を調整する（デバッグ用）
 * @param {string} key - キー名
 * @param {number} pointIndex - 頂点インデックス (0-3)
 * @param {number} dx - X方向の移動量
 * @param {number} dy - Y方向の移動量
 */
function adjustKeyPoint(key, pointIndex, dx, dy) {
  if (keyboardLayout[key] && keyboardLayout[key].points && keyboardLayout[key].points[pointIndex]) {
    keyboardLayout[key].points[pointIndex].x += dx;
    keyboardLayout[key].points[pointIndex].y += dy;
    console.log(`キー "${key}" の頂点 ${pointIndex} を調整しました: (${keyboardLayout[key].points[pointIndex].x}, ${keyboardLayout[key].points[pointIndex].y})`);
  } else {
    console.error(`キー "${key}" または頂点 ${pointIndex} が見つかりません`);
  }
}

/**
 * キーボード座標をコンソールに出力（JavaScriptコピー用）
 */
function exportKeyboardLayout() {
  const output = {};
  for (const [key, keyData] of Object.entries(keyboardLayout)) {
    const adj = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
    output[key] = `{points: ${JSON.stringify(adj)}}`;
  }
  console.log(JSON.stringify(output, null, 2));
  return output;
}

/**
 * 点が多角形内にあるかを判定（Ray casting アルゴリズム）
 */
function isPointInPolygon(px, py, polygon) {
  if (!polygon || polygon.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > py) !== (yj > py)) && 
                      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function drawKeyboardLayout(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.save();
  const highlight = (window && window.highlightKey) ? String(window.highlightKey).toLowerCase() : null;
  
  for (const [key, keyData] of Object.entries(keyboardLayout)) {
    const points = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
    if (!points || points.length < 3) continue;
    // ハイライトキーであれば赤く表示
    const isHighlight = highlight && String(key).toLowerCase() === highlight;
    ctx.fillStyle = isHighlight ? 'rgba(255,0,0,0.45)' : 'rgba(100, 100, 100, 0.3)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    // キーボタンの枠線（ハイライト時は赤系）
    ctx.strokeStyle = isHighlight ? 'rgba(200,0,0,0.95)' : '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // キーラベルを中心に表示
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    ctx.fillStyle = isHighlight ? '#ffffff' : '#cccccc';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayKey = String(key).toUpperCase();
    ctx.fillText(displayKey, centerX, centerY);
  }
  ctx.restore();
}

/**
 * 指先がホバーしているキーをハイライト表示
 */
function highlightHoveredKey(canvas, fingertip) {
  if (!canvas || !fingertip) return;
  
  const ctx = canvas.getContext('2d');
  const fingerX = fingertip.xPx;
  const fingerY = fingertip.yPx;
  
  // 各キーをチェック
  for (const [key, keyData] of Object.entries(keyboardLayout)) {
    const points = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
    if (!points || points.length < 3) continue;
    
    // 多角形内判定
    if (isPointInPolygon(fingerX, fingerY, points)) {
      // Z情報を正規化（onHandsResults では z を lm.z * 100 で保存している）
      const fingerZnorm = (fingertip.z !== undefined && fingertip.z !== null) ? (fingertip.z / 100) : null;
      const normalizedKey = String(key).toLowerCase();
      const keyRow = (KEY_ROW.hasOwnProperty(normalizedKey)) ? KEY_ROW[normalizedKey] : null;

      // Z差に基づく色分岐：diff = fingerZ - targetZ
      // diff <= -Z_TOLERANCE -> 指が近すぎる（Zが小さい） -> 黄
      // |diff| <= Z_TOLERANCE -> 丁度いい -> 緑
      // diff >= Z_TOLERANCE -> 遠すぎる（Zが大きい） -> 青
      let fillStyle = 'rgba(255, 200, 0, 0.4)';
      let strokeStyle = 'rgba(255, 200, 0, 0.8)';
      let labelColor = '#ffff00';
      if (fingerZnorm !== null && keyRow !== null && ROW_TARGET_Z.hasOwnProperty(keyRow)) {
        const diff = fingerZnorm - ROW_TARGET_Z[keyRow];
        if (Math.abs(diff) <= Z_TOLERANCE) {
          // 丁度いい
          fillStyle = 'rgba(0,200,0,0.45)';
          strokeStyle = 'rgba(0,150,0,0.95)';
          labelColor = '#006400';
        } else if (diff < -Z_TOLERANCE) {
          // Z が小さすぎる（指がカメラ側に近い）→黄
          fillStyle = 'rgba(255, 200, 0, 0.4)';
          strokeStyle = 'rgba(255, 200, 0, 0.8)';
          labelColor = '#ffff00';
        } else {
          // diff > Z_TOLERANCE : Z が大きすぎる（指が遠い）→青
          fillStyle = 'rgba(0,120,255,0.45)';
          strokeStyle = 'rgba(0,80,200,0.95)';
          labelColor = '#ffffff';
        }
      } else {
        // Z 情報や行情報が無ければ黄で示す（既存の挙動に近づける）
        fillStyle = 'rgba(255, 200, 0, 0.4)';
        strokeStyle = 'rgba(255, 200, 0, 0.8)';
        labelColor = '#ffff00';
      }

      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 2;
      ctx.stroke();
      // キー情報をポップアップ表示
      const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      const labelY = centerY - 20;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(centerX - 20, labelY - 12, 40, 18);
      
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const displayKey = String(key).toUpperCase();
      ctx.fillText(displayKey, centerX, labelY);
      
      break;
    }
  }
}

// ============================================================
// ⑥ 入力検出・判定
// ============================================================

let inputBuffer = '';
let lastInputTime = 0;
let correctCount = 0;
let incorrectCount = 0;

// 座標履歴の管理（各指先の過去フレーム座標を保持）
const fingertipHistory = {}; // { "hand_fingertip_id": [{ x, y, z }, ...] }

/**
 * 指先の座標履歴を更新
 * @param {number} handIdx - 手のインデックス
 * @param {number} fingertipIdx - 指先インデックス
 * @param {object} fingertipData - 現在の指先座標データ { x, y, z, xPx, yPx, xDiv, yDiv }
 */
function updateFingertipHistory(handIdx, fingertipIdx, fingertipData) {
  const id = `${handIdx}_${fingertipIdx}`;
  
  if (!fingertipHistory[id]) {
    fingertipHistory[id] = [];
  }
  
  // 正規化座標を履歴に追加 (xPx, yPx ではなく正規化座標 x, y を使用)
  fingertipHistory[id].push({ x: fingertipData.x, y: fingertipData.y, z: fingertipData.z });
  
  // 履歴サイズを FRAME_HISTORY_SIZE に制限
  if (fingertipHistory[id].length > FRAME_HISTORY_SIZE) {
    fingertipHistory[id].shift();
  }
}

/**
 * 指先の速度を計算（12フレーム前との比較）
 * @param {number} handIdx - 手のインデックス
 * @param {number} fingertipIdx - 指先インデックス
 * @returns {number} 速度値（dy: Y軸の移動量をそのまま使用）、履歴が不足している場合は0
 */
function calculateFingertipSpeed(handIdx, fingertipIdx) {
  const id = `${handIdx}_${fingertipIdx}`;
  const history = fingertipHistory[id];
  
  // 履歴が不足している場合は0を返す
  if (!history || history.length < FRAME_HISTORY_SIZE) {
    return 0;
  }
  
  // 現在の座標（履歴の最後）
  const current = history[history.length - 1];
  // 12フレーム前の座標（履歴の最初）
  const past = history[0];
  
  const dy = current.y - past.y;
  
  // 速度 = dy（Y軸の移動量をそのまま使う）
  const speed = dy;
  
  return speed;
}

/**
 * 指先の速度が閾値以上か判定
 * @param {number} handIdx - 手のインデックス
 * @param {number} fingertipIdx - 指先インデックス
 * @returns {boolean} 速度が閾値以上の場合は true
 */
function isFingertipMovingFast(handIdx, fingertipIdx) {
  const speed = calculateFingertipSpeed(handIdx, fingertipIdx);
  return speed >= SPEED_THRESHOLD;
}


function checkKeyInput() {
  const now = Date.now();
  if (now - lastInputTime < INPUT_DEBOUNCE) return;

  // 複数の手の全指先を一覧で取得（両手対応）
  const allFingertips = window.allFingertips || [];
  console.debug(`[checkKeyInput] allFingertips.length=${allFingertips.length}, SPEED_THRESHOLD=${SPEED_THRESHOLD}`);
  
  // 全ての指をチェック
  for (const fingertipInfo of allFingertips) {
    const fingertip = fingertipInfo.data;
    if (!fingertip) continue;

    // 速度判定：閾値以上の速度が出ている指のみを入力対象にする
    const speed = fingertipInfo.speed || 0;
    const isMovingFast = speed >= SPEED_THRESHOLD;
    
    console.debug(`  [Hand ${fingertipInfo.hand} Fingertip ${fingertipInfo.fingertip}] speed=${speed}, isMovingFast=${isMovingFast}`);
    
    if (!isMovingFast) continue;

    const fingerX = fingertip.xPx;
    const fingerY = fingertip.yPx;

    // 各キーの多角形領域をチェック
    for (const [key, keyData] of Object.entries(keyboardLayout)) {
      const points = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
      if (!points || points.length < 3) continue;

      // 多角形内判定
      if (isPointInPolygon(fingerX, fingerY, points)) {
        console.debug(`    [Polygon match] key=${key}, fingerPos=(${fingerX.toFixed(1)}, ${fingerY.toFixed(1)})`);
        const normalizedKey = String(key).toLowerCase();
        // fingertip.z は onHandsResults 側で lm.z * 100 として保存されているため
        // 正規化された z を得るには 100 で割る
        const fingerZnorm = (fingertip.z !== undefined && fingertip.z !== null) ? (fingertip.z / 100) : null;

        // 最も近い行を決定
        let nearestRow = null;
        let nearestDiff = Infinity;
        for (const r in ROW_TARGET_Z) {
          const d = Math.abs((fingerZnorm !== null ? fingerZnorm : 0) - ROW_TARGET_Z[r]);
          if (d < nearestDiff) { nearestDiff = d; nearestRow = Number(r); }
        }
        const keyRow = (KEY_ROW.hasOwnProperty(normalizedKey)) ? KEY_ROW[normalizedKey] : null;
        
        console.debug(`      [Z check] fingerZnorm=${fingerZnorm}, nearestRow=${nearestRow}, keyRow=${keyRow}, diff=${nearestDiff.toFixed(4)}`);

        if (keyRow !== null && nearestRow !== null && keyRow === nearestRow) {
          // 行の Z 値に最も近く、かつ x,y が多角形内である -> 入力とみなす
          // '-'キーの場合は伸ばし棒「ー」を入力
          if (normalizedKey === '-') {
            inputBuffer += 'ー';
          } else {
            inputBuffer += normalizedKey;
          }
          lastInputTime = now;
          updateInputDisplay();
          console.log(`Key detected by hand ${fingertipInfo.hand} fingertip ${fingertipInfo.fingertip}: ${key} -> ${normalizedKey}, Buffer: ${inputBuffer} (z=${fingerZnorm}, row=${keyRow})`);
          checkAnswer();
          return; // 1回のチェックあたり1入力のみ
        } else {
          // 行が一致しなければ入力しない（デバッグ出力）
          console.log(`Z mismatch: fingertip z=${fingerZnorm} nearestRow=${nearestRow} keyRow=${keyRow} for key=${key}`);
        }
      }
    }
  }
}

function updateInputDisplay() {
  const el = document.getElementById('inputBuffer');
  if (el) {
    let hiraganaText = '';
    if (typeof wanakana !== 'undefined' && typeof wanakana.toHiragana === 'function') {
      hiraganaText = wanakana.toHiragana(inputBuffer);
    }
    const displayText = hiraganaText ? `入力: ${inputBuffer}（${hiraganaText}）` : `入力: ${inputBuffer}`;
    el.textContent = displayText;
  }
  try{ refreshNextKeyHighlight(); }catch(e){}
}

function checkAnswer() {
  // ローマ字は常にromajiLabelに表示されている
  const romaEl = document.getElementById('romajiLabel');
  
  if (!romaEl) return;
  // data-raw-romaji属性を優先して参照、なければtextContent
  const expectedRomaji = (romaEl.dataset && romaEl.dataset.rawRomaji) ? romaEl.dataset.rawRomaji.trim() : romaEl.textContent.trim();
  if (!expectedRomaji) return;
  
  if (inputBuffer === expectedRomaji) {
    console.log('✓ 正解!');
    recordCorrectAnswer(inputBuffer);
    inputBuffer = '';
    updateInputDisplay();
    try{ refreshNextKeyHighlight(); }catch(e){}
    nextWord();
  } else if (expectedRomaji.startsWith(inputBuffer)) {
    console.log('途中入力...');
  } else {
    console.log('✗ 不正解! 最後の文字を削除');
    recordIncorrectAnswer(inputBuffer);
    // 最後の誤った文字を削除（正解部分は保持）
    inputBuffer = inputBuffer.slice(0, -1);
    updateInputDisplay();
    try{ refreshNextKeyHighlight(); }catch(e){}
  }
}

function recordCorrectAnswer(answer) {
  correctCount++;
  console.log(`正解数: ${correctCount}`);
}

function recordIncorrectAnswer(answer) {
  incorrectCount++;
  console.log(`不正解数: ${incorrectCount}`);
}

// ============================================================
// ⑦ 結果表示・ゲーム管理
// ============================================================

function showResults() {
  const total = correctCount + incorrectCount;
  const correctPercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const incorrectPercent = 100 - correctPercent;
  // 得点計算式
  const l = total;
  const c = correctCount;
  const i = incorrectCount;
  const t = tslider ? Number(tslider.value) * 60 : 60; // 秒
  const v = (c > 0 && t > 0) ? c / t : 0;
  const a = (c + i) > 0 ? c / (c + i) : 0;
  let p = (l > 0 && v > 0 && a > 0) ? Math.sqrt(l) * Math.pow(v, 2) * Math.pow(a, 2) * 2 / 45 : 0;
  p = Math.round(p);
  // ランク判定
  let rank = 'D';
  if (p >= 120) rank = 'S';
  else if (p >= 100) rank = 'A';
  else if (p >= 70) rank = 'B';
  else if (p >= 40) rank = 'C';
  // 表示
  const pointEl = document.getElementById('point');
  const levelEl = document.getElementById('revel');
  const lengthEl = document.getElementById('length');
  const timeEl = document.getElementById('time');
  const speedEl = document.getElementById('speed');
  const nTrueEl = document.getElementById('n_true');
  const nFalseEl = document.getElementById('n_false');
  const tPerEl = document.getElementById('t_per');
  const fPerEl = document.getElementById('f_per');
  const rankEl = document.getElementById('rank');
  if (pointEl) pointEl.textContent = Math.max(0, p);
  if (levelEl) {
    const level = lslider ? lslider.value : '1';
    levelEl.textContent = `${level} — ${levelLabels[level]||''}`;
  }
  if (lengthEl) {
    const levelVal = lslider ? lslider.value : '1';
    lengthEl.textContent = `${levelVal} — ${levelLabels[levelVal]||''}`;
  }
  if (timeEl) timeEl.textContent = tslider ? `${tslider.value}分` : '1分';
  if (speedEl) speedEl.textContent = t > 0 ? (c / t).toFixed(2) : 0;
  if (nTrueEl) nTrueEl.textContent = correctCount;
  if (nFalseEl) nFalseEl.textContent = incorrectCount;
  if (tPerEl) tPerEl.textContent = `${correctPercent}%`;
  if (fPerEl) fPerEl.textContent = `${incorrectPercent}%`;
  if (rankEl) rankEl.textContent = rank;
}

function resetGameState() {
  correctCount = 0;
  incorrectCount = 0;
  inputBuffer = '';
  timerStarted = false;
  updateInputDisplay();
  stopMediapipeHands();
}

// wanakana 利用判定 + フォールバック
const useWanakana = typeof window !== 'undefined' && window.wanakana && typeof wanakana.toRomaji === 'function';
function hiraganaToRomaji(input) {
  if (useWanakana) return wanakana.toRomaji(input, {upcaseKatakana: false});
  const map = {'あ':'a','い':'i','う':'u','え':'e','お':'o',
    'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'さ':'sa','し':'si','す':'su','せ':'se','そ':'so',
    'ざ':'za','じ':'zi','ず':'zu','ぜ':'ze','ぞ':'zo',
    'た':'ta','ち':'ti','つ':'tu','て':'te','と':'to',
    'だ':'da','ぢ':'di','づ':'du','で':'de','ど':'do',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
    'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
    'や':'ya','ゆ':'yu','よ':'yo',
    'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
    'わ':'wa','を':'o','ん':'nn',};
  const combos = {
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
    'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
    'しゃ':'sha','しゅ':'shu','しょ':'sho',
    'じゃ':'ja','じゅ':'ju','じょ':'jo',
    'ちゃ':'tya','ちゅ':'tyu','ちょ':'tyo',
    'つぁ':'tsa','つぃ':'tsi','つぇ':'tse','つぉ':'tso',
    'てぃ':'thi','てゅ':'thu','てょ':'tho',
    'でぃ':'dhi','でゅ':'dhu','でょ':'dho',
    'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
    'ふぁ':'fa','ふぃ':'fi','ふゅ':'fyu','ふぇ':'fe','ふぉ':'fo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo',
    'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
    'みゃ':'mya','みゅ':'myu','みょ':'myo',
    'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
    'うぁ':'wha','うぃ':'wi','うぇ':'we','うぉ':'who',
  };
  let out = '';
  input = input || '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i+1] || '';
    const pair = ch + next;
    if (ch === 'っ') {
      const next2 = input[i+2] || '';
      const nextPair = next + next2;
      const romNext = combos[nextPair] || combos[next] || map[next] || '';
      const consonant = romNext.charAt(0) || '';
      if (consonant.match(/[bcdfghjklmnpqrstvwxyz]/)) out += consonant;
      continue;
    }
    if (combos[pair]) { out += combos[pair]; i++; continue; }
    out += map[ch] || ch;
  }
  return out;
}

function getWordsForLevel(level) {
  const lists = {
    1: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    2: ['ねずみ','うし','とら','うさぎ','りゅう','へび','うま','ひつじ','さる','とり','いぬ','いのしし','ねこ','おおかみ','ぶた','きつね','たぬき','ぱんだ','くま','きりん','かめ','ぞう','おうむ','しまうま','こあら','しか','りす','もぐら','ひよこ','ふくろう','にわとり','かえる','やもり','うずら','とかげ','さめ','たこ','いか','さかな','ふぐ','さば','さけ','くらげ','あじ','えび','たい','うなぎ','かに','いるか','くじら','りんご','なし','ばなな','めろん','ぶどう','くるみ','かき','すいか','くり','もも','いちご','れもん','まんごー','すだち','きうい','きゃべつ','もやし','れたす','はくさい','にんじん','とまと','だいこん','かぶ','きのこ','なす','ぴーまん','ごーや','ぱぷりか','しめじ','たまねぎ','くるま','ばいく','でんしゃ','ふね','ばす','め','はな','くち','みみ','あたま','むね','うで','かた','くび','こし','おなか','て','ゆび','あし','くるぶし'],
    3: ['かれーらいす','ばたーろーる','かれーぱん','まーがりん','おみそしる','はんばーがー','ちきんかつ','ふらいどぽてと','おむらいす','すぱげってぃ','みーとそーす','さんどいっち','ぽてとさらだ','しーざーさらだ','ぽたーじゅ','こーんすーぷ','こーひーぜりー','ぷりんあらもーど','ちょこれーと','あいすくりーむ','たんじょうび','くりすます','おしょうがつ','はろうぃん','こどものひ','せいじんのひ','けんこうしんだん','うんどうかい','けっこんしき','にゅうがくしき','そつぎょうしき','でんわばんごう','めーるあどれす','いんたーねっと','すまーとふぉん','こんぴゅーた','てれびげーむ','そーしゃるめでぃあ','おんらいんしょっぴんぐ','でじたるかめら','びでおかめら','ばすけっとぼーる','てにすらけっと','さっかーぼーる','ごーるぽすと','ごるふくらぶ','すいみんぐぷーる','らんにんぐしゅーず','さーふぼーど','すけーとぼーど','すのーぼーど'],
    4: ['いぬがあるいている。','ねこがねている 。','あめがふってきた。','きょうはいいてんき。','ごはんをたこう。','えんぴつでかこう。','みんなであそぶ。','くつをはいてでる。','すいかがあまい。','ともだちとわらう。','ほんをよむ。','ぼーるをなげる。','さっかーをしてあそぶ。','やまにのぼる。','うんどうかいにでる。','しあいでまける。','あさのゆうがなめざめ。','ごはんをたくさんたべる。','そらにくもがある。','はなをつみにいく。','かぜがふいている。','つきがでてきた。','でんしゃがはしる。','かさをひろげよう。','りんごをたべたい。','うみでおよいだ。','ことりがなく。','やまにのぼろう。','がっこうをやすむ。','さつまいもをほる。','さかながおよいでいる。','あかいいちごをさがす。','くるまがはしっている。','ひこうきがとんでいる。','おにぎりをたべた。','かみをきってみた。','いすにすわろう。','でんきをつけよう。','ふうせんがうかんでいる。','かばんをもっていく。','あめがふっている。','ゆきがふっている。','きょうかしょをあける。','たいようがてっている。','くもがうごいている。','そらがあおい。','つきがみえる。','ほしがひかっている。','かぜがやんでいる。','あさがきている。','そらにとりがとんでいる。','はながさいている。','つきがかがやいている。','たいようがのぼっている。','おはしをもつ。','いけにさかながいる。','でんしゃがはしっている。','じてんしゃにのる。','おはなみにいく。','ふねがうみにうかんでいる。','りんごをたべる。','みかんをたべる。','ぶどうをたべる。','なしをたべる。','ももをたべる。','すいかをたべる。','いちごをたべる。','ばななをたべる。','さくらんぼをたべる。','かきをたべる。','いぬとあそんでいる。','ねことあそんでいる。','とりがなく。','うさぎがはねている。','ぞうがあるいている。','きりんがみている。','さるがのぼっている。','くまがあるいている。','かめがあるいている。','いんこがなく。','えんぴつでかいてある。','けしごむでなおす。','ほんをよんでいる。','のーとにかいている。','じをならっている。','すうじをかぞえている。','えをかいている。','うたをうたっている。','ぴあのをひいた。','たいこをたたいている。','こうえんにいく。','やまにのぼる。','うみにいく。','かわであそぶ。','みちをあるく。','いえにかえる。','がっこうにいく。','きょうしつにすわる。','じゅぎょうをうける。','せんせいにはなす。'],
    5: ['むずかしいぶんしょうをよむれんしゅうです','いろいろなことをくわしくせつめいする']
  };
  return lists[level] || lists[1];
}

let wordList = [];
let currentWordIndex = 0;

function shuffleArray(arr){ 
  for(let i=arr.length-1;i>0;i--){ 
    const j=Math.floor(Math.random()*(i+1)); 
    [arr[i],arr[j]]=[arr[j],arr[i]];
  } 
  return arr; 
}

function loadWords(list){
  wordList = shuffleArray(Array.from(list||[]));
  currentWordIndex = 0;
  showCurrentWord();
}

function showCurrentWord(){
  const kanaEl = document.getElementById('wordLabel') || document.querySelector('.wordLabel');
  const romaEl = document.getElementById('romajiLabel') || document.querySelector('.romajiLabel');
  const item = (wordList && wordList.length) ? wordList[currentWordIndex] : null;
  if (!kanaEl) return;
  if (!item) { kanaEl.textContent=''; if (romaEl) romaEl.textContent=''; return; }
  let kana, roma;
  if (typeof item === 'string') { kana = item; roma = hiraganaToRomaji(item); }
  else { kana = item.kana || ''; roma = item.romaji || (kana ? hiraganaToRomaji(kana) : ''); }
  // page4ではローマ字を上部に表示、ひらがなと対応
  const isPage4Active = (page4 && page4.style.display !== 'none');
  if (isPage4Active) {
    kanaEl.textContent = kana;
    try{ kanaEl.style.color = 'black'; }catch(e){}
    if (romaEl) {
      romaEl.textContent = roma;
      // 生のローマ字を保持（innerHTMLで上書きしても参照できるように）
      try{ romaEl.dataset.rawRomaji = roma; }catch(e){}
      try{ romaEl.style.color = '#666'; }catch(e){}
    }
  } else {
    kanaEl.textContent = kana;
    try{ kanaEl.style.color = 'black'; }catch(e){}
    if (romaEl) {
      romaEl.textContent = roma;
      try{ romaEl.dataset.rawRomaji = roma; }catch(e){}
    }
  }
  // 次に入力すべきキーの強調を更新（ローマ字表示の次文字を赤に）
  try{ refreshNextKeyHighlight(); }catch(e){}
}

/**
 * 次に入力すべきキー（1文字）を算出し、グローバルに設定する
 */
function refreshNextKeyHighlight(){
  const kanaEl = document.getElementById('wordLabel') || document.querySelector('.wordLabel');
  const romaEl = document.getElementById('romajiLabel') || document.querySelector('.romajiLabel');
  
  // ローマ字は常にromaElに表示されている
  const displayEl = romaEl;
  // 優先して data-raw-romaji を使う（innerHTMLでspanが埋め込まれている場合の上書き回避）
  const expected = displayEl ? ((displayEl.dataset && displayEl.dataset.rawRomaji) || displayEl.textContent || '') : '';
  const buf = inputBuffer || '';
  let next = null;
  if (expected && buf.length < expected.length) next = expected.charAt(buf.length).toLowerCase();
  try{ window.highlightKey = next; }catch(e){}
  
  // 表示用要素で次の文字のみ赤にする
  try{
    if (displayEl){
      const chars = expected.split('');
      const idx = Math.min(Math.max(0, buf.length), chars.length);
      const out = chars.map((ch,i)=> i===idx ? `<span style="color:red; font-weight:bold;">${escapeHtml(ch)}</span>` : escapeHtml(ch)).join('');
      displayEl.innerHTML = out;
      // dataset.rawRomaji は元の生文字列を保持しておく
      try{ displayEl.dataset.rawRomaji = expected; }catch(e){}
    }
  }catch(e){}
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function nextWord(){
  if (!wordList || wordList.length===0) return;
  currentWordIndex++;
  if (currentWordIndex >= wordList.length) { wordList = shuffleArray(wordList); currentWordIndex = 0; }
  showCurrentWord();
}

// タイマー
let timer = null;
let timeRemaining = 0;

function updateTimerDisplay(){
  const el = document.getElementById('timerLabel') || document.querySelector('.timerLabel');
  if (!el) return;
  const m = Math.floor(timeRemaining/60), s = timeRemaining%60;
  el.textContent = `${m}:${String(s).padStart(2,'0')}`;
}

function stopTimer(){ 
  if (timer){ clearInterval(timer); timer=null; } 
}

function startTimer(durationMinutes){
  stopTimer();
  const mins = Math.max(0, Math.floor(Number(durationMinutes)||0));
  timeRemaining = mins * 60;
  updateTimerDisplay();
  timer = setInterval(()=>{
    if (timeRemaining <= 0){
      stopTimer();
      showResults();
      if (page4) page4.style.display = 'none';
      if (page5) page5.style.display = 'flex';
      return;
    }
    timeRemaining--;
    updateTimerDisplay();
  }, 1000);
}

// ============================================================
// ⑧ ページ遷移・イベント
// ============================================================

document.addEventListener('keydown', e=>{
  if (!e.key) return;
  if (e.key.toLowerCase() === 'z') {
    if (page4 && page4.style.display === 'flex') nextWord();
  }
});

if (stButton) { 
  console.log('stButton click listener attached'); 
  stButton.addEventListener('click', ()=>{ 
    console.log('stButton clicked'); 
    if (page1) page1.style.display='none'; 
    if (page2) page2.style.display='flex'; 
  }); 
}

if (backButton_a) { 
  console.log('backButton_a click listener attached'); 
  backButton_a.addEventListener('click', ()=>{ 
    console.log('backButton_a clicked'); 
    if (page2) page2.style.display='none'; 
    if (page1) page1.style.display='flex'; 
  }); 
}

if (prepButton) { 
  console.log('prepButton click listener attached'); 
  prepButton.addEventListener('click', ()=>{ 
    console.log('prepButton clicked'); 
    if (page2) page2.style.display='none'; 
    if (page3) { 
      page3.style.display='flex'; 
      startMediapipeHands(); 
    } 
  }); 
}

if (backButton_b) { 
  console.log('backButton_b click listener attached'); 
  backButton_b.addEventListener('click', ()=>{ 
    console.log('backButton_b clicked'); 
    if (page3) { 
      page3.style.display='none'; 
      stopMediapipeHands(); 
    } 
    if (page2) page2.style.display='flex'; 
  }); 
}

if (pracButton) { 
  console.log('pracButton click listener attached'); 
  pracButton.addEventListener('click', ()=>{
    console.log('pracButton clicked');
    correctCount = 0;
    incorrectCount = 0;
    inputBuffer = '';
    timerStarted = false;
    updateInputDisplay();
    if (mpCamera) stopMediapipeHands();
    if (page3) page3.style.display='none';
    if (page4) page4.style.display='flex';
    const level = lslider ? Number(lslider.value) : 1;
    const words = getWordsForLevel(level);
    loadWords(words);
    setTimeout(() => {
      startMediapipeHands();
    }, 100);
  }); 
}

if (stopbutton) { 
  console.log('stopbutton click listener attached'); 
  stopbutton.addEventListener('click', ()=>{
    console.log('stopbutton clicked');
    stopTimer();
    stopMediapipeHands();
    resetGameState();
    if (page4) page4.style.display='none';
    if (page1) page1.style.display='flex';
  }); 
}

if (homebutton) { 
  console.log('homebutton click listener attached'); 
  homebutton.addEventListener('click', ()=>{
    console.log('homebutton clicked');
    stopTimer();
    resetGameState();
    if (page5) page5.style.display='none';
    if (page1) page1.style.display='flex';
  }); 
}

function initPages(){
  if (page1) page1.style.display='flex';
  if (page2) page2.style.display='none';
  if (page3) page3.style.display='none';
  if (page4) page4.style.display='none';
  if (page5) page5.style.display='none';
}
initPages();

// ============================================================
// ⑨ Mediapipe Hands 関係
// ============================================================

let mpCamera = null;
let mpHands = null;
let mpCanvasFallbackTimer = null;
let sending = false;
let handsInitialized = false;
let timerStarted = false;

window.latestFingertips = {};
window.mpUseMirror = true;

window.mpSetMirror = function(flag){
  window.mpUseMirror = !!flag;
  console.log('mpSetMirror: set to', window.mpUseMirror);
  // Update Hands options if initialized
  try{
    if (mpHands && typeof mpHands.setOptions === 'function') {
      mpHands.setOptions({ selfieMode: window.mpUseMirror });
      console.log('mpSetMirror: mpHands.setOptions updated');
    }
  } catch(e) { console.warn('mpSetMirror: failed to update mpHands options', e); }
  // Update immediate preview transforms for video/canvas elements
  try{
    const vids = document.querySelectorAll('#mp_input_video_p3, #mp_input_video_p4, video');
    vids.forEach(v=>{ if (v && v.style) v.style.transform = window.mpUseMirror ? 'scaleX(-1)' : ''; });
    const canvases = document.querySelectorAll('#mp_output_canvas_p3, #mp_output_canvas_p4, canvas');
    canvases.forEach(c=>{ if (c && c.style) c.style.transform = window.mpUseMirror ? 'scaleX(-1)' : ''; });
  } catch(e) { /* ignore */ }
};

window.mpNormToPixel = function(xNorm, yNorm, opts){
  opts = opts || {};
  const canvas = document.querySelector('.mp_output_canvas_active');
  const w = opts.width || (canvas && canvas.width) || 640;
  const h = opts.height || (canvas && canvas.height) || 480;
  return { xPx: xNorm * w, yPx: yNorm * h };
};

window.mpPixelToNorm = function(xPx, yPx, opts){
  opts = opts || {};
  const canvas = document.getElementById('mp_output_canvas');
  const w = opts.width || (canvas && canvas.width) || 640;
  const h = opts.height || (canvas && canvas.height) || 480;
  return { x: xPx / w, y: yPx / h };
};

window.mpGetFingertip = function(index, opts){
  opts = opts || {};
  const ft = window.latestFingertips && window.latestFingertips[index];
  if (!ft) return null;
  if (opts.space === 'canvas') return { xPx: ft.xPx, yPx: ft.yPx, xDiv: ft.xDiv, yDiv: ft.yDiv, z: ft.z, rawX: ft.rawX };
  if (opts.space === 'fixed'){
    const w = opts.width || 640; const h = opts.height || 480;
    const xPxFixed = ft.x * w; const yPxFixed = ft.y * h;
    return { x: ft.x, y: ft.y, z: ft.z, xPx: xPxFixed, yPx: yPxFixed, xDiv: Math.round(xPxFixed/5.1), yDiv: Math.round(yPxFixed/5.1), rawX: ft.rawX };
  }
  return { x: ft.x, y: ft.y, z: ft.z, rawX: ft.rawX };
};

window.mpDistance = function(i1,i2, opts){
  opts = opts || {};
  const space = opts.space || 'canvas';
  const a = window.mpGetFingertip(i1, { space: space, width: opts.width, height: opts.height });
  const b = window.mpGetFingertip(i2, { space: space, width: opts.width, height: opts.height });
  if (!a || !b) return null;
  if (space === 'norm') return Math.hypot(a.x - b.x, a.y - b.y);
  const ax = (a.xPx !== undefined) ? a.xPx : (a.x * (opts.width || 640));
  const ay = (a.yPx !== undefined) ? a.yPx : (a.y * (opts.height || 480));
  const bx = (b.xPx !== undefined) ? b.xPx : (b.x * (opts.width || 640));
  const by = (b.yPx !== undefined) ? b.yPx : (b.y * (opts.height || 480));
  return Math.hypot(ax - bx, ay - by);
};

function onHandsResults(results){
  try{ window._mpHandsRendered = true; }catch(e){}
  if (mpCanvasFallbackTimer){ clearInterval(mpCanvasFallbackTimer); mpCanvasFallbackTimer = null; }
  
  if (!window._handsResultsCount) window._handsResultsCount = 0;
  window._handsResultsCount++;
  if (window._handsResultsCount % 30 === 0) {
    console.log(`[onHandsResults] called ${window._handsResultsCount} times`);
  }
  
  // ページに応じた要素を取得
  const isPage4Active = (page4 && page4.style.display !== 'none');
  let canvasId = isPage4Active ? 'mp_output_canvas_p4' : 'mp_output_canvas_p3';
  
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error('onHandsResults: Canvas not found', canvasId);
    return;
  }
  const ctx = canvas.getContext('2d');
  
  // 背景画像を描画
  if (results.image) {
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  } else {
    console.warn('onHandsResults: No image in results');
  }
  
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0){
    console.log('Hand detected, landmarks count:', results.multiHandLandmarks.length);
    const fingertipIndices = [8,12,16,20];
    const detected = {};
    const allFingertips = []; // 両手対応：複数の手の全指を配列で保存
    
    for (let handIdx = 0; handIdx < results.multiHandLandmarks.length; handIdx++){
      const landmarks = results.multiHandLandmarks[handIdx];
      fingertipIndices.forEach(i=>{
        const lm = landmarks[i];
        if (!lm) return;
        
        const xPx = lm.x * canvas.width; 
        const yPx = lm.y * canvas.height;
        const xDiv = Math.round(xPx);
        const yDiv = Math.round(yPx);
        
        console.log(`Hand ${handIdx} Fingertip ${i}: (x:${xPx.toFixed(1)}, y:${yPx.toFixed(1)}, z:${(lm.z !== undefined ? (lm.z * 100).toFixed(1) : 'n/a')})`);
        
        // 指先のみを黄色で表示
        ctx.fillStyle = 'yellow'; 
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.arc(xPx, yPx, FINGERTIP_RADIUS, 0, 2*Math.PI); 
        ctx.fill();
        ctx.stroke();
        
        const fingertipData = { x: lm.x, y: lm.y, z: lm.z * 100, xPx: xPx, yPx: yPx, xDiv: xDiv, yDiv: yDiv };
        detected[i] = fingertipData;
        
        // 座標履歴を更新
        updateFingertipHistory(handIdx, i, fingertipData);
        
        allFingertips.push({ hand: handIdx, fingertip: i, data: fingertipData, speed: calculateFingertipSpeed(handIdx, i) });
      });
    }
    
    try{ window.latestFingertips = detected; }catch(e){}
    try{ window.allFingertips = allFingertips; }catch(e){} // 両手対応
    
    // キーボードハイライト情報を更新してからレイアウトを描画（次キー強調と同期）
    try{ refreshNextKeyHighlight(); }catch(e){}
    // キーボードレイアウトを描画
    drawKeyboardLayout(canvas);
    
    // 指先がどのキーの上にあるかをハイライト（全ての手・全ての指でチェック）
    for (const fingertipInfo of allFingertips) {
      highlightHoveredKey(canvas, fingertipInfo.data);
    }
    
    // 入力をチェック（全指先対応）
    checkKeyInput();
    
    const infoEl = document.getElementById('mp_fingertips');
    if (infoEl) infoEl.textContent = JSON.stringify(detected);
    // 検出された指の数を表示（両手対応）
    if (status) status.textContent = '手検出: OK (' + allFingertips.length + '指)';
    
    // 手検出成功時、ゲーム中ならタイマーを開始
    if (isPage4Active && !timerStarted && handsInitialized) {
      timerStarted = true;
      console.log('手検出成功。タイマー開始');
      const mins = tslider ? tslider.value : 1;
      startTimer(mins);
    }
  } else {
    if (status) status.textContent = '手が見つかりません（video側は再生中）';
  }
}

function startMediapipeHands(){
  if (mpCamera) return;
  
  // 現在アクティブなページを判定
  const isPage4Active = (page4 && page4.style.display !== 'none');
  const isPage3Active = (page3 && page3.style.display !== 'none');
  
  console.log('startMediapipeHands: page4=' + isPage4Active + ', page3=' + isPage3Active);
  
  if (typeof Hands === 'undefined' || typeof Camera === 'undefined' || typeof drawConnectors === 'undefined') {
    console.warn('startMediapipeHands: Mediapipe libraries not loaded yet. Retrying...');
    console.warn('  Hands:', typeof Hands, 'Camera:', typeof Camera, 'drawConnectors:', typeof drawConnectors);
    if (status) status.textContent = 'ライブラリ読み込み中...';
    setTimeout(() => startMediapipeHands(), 200);
    return;
  }
  
  // ページに応じた要素を取得
  let video, canvas, status;
  if (isPage4Active) {
    video = document.getElementById('mp_input_video_p4');
    canvas = document.getElementById('mp_output_canvas_p4');
    console.log('Using page4 elements: video=' + (video ? 'found' : 'NOT FOUND') + ', canvas=' + (canvas ? 'found' : 'NOT FOUND'));
  } else if (isPage3Active) {
    video = document.getElementById('mp_input_video_p3');
    canvas = document.getElementById('mp_output_canvas_p3');
    console.log('Using page3 elements: video=' + (video ? 'found' : 'NOT FOUND') + ', canvas=' + (canvas ? 'found' : 'NOT FOUND'));
  } else {
    console.error('startMediapipeHands: Neither page3 nor page4 is active');
    return;
  }
  
  console.log('startMediapipeHands: initializing Camera first');
  
  // Use full window size for processing (full-screen capture), display at fixed 640x240
  const VIDEO_WIDTH = Math.max(window.innerWidth || 640, 640);
  const VIDEO_HEIGHT = Math.max(window.innerHeight || 480, 480);
  
  // キャンバスを固定サイズ 640x240 に設定
  canvas.width = 640;
  canvas.height = 240;
  
  console.log('Canvas initialized: ' + canvas.width + ' x ' + canvas.height);
  
  mpCamera = new Camera(video, {
    onFrame: async () => {
      if (sending) return;
      if (video.readyState < 2) return;
      if (video.videoWidth === 0) return;
      
      if (!mpHands || !handsInitialized) {
        if (!window._frameWarnCount) window._frameWarnCount = 0;
        if (window._frameWarnCount % 30 === 0) {
          console.warn('[onFrame] Hands not ready yet. handsInitialized=' + handsInitialized + ', mpHands=' + (!!mpHands));
        }
        window._frameWarnCount++;
        return;
      }
      
      sending = true;
      try {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const actualW = video.videoWidth;
          const actualH = video.videoHeight;
          
          // キャンバスを常に 640x240 の固定サイズに保つ
          if (canvas.width !== 640 || canvas.height !== 240) {
            canvas.width = 640;
            canvas.height = 240;
            console.log('Canvas reset to fixed size: 640 x 240');
          }
          
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, Math.round(actualH / 4), actualW, Math.round(actualH * 3 / 4), 0, 0, canvas.width, canvas.height);
          
          // Send to Hands
          if (mpHands.send && typeof mpHands.send === 'function') {
            await mpHands.send({image: canvas});
          } else {
            console.error('[onFrame] mpHands.send is not a function!');
          }
        } else {
          if (!window._emptyFrameCount) window._emptyFrameCount = 0;
          if (window._emptyFrameCount % 60 === 0) {
            console.warn('[onFrame] video not ready: readyState=' + video.readyState + ', size=' + video.videoWidth + 'x' + video.videoHeight);
          }
          window._emptyFrameCount++;
        }
      } catch (err) {
        console.error('[onFrame] error:', err.message || err);
      } finally {
        sending = false;
      }
    },
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT
  });
  
  mpCamera.start().then(()=>{
    console.log('mpCamera.start() succeeded');
    
    let handsInitTimeout = setTimeout(() => {
      try {
        console.log('Hands ctor: Creating new Hands instance');
        mpHands = new Hands({
          locateFile: (file) => {
            console.log('Hands locateFile requested:', file);
            const filename = file.split('/').pop();
            const baseUrl = 'https://ishikawa1007.github.io/st_202601/hands/';
            const resolved = baseUrl + filename;
            console.log('  -> Resolved to:', resolved);
            return resolved;
          }
        });
        
        console.log('Hands instance created, setting options...');
        mpHands.setOptions({
          modelComplexity: 0,
          maxNumHands: 2, 
          minDetectionConfidence: 0.5, 
          minTrackingConfidence: 0.5,
          selfieMode: window.mpUseMirror
        });
        
        console.log('Hands instance: registering onResults callback...');
        mpHands.onResults(onHandsResults);
        
        console.log('✓ mpHands initialized successfully');
        handsInitialized = true;
        // Test: Force send one frame to verify it works
        console.log('Hands init: Ready to receive frames');
        
      } catch (err) {
        console.error('✗ Failed to initialize Hands:', err, err.stack);
        handsInitialized = false;
      }
    }, 300);
    
    if (!window._mpHandsRendered && !mpCanvasFallbackTimer){
      mpCanvasFallbackTimer = setInterval(()=>{
        try{
          if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0){
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const actualW = video.videoWidth;
            const actualH = video.videoHeight;
            if (window.mpUseMirror) {
              ctx.save();
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, Math.round(actualH / 4), actualW, Math.round(actualH * 3 / 4), 0, 0, canvas.width, canvas.height);
              ctx.restore();
            } else {
              ctx.drawImage(video, 0, Math.round(actualH / 4), actualW, Math.round(actualH * 3 / 4), 0, 0, canvas.width, canvas.height);
            }
          }
        } catch(e) {
          console.error('fallback draw error', e);
        }
      }, 150);
    }
    
  }).catch(err=>{
    if (status) status.textContent = 'カメラ開始失敗';
    console.error('mpCamera.start() failed:', err, err.stack);
  });
}

function stopMediapipeHands(){
  console.log('stopMediapipeHands: stopping camera and hands');
  try{ if (mpCamera && typeof mpCamera.stop === 'function') mpCamera.stop(); }catch(e){}
  mpCamera = null;
  try{ if (mpHands && typeof mpHands.close === 'function') mpHands.close(); }catch(e){}
  mpHands = null;
  handsInitialized = false;
  timerStarted = false;
  if (mpCanvasFallbackTimer){ clearInterval(mpCanvasFallbackTimer); mpCanvasFallbackTimer = null; }
  
  // アクティブなページの要素をクリア
  const isPage4Active = (page4 && page4.style.display !== 'none');
  const isPage3Active = (page3 && page3.style.display !== 'none');
  
  if (isPage4Active) {
    const canvas = document.getElementById('mp_output_canvas_p4');
    if (canvas){ const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
    if (status) status.textContent = 'カメラ停止';
  } else if (isPage3Active) {
    const canvas = document.getElementById('mp_output_canvas_p3');
    if (canvas){ const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
    if (status) status.textContent = 'カメラ停止';
  }
}

// ============================================================
// 初期化
// ============================================================

waitForMediapipe().then(success => {
  if (success) {
    console.log('Ready to use Mediapipe');
  }
});

// スマホ縦向きリマインダー
(function(){
  function isMobileDevice(){
    return ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }
  const REMINDER_ID = 'orientationReminderOverlay';
  function createOverlayIfNeeded(){
    if (document.getElementById(REMINDER_ID)) return;
    const wrapper = document.createElement('div');
    wrapper.id = REMINDER_ID;
    Object.assign(wrapper.style, {
      position: 'fixed', left: '0', top: '0', width: '100%', height: '100%',
      display: 'none', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', zIndex: '9999', padding: '12px', boxSizing: 'border-box'
    });
    wrapper.innerHTML = [
      '<div role="dialog" aria-modal="true" style="background:#fff;color:#000;padding:16px;border-radius:10px;max-width:520px;width:100%;text-align:center;font-size:16px;line-height:1.4;">',
      '  <div>がめんがたてむきです。よこむきでプレイしてください。</div>',
      '  <div style="height:10px"></div>',
      `  <button id="${REMINDER_ID}_close" style="padding:8px 14px;font-size:15px;border-radius:6px;border:0;background:#1976d2;color:#fff;cursor:pointer;">とじる</button>`,
      '</div>'
    ].join('');
    document.body.appendChild(wrapper);
    document.getElementById(`${REMINDER_ID}_close`).addEventListener('click', ()=>{ wrapper.style.display='none'; });
  }
  function showOverlay(){
    createOverlayIfNeeded();
    const el = document.getElementById(REMINDER_ID);
    if (el) el.style.display = 'flex';
  }
  function hideOverlay(){
    const el = document.getElementById(REMINDER_ID);
    if (el) el.style.display = 'none';
  }
  function checkOrientationAndRemind(){
    if (!isMobileDevice()) { hideOverlay(); return; }
    const isPortrait = (window.matchMedia && window.matchMedia('(orientation: portrait)').matches) || (window.innerHeight > window.innerWidth);
    if (isPortrait) showOverlay(); else hideOverlay();
  }
  window.addEventListener('orientationchange', checkOrientationAndRemind, {passive:true});
  window.addEventListener('resize', checkOrientationAndRemind, {passive:true});
  document.addEventListener('visibilitychange', ()=>{ if (!document.hidden) checkOrientationAndRemind(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkOrientationAndRemind);
  else checkOrientationAndRemind();
})();
