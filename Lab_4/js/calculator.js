// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.


function priority(operator) {
  if (operator == '+' || operator == '-') {
      return 1;
  } else {
      return 2;
  }
}

// Проверка, является ли строка str числом.

function isNumeric(str) {
  return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.

function isDigit(str) {
  return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.

function isOperation(str) {
  return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает строку str и разбивает на токены(числа, скобки, операторы)
//затем возвращает массив токенов

function tokenize(str) {
  let tokens = [];//берем пустой массив для токенов
  let lastNumber = '';//хранит последнее число в строке
  for (char of str) {//обход каждого символа в строке
      if (isDigit(char) || char == '.') {//если является цифрой или точкой
          lastNumber += char;//добавляем к переменной
      } 
      else {
          if (lastNumber.length > 0) {//если lastNumber содержит хотя бы один символ
              tokens.push(lastNumber);//этот символ добавляется в токены
              lastNumber = '';//массив становится пустым
          }
      } 
      if (isOperation(char) || char == '(' || char == ')') {//если значение явл оператором 
        //или скобкой
          tokens.push(char);
      } 
  }
  if (lastNumber.length > 0) {//если lastNumber не пуст, то содержимое отправляется в массив токенов
      tokens.push(lastNumber);
  }
  return tokens;
}

// Функция compile принимает строку
// с арифметическим выражением и преобразует это выражение в обратную польскую нотацию.
// Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. 

// **Обратная польская нотация (или запись) - способ представления математических выражений, 
// где каждый операнд предшествует двум операторам. 
// Например, можно записать следующий код 2 5 3 + * 
// вместо обычного математического выражения со скобками: (5 + 3) * 2. 

function compile(str) {
  let out = [];//массив для хранения результата
  let stack = [];
  for (token of tokenize(str)) {
      if (isNumeric(token)) {//если токен-число, он отправляется в массив результата
          out.push(token);
      } else if (isOperation(token)) {//если токен оператор, то
          while (stack.length > 0 && //пока длина стека>0 и пока не встретится оператор
                 isOperation(stack[stack.length - 1]) && //с большим или раным приоритетом
                 priority(stack[stack.length - 1]) >= priority(token)) {
              out.push(stack.pop());//чем у текущего, из стека извлекаются элементы и 
              //добавляются в массив результата
          }
          stack.push(token);//текущий оператор добавляется в стек
      } else if (token == '(') {
          stack.push(token);
      } else if (token == ')') {
        //стек обрабатывается до тех пор, 
        //пока не будет найдена соответствующая открывающаяся скобка
          while (stack.length > 0 && stack[stack.length - 1] != '(') {
              out.push(stack.pop());
          }
          stack.pop();
      }
  }
  while (stack.length > 0) {
      out.push(stack.pop());
  }
  return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).


function evaluate(expression) {
  const stack = [];

  // Разбиваем строку на токены (числа и операторы) и обрабатываем их
  const tokens = expression.split(' ');

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      //Если результат parseFloat не является NaN (что означает “не число”),
      // число добавляется в стек.
      stack.push(parseFloat(token));
    } else {
      // Если текущий токен - оператор, извлекаем два числа из стека и применяем оператор
      const operand2 = stack.pop();
      const operand1 = stack.pop();

      switch (token) {
        case '+':
          stack.push(operand1 + operand2);
          break;
        case '-':
          stack.push(operand1 - operand2);
          break;
        case '*':
          stack.push(operand1 * operand2);
          break;
        case '/':
          stack.push(operand1 / operand2);
          break;
        default:
          throw new Error('Недопустимый оператор: ' + token);
      }
    }
  }

      // В конце оценки выражения стек должен содержать только одну величину - результат
  if (stack.length !== 1) {
    throw new Error('Недопустимое выражение');
  }

  return stack[0];
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operator и parenthesis
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// механизм делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.


function clickHandler(event) {
const buttonText = event.target.innerText;
const screen = document.querySelector('.display span');
const currentExpression = screen.innerText;

if (buttonText === '=') {
  // Replace consecutive operators with a single operator
  const sanitizedExpression = currentExpression.replace(/[-+*/]{2,}/g, m => m[0]);

  const rpnExpression = compile(sanitizedExpression);
  const result = evaluate(rpnExpression);

  // Check if the result is a non-integer number
  const formattedResult = Number.isInteger(result) ? result : result.toFixed(2);

  screen.innerText = formattedResult;
} else if (buttonText === 'C') {
  screen.innerText = '';
} else {
  // Allow negative numbers and handle leading zeros
  if (
    (buttonText === '-' && currentExpression === '') ||
    (!currentExpression.endsWith('-') &&
     !currentExpression.endsWith('+') &&
     !currentExpression.endsWith('*') &&
     !currentExpression.endsWith('/') &&
     !currentExpression.includes('-') &&
     !currentExpression.includes('+') &&
     !currentExpression.includes('*') &&
     !currentExpression.includes('/'))
  ) {
    screen.innerText += buttonText;
  } else if (/[0-9.]/.test(buttonText)) {
    screen.innerText += buttonText;
  }
}
}





// Назначьте нужные обработчики событий.
//Механизм обработки событий в JavaScript построен на основе модели "событие-обработчик".
// Когда происходит событие (например, клик на элементе), 
//браузер создает объект события и вызывает соответствующий обработчик, 
//который был назначен для данного события.

//Обработчик события можно назначить не только напрямую на элемент, 
//но и на его родительский элемент. Это называется делегированием событий. 
//При этом обработчик будет вызван для всех потомков родительского элемента, 
//которые соответствуют заданному селектору.

window.onload = function () {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', clickHandler);
  });
};