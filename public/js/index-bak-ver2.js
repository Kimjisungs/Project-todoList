const $inputTodo = document.querySelector('#inputTodo');
const $saveTodo = document.querySelector('#saveTodo');
const $todos = document.querySelector('#todos');
const $memoEditor = document.querySelector('#memoEditor');
const $createMemo = document.querySelector('#createMemo');
const $memoBox = document.querySelector('#memoBox');
const $memoTextArea = document.querySelector('#memoTextArea');

let todos = [];


const renderTodos = () => {
  todos.sort((a, b) => b.id - a.id);

  let html = '';
  todos.forEach(({ id, content, completed, date }) => {
    html += `
    <li id="${id}">
      <div class="row todos-inner">
        <div class="col-12 col-md-12 col-lg-8 custom-control custom-checkbox chk-type">
          <input type="checkbox" class="custom-control-input" id="inputCheck-${id}" ${completed ? 'checked' : ''}>
          <label class="custom-control-label" for="inputCheck-${id}">${content}</label>
        </div>
        <div class="col-6 col-md-8 col-lg-2 text-right">
          <span id="dateTodo" class="date">${date}</span>
        </div>
        <div class="col-6 col-md-4 col-lg-2 text-right">
          <button type="button" class="btn btn-outline-secondary modifyTodo"><i class="fas fa-pencil-alt"></i></button>
          <button type="button" class="btn btn-outline-secondary"><i class="far fa-clock"></i></button>
          <button type="button" class="btn btn-outline-secondary removeTodo">X</button>
        </div>
      </div>
    </li>
  `;
  });
  $todos.innerHTML = html;
};

const maxId = (list) => (list.length ? Math.max(...list.map(todo => todo.id)) + 1 : 1);

const thisId = (target) => +target.parentNode.parentNode.parentNode.id;

const createModify = (target) => {
  if (!target.classList.contains('modifyTodo')) return;
  console.log(target);
  const $createInput = document.createElement('input');
  const todoNode = target.parentNode.previousElementSibling.previousElementSibling;

  todos.forEach(({ id, content }) => {
    if (id === thisId(target)) {
      $createInput.setAttribute('type', 'text');
      $createInput.setAttribute('class', 'label-modify');
      $createInput.setAttribute('value', content);
    }
  });
  // todoNode.removeChild(todoNode.children[1]);
  todoNode.appendChild($createInput);
};

const writeModify = async (target, keyCode) => {
  if (!target.classList.contains('label-modify')) return;
  const content = target.value;
  await axios.patch(`http://localhost:9000/todos/${thisId(target)}`, { content });
  if (keyCode === 13) {
    target.parentNode.removeChild(target);
    getTodo();
  }
};

$todos.addEventListener('keyup', ({ target, keyCode }) => {
  writeModify(target, keyCode);
});

const dateTodo = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const getTodo = async () => {
  const response = await axios.get('http://localhost:9000/todos');
  todos = response.data;
  renderTodos();
};

const postTodo = async (target, keyCode) => {
  const content = target.value.trim();
  if (keyCode !== 13 || content === '' || !target.classList.contains('form-control')) return;
  target.value = '';
  await axios.post('http://localhost:9000/todos', { id: maxId(todos), content, completed: false, date: dateTodo() });
  getTodo();
};

const patchTodo = async ($id, checked) => {
  await axios.patch(`http://localhost:9000/todos/${$id}`, { completed: checked });
};

const deleteTodo = async (target) => {
  if (!target.classList.contains('removeTodo')) return;
  await axios.delete(`http://localhost:9000/todos/${thisId(target)}`);
  getTodo();
};

window.addEventListener('load', () => {
  getTodo();
});

$inputTodo.addEventListener('keyup', ({ target, keyCode }) => {
  postTodo(target, keyCode);
});

$todos.addEventListener('change', ({ target }) => {
  if (!target.classList.contains('custom-control-input')) return;
  const $id = +target.parentNode.parentNode.parentNode.id;
  const { checked } = target;
  patchTodo($id, checked);
  getTodo();
});

$todos.addEventListener('click', ({ target }) => {
  deleteTodo(target);
  createModify(target);
});

let $textArea = [];
let memo = [];


