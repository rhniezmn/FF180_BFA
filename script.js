/* --- Basic state --- */
const state = {
  currentWeek: 2, // change to unlock week 2
  player: { name: '', house: '' },
  games: [], // will contain 10 games per week
  activeGame: null,
  timer: null,         // game-level timer (counts down whole game)
  timeLeft: 0,
  weekScore: 0
};

function initGames() {
  state.games = [
    { id: 1, key: 'logic', name: 'Wakanda Logic Boost', duration: 60, played: false, score: 0 },
    { id: 2, key: 'word', name: 'Stark Word Sprint', duration: 45, played: false, score: 0 },
    { id: 3, key: 'memory', name: 'Gamma Memory Matrix', duration: 60, played: false, score: 0 },
    { id: 4, key: 'reflex', name: 'Infinity Reflex Gauntlet', duration: 30, played: false, score: 0 },
    { id: 5, key: 'quiz', name: 'Shield Quiz Blitz', duration: 60, played: false, score: 0 },
    { id: 6, key: 'focus', name: 'SpeedForce Focus', duration: 45, played: false, score: 0 },
    { id: 7, key: 'pattern', name: 'Thunder Pattern Pulse', duration: 50, played: false, score: 0 },
    { id: 8, key: 'math', name: 'Arc Reactor Math Dash', duration: 45, played: false, score: 0 },
    { id: 9, key: 'visual', name: 'Vision’s Spot It', duration: 40, played: false, score: 0 },
    { id:10, key: 'emoji', name: 'Infinity Emoji Quest', duration: 45, played: false, score: 0 }
  ];
}
initGames();

/* --- Per-game scoring / fast-bonus config --- */
const gameConfig = {
  logic:  { correct: 12, wrong: -5, fastWindow: 4000, fastBonus: 4 },  // 4s fast window
  word:   { correct: 10, wrong: -5, fastWindow: 5000, fastBonus: 3 },  // 5s
  memory: { correct: 15, wrong: -5, fastWindow: 5000, fastBonus: 5 },
  reflex: { correct: 8,  wrong: -4, fastWindow: 1200, fastBonus: 6 },  // reflex is faster
  quiz:   { correct: 10, wrong: -5, fastWindow: 6000, fastBonus: 2 },
  focus:  { correct: 12, wrong: -5, fastWindow: 5000, fastBonus: 3 },
  pattern: { correct: 12, wrong: -5, fastWindow: 4500, fastBonus: 3 },
  math:    { correct: 12, wrong: -6, fastWindow: 5000, fastBonus: 4 },
  visual:  { correct: 14, wrong: -6, fastWindow: 4000, fastBonus: 5 },
  emoji:   { correct: 10, wrong: -5, fastWindow: 4500, fastBonus: 3 }
};

/* --- Question / variation banks (8-10 each) --- */
const logicBoostQuestions = [
  { question: 'What comes next: 2, 4, 6, ...', options: ['8','9','7','10'], answer: '8' },
  { question: 'What is 10 + 5 - 3?', options: ['10','11','12','13'], answer: '12' },
  { question: 'Iron Man needs energy to fight. What’s the healthiest source?', options: ['Candy','Fruits','Soda','Chips'], answer: 'Fruits' },
  { question: 'Flash runs 100m in 1 second. How far in 5 seconds?', options: ['300m','400m','500m','600m'], answer: '500m' },
  { question: 'Odd one out: Iron Man, Thor, Hulk, Flash?', options: ['Iron Man','Thor','Hulk','Flash'], answer: 'Flash' },
  { question: 'Odd one out: 2,4,6,9,8?', options: ['2','4','6','9'], answer: '9' },
  { question: 'Twice a number is 14. Number?', options: ['6','7','8','5'], answer: '7' },
  { question: 'Thanos snaps away all germs. What should heroes still do?', options: ['Wash hands','Eat junk food','Never sleep','Avoid water'], answer: 'Wash hands'},
  { question: 'Squares: 4,9,16,25,... next?', options: ['34','35','36','49'], answer: '36' }
];

const wordList = ['HEART','TRAIN','APPLE','BREAD','PLANT','MONEY','SMART','LIGHT','GLOBE','POWER', 'BEICIP', 'HEALTH', 'UNITY', 'WATER'];

const memorySequences = [
  [0,1],
  [2,4,1,3,0],
  [0,2,4,2,0,1,0],
  [1,3,5,2,1],
  [1],
  [4,2,0,3,1],
  [0,1,0,1,2,3,5],
  [3,1,4,1,3,5],
  [2,5,4,3,1,0],
  [1,2,3,2,1],
  [1,2,3,2,1,0,2,1]
];

const reflexColors = ['Red','Blue','Green','Yellow','Purple','Orange','Cyan','Magenta','Brown'];

const quizQuestions = [
  { q: 'Which habit improves heart health?', opts:['Skipping breakfast','Regular exercise','Smoking','Excess sugar'], a: 1 },
  { q: 'Which is a healthy snack?', opts:['Candy','Fruit','Soda','Chips'], a: 1 },
  { q: 'How many minutes of moderate exercise recommended weekly?', opts:['50','150','300','10'], a: 1 },
  { q: 'Which lowers blood pressure?', opts:['Exercise','Smoking','Excess salt','Sitting all day'], a: 0 },
  { q: 'Which is high in healthy fats?', opts:['Avocado','Donut','Fried potato','Sugary cereal'], a: 0 },
  { q: 'Good source of protein?', opts:['Chicken','Soda','Candy','White bread'], a: 0 },
  { q: 'Which is a whole grain?', opts:['Brown rice','White bread','Sugary cereal','Cake'], a: 0 },
  { q: 'Which reduces stress?', opts:['Meditation','Overeating','Procrastination','Smoking'], a: 0 },
  { q: 'A sign of dehydration?', opts:['Clear urine','Dizziness','Yawning','Normal energy'], a: 1 }
];

const focusSets = [
  ['A','A','B','B','C','C'],
  ['1','1','2','2','3','3'],
  ['★','★','✿','✿','☼','☼'],
  ['🍎','🍎','🍌','🍌','🍇','🍇'],
  ['X','X','Y','Y','Z','Z'],
  ['🐶','🐶','🐱','🐱','🐰','🐰'],
  ['M','M','N','N','O','O'],
  ['▲','▲','●','●','■','■']
];

