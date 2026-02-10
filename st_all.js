// ============================================================
// 定数・設定
// ============================================================

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7],
  [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15],
  [15, 16], [0, 17], [17, 18], [18, 19], [19, 20]
];


const KEY_Y_OFFSET = 120; // キーY座標に追加するオフセット（px） 目的:指の先端に合わせるため
const FINGERTIP_RADIUS = 5; // 指先点の半径（px）
const FINGERTIP_INDICES = [8, 12, 16, 20]; // 入力対象の指先インデックス
const INPUT_DEBOUNCE = 300; // ミリ秒

const timeLabels = {1:'1分',2:'2分',3:'3分',4:'4分',5:'5分'};
const levelLabels = {1:'1もじ',2:'みじかいことば',3:'ながいことば',4:'みじかい文',5:'ながい文'};

// キーボードの形（多角形方式）
  const keyboardLayout = {
  // 1行目
  'Q': { points: [ {x:0,y:101}, {x:28,y:95}, {x:84 ,y:95 }, {x:58 ,y:105 } ]  },
  'W': { points: [ {x:58 ,y:105}, {x:84,y:95}, {x:143,y:96}, {x:121,y:106} ]  },
  'e': { points: [ {x:121 ,y:106 }, {x:143 ,y:96 }, {x:201 ,y:96 }, {x:187 ,y:106 } ]  },
  'r': { points: [ {x:187 ,y:106 }, {x:201 ,y:96 }, {x:258 ,y:96 }, {x:253 ,y:107 } ]  },
  't': { points: [ {x:253 ,y:107 }, {x:258 ,y:96 }, {x:317 ,y:96 }, {x:317 ,y:108 } ]  },
  'y': { points: [ {x:317 ,y:108 }, {x:317 ,y:96 },  {x:373 ,y:98 },{x:382 ,y:108 } ]  },
  'u': { points: [ {x:382 ,y:108 }, {x:373,y:98 }, {x:434 ,y:99 }, {x:447 ,y:110 } ]  },
  'i': { points: [ {x:447 ,y:110 }, {x:434 ,y:99 }, {x:493 ,y:99 }, {x:515 ,y:111 } ]  },
  'o': { points: [ {x:515 ,y:111 }, {x:493 ,y:99 }, {x:551 ,y:101 }, {x:579 ,y:111 } ]  },
  'p': { points: [ {x:579 ,y:111 }, { x:551 ,y:101 }, {x:608 ,y:101 }, {x:640 ,y:111 } ]  },
  // 2行目
  'a': { points: [ {x:45 ,y:95 }, {x:70 ,y:87 }, {x:120 ,y:88 }, {x:101 ,y:96 } ]  },
  's': { points: [ {x:101 ,y:96 }, {x:120 ,y:88 }, {x:172 ,y:88 }, {x:159 ,y:96 } ]  },
  'd': { points: [ {x:159 ,y:96 }, {x:172 ,y:88 }, {x:225 ,y:88 }, {x:215 ,y:96 } ]  },
  'f': { points: [ {x:215 ,y:96 }, {x:225 ,y:88 }, {x:277 ,y:88 }, {x:272 ,y:97 } ]  },
  'g': { points: [ {x:272 ,y:97 }, {x:277 ,y:88 }, {x:328 ,y:89 }, {x:329 ,y:97 } ]  },
  'h': { points: [ {x:329 ,y:97 }, {x:328 ,y:89 }, {x:379 ,y:90 }, {x:387 ,y:98 } ]  },
  'j': { points: [ {x:387 ,y:98 }, {x:379 ,y:90 }, {x:432 ,y:91 }, {x:445 ,y:99 } ]  },
  'k': { points: [ {x:445 ,y:99 }, {x:432 ,y:91 }, {x:485 ,y:91 }, {x:504 ,y:100 } ]  },
  'l': { points: [ {x:504 ,y:100 }, {x:485 ,y:91 }, {x:538 ,y:93 }, {x:560 ,y:101 } ]  },
  // 3行目
  'z': { points: [ {x:93 ,y:87 }, {x:112 ,y:81 }, {x:158 ,y:81 }, {x:145 ,y:88 } ]  },
  'x': { points: [ {x:145 ,y:88 }, {x:158 ,y:81 },  {x:205 ,y:82 },{x:197 ,y:89 }, ]  },
  'c': { points: [ {x:197 ,y:89 }, {x:205 ,y:82 }, {x:253 ,y:82 }, {x:247 ,y:89 } ]  },
  'v': { points: [ {x:247 ,y:89 }, {x:253 ,y:82 }, {x:299 ,y:81 }, {x:299 ,y:88 } ]  },
  'b': { points: [ {x:299 ,y:88 }, {x:299 ,y:81 }, {x:346 ,y:83 }, {x:349 ,y:90 } ]  },
  'n': { points: [ {x:349 ,y:90 }, {x:346 ,y:83 }, {x:392 ,y:84 }, {x:401 ,y:90 } ]  },
  'm': { points: [ {x:401 ,y:90 }, {x:392 ,y:84 }, {x:441 ,y:84 }, {x:452 ,y:91 } ]  },
  ',': { points: [ {x:452 ,y:91 }, {x:441 ,y:84 }, {x:490 ,y:84 }, {x:506 ,y:92 } ]  },
  '.': { points: [ {x:506 ,y:92 }, {x:490 ,y:84 }, {x:536 ,y:86 }, {x:558 ,y:93 } ]  },
  };


  function extractFingerData(landmarks, handSide) {
  const fingerIds = [8, 12, 16, 20];

  const fingers = fingerIds.map(id => ({
    id,
    x: landmarks[id].x,
    y: landmarks[id].y,
    z: landmarks[id].z
  }));

  // x座標でソート（画面基準）
  fingers.sort((a, b) => a.x - b.x);

  const prefix = handSide === 'Right' ? 'r' : 'l';

  return {
    wristX: landmarks[0].x,
    fingers: fingers.map((f, i) => ({
      name: `${prefix}${fingerIds[i]}`,
      x: f.x,
      y: f.y,
      z: f.z
    }))
  };
}



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
  
  for (const [key, keyData] of Object.entries(keyboardLayout)) {
    const points = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
    if (!points || points.length < 3) continue;
    
    // キーボタンの背景（薄い色）
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    // キーボタンの枠線（黒で目立たせる）
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // キーラベルを中心に表示
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    ctx.fillStyle = '#cccccc';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const displayKey = String(key).toUpperCase();
    ctx.fillText(displayKey, centerX, centerY);
  }
  ctx.restore();
}