const addEditor = () => {
  let html = '';
  html += `
   <div class="memo-box">
      <div class="row">
        <div class="col-8 col-md-10 col-lg-8">
          <div id="memoFontWeight" class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              font-weight
            </button>
            <div class="dropdown-menu fontWeight" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item fontWeight-400" href="#">400</a>
              <a class="dropdown-item fontWeight-700" href="#">700</a>
            </div>
          </div>
          <div id="memoFontSize" class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              font-size
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item fontSize-14" href="#">14</a>
              <a class="dropdown-item fontSize-16" href="#">16</a>
              <a class="dropdown-item fontSize-20" href="#">20</a>
              <a class="dropdown-item fontSize-26" href="#">26</a>
              <a class="dropdown-item fontSize-40" href="#">40</a>
              <a class="dropdown-item fontSize-70" href="#">70</a>
            </div>
          </div>
          <input type="text" id="memoFontColor" class="form-control" value="#" placeholder="" maxlength="7">
          <button type="button" id="memoFontItalic" class="btn btn-outline-secondary memoFontItalic">italic</button>
        </div>
        <div class="col-4 col-md-2 col-lg-4 text-right">
          <div id="memoBgc" class="dropdown">
            <button class="btn btn-outline-danger" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-palette"></i>
            </button>
            <div class="dropdown-menu type2 border-0 row" aria-labelledby="dropdownMenuButton">
              <a class="drop-circle cir-red col" href="#">red</a>
              <a class="drop-circle cir-blue col" href="#">blue</a>
              <a class="drop-circle cir-yellow col" href="#">yellow</a>
              <a class="drop-circle cir-green col" href="#">green</a>
              <a class="drop-circle cir-skyblue col" href="#">skyblue</a>
            </div>
          </div>
        </div>
      </div>
      <div class="writer">
        <textarea id="memoTextArea" class="memoTextArea" cols="30" rows="10" style="font-style:normal;"></textarea>
      </div>
      <div class="memo-btn text-right">
        <button type="button" id="saveMemo" class="btn btn-outline-primary saveMemo">Save</button>
        <button type="button" id="cancelMemo" class="btn btn-outline-secondary cancelMemo">Cancel</button>
      </div>
    </div>
    `;

  $memoEditor.innerHTML = html;
  $memoEditor.classList.add('active');
  $textArea = $memoEditor.children[0].children[1].children[0];
};

const renderMemo = () => {
  let html = '';

  memo.sort((a, b) => b.id - a.id);
  memo.forEach(({ id, content, fontWeight, fontSize, fontColor, fontItalic, bgColor }) => {
    html += `<li class="col-sm-12 col-md-6" id="memo-${id}">
      <div class="sticker-memo" style="font-weight:${fontWeight};font-size:${fontSize};color:${fontColor};font-style:${fontItalic};background-color:${bgColor};">${content}</div>
      <button type="button" class="memoRemove">X</button>
    </li>`
  });

  $memoBox.innerHTML = html;
};

const removeEditor = () => {
  $memoEditor.innerHTML = '';
  $memoEditor.classList.remove('active');
};

const _each = (item, iter) => {
  for (list of item) {
    iter(list)
  }
};

const fontWeightEditor = (target) => {
  const $weightItem = document.querySelector('.fontWeight');
  for (list of $weightItem.children) {
    if (list === target) {
      $textArea.style.fontWeight = target.textContent;
    }
  }
};

const fontSizeEditor = (target) => {
  if (!target.classList.contains('dropdown-item')) return;
  const routes = $memoEditor.children[0].children[0].children[0].children[1].children[1].children;
  _each(routes, (list) => {
    if (list === target) {
      $textArea.style.fontSize = `${target.textContent}px`;
    };
  });
};

const fontItalicEditor = (target) => {
  if (!target.classList.contains('memoFontItalic')) return;
  target.classList.toggle('active');

  const italicStyle = target.classList.contains('active') ? 'italic' : 'normal';
  $textArea.style.fontStyle = italicStyle;
};

const fontColorEditor = (target) => {
  $textArea.style.color = target.value;
};

const bgColorEditor = (target) => {
  if (!target.classList.contains('drop-circle')) return;
  const routes = $memoEditor.children[0].children[0].children[1].children[0].children[1].children;
  _each(routes, (list) => {
    if (list === target) {
      $textArea.style.backgroundColor = `${target.textContent}`;
    };
  });
};

const saveEditor = (target) => {
  if (!target.classList.contains('saveMemo')) return;
  postMemo();
  getMemo();
  removeEditor();
};

const cancelEditor = (target) => {
  if (!target.classList.contains('cancelMemo')) return;
  removeEditor();
};

const getMemo = async () => {
  try {
    const response = await axios.get('http://localhost:9000/memo');
    memo = response.data;
    renderMemo();
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const postMemo = async () => {
  const data = {
    id: maxId(memo),
    content: $textArea.value,
    fontWeight: $textArea.style.fontWeight || 400,
    fontSize: $textArea.style.fontSize || 20,
    fontColor: $textArea.style.color || '#222',
    fontItalic: $textArea.style.fontStyle || 'normal',
    bgColor: $textArea.style.backgroundColor || 'white'
  }
  try {
    await axios.post('http://localhost:9000/memo', data);
  } catch (e) {
    console.log(new Error('Error'));
  }
}

const deleteMemo = async (id) => {
  await axios.delete(`http://localhost:9000/memo/${id}`);
};

window.addEventListener('load', () => {
  getMemo();
});

$createMemo.addEventListener('click', () => {
  $memoEditor.className !== 'active' ? addEditor() : removeEditor();
});

$memoEditor.addEventListener('click', (event) => {
  event.preventDefault();
  const { target } = event;

  fontWeightEditor(target);
  fontSizeEditor(target);
  fontItalicEditor(target);
  bgColorEditor(target);
  saveEditor(target);
  cancelEditor(target);
});

$memoEditor.addEventListener('keyup', ({ target, keyCode }) => {
  if (!target.classList.contains('form-control') || keyCode !== 13 || target.value.trim() === '#') return;
  fontColorEditor(target);
  target.value = '#';
});

$memoBox.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('memoRemove')) return;
  const $id = +target.parentNode.id.split('-')[1];
  console.log($id);
  deleteMemo($id);
  getMemo();
});