const patternQuestions = [
  { question: 'Find next: 2,4,8,16,...', options:['18','24','32','20'], answer:'32' },
  { question: 'Next: 1,4,9,16,...', options:['20','25','30','36'], answer:'25' },
  { question: 'Complete: 5,10,15,20,...', options:['24','25','30','35'], answer:'25' },
  { question: 'Sequence: 3,6,12,24,...', options:['30','36','48','40'], answer:'48' },
  { question: 'Which next: 2,3,5,8,13,...', options:['18','20','21','22'], answer:'21' },
  { question: 'Next: 10,9,7,4,...', options:['0','1','2','3'], answer:'0' },
  { question: 'Pattern: 1,2,4,7,11,...', options:['14','15','16','18'], answer:'16' },
  { question: 'Next: 6,11,16,21,...', options:['24','26','27','28'], answer:'26' },
  { question: 'Next: 2,6,18,54,...', options:['108','162','216','72'], answer:'162' }
];

const mathQuestions = [
  { expr: '7 + 8', answer: 15 },
  { expr: '12 - 5', answer: 7 },
  { expr: '6 × 7', answer: 42 },
  { expr: '48 ÷ 6', answer: 8 },
  { expr: '9 + 14', answer: 23 },
  { expr: '15 - 9', answer: 6 },
  { expr: '8 × 6', answer: 48 },
  { expr: '81 ÷ 9', answer: 9 },
  { expr: '5 + 17', answer: 22 }
];

const visualSymbols = ['●','○','■','◆','▲','★','✿','☼','⬤','◧'];

const emojiPool = ['🍎','🍌','🍇','🍓','🍍','🍉','🍒','🥝','🍑','🍋'];

/* --- DOM refs --- */
const playBtn = document.getElementById('playBtn');
const modal = document.getElementById('modal');
const saveModal = document.getElementById('saveModal');
const cancelModal = document.getElementById('cancelModal');
const playerNameIn = document.getElementById('playerName');
const sportHouseIn = document.getElementById('sportHouse');
const restartBtn = document.getElementById('restartBtn');
const welcomeCard = document.getElementById('welcomeCard');
const welcomeText = document.getElementById('welcomeText');
const playerScoreEl = document.getElementById('playerScore');
const week1Btn = document.getElementById('week1Btn');
const week2Btn = document.getElementById('week2Btn');
const gamesCard = document.getElementById('gamesCard');
const gamesGrid = document.getElementById('gamesGrid');
const gamesTitle = document.getElementById('gamesTitle');
const gameArea = document.getElementById('gameArea');
const gameTimer = document.getElementById('gameTimer'); // original inline timer (we'll hide it)
const gameContent = document.getElementById('gameContent');
const gameScoreLine = document.getElementById('gameScoreLine');
const endGameBtn = document.getElementById('endGameBtn');
const completionArea = document.getElementById('completionArea');
const weekTotal = document.getElementById('weekTotal');
const submitBtn = document.getElementById('submitBtn');
const submitScoreBtn = document.getElementById('submitScoreBtn');

function setPlayButtonVisible(visible){
  if(!playBtn) return;
  playBtn.style.display = visible ? '':'none';
}

if (playBtn) playBtn.addEventListener('click', () => { openModal(); });
if (cancelModal) cancelModal.addEventListener('click', () => { closeModal();
  if(state.player && state.player.name){
    closeModal();
  }else {
    showToast('Please enter your name to continue', 'error', 1200);
    if (playerNameIn) playerNameIn.focus();
  }
});

if (saveModal) saveModal.addEventListener('click', savePlayerDetails);
if (restartBtn) restartBtn.addEventListener('click', restartSession);
if (week1Btn) week1Btn.addEventListener('click', () => openWeek(1));
if (week2Btn) week2Btn.addEventListener('click', () => { if (state.currentWeek >= 2) openWeek(2); else flashLocked(week2Btn); });

if (endGameBtn) {
  // ensure we don't attach duplicate listeners in case of re-run: remove old ones
  endGameBtn.replaceWith(endGameBtn.cloneNode(true));

  // re-query to get the new node
  const newEndBtn = document.getElementById('endGameBtn');

  if (newEndBtn) newEndBtn.addEventListener('click', endAndSubmit);
}

if (submitBtn) {
  submitScoreBtn.addEventListener('click', endAndSubmit);
  submitBtn.addEventListener('click', endAndSubmit);
}

function flashLocked(el) { 
  if (!el) return; 
  el.style.transform = 'scale(0.98)'; 
  setTimeout(() => el.style.transform = '', 200); 
}

function openModal() { 
  if (!modal) return;
  //Clear prior values so previous saved name
  if (playerNameIn) playerNameIn.value = '';
  if (sportHouseIn) sportHouseIn.selectedIndex = 0;
  modal.style.display = 'flex'; 
}

function closeModal() { 
  if(!modal) return;
  modal.style.display = 'none'; 
}

function restartSession(){
  //Stop any running game timer
  try { if(state.timer) {clearInterval(state.timer); state.timer = null;}} catch(e) {}

  //Clear Persisted Player
  try {localStorage.removeItem('bbb_player'); } catch (e){}

  //Reset in-memory player and games
  state.player = {name: '', house: '' };
  initGames();
  state.weekScore = 0;
  state.activeGame = null;

  if(gameArea) gameArea.style.display = 'none';
  if(gamesCard) gamesCard.style.display = 'none';
  if(completionArea) completionArea.style.display = 'none';
  if(welcomeCard) welcomeCard.style.display = 'none';

  updatePlayerScoreDisplay();
  openModal();
  setPlayButtonVisible(false);
  showToast('Session reset - Please Enter Player Details', 'info', 1400);
}

function savePlayerDetails(){
  const raw = playerNameIn ? playerNameIn.value.trim() : '';
  if (!raw){
    showToast('Please enter your name before contuining', 'error', 1400);
    if(playerNameIn) playerNameIn.focus();
    return;
  }
  const name = raw;
  const house = sportHouseIn ? sportHouseIn.value : '';
  state.player.name = name;
  state.player.house = house;
  try { localStorage.setItem('bbb_player', JSON.stringify(state.player)); } catch(e) {}
  closeModal();
  showWelcome();
  setPlayButtonVisible(false);
}

function showWelcome() {
  if (welcomeText) {
    welcomeText.innerHTML = `<strong>Hello, ${escapeHtml(state.player.name)}!</strong><div class=meta style='margin-top:6px'>Sport house: ${escapeHtml(state.player.house)}</div>`;
  }
  if (welcomeCard) welcomeCard.style.display = 'block';
  if (gamesCard) gamesCard.style.display = 'none';
  if (completionArea) completionArea.style.display = 'none';
  updatePlayerScoreDisplay();
}

function openWeek(week) {
  if (gamesTitle) gamesTitle.textContent = `Week ${week} Games`;
  if (welcomeCard) welcomeCard.style.display = 'none';
  if (gamesCard) gamesCard.style.display = 'block';
  renderGamesGrid();
  checkCompletion();
}