/**
 * 指先の点を描画（視覚化用）
 */
function drawFingertipMarkers(canvas, detectedFingertips) {
  if (!canvas || !detectedFingertips || Object.keys(detectedFingertips).length === 0) return;
  
  const ctx = canvas.getContext('2d');
  
  for (const [fingerName, fingertip] of Object.entries(detectedFingertips)) {
    if (!fingertip || fingertip.xPx === undefined || fingertip.yPx === undefined) continue;
    
    const x = fingertip.xPx;
    const y = fingertip.yPx;
    
    // 指先を赤い円で描画
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(x, y, FINGERTIP_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // 指の名前をラベルとして表示
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(fingerName, x + 8, y - 5);
  }
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
      // ホバー中のキーをハイライト
      ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // キー情報をポップアップ表示
      const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      const labelY = centerY - 20;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(centerX - 20, labelY - 12, 40, 18);
      
      ctx.fillStyle = '#ffff00';
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

function checkKeyInput() {
  const now = Date.now();
  if (now - lastInputTime < INPUT_DEBOUNCE) return;

  // 対象の複数指先を順にチェックして、先に見つかったものを入力として扱う
  for (const idx of FINGERTIP_INDICES) {
    const fingertip = window.mpGetFingertip(idx, { space: 'canvas' });
    if (!fingertip) continue;

    // 指先の座標（canvasピクセル単位）
    const fingerX = fingertip.xPx;
    const fingerY = fingertip.yPx;

    // 各キーの多角形領域をチェック
    for (const [key, keyData] of Object.entries(keyboardLayout)) {
      const points = keyData.points.map(p => ({ x: p.x, y: p.y + KEY_Y_OFFSET }));
      if (!points || points.length < 3) continue;

      // 多角形内判定
      if (isPointInPolygon(fingerX, fingerY, points)) {
        const normalizedKey = String(key).toLowerCase();
        inputBuffer += normalizedKey;
        lastInputTime = now;
        updateInputDisplay();
        console.log(`Key detected by fingertip ${idx}: ${key} -> ${normalizedKey}, Buffer: ${inputBuffer}`);
        checkAnswer();
        return; // 1回のチェックあたり1入力のみ
      }
    }
  }
}

function updateInputDisplay() {
  const el = document.getElementById('inputBuffer');
  if (el) el.textContent = `入力: ${inputBuffer}`;
}

function checkAnswer() {
  const romaEl = document.getElementById('romajiLabel');
  if (!romaEl) return;
  const expectedRomaji = romaEl.textContent.trim();
  
  if (!expectedRomaji) return;
  
  if (inputBuffer === expectedRomaji) {
    console.log('✓ 正解!');
    recordCorrectAnswer(inputBuffer);
    inputBuffer = '';
    updateInputDisplay();
    nextWord();
  } else if (expectedRomaji.startsWith(inputBuffer)) {
    console.log('途中入力...');
  } else {
    console.log('✗ 不正解!');
    recordIncorrectAnswer(inputBuffer);
    inputBuffer = '';
    updateInputDisplay();
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
  const score = correctCount * 10 - incorrectCount * 5;
  
  const pointEl = document.getElementById('point');
  const levelEl = document.getElementById('revel');
  const lengthEl = document.getElementById('length');
  const timeEl = document.getElementById('time');
  const speedEl = document.getElementById('speed');
  const nTrueEl = document.getElementById('n_true');
  const nFalseEl = document.getElementById('n_false');
  const tPerEl = document.getElementById('t_per');
  const fPerEl = document.getElementById('f_per');
  
  if (pointEl) pointEl.textContent = Math.max(0, score);
  if (levelEl) levelEl.textContent = lslider ? lslider.value : '1';
  if (lengthEl) lengthEl.textContent = total;
  if (timeEl) timeEl.textContent = tslider ? `${tslider.value}分` : '1分';
  if (speedEl) speedEl.textContent = total > 0 ? Math.round(total / (tslider ? tslider.value : 1)) : 0;
  if (nTrueEl) nTrueEl.textContent = correctCount;
  if (nFalseEl) nFalseEl.textContent = incorrectCount;
  if (tPerEl) tPerEl.textContent = `${correctPercent}%`;
  if (fPerEl) fPerEl.textContent = `${incorrectPercent}%`;
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
  if (useWanakana) return wanakana.toRomaji(input);
  const map = {'あ':'a','い':'i','う':'u','え':'e','お':'o',
    'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
    'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
    'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
    'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
    'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
    'や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri',
    'る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'o','ん':'n',};
  const combos = {
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
    'しゃ':'sha','しゅ':'shu','しょ':'sho','じゃ':'ja','じゅ':'ju','じょ':'jo',
    'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','ふぁ':'fa','ふぃ':'fi','ふゅ':'fyu','ふぇ':'fe','ふぉ':'fo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
    'みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo',
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
    3: ['カレーライス','バターロール','カレーパン','マーガリン','おみそしる','ハンバーガー','チキンカツ','フライドポテト','オムライス','スパゲッティ','ミートソース','サンドイッチ','ポテトサラダ','シーザーサラダ','ポタージュ','コーンスープ','コーヒーゼリー','プリンアラモード','チョコレート','アイスクリーム','たんじょうび','クリスマス','おしょうがつ','ハロウィン','こどものひ','せいじんのひ','けんこうしんだん','うんどうかい','けっこんしき','にゅうがくしき','そつぎょうしき','でんわばんごう','メールアドレス','インターネット','スマートフォン','コンピュータ','テレビゲーム','ソーシャルメディア','オンラインショッピング','デジタルカメラ','ビデオカメラ','バスケットボール','テニスラケット','サッカーボール','ゴールポスト','ゴルフクラブ','スイミングプール','ランニングシューズ','サーフボード','スケートボード','スノーボード'],
    4: ['いぬがあるいている。','ねこがねている 。','あめがふってきた。','きょうはいいてんき。','ごはんをたこう。','えんぴつでかこう。','みんなであそぶ。','くつをはいてでる。','すいかがあまい。','ともだちとわらう。','ほんをよむ。','ボールをなげる。','サッカーをしてあそぶ。','やまにのぼる。','うんどうかいにでる。','しあいでまける。','あさのゆうがなめざめ。','ごはんをたくさんたべる。','そらにくもがある。','はなをつみにいく。','かぜがふいている。','つきがでてきた。','でんしゃがはしる。','かさをひろげよう。','りんごをたべたい。','うみでおよいだ。','ことりがなく。','やまにのぼろう。','がっこうをやすむ。','さつまいもをほる。','さかながおよいでいる。','あかいいちごをさがす。','くるまがはしっている。','ひこうきがとんでいる。','おにぎりをたべた。','かみをきってみた。','いすにすわろう。','でんきをつけよう。','ふうせんがうかんでいる。','かばんをもっていく。','あめがふっている。','ゆきがふっている。','きょうかしょをあける。','たいようがてっている。','くもがうごいている。','そらがあおい。','つきがみえる。','ほしがひかっている。','かぜがやんでいる。','あさがきている。','そらにとりがとんでいる。','はながさいている。','つきがかがやいている。','たいようがのぼっている。','おはしをもつ。','いけにさかながいる。','でんしゃがはしっている。','じてんしゃにのる。','おはなみにいく。','ふねがうみにうかんでいる。','りんごをたべる。','みかんをたべる。','ぶどうをたべる。','なしをたべる。','ももをたべる。','すいかをたべる。','いちごをたべる。','ばななをたべる。','さくらんぼをたべる。','かきをたべる。','いぬとあそんでいる。','ねことあそんでいる。','とりがなく。','うさぎがはねている。','ぞうがあるいている。','きりんがみている。','さるがのぼっている。','くまがあるいている。','かめがあるいている。','いんこがなく。','えんぴつでかいてある。','けしごむでなおす。','ほんをよんでいる。','ノートにかいている。','じをならっている。','すうじをかぞえている。','えをかいている。','うたをうたっている。','ピアノをひいた。','たいこをたたいている。','こうえんにいく。','やまにのぼる。','うみにいく。','かわであそぶ。','みちをあるく。','いえにかえる。','がっこうにいく。','きょうしつにすわる。','じゅぎょうをうける。','せんせいにはなす。'],
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
  kanaEl.textContent = kana;
  if (romaEl) romaEl.textContent = roma;
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
  // Canvas参照の優先順: アクティブなページのCanvas -> 指定されたサイズ
  let canvas = document.querySelector('.mp_output_canvas_active');
  if (!canvas) {
    const page4 = document.getElementById('page4');
    const page3 = document.getElementById('page3');
    if (page4 && page4.style.display !== 'none') {
      canvas = document.getElementById('mp_output_canvas_p4');
    } else if (page3 && page3.style.display !== 'none') {
      canvas = document.getElementById('mp_output_canvas_p3');
    }
  }
  const w = opts.width || (canvas && canvas.width) || 640;
  const h = opts.height || (canvas && canvas.height) || 480;
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

/**
 * Extract structured hand fingertip data from either a Mediapipe
 * results object or directly from multiHandLandmarks array.
 * Returns:
 * {
 *   right: { r8, r12, r16, r20 } | null,
 *   left : { l8, l12, l16, l20 } | null
 * }
 */
function extractHandsData(input) {
  const handsLandmarks = Array.isArray(input) ? input : (input && input.multiHandLandmarks) ? input.multiHandLandmarks : null;
  if (!handsLandmarks || handsLandmarks.length === 0) {
    return { right: null, left: null };
  }

  const hands = handsLandmarks.map(landmarks => {
    const wrist = landmarks[0];
    const fingers = [8, 12, 16, 20].map(i => ({
      index: i,
      x: landmarks[i].x,
      y: landmarks[i].y,
      z: landmarks[i].z
    }));
    return { wristX: wrist.x, fingers };
  });

  hands.sort((a, b) => b.wristX - a.wristX);

  let rightHand = null;
  let leftHand = null;
  if (hands.length >= 1) rightHand = hands[0];
  if (hands.length >= 2) leftHand = hands[1];

  return {
    right: rightHand ? assignFingerNames(rightHand.fingers, 'r') : null,
    left: leftHand ? assignFingerNames(leftHand.fingers, 'l') : null
  };
}

/**
 * Map an array of finger landmarks to named fingertip objects.
 * fingers: [{index,x,y,z}, ...]
 * prefix: 'r' or 'l'
 */
function assignFingerNames(fingers, prefix) {
  const out = {};
  if (!Array.isArray(fingers)) return out;
  
  // Canvas参照を取得（正確な幅を使用）
  let canvas = document.querySelector('.mp_output_canvas_active');
  if (!canvas) {
    const page4 = document.getElementById('page4');
    const page3 = document.getElementById('page3');
    if (page4 && page4.style.display !== 'none') {
      canvas = document.getElementById('mp_output_canvas_p4');
    } else if (page3 && page3.style.display !== 'none') {
      canvas = document.getElementById('mp_output_canvas_p3');
    }
  }
  const w = (canvas && canvas.width) || 640;
  const h = (canvas && canvas.height) || 480;
  
  for (const f of fingers) {
    const key = prefix + f.index;
    // 正規化座標からピクセル座標に変換
    let xPx = f.x * w;
    if (window.mpUseMirror) {
      xPx = w - xPx;
    }
    const yPx = f.y * h;
    out[key] = { x: f.x, y: f.y, z: f.z, xPx: xPx, yPx: yPx };
  }
  return out;
}

/**
 * Mediapipe onResults handler: accepts the full results object
 * and updates UI / state accordingly.
 */
function onHandsResults(results) {
  const canvas = document.querySelector('.mp_output_canvas_active') || document.getElementById('mp_output_canvas_p4') || document.getElementById('mp_output_canvas_p3');
  const status = document.getElementById('mp_status_p4') || document.getElementById('mp_status_p3');
  const isPage4Active = (page4 && page4.style.display !== 'none');
  const detected = {};

  if (results && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const handsData = extractHandsData(results);

    if (handsData.right) {
      const { r8, r12, r16, r20 } = handsData.right;
      detected.r8 = r8; detected.r12 = r12; detected.r16 = r16; detected.r20 = r20;
    }
    if (handsData.left) {
      const { l8, l12, l16, l20 } = handsData.left;
      detected.l8 = l8; detected.l12 = l12; detected.l16 = l16; detected.l20 = l20;
    }

    try { window.latestFingertips = detected; } catch(e) {}

    if (canvas) {
      drawKeyboardLayout(canvas);
      drawFingertipMarkers(canvas, detected);
      for (const key in detected) highlightHoveredKey(canvas, detected[key]);
    }
    checkKeyInput();

    const infoEl = document.getElementById('mp_fingertips');
    if (infoEl) {
      const debugInfo = {};
      for (const k in detected) {
        debugInfo[k] = { xPx: detected[k].xPx, yPx: detected[k].yPx };
      }
      infoEl.textContent = JSON.stringify(debugInfo);
    }
    if (status) status.textContent = '手検出: OK (' + Object.keys(detected).length + '指)';

    if (isPage4Active && !timerStarted && handsInitialized) {
      timerStarted = true;
      console.log('手検出成功。タイマー開始');
      const mins = tslider ? tslider.value : 1;
      startTimer(mins);
    }
  } else {
    if (status) status.textContent = '手が見つかりません（video側は再生中）';
    try { window.latestFingertips = {}; } catch(e) {}
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
    const status = document.getElementById('mp_status_p4') || document.getElementById('mp_status_p3');
    if (status) status.textContent = 'ライブラリ読み込み中...';
    setTimeout(() => startMediapipeHands(), 200);
    return;
  }
  
  // ページに応じた要素を取得
  let video, canvas, status;
  if (isPage4Active) {
    video = document.getElementById('mp_input_video_p4');
    canvas = document.getElementById('mp_output_canvas_p4');
    status = document.getElementById('mp_status_p4');
    console.log('Using page4 elements: video=' + (video ? 'found' : 'NOT FOUND') + ', canvas=' + (canvas ? 'found' : 'NOT FOUND'));
  } else if (isPage3Active) {
    video = document.getElementById('mp_input_video_p3');
    canvas = document.getElementById('mp_output_canvas_p3');
    status = document.getElementById('mp_status_p3');
    console.log('Using page3 elements: video=' + (video ? 'found' : 'NOT FOUND') + ', canvas=' + (canvas ? 'found' : 'NOT FOUND'));
  } else {
    console.error('startMediapipeHands: Neither page3 nor page4 is active');
    return;
  }
  
  console.log('startMediapipeHands: initializing Camera first');
  
  // Use full window size for processing (full-screen capture), display scaled down via CSS
  const VIDEO_WIDTH = Math.max(window.innerWidth || 640, 640);
  const VIDEO_HEIGHT = Math.max(window.innerHeight || 480, 480);
  
  canvas.width = VIDEO_WIDTH;
  canvas.height = Math.round(VIDEO_HEIGHT * 3 / 4);
  
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
          
          if (canvas.width !== actualW || canvas.height !== Math.round(actualH * 3 / 4)) {
            canvas.width = actualW;
            canvas.height = Math.round(actualH * 3 / 4);
            console.log('Canvas resized to:', canvas.width, 'x', canvas.height, 'from video:', actualW, 'x', actualH);
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
    if (status) status.textContent = 'カメラ起動成功';
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
        if (status) status.textContent = 'カメラ接続成功。手を検出中...';
        
        // Test: Force send one frame to verify it works
        console.log('Hands init: Ready to receive frames');
        
      } catch (err) {
        console.error('✗ Failed to initialize Hands:', err, err.stack);
        if (status) status.textContent = 'Hands 初期化失敗: ' + err.message;
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
            // Draw video raw into canvas; visual mirroring is handled by CSS transforms
            ctx.drawImage(video, 0, Math.round(actualH / 4), actualW, Math.round(actualH * 3 / 4), 0, 0, canvas.width, canvas.height);
            const st = document.getElementById('mp_status_p4') || document.getElementById('mp_status_p3');
            if (st) {
              if (mpHands) {
                st.textContent = 'video再生中（手検出待機中...）';
              } else {
                st.textContent = 'Hands 初期化中...';
              }
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
    const status = document.getElementById('mp_status_p4');
    if (canvas){ const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); }
    if (status) status.textContent = 'カメラ停止';
  } else if (isPage3Active) {
    const canvas = document.getElementById('mp_output_canvas_p3');
    const status = document.getElementById('mp_status_p3');
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
