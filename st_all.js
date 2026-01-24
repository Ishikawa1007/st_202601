// ============================================================
// ① 定数・設定
// ============================================================

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7],
  [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15],
  [15, 16], [0, 17], [17, 18], [18, 19], [19, 20]
];

const KEYBOARD_DETECTION_DISTANCE = 80; // ピクセル単位での検出距離
const INPUT_DEBOUNCE = 300; // ミリ秒

const timeLabels = {1:'1分',2:'2分',3:'3分',4:'4分',5:'5分'};
const levelLabels = {1:'1もじ',2:'みじかいことば',3:'ながいことば',4:'みじかい文',5:'ながい文'};

const keyboardLayout = {
  '1': {x: 101, y: 333}, '2': {x: 140, y: 334}, '3': {x: 177, y: 334}, '4': {x: 216, y: 335},
  '5': {x: 253, y: 335}, '6': {x: 291, y: 336}, '7': {x: 328, y: 337}, '8': {x: 364, y: 337},
  '9': {x: 403, y: 338}, '0': {x: 441, y: 339}, '-': {x: 481, y: 340}, '^': {x: 520, y: 341},
  '\\': {x: 559, y: 342}, 'bs': {x: 598, y: 342},
  'q': {x: 136, y: 329}, 'w': {x: 169, y: 330}, 'e': {x: 205, y: 330}, 'r': {x: 240, y: 330},
  't': {x: 275, y: 331}, 'y': {x: 310, y: 332}, 'u': {x: 345, y: 332}, 'i': {x: 382, y: 333},
  'o': {x: 417, y: 333}, 'p': {x: 452, y: 335}, '@': {x: 488, y: 336}, '[': {x: 523, y: 336},
  'ent': {x: 563, y: 339},
  'a': {x: 155, y: 325}, 's': {x: 190, y: 326}, 'd': {x: 223, y: 326}, 'f': {x: 254, y: 326},
  'g': {x: 288, y: 327}, 'h': {x: 321, y: 328}, 'j': {x: 354, y: 328}, 'k': {x: 384, y: 329},
  'l': {x: 418, y: 330}, ';': {x: 451, y: 330}, ':': {x: 488, y: 331}, ']': {x: 521, y: 332},
  'z': {x: 182, y: 323}, 'x': {x: 213, y: 323}, 'c': {x: 243, y: 323}, 'v': {x: 277, y: 324},
  'b': {x: 305, y: 324}, 'n': {x: 332, y: 325}, 'm': {x: 368, y: 325}, ',': {x: 398, y: 326},
  '.': {x: 429, y: 327}, '/': {x: 461, y: 327}
};

// ============================================================
// ② MP準備・チェック
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