function endAndSubmit(){
  if(!state.player || !state.player.name){
    showToast('Please enter player details first', 'error', 1200);
    openModal();
    return;
  }
  if (state.activeGame) {
    // finish current game (marks it played and updates week score)
    finishGame(state.activeGame, 'ended_by_player');

    // short delay so finish toast/alert can display before submit flow
    setTimeout(() => {
      submitFinalScore();
    }, 350);
  } else {
    // no active game: just submit whatever is collected so far
    submitFinalScore();
  }
}

/* Game Icons */
const gameIcons = {
  logic:  '🐾',
  word:   '🤖',
  memory: '💪',
  reflex: '💀',
  quiz:   '🛡️',
  focus:  '⚡',
  pattern:'🔨',
  math:   '➗',
  visual: '👁️',
  emoji:  '😊'
};

function renderGamesGrid(){
  if(!gamesGrid) return;
  gamesGrid.innerHTML = '';
  state.games.forEach(g=>{
    const card = document.createElement('div');
    card.className = 'game-card' + (g.played? ' disabled':'') + ` game-type-${g.key}`;
    card.innerHTML = `
      <div class="game-card-inner">
        <div class="game-icon" aria-hidden="true">${escapeHtml(gameIcons[g.key] || '🎮')}</div>
        <div class="game-info">
          <div class="game-title"><strong>${escapeHtml(g.name)}</strong></div>
          <div class="meta">Duration: ${formatSeconds(g.duration)}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', ()=>{ if(!g.played) startGame(g.id); });
    gamesGrid.appendChild(card);
  });
}

/* --- Helper: sample n items from an array (fill by repeating randomly if needed) --- */
function sampleArray(arr, n) {
  const out = [];
  if (!Array.isArray(arr) || arr.length === 0) {
    for (let i = 0; i < n; i++) out.push(null);
    return out;
  }
  let pool = shuffle(arr.slice());
  while (out.length < n) {
    if (pool.length === 0) pool = shuffle(arr.slice());
    out.push(pool.pop());
  }
  return out;
}

/* --- Floating UI: timer & toast container --- */
function ensureFloatingUI() {
  if (!document.getElementById('floatingTimer')) {
    const ft = document.createElement('div');
    ft.id = 'floatingTimer';
    ft.textContent = '00:00';
    Object.assign(ft.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      padding: '8px 12px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      borderRadius: '8px',
      fontWeight: '700',
      zIndex: 9999,
      boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
      fontFamily: 'system-ui,Segoe UI,Roboto,Arial'
    });
    document.body.appendChild(ft);
  }
  if (gameTimer) gameTimer.style.display = 'none';

  if (!document.getElementById('toastContainer')) {
    const tc = document.createElement('div');
    tc.id = 'toastContainer';
    Object.assign(tc.style, {
      position: 'fixed',
      top: '56px',
      right: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 10000,
      maxWidth: '320px',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    });
    document.body.appendChild(tc);
  }
}

function updateFloatingTimerDisplay(text) {
  const ft = document.getElementById('floatingTimer');
  if (ft) ft.textContent = text;
}

function showToast(message, type = 'info', duration = 1500) {
  ensureFloatingUI();
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = 'game-toast';
  t.textContent = message;
  const base = {
    padding: '8px 12px',
    color: '#fff',
    borderRadius: '8px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    fontFamily: 'system-ui,Segoe UI,Roboto,Arial',
    pointerEvents: 'auto',
    transform: 'translateX(18px)',
    opacity: '0'
  };
  Object.assign(t.style, base);
  if (type === 'success') {
    t.style.background = 'linear-gradient(90deg,#2ecc71,#27ae60)';
  } else if (type === 'error') {
    t.style.background = 'linear-gradient(90deg,#ff6b6b,#e74c3c)';
  } else {
    t.style.background = 'rgba(0,0,0,0.7)';
  }
  tc.appendChild(t);
  requestAnimationFrame(() => {
    t.style.transition = 'transform 220ms ease, opacity 220ms ease';
    t.style.transform = 'translateX(0)';
    t.style.opacity = '1';
  });
  setTimeout(() => {
    t.style.transition = 'transform 220ms ease, opacity 220ms ease';
    t.style.transform = 'translateX(10px)';
    t.style.opacity = '0';
    setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
  }, duration);
}

/* --- Difficulty helpers --- */
function getRandomDifficulty(){
  // Weighted: beginner 50%, medium 35%, hard 15%
  const r = Math.random() * 100;
  if (r < 50) return 'beginner';
  if (r < 85) return 'medium';
  return 'hard';
}
const difficultyMultipliers = {
  beginner: 1.0,
  medium: 1.3,
  hard: 1.6
};
function difficultyBadgeText(d){
  if (!d) return '';
  return d.charAt(0).toUpperCase() + d.slice(1); // Beginner, Medium, Hard
}
function difficultyBadgeColor(d){
  if (!d) return '#999';
  if (d === 'beginner') return 'rgba(34,197,94,0.18)'; // greenish subtle
  if (d === 'medium') return 'rgba(59,130,246,0.14)'; // blueish
  if (d === 'hard') return 'rgba(220,38,38,0.14)'; // reddish
  return '#999';
}

/* --- Start / finish game --- */
function startGame(id) {
  const g = state.games.find(x => x.id === id);
  if (!g) return;
  g.totalQuestions = 10;
  g.currentQuestion = 0;
  g.score = 0;
  g.answered = 0;
  g._qStart = null;
  // build pool depending on game type (and assign difficulties)
  if (g.key === 'logic') g._pool = sampleArray(logicBoostQuestions, g.totalQuestions);
  else if (g.key === 'word') g._pool = sampleArray(wordList, g.totalQuestions);
  else if (g.key === 'memory') g._pool = sampleArray(memorySequences, g.totalQuestions);
  else if (g.key === 'reflex') g._pool = sampleArray(reflexColors, g.totalQuestions);
  else if (g.key === 'quiz') g._pool = sampleArray(quizQuestions, g.totalQuestions);
  else if (g.key === 'focus') g._pool = sampleArray(focusSets, g.totalQuestions);
  else if (g.key === 'pattern') g._pool = sampleArray(patternQuestions, g.totalQuestions);
  else if (g.key === 'math') g._pool = sampleArray(mathQuestions, g.totalQuestions);
  else if (g.key === 'visual') g._pool = sampleArray(visualSymbols, g.totalQuestions);
  else if (g.key === 'emoji') g._pool = sampleArray(emojiPool, g.totalQuestions);

  // attach per-question difficulty choices (random)
  g._diffs = Array.from({ length: g.totalQuestions }, () => getRandomDifficulty());

  state.activeGame = g;
  state.timeLeft = g.duration;
  if (gameArea) gameArea.style.display = 'block';
  ensureFloatingUI();
  updateTimerDisplay();
  if (gameScoreLine) gameScoreLine.textContent = 'Score: 0';
  if (state.timer) clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.timeLeft -= 1; updateTimerDisplay();
    if (state.timeLeft <= 0) { clearInterval(state.timer); finishGame(g, 'time_up'); }
  }, 1000);

  renderQuestion(g);
}

function updateTimerDisplay() {
  const s = state.timeLeft;
  const text = formatSeconds(s);
  if (gameTimer) gameTimer.textContent = text;
  updateFloatingTimerDisplay(text);
}

function finishGame(g, reason) {
  if (state.timer) { clearInterval(state.timer); state.timer = null; }
  const answered = g.answered || 0;
  const total = g.totalQuestions || 0;
  if (reason === 'time_up') {
    showToast(`Time's up — ${answered}/${total} answered`, 'error', 2200);
    setTimeout(() => { alert(`⏰ Time's up! You answered ${answered}/${total} questions. Final score for ${g.name}: ${g.score || 0}.`); }, 200);
  } else if (reason === 'completed') {
    showToast(`Completed ${total} questions`, 'success', 1600);
    setTimeout(() => { alert(`✅ Completed! You answered all ${total} questions. Final score for ${g.name}: ${g.score || 0}.`); }, 200);
  } else if (reason === 'ended_by_player') {
    showToast(`Game ended — ${answered}/${total}`, 'info', 1500);
    setTimeout(() => { alert(`You ended ${g.name}. You answered ${answered}/${total}. Score: ${g.score || 0}`); }, 200);
  }
  markGamePlayed(g.id);
}

function markGamePlayed(id) {
  const g = state.games.find(x => x.id === id);
  if (!g) return;
  g.played = true;
  state.weekScore = state.games.reduce((s, gg) => s + (gg.score || 0), 0);
  updatePlayerScoreDisplay();
  state.activeGame = null;
  if (gameArea) gameArea.style.display = 'none';
  renderGamesGrid();
  checkCompletion();
}

function checkCompletion() {
  const allPlayed = state.games.every(g => g.played);
  if (weekTotal) weekTotal.textContent = state.weekScore;
  if (allPlayed) {
    if (completionArea) completionArea.style.display = 'block';
  } else {
    if (completionArea) completionArea.style.display = 'none';
  }
}

/* --- Render single question for the active game's currentQuestion --- */
function renderQuestion(g){
  if(!gameContent) return;
  gameContent.innerHTML = '';
  if(gameScoreLine) gameScoreLine.textContent = `Score: ${g.score || 0}`;
  const qNum = (g.currentQuestion || 0) + 1;
  const header = document.createElement('div');
  header.className = 'question-card';

  const topRow = document.createElement('div');
  topRow.className = 'question-card-top';

  const progressText = document.createElement('div');
  progressText.className = 'question-progress-text';
  progressText.textContent = `Question ${qNum} / ${g.totalQuestions}`;

  // Difficulty badge (from g._diffs)
  const difficulty = (g._diffs && g._diffs[g.currentQuestion]) || 'beginner';
  g._currentDifficulty = difficulty;
  const badge = document.createElement('span');
  badge.className = 'difficulty-badge';
  badge.textContent = difficultyBadgeText(difficulty);
  badge.style.marginLeft = '10px';
  badge.style.padding = '4px 8px';
  badge.style.borderRadius = '999px';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = '700';
  badge.style.color = '#042028';
  badge.style.background = difficultyBadgeColor(difficulty);

  // attach badge to progressText
  progressText.style.display = 'inline-flex';
  progressText.style.alignItems = 'center';
  progressText.appendChild(badge);

  const progressWrap = document.createElement('div');
  progressWrap.className = 'progress-wrap';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  const inner = document.createElement('i');
  const pct = Math.round(((qNum-1)/g.totalQuestions)*100);
  inner.style.width = `${pct}%`;
  progressBar.appendChild(inner);
  progressWrap.appendChild(progressBar);
  topRow.appendChild(progressText);
  topRow.appendChild(progressWrap);
  header.appendChild(topRow);

  const contentPlaceholder = document.createElement('div');
  contentPlaceholder.className = 'question-body';
  header.appendChild(contentPlaceholder);
  gameContent.appendChild(header);

  if(g.currentQuestion >= g.totalQuestions){
    finishGame(g, 'completed');
    return;
  }

  // default question start timestamp; some renderers (like memory) may override when answers are enabled
  g._qStart = Date.now();

  // call the specific renderer which will append UI into gameContent (after header)
  if (g.key === 'logic') renderLogicQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'word') renderWordQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'memory') renderMemoryQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'reflex') renderReflexQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'quiz') renderQuizQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'focus') renderFocusQuestion(g, g._pool[g.currentQuestion]);
  else if (g.key === 'pattern') renderPatternQuestion(g);
  else if (g.key === 'math') renderMathQuestion(g);
  else if (g.key === 'visual') renderVisualQuestion(g);
  else if (g.key === 'emoji') renderEmojiQuestion(g);

  requestAnimationFrame(()=> {
    const bar = gameContent.querySelector('.progress-bar > i');
    if(bar) {
      const nextPct = Math.round(((qNum)/g.totalQuestions)*100);
      bar.style.transition = 'width 420ms linear';
      bar.style.width = `${nextPct}%`;
    }
  });
}

