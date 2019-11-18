const $inputTodo = document.querySelector('#inputTodo');
const $saveTodo = document.querySelector('#saveTodo');
const $todos = document.querySelector('#todos');

let todos = [];


const renderTodos = () => {
  todos.sort((a, b) => b.id - a.id);
  let html = '';
  todos.forEach(({
    id, content, completed, date
  }) => {
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
};

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



