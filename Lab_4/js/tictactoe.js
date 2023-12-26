var board = ['', '', '', '', '', '', '', '', '']; 
var currentPlayer = 'X'; 
 
// Это функция, которая проверяет, есть ли победитель в игре крестики-нолики. 
// Она перебирает все возможные комбинации клеток на доске (3х3), и если оказывается, 
// что в одной из них все клетки заполнены символами одного игрока (либо крестиками, либо ноликами), 
// она возвращает true. 
//Если после полного прохода по доске не было обнаружено ни одного победителя,
// функция проверяет, все ли клетки на доске пусты. Если это так, значит игра закончилась вничью, 
// и функция возвращает false.
function checkWinner() { 
  for (var i = 0; i < 3; i++) { 
    if (board[i*3] === currentPlayer && board[i*3+1] === currentPlayer && board[i*3+2] === currentPlayer || 
        board[i] === currentPlayer && board[i+3] === currentPlayer && board[i+6] === currentPlayer || 
        board[0] === currentPlayer && board[4] === currentPlayer && board[8] === currentPlayer /*гл диаг*/ || 
        board[2] === currentPlayer && board[4] === currentPlayer && board[6] === currentPlayer)/*побочная диаг*/ { 
      return true; 
    } 
  } 
  if (board.every(function(cell) { return cell !== ''; })) {
    alert('Ничья!'); 
    board = ['', '', '', '', '', '', '', '', '']; 
    renderBoard(); 
  }
  return false; 
} 
 

//обрабатывает клик пользователя по ячейке игрового поля. 
//Она проверяет, пуста ли ячейка (если да, то она становится занятой символом текущего игрока). 
//Затем вызывается renderBoard для обновления игрового поля, после чего проверяет, 
//не победил ли кто-нибудь (вызывает checkWinner). Если да, выводится соответствующее сообщение, 
//поле очищается и снова перерисовывается. 
//Если же ячейка была занята, выводится сообщение об ошибке. В конце функции происходит смена текущего игрока.
function makeMove(index) { 
  if (board[index] === '') { 
    board[index] = currentPlayer; 
    renderBoard(); 
    if (checkWinner()) { 
      alert('Игрок ' + currentPlayer + ' выиграл!'); 
      board = ['', '', '', '', '', '', '', '', '']; 
      renderBoard(); 
    } else { 
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 
    } 
  } else { 
    alert('Эта клетка занята. Выберите другую.'); 
  } 
} 
//\ отвечает за визуализацию игрового поля на экране. 
//Она получает элемент #board с помощью document.getElementById, 
//а затем проходит по каждому индексу массива board. 
//Для каждой ячейки создается новый div-элемент с классом .cell, 
//которому присваивается содержимое ячейки и добавляется обработчик события клика, 
//который вызывает функцию makeMove с аргументом i (индекс ячейки). 
//В конце функции boardElement.appendChild используется для добавления созданных элементов 
//в нужное место на странице.
function renderBoard() { 
  var boardElement = document.getElementById('board'); 
  boardElement.innerHTML = ''; 
  for (var i = 0; i < 9; i++) { 
    var cell = document.createElement('div'); 
    cell.className = 'cell'; 
    cell.textContent = board[i]; 
    cell.addEventListener('click', makeMove.bind(null, i)); 
    boardElement.appendChild(cell); 
  } 
} 
 
renderBoard();