/* --- UI helpers: inject shared option styles and spark effect --- */
function injectOptionStyles() {
  if (document.getElementById('bbb_option_styles')) return;
  const css = `
    .choice-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
    .option-btn {
      appearance: none;
      -webkit-appearance: none;
      border: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      color: #fff;
      padding: 10px 12px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-family: system-ui,Segoe UI,Roboto,Arial;
      transition: transform 140ms ease, box-shadow 140ms ease, opacity 120ms ease;
      box-shadow: 0 8px 18px rgba(2,6,23,0.25);
      min-width: 64px;
    }
    .option-btn:active { transform: translateY(2px) scale(0.995); }
    .option-btn[disabled]{ opacity: 0.48; cursor: default; transform:none; box-shadow:none; }
    .option-btn.fullwidth { display:block; width:100%; box-sizing:border-box; }
    .swatch-btn { min-width:64px; height:44px; border-radius:10px; padding:0; }
    .tile-btn { min-width:60px; min-height:60px; padding:12px; font-size:20px; border-radius:8px; }
    .emoji-btn { min-width:60px; padding:10px; font-size:22px; border-radius:8px; }
    .question-card .meta { color: rgba(255,255,255,0.92); }
    .difficulty-badge { letter-spacing: 0.4px; }
    /* spark effect element */
    .bbb-spark {
      position: fixed;
      pointer-events: none;
      width: 18px; height: 18px;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0.6);
      opacity: 0;
      transition: transform 360ms cubic-bezier(.2,.9,.25,1), opacity 360ms linear;
      z-index: 20000;
      box-shadow: 0 10px 28px rgba(2,6,23,0.35);
      mix-blend-mode: screen;
    }
    .bbb-spark.show { opacity: 1; transform: translate(-50%, -50%) scale(1.6); }
  `;
  const style = document.createElement('style');
  style.id = 'bbb_option_styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/* small spark animation anchored to clicked element (el may be null) */
function triggerSpark(el, isCorrect) {
  try {
    const spark = document.createElement('div');
    spark.className = 'bbb-spark';
    // color by correctness
    spark.style.background = isCorrect ? 'linear-gradient(90deg,#7CFC9F,#2ECC71)' : 'linear-gradient(90deg,#ffd1d1,#ff6b6b)';
    document.body.appendChild(spark);
    // compute position (center of el or center of viewport fallback)
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const r = el.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    spark.style.left = `${Math.round(x)}px`;
    spark.style.top = `${Math.round(y)}px`;
    // show / animate
    requestAnimationFrame(() => spark.classList.add('show'));
    // remove after animation
    setTimeout(() => {
      spark.classList.remove('show');
      setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 260);
    }, 420);
  } catch (e) { /* fail silently if painting spark errors */ }
}

