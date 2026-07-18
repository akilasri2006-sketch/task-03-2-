(function(){
  // ---------- Constants ----------
  const WIN_PATTERNS = [
    [0,1,2], [3,4,5], [6,7,8],   // rows
    [0,3,6], [1,4,7], [2,5,8],   // cols
    [0,4,8], [2,4,6]             // diagonals
  ];

  const LINE_COORDS = {
    '0,1,2': [10,50,290,50],
    '3,4,5': [10,150,290,150],
    '6,7,8': [10,250,290,250],
    '0,3,6': [50,10,50,290],
    '1,4,7': [150,10,150,290],
    '2,5,8': [250,10,250,290],
    '0,4,8': [20,20,280,280],
    '2,4,6': [280,20,20,280]
  };

  const ICON_X = '<svg viewBox="0 0 40 40" class="mark-x"><path d="M8 8 L32 32 M32 8 L8 32" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';
  const ICON_O = '<svg viewBox="0 0 40 40" class="mark-o"><circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" stroke-width="5"/></svg>';

  // ---------- State ----------
  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let mode = 'pvp'; // 'pvp' | 'cpu'
  let scores = { X: 0, O: 0, draw: 0 };

  // ---------- Elements ----------
  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const turnText = document.getElementById('turnText');
  const turnDot = document.querySelector('.turn-dot');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDrawEl = document.getElementById('scoreDraw');
  const scoreCellX = document.getElementById('scoreCellX');
  const scoreCellO = document.getElementById('scoreCellO');
  const labelO = document.getElementById('labelO');
  const modePvpBtn = document.getElementById('modePvp');
  const modeCpuBtn = document.getElementById('modeCpu');
  const newRoundBtn = document.getElementById('newRoundBtn');
  const resetAllBtn = document.getElementById('resetAllBtn');
  const winLine = document.getElementById('winLine');
  const winLineEl = document.getElementById('winLineEl');
  const toast = document.getElementById('toast');

  // ---------- Rendering ----------
  function renderCell(i){
    const cell = cells[i];
    if(board[i] === 'X'){
      cell.innerHTML = ICON_X;
      cell.style.color = 'var(--x-color)';
    } else if(board[i] === 'O'){
      cell.innerHTML = ICON_O;
      cell.style.color = 'var(--o-color)';
    } else {
      cell.innerHTML = '';
    }
  }

  function updateTurnUI(){
    turnText.textContent = gameActive ? currentPlayer + "'s turn" : turnText.textContent;
    turnDot.style.background = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    turnDot.style.boxShadow = currentPlayer === 'X'
      ? '0 0 10px var(--x-glow)'
      : '0 0 10px var(--o-glow)';
    scoreCellX.classList.toggle('active-turn', gameActive && currentPlayer === 'X');
    scoreCellO.classList.toggle('active-turn', gameActive && currentPlayer === 'O');
  }

  function updateScoreUI(){
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDrawEl.textContent = scores.draw;
  }

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function drawWinLine(pattern){
    const key = pattern.join(',');
    const coords = LINE_COORDS[key];
    if(!coords) return;
    winLineEl.setAttribute('x1', coords[0]);
    winLineEl.setAttribute('y1', coords[1]);
    winLineEl.setAttribute('x2', coords[2]);
    winLineEl.setAttribute('y2', coords[3]);
    winLine.classList.add('show');
  }

  function clearWinLine(){
    winLine.classList.remove('show');
  }

  // ---------- Game logic ----------
  function checkWinner(b){
    for(const pattern of WIN_PATTERNS){
      const [a, c, d] = pattern;
      if(b[a] && b[a] === b[c] && b[a] === b[d]){
        return { winner: b[a], pattern };
      }
    }
    if(b.every(v => v !== null)) return { winner: 'draw', pattern: null };
    return null;
  }

  function endGame(result){
    gameActive = false;
    if(result.winner === 'draw'){
      scores.draw++;
      turnText.textContent = "It's a draw";
      showToast("🤝 It's a draw");
    } else {
      scores[result.winner]++;
      turnText.textContent = result.winner + ' wins!';
      result.pattern.forEach(i => cells[i].classList.add('win-cell'));
      drawWinLine(result.pattern);
      showToast((mode === 'cpu' && result.winner === 'O' ? '🤖 ' : '🏆 ') + result.winner + ' wins the round!');
    }
    updateScoreUI();
    cells.forEach(c => c.disabled = true);
  }

  function placeMark(index, player){
    board[index] = player;
    renderCell(index);
  }

  function handleCellClick(e){
    const index = Number(e.currentTarget.dataset.index);
    if(!gameActive || board[index] !== null) return;
    if(mode === 'cpu' && currentPlayer !== 'X') return; // block clicks during CPU turn

    placeMark(index, currentPlayer);
    const result = checkWinner(board);
    if(result){ endGame(result); return; }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnUI();

    if(mode === 'cpu' && currentPlayer === 'O' && gameActive){
      cells.forEach(c => c.disabled = true);
      setTimeout(cpuMove, 480);
    }
  }

  // ---------- Unbeatable CPU (minimax) ----------
  function cpuMove(){
    const bestIndex = findBestMove(board);
    if(bestIndex === -1) return;
    placeMark(bestIndex, 'O');
    const result = checkWinner(board);
    if(result){ endGame(result); return; }
    currentPlayer = 'X';
    updateTurnUI();
    cells.forEach((c, i) => { if(board[i] === null) c.disabled = false; });
  }

  function findBestMove(b){
    let bestScore = -Infinity;
    let move = -1;
    for(let i = 0; i < 9; i++){
      if(b[i] === null){
        b[i] = 'O';
        const score = minimax(b, 0, false);
        b[i] = null;
        if(score > bestScore){
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(b, depth, isMaximizing){
    const result = checkWinner(b);
    if(result){
      if(result.winner === 'O') return 10 - depth;
      if(result.winner === 'X') return depth - 10;
      return 0;
    }

    if(isMaximizing){
      let best = -Infinity;
      for(let i = 0; i < 9; i++){
        if(b[i] === null){
          b[i] = 'O';
          best = Math.max(best, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for(let i = 0; i < 9; i++){
        if(b[i] === null){
          b[i] = 'X';
          best = Math.min(best, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return best;
    }
  }

  // ---------- Round / Match control ----------
  function newRound(){
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    clearWinLine();
    cells.forEach(c => {
      c.disabled = false;
      c.classList.remove('win-cell');
      c.innerHTML = '';
    });
    updateTurnUI();
  }

  function resetMatch(){
    scores = { X: 0, O: 0, draw: 0 };
    updateScoreUI();
    newRound();
    showToast('Match reset');
  }

  function setMode(newMode){
    mode = newMode;
    modePvpBtn.classList.toggle('active', mode === 'pvp');
    modeCpuBtn.classList.toggle('active', mode === 'cpu');
    modePvpBtn.setAttribute('aria-selected', mode === 'pvp');
    modeCpuBtn.setAttribute('aria-selected', mode === 'cpu');
    labelO.textContent = mode === 'cpu' ? 'Computer' : 'Player O';
    resetMatch();
  }

  // ---------- Wire up ----------
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  newRoundBtn.addEventListener('click', newRound);
  resetAllBtn.addEventListener('click', resetMatch);
  modePvpBtn.addEventListener('click', () => setMode('pvp'));
  modeCpuBtn.addEventListener('click', () => setMode('cpu'));

  updateTurnUI();
  updateScoreUI();
})();
      