function drawKeyboardLayout(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  for (const [key, pos] of Object.entries(keyboardLayout)) {
    const radius = KEYBOARD_DETECTION_DISTANCE / 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(key, pos.x, pos.y);
    ctx.fillStyle = 'rgba(100, 100, 255, 0.3)';
  }
  ctx.restore();
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
  
  const fingertip = window.mpGetFingertip(8, { space: 'canvas' });
  if (!fingertip) return;
  
  for (const [key, pos] of Object.entries(keyboardLayout)) {
    const dist = Math.hypot(fingertip.xDiv - pos.x, fingertip.yDiv - pos.y);
    if (dist <= KEYBOARD_DETECTION_DISTANCE) {
      inputBuffer += key;
      lastInputTime = now;
      updateInputDisplay();
      console.log(`Key detected: ${key}, Buffer: ${inputBuffer}`);
      checkAnswer();
      break;
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

window.mpSetMirror = function(flag){ window.mpUseMirror = !!flag; };

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
  let statusId = isPage4Active ? 'mp_status_p4' : 'mp_status_p3';
  
  const canvas = document.getElementById(canvasId);
  const status = document.getElementById(statusId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.save();
  
  if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0){
    const fingertipIndices = [4,8,12,16,20];
    const detected = {};
    for (const landmarks of results.multiHandLandmarks){
      if (typeof drawConnectors === 'function' && typeof HAND_CONNECTIONS !== 'undefined') {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color:'#00FF00', lineWidth:2});
      }
      if (typeof drawLandmarks === 'function') drawLandmarks(ctx, landmarks, {color:'#FF0000', lineWidth:1});
      fingertipIndices.forEach(i=>{
        const lm = landmarks[i]; if (!lm) return;
        const xPx = lm.x * canvas.width; 
        const yPx = lm.y * canvas.height;
        const xDiv = Math.round(xPx);
        const yDiv = Math.round(yPx);
        ctx.fillStyle = 'yellow'; ctx.beginPath(); ctx.arc(xPx, yPx, 6, 0, 2*Math.PI); ctx.fill();
        ctx.fillStyle = 'black'; ctx.font='12px sans-serif'; ctx.fillText(String(i), xPx+6, yPx-6);
        detected[i] = { x: lm.x, y: lm.y, z: lm.z, xPx: xPx, yPx: yPx, xDiv: xDiv, yDiv: yDiv };
      });
    }
    try{ window.latestFingertips = detected; }catch(e){}
    drawKeyboardLayout(canvas);
    checkKeyInput();
    const infoEl = document.getElementById('mp_fingertips');
    if (infoEl) infoEl.textContent = JSON.stringify(detected);
    if (status) status.textContent = '手検出: OK';
    
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
  ctx.restore();
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
  
  const VIDEO_WIDTH = 640;
  const VIDEO_HEIGHT = 480;
  
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT / 2;
  
  console.log('Canvas initialized: ' + canvas.width + ' x ' + canvas.height);
  
  mpCamera = new Camera(video, {
    onFrame: async () => {
      if (sending) return;
      if (video.readyState < 2) return;
      if (video.videoWidth === 0) return;
      
      sending = true;
      try {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const actualW = video.videoWidth;
          const actualH = video.videoHeight;
          
          if (canvas.width !== actualW || canvas.height !== Math.round(actualH / 2)) {
            canvas.width = actualW;
            canvas.height = Math.round(actualH / 2);
            console.log('Canvas resized to:', canvas.width, 'x', canvas.height, 'from video:', actualW, 'x', actualH);
          }
          
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, actualH / 2, actualW, actualH / 2, 0, 0, canvas.width, canvas.height);
          
          if (mpHands) await mpHands.send({image: canvas});
        } else {
          console.warn('[onFrame] video not ready: readyState=' + video.readyState + ', size=' + video.videoWidth + 'x' + video.videoHeight);
        }
      } catch (err) {
        console.error('[onFrame] mpHands.send() error:', err.message || err);
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
        console.log('Hands ctor');
        mpHands = new Hands({
          locateFile: (file) => {
            console.log('Hands locateFile requested:', file);
            const filename = file.split('/').pop();
            const baseUrl = 'https://ishikawa1007.github.io/st_202601/hands/';
            const resolved = baseUrl + filename;
            console.log('  Resolved to:', resolved);
            return resolved;
          }
        });
        
        mpHands.setOptions({
          modelComplexity: 0,
          maxNumHands: 2, 
          minDetectionConfidence: 0.5, 
          minTrackingConfidence: 0.5
        });
        mpHands.onResults(onHandsResults);
        
        console.log('✓ mpHands initialized successfully');
        handsInitialized = true;
        if (status) status.textContent = 'カメラ接続成功。手を検出中...';
        
      } catch (err) {
        console.error('✗ Failed to initialize Hands:', err, err.stack);
        if (status) status.textContent = 'Hands 初期化失敗: ' + err.message;
      }
    }, 500);
    
    if (!window._mpHandsRendered && !mpCanvasFallbackTimer){
      mpCanvasFallbackTimer = setInterval(()=>{
        try{
          if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0){
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const actualW = video.videoWidth;
            const actualH = video.videoHeight;
            ctx.drawImage(video, 0, actualH / 2, actualW, actualH / 2, 0, 0, canvas.width, canvas.height);
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
      `  <button id="${REMINDER_ID}_close" style="padding:8px 14px;font-size:15px;border-radius:6px;border:0;background:#1976d2;color:#fff;cursor:pointer;">閉じる</button>`,
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