/* --- Helper to apply scoring (base + optional fast bonus) ---
   Signature: applyScoringFor(g, isCorrect, el)
   This version applies difficulty multiplier to positive (correct) points.
*/
function applyScoringFor(g, isCorrect, el) {
  const cfg = gameConfig[g.key] || { correct: 10, wrong: -5, fastWindow: 5000, fastBonus: 0 };
  const elapsed = g._qStart ? (Date.now() - g._qStart) : Infinity;
  let basePoints = 0;
  let fastApplied = false;

  if (isCorrect) {
    basePoints += cfg.correct;
    if (elapsed <= cfg.fastWindow && cfg.fastBonus) {
      basePoints += cfg.fastBonus;
      fastApplied = true;
    }
  } else {
    basePoints += cfg.wrong; // negative
  }

  // Difficulty multiplier (apply only to positive/correct portions)
  const diff = (g._currentDifficulty || (g._diffs && g._diffs[g.currentQuestion])) || 'beginner';
  const mult = difficultyMultipliers[diff] || 1;
  let pointsAdded = basePoints;
  if (isCorrect && mult && mult !== 1) {
    // compute the portion to scale: correct + possible fast bonus
    const correctPart = cfg.correct + (fastApplied ? (cfg.fastBonus || 0) : 0);
    const extra = Math.round(correctPart * (mult - 1));
    pointsAdded = basePoints + extra;
  }

  g.score += pointsAdded;
  if (gameScoreLine) gameScoreLine.textContent = `Score: ${g.score}`;
  updatePlayerScoreDisplay();

  // visual spark feedback
  try { triggerSpark(el, !!isCorrect); } catch(e){}

  // toasts include difficulty label for clarity
  const diffLabel = difficultyBadgeText(diff);
  if (isCorrect) {
    const baseText = `+${cfg.correct}`;
    const txt = (fastApplied ? `${baseText} (+${cfg.fastBonus} fast)` : baseText) + ` • ${diffLabel}`;
    showToast(txt, 'success', 1200);
  } else {
    showToast(`${pointsAdded} • ${diffLabel}`, 'error', 1200);
  }
}

/* --- Per-question renderers --- */

/* Logic question */
function renderLogicQuestion(g, q) {
  if (!q) {
    g.currentQuestion++;
    renderQuestion(g);
    return;
  }
  const container = document.createElement('div');
  container.innerHTML = `<div class="meta">${escapeHtml(q.question)}</div>`;
  const grid = document.createElement('div');
  grid.className = 'choice-grid';
  grid.style.marginTop = '10px';
  const opts = shuffle(q.options || []);
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.textContent = o;
    b.style.margin = '6px';
    b.addEventListener('click', () => {
      const correct = (o === q.answer);
      applyScoringFor(g, correct, b);
      g.answered = (g.answered || 0) + 1;
      Array.from(grid.children).forEach(btn => btn.disabled = true);
      setTimeout(() => { g.currentQuestion++; renderQuestion(g); }, 350);
    });
    grid.appendChild(b);
  });
  container.appendChild(grid);
  gameContent.appendChild(container);
}

/* Word question */
function renderWordQuestion(g, word) {
  const container = document.createElement('div');
  const scrambled = shuffle((word || '').split('')).join('');
  container.innerHTML = `<div class="meta">Unscramble: <strong>${escapeHtml(scrambled)}</strong></div>`;
  const inp = document.createElement('input'); inp.placeholder = 'Type answer'; inp.style.marginTop = '10px';
  const btn = document.createElement('button'); btn.textContent = 'Submit';
  btn.classList.add('option-btn', 'fullwidth');
  btn.style.marginTop = '8px';
  btn.addEventListener('click', () => {
    const ans = (inp.value || '').trim().toUpperCase();
    const correct = (ans === (word || '').toUpperCase());
    applyScoringFor(g, correct, btn);
    g.answered = (g.answered || 0) + 1;
    btn.disabled = true; inp.disabled = true;
    setTimeout(() => { g.currentQuestion++; renderQuestion(g); }, 350);
  });
  const wrapper = document.createElement('div'); wrapper.style.marginTop = '8px';
  wrapper.appendChild(inp); wrapper.appendChild(btn);
  container.appendChild(wrapper);
  gameContent.appendChild(container);
}

/* Memory question - upgraded UI */
function renderMemoryQuestion(g, seq) {
  if (!Array.isArray(seq) || seq.length === 0) {
    g.currentQuestion++;
    renderQuestion(g);
    return;
  }

  const container = document.createElement('div');
  container.innerHTML = `<div class="meta">Watch the flashing squares. Then choose how many flashes you saw.</div>`;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  // board: 3 columns x 2 rows (6 squares)
  const board = document.createElement('div');
  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(3, 72px)';
  board.style.gridTemplateRows = 'repeat(2, 72px)';
  board.style.gap = '10px';
  board.style.marginTop = '14px';
  board.style.justifyContent = 'center';

  const squares = [];
  for (let i = 0; i < 6; i++) {
    const sq = document.createElement('div');
    sq.style.width = '72px';
    sq.style.height = '72px';
    sq.style.borderRadius = '10px';
    sq.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    sq.style.boxShadow = 'inset 0 -6px 12px rgba(0,0,0,0.12)';
    sq.style.display = 'flex';
    sq.style.alignItems = 'center';
    sq.style.justifyContent = 'center';
    sq.style.fontSize = '20px';
    sq.style.color = 'rgba(255,255,255,0.9)';
    board.appendChild(sq);
    squares.push(sq);
  }
  container.appendChild(board);

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '10px';
  controls.style.marginTop = '12px';
  controls.style.alignItems = 'center';

  const replayBtn = document.createElement('button');
  replayBtn.className = 'option-btn';
  replayBtn.textContent = 'Replay';
  replayBtn.style.padding = '8px 12px';
  replayBtn.setAttribute('aria-label', 'Replay sequence');
  controls.appendChild(replayBtn);

  const hint = document.createElement('div');
  hint.className = 'meta';
  hint.style.opacity = '0.95';
  hint.style.fontSize = '13px';
  hint.textContent = 'Tap Replay to watch again before answering';
  controls.appendChild(hint);

  container.appendChild(controls);

  const answersWrap = document.createElement('div');
  answersWrap.style.display = 'flex';
  answersWrap.style.flexWrap = 'wrap';
  answersWrap.style.gap = '10px';
  answersWrap.style.justifyContent = 'center';
  answersWrap.style.marginTop = '14px';
  container.appendChild(answersWrap);

  gameContent.appendChild(container);

  // playback
  let playing = false;
  let seqTimeouts = [];

  function clearPlayback() {
    seqTimeouts.forEach(t => clearTimeout(t));
    seqTimeouts = [];
    playing = false;
    for (const s of squares) {
      s.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
      s.style.transform = '';
      s.style.transition = '';
    }
  }

  function flashSquare(index, when) {
    const t1 = setTimeout(() => {
      const s = squares[index];
      if (!s) return;
      s.style.transition = 'transform 160ms ease, background 160ms ease';
      s.style.background = 'linear-gradient(90deg, rgba(14,165,233,0.95), rgba(59,130,246,0.95))';
      s.style.transform = 'scale(1.06)';
    }, when);
    const t2 = setTimeout(() => {
      const s = squares[index];
      if (!s) return;
      s.style.transition = 'transform 160ms ease, background 160ms ease';
      s.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
      s.style.transform = '';
    }, when + 380);
    seqTimeouts.push(t1, t2);
  }

  function setAnswersEnabled(enable) {
    Array.from(answersWrap.children).forEach(btn => {
      btn.disabled = !enable;
      btn.style.opacity = enable ? '1' : '0.72';
    });
    if (enable) {
      // start question timer for fast-bonus now that answers are available
      g._qStart = Date.now();
    }
  }

  function playSequence() {
    setAnswersEnabled(false);
    clearPlayback();
    playing = true;
    let time = 280;
    for (let i = 0; i < seq.length; i++) {
      const pos = seq[i];
      flashSquare(pos, time);
      time += 520;
    }
    const endTimer = setTimeout(() => {
      playing = false;
      setAnswersEnabled(true);
    }, time + 120);
    seqTimeouts.push(endTimer);
  }

  function buildAnswerChoices() {
    answersWrap.innerHTML = '';
    const correctCount = seq.length;
    const pool = new Set([correctCount]);
    const maxOptions = 6;
    let delta = 1;
    while (pool.size < maxOptions) {
      const plus = correctCount + delta;
      const minus = correctCount - delta;
      if (plus <= 9) pool.add(plus);
      if (minus >= 1) pool.add(minus);
      delta++;
      if (delta > 9) break;
    }
    while (pool.size < maxOptions) {
      pool.add(Math.floor(Math.random() * 9) + 1);
    }
    let choices = Array.from(pool);
    choices = shuffle(choices);

    choices.forEach(n => {
      const b = document.createElement('button');
      b.className = 'option-btn tile-btn';
      b.textContent = String(n);
      b.style.fontSize = '18px';
      b.style.padding = '12px 16px';
      b.style.minWidth = '56px';
      b.style.textAlign = 'center';
      b.disabled = true;
      b.addEventListener('click', () => {
        if (b.disabled) return;
        const correct = (n === correctCount);
        applyScoringFor(g, correct, b);
        g.answered = (g.answered || 0) + 1;
        setAnswersEnabled(false);
        b.style.transform = 'scale(1.05)';
        setTimeout(() => { b.style.transform = ''; }, 260);
        setTimeout(() => {
          g.currentQuestion++;
          renderQuestion(g);
        }, 420);
      });
      answersWrap.appendChild(b);
    });
  }

  replayBtn.addEventListener('click', () => {
    if (playing) return;
    playSequence();
  });

  buildAnswerChoices();
  setTimeout(() => playSequence(), 360);

  // cleanup on leaving question (defensive)
  container._clearPlayback = clearPlayback;
}

/* Reflex question (swatches) */
function renderReflexQuestion(g, color) {
  const container = document.createElement('div');

  let choices = shuffle(reflexColors).slice(0, 6);

  let target = color;
  if (color) {
    if (!choices.includes(color)) {
      const replaceIndex = Math.floor(Math.random() * choices.length);
      choices[replaceIndex] = color;
      choices = shuffle(choices);
    }
  } else {
    target = choices[Math.floor(Math.random() * choices.length)];
  }

  const targetHex = colorNameToHex(target) || '#000';
  const targetLabelHTML = `<span style="display:inline-flex;align-items:center;gap:8px">
    <span style="width:12px;height:12px;border-radius:50%;background:${targetHex};box-shadow:0 2px 6px rgba(0,0,0,0.35);display:inline-block"></span>
    <span>${escapeHtml(target)}</span>
  </span>`;

  container.innerHTML = `<div class="meta">Tap <strong>${targetLabelHTML}</strong> as fast as you can.</div>`;

  const wrap = document.createElement('div');
  wrap.style.marginTop = '10px';
  wrap.style.display = 'flex';
  wrap.style.flexWrap = 'wrap';
  wrap.style.gap = '8px';

  choices.forEach(c => {
    const b = document.createElement('button');
    b.classList.add('option-btn', 'swatch-btn');
    const hex = colorNameToHex(c) || '#999';
    b.setAttribute('aria-label', c);
    b.style.background = hex;
    b.style.color = readableTextColor(hex);
    b.style.boxShadow = '0 8px 20px rgba(2,6,23,0.35)';
    b.style.fontWeight = '700';
    b.style.fontSize = '13px';
    b.textContent = '';

    b.addEventListener('click', () => {
      const correct = (c === target);
      applyScoringFor(g, correct, b);
      g.answered = (g.answered || 0) + 1;
      Array.from(wrap.children).forEach(btn => btn.disabled = true);
      setTimeout(() => { g.currentQuestion++; renderQuestion(g); }, 250);
    });
    wrap.appendChild(b);
  });
  container.appendChild(wrap);
  gameContent.appendChild(container);
}

/* Quiz question */
function renderQuizQuestion(g, q) {
  const container = document.createElement('div');
  container.innerHTML = `<div class="meta">${escapeHtml(q.q)}</div>`;
  const wrap = document.createElement('div'); wrap.style.marginTop = '10px';
  q.opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.textContent = o;
    b.classList.add('option-btn', 'fullwidth');
    b.style.marginTop = '8px';
    b.addEventListener('click', () => {
      const correct = (i === q.a);
      applyScoringFor(g, correct, b);
      g.answered = (g.answered || 0) + 1;
      Array.from(wrap.children).forEach(btn => btn.disabled = true);
      setTimeout(() => { g.currentQuestion++; renderQuestion(g); }, 350);
    });
    wrap.appendChild(b);
  });
  container.appendChild(wrap);
  gameContent.appendChild(container);
}

/* Focus question (match a pair) */
function renderFocusQuestion(g, set) {
  const container = document.createElement('div');
  const laid = shuffle((set || ['A','A','B','B','C','C']).slice());
  container.innerHTML = `<div class="meta">Find a matching pair by clicking two tiles.</div>`;
  const board = document.createElement('div');
  board.style.display = 'grid'; board.style.gridTemplateColumns = 'repeat(3,1fr)'; board.style.gap = '8px'; board.style.marginTop = '10px';
  let first = null;
  let lock = false;
  for (let i = 0; i < laid.length; i++) {
    const tile = document.createElement('button');
    tile.classList.add('option-btn', 'tile-btn');
    tile.textContent = '?';
    tile.style.padding = '12px';
    tile.dataset.val = laid[i];
    tile.addEventListener('click', () => {
      if (lock || tile.disabled) return;
      tile.textContent = tile.dataset.val;
      tile.disabled = true;
      if (!first) {
        first = tile;
      } else {
        lock = true;
        if (first.dataset.val === tile.dataset.val) {
          applyScoringFor(g, true, tile);
          g.answered = (g.answered || 0) + 1;
          setTimeout(() => {
            first = null; lock = false;
            g.currentQuestion++; renderQuestion(g);
          }, 400);
        } else {
          applyScoringFor(g, false, tile);
          g.answered = (g.answered || 0) + 1;
          setTimeout(() => {
            first.textContent = '?'; tile.textContent = '?';
            first.disabled = false; tile.disabled = false;
            first = null; lock = false;
            g.currentQuestion++; renderQuestion(g);
          }, 700);
        }
      }
    });
    board.appendChild(tile);
  }
  container.appendChild(board);
  gameContent.appendChild(container);
}

// Pattern question
function renderPatternQuestion(g) {
  const q = g._pool[g.currentQuestion];
  if (!q) { g.currentQuestion++; renderQuestion(g); return; }
  gameContent.innerHTML = `<div class="meta">${escapeHtml(q.question)}</div>`;
  const wrap = document.createElement('div'); wrap.style.marginTop='10px';
  const opts = shuffle(q.options || []);
  opts.forEach(o=>{
    const b = document.createElement('button');
    b.classList.add('option-btn');
    b.textContent = o;
    b.style.margin = '6px';
    b.addEventListener('click', ()=>{
      const correct = (o.toString() === q.answer.toString());
      applyScoringFor(g, correct, b);
      g.answered = (g.answered||0)+1;
      Array.from(wrap.children).forEach(btn=>btn.disabled=true);
      setTimeout(()=>{ g.currentQuestion++; renderQuestion(g); }, 350);
    });
    wrap.appendChild(b);
  });
  gameContent.appendChild(wrap);
}

// Math question
function renderMathQuestion(g) {
  const q = g._pool[g.currentQuestion];
  if (!q) { g.currentQuestion++; renderQuestion(g); return; }
  gameContent.innerHTML = `<div class="meta">Solve: <strong>${escapeHtml(q.expr)}</strong></div>`;
  const inp = document.createElement('input'); inp.type='number'; inp.style.marginTop='10px'; inp.placeholder='Answer';
  const btn = document.createElement('button'); btn.textContent='Submit';
  btn.classList.add('option-btn');
  btn.style.marginLeft='8px';
  btn.addEventListener('click', ()=>{
    const val = parseInt(inp.value,10);
    const correct = (val === q.answer);
    applyScoringFor(g, correct, btn);
    g.answered = (g.answered||0)+1;
    btn.disabled=true; inp.disabled=true;
    setTimeout(()=>{ g.currentQuestion++; renderQuestion(g); }, 350);
  });
  const wrapper = document.createElement('div'); wrapper.style.marginTop='8px';
  wrapper.appendChild(inp); wrapper.appendChild(btn);
  gameContent.appendChild(wrapper);
}

// Visual question
function renderVisualQuestion(g) {
  const symbol = g._pool[g.currentQuestion] || visualSymbols[Math.floor(Math.random()*visualSymbols.length)];
  let other = shuffle(visualSymbols).find(s=>s!==symbol) || symbol;
  const oddIndex = Math.floor(Math.random()*9);
  gameContent.innerHTML = `<div class="meta">Tap the tile that is different.</div>`;
  const board = document.createElement('div');
  board.style.display='grid'; board.style.gridTemplateColumns='repeat(3,60px)'; board.style.gap='8px'; board.style.marginTop='10px';
  for(let i=0;i<9;i++){
    const btn = document.createElement('button');
    btn.classList.add('option-btn', 'tile-btn');
    btn.textContent = (i===oddIndex) ? other : symbol;
    btn.style.width='60px'; btn.style.height='60px'; btn.style.fontSize='22px'; btn.style.borderRadius='8px';
    btn.addEventListener('click', () => {
      const correct = (i===oddIndex);
      applyScoringFor(g, correct, btn);
      g.answered = (g.answered||0)+1;
      Array.from(board.children).forEach(x=>x.disabled=true);
      setTimeout(()=>{ g.currentQuestion++; renderQuestion(g); }, 400);
    });
    board.appendChild(btn);
  }
  gameContent.appendChild(board);
}

// Emoji Hunt
function renderEmojiQuestion(g) {
  const targetEmoji = g._pool[g.currentQuestion] || emojiPool[Math.floor(Math.random()*emojiPool.length)];
  let choices = sampleArray(emojiPool.filter(e=>e!==targetEmoji), 5);
  choices.push(targetEmoji);
  choices = shuffle(choices);
  gameContent.innerHTML = `<div class="meta">Find: <strong>${escapeHtml(targetEmoji)}</strong></div>`;
  const wrap = document.createElement('div'); wrap.style.marginTop='10px'; wrap.style.display='flex'; wrap.style.flexWrap='wrap'; wrap.style.gap='8px';
  choices.forEach(c=>{
    const b = document.createElement('button');
    b.classList.add('option-btn', 'emoji-btn');
    b.textContent = c; b.style.fontSize='22px'; b.style.padding='10px'; b.style.minWidth='60px'; b.style.borderRadius='8px';
    b.addEventListener('click', ()=>{
      const correct = (c === targetEmoji);
      applyScoringFor(g, correct, b);
      g.answered = (g.answered||0)+1;
      Array.from(wrap.children).forEach(x=>x.disabled=true);
      setTimeout(()=>{ g.currentQuestion++; renderQuestion(g); }, 350);
    });
    wrap.appendChild(b);
  });
  gameContent.appendChild(wrap);
}

/* --- Utilities --- */
function formatSeconds(s) { const mm = Math.floor(s / 60); const ss = s % 60; return `${mm}:${ss.toString().padStart(2, '0')}`; }
function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5); }
function escapeHtml(s) { if (typeof s !== 'string') return s; return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* Submit: store week summary locally and offer JSON download
   Updated to avoid CORS preflight in browsers:
   - secret embedded in the POST body
   - use a "simple" content type (text/plain) from the browser to avoid triggering OPTIONS preflight
   - server (Apps Script) must validate secret from body
*/
function submitFinalScore() {
  const payload = { player: state.player, week: state.currentWeek, total: state.weekScore, games: state.games.map(g => ({ id: g.id, name: g.name, score: g.score })) };
  // local store as before
  try { localStorage.setItem(`bbb_${state.player.name}_week${state.currentWeek}`, JSON.stringify(payload)); } catch (e) {}
  showToast(`Submitting... Week ${state.currentWeek}`, 'info', 900);

  // --- CONFIG: set these before using ---
  // Make sure WEB_APP_URL matches the URL shown in your Apps Script deployment dialog.
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby-Xed7U3ze-qzmjAe1mm3K_Owofwz1_0FKvW4sBSoYBDtYdTD1ZrplTq2yV_j7Imz-/exec';
  const CLIENT_TOKEN = 'bb_2025_SECRET_9f4c8e2d'; // <-- must match SECRET in Apps Script (put secret in body, not headers)

  // build payload with embedded secret (no custom headers)
  const payloadWithSecret = Object.assign({}, payload, { secret: CLIENT_TOKEN });

  // Try POSTing to organizer sheet endpoint using a "simple" content-type to avoid preflight
  (async () => {
    let posted = false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const resp = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8' // simple content-type -> avoids preflight OPTIONS
        },
        body: JSON.stringify(payloadWithSecret),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (resp && resp.ok) {
        let j = {};
        try { j = await resp.json(); } catch(e){ /* ignore parse */ }
        if (j && j.ok) {
          posted = true;
          showToast('Score submitted to organizer ✅', 'success', 1600);
        } else {
          // Received non-ok response body
          showToast('Organizer submission failed (server) — saved locally', 'error', 2200);
          console.warn('Sheet submit server response:', j);
        }
      } else {
        showToast('Organizer submission failed (network) — saved locally', 'error', 2200);
        console.warn('Sheet submit HTTP error', resp && resp.status);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('Organizer submission timed out — saved locally', 'error', 2200);
      } else {
        showToast('Organizer submission error — saved locally', 'error', 2200);
      }
      console.warn('submitFinalScore POST error', err);
    } finally {

      // Always create the JSON download regardless of remote result so user has a local copy
      // try {
      //   const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      //   const url = URL.createObjectURL(blob);
      //   const a = document.createElement('a'); a.href = url; a.download = `bbb_${state.player.name}_week${state.currentWeek}.json`;
      //   a.click();
      //   setTimeout(() => URL.revokeObjectURL(url), 2000);
      // } catch (e) { /* ignore */ }

      // update UI: hide games, show welcome with message
      if (gamesCard) gamesCard.style.display = 'none';
      if (welcomeCard) welcomeCard.style.display = 'block';
      if (welcomeText) welcomeText.innerHTML = `<strong>Thanks, ${escapeHtml(state.player.name)}!</strong><div class=meta style='margin-top:6px'>Your Week ${state.currentWeek} score has been submitted.${posted? ' (Organizer updated)':''}</div>`;
    }
  })();
}

function updatePlayerScoreDisplay(){
  if(!playerScoreEl) return;
  state.weekScore = state.games.reduce((s, gg) => s + (gg.score || 0), 0);
  playerScoreEl.textContent = state.weekScore;
}

function colorNameToHex(name){
  if (!name) return null;
  const map = {
    red:    '#ef4444',
    blue:   '#2D6CB5',
    green:  '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    orange: '#F97316',
    cyan:   '#06B6D4',
    magenta:'#DE5C8E',
    brown:  '#A16207'
  };
  return map[name.toLowerCase()] || name;
}

function readableTextColor(hex) {
  if (!hex) return '#fff';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
  const r = parseInt(c.substring(0,2), 16) / 255;
  const g = parseInt(c.substring(2,4), 16) / 255;
  const b = parseInt(c.substring(4,6), 16) / 255;
  const srgb = v => (v <= 0.03928) ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  const L = 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  return L > 0.5 ? '#042028' : '#ffffff';
}

/* Home + Back-to-top wiring */
(function wireHomeAndBackTop(){
  const homeBtn = document.getElementById('homeBtn');
  const backTopBtn = document.getElementById('backTopBtn');

  if (homeBtn) {
    homeBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (welcomeCard) welcomeCard.style.display = 'block';
      if (gamesCard) gamesCard.style.display = 'none';
      if (gameArea) gameArea.style.display = 'none';
      if (modal) modal.style.display = 'none';
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0,0); }
    });
  }

  if (backTopBtn) {
    const showAt = 200;
    function checkScroll() {
      if (window.scrollY > showAt) backTopBtn.style.display = 'flex';
      else backTopBtn.style.display = 'none';
    }
    checkScroll();
    window.addEventListener('scroll', () => {
      if (window.requestAnimationFrame) {
        requestAnimationFrame(checkScroll);
      } else {
        checkScroll();
      }
    }, { passive: true });

    backTopBtn.addEventListener('click', () => {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0,0); }
    });
  }
})();

/* Boot */
(function boot() {
  ensureFloatingUI();
  injectOptionStyles();

  try {
    setPlayButtonVisible(false);
    openModal();
  } catch (e) {/*noop */}

  try {
    const params = new URLSearchParams(location.search);
    const w = parseInt(params.get('week'), 10);
    if (w === 2) state.currentWeek = 2;
  } catch (e) { /* noop */ }

  updatePlayerScoreDisplay();

})();
