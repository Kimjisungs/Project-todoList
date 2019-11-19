const $inputTodo = document.querySelector('#inputTodo');
const $saveTodo = document.querySelector('#saveTodo');
const $todos = document.querySelector('#todos');

let todos = [];

const promiseGetTodo = () => axios.get('http://localhost:9000/todos').then(res => res.data);

const promisePostTodo = (content) => axios.post('http://localhost:9000/todos', {
  id: maxId(todos), content, completed: false, date: dateTodo()
});

const promisePatchTodoCheck = (id, checked) => axios.patch(`http://localhost:9000/todos/${id}`, { completed: checked });

const promisePatchTodoContent = (target, content) => axios.patch(`http://localhost:9000/todos/${thisId(target)}`, { content });

const promiseDeleteTodo = (target) => axios.delete(`http://localhost:9000/todos/${thisId(target)}`);

const ajaxGetTodo = async () => {
  try {
    todos = await promiseGetTodo();
    renderTodos();
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const ajaxPostTodo = async (content) => {
  try {
    await promisePostTodo(content);
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const ajaxPatchTodoCheck = async (id, checked) => {
  try {
    await promisePatchTodoCheck(id, checked);
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const ajaxPatchTodoContent = async (target, content) => {
  try {
    await promisePatchTodoContent(target, content);
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const ajaxDeleteTodo = async (target) => {
  try {
    await promiseDeleteTodo(target);
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const renderTodos = () => {
  let html = '';

  todos.sort((a, b) => b.id - a.id);
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

const inputTodo = (target, keyCode) => {
  const content = target.value.trim();
  if (keyCode !== 13 || content === '' || !target.classList.contains('form-control')) return;
  target.value = '';
  ajaxPostTodo(content);
  ajaxGetTodo();
};

const dateTodo = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const checkedTodo = (target) => {
  if (!target.classList.contains('custom-control-input')) return;
  const { checked } = target;
  const $id = +target.parentNode.parentNode.parentNode.id;
  ajaxPatchTodoCheck($id, checked);
  ajaxGetTodo();
};

const createModifyInput = (target) => {
  const $createInput = document.createElement('input');

  todos.forEach(({ id, content }) => {
    if (id === thisId(target)) {
      $createInput.setAttribute('type', 'text');
      $createInput.setAttribute('class', 'label-modify');
      $createInput.setAttribute('value', content);
    }
  });
  [...$todos.children].forEach((list) => {
    if (+list.id === thisId(target)) {
      console.log(target.parentNode.classList.contains('text-right'))
      list.children[0].children[0].appendChild($createInput);
    }
  });

  // [...$todos.children].forEach((list) => {
  //   if (+list.id === thisId(target)) {
  //     [...list.children[0].children[0].children].forEach((childList) => {
  //       console.log(childList);
  //     });
  //   }
  // });

  // [...thisFilter.children[0].children[0]].forEach(list => {
  // });
  // {
  //   if (+list.id === thisId(target)) {
  //     list.children[0].children[0].appendChild($createInput);
  //   }
  // });
};

const btnModifyTodo = (target) => {
  if (target.classList.contains('modifyTodo') || target.tagName === 'svg' || target.tagName === 'path') {
    if (target.tagName === 'svg') target = target.parentNode;
    else if (target.tagName === 'path') target = target.parentNode.parentNode;
    createModifyInput(target);
  }
};

const deleteTodo = async (target) => {
  if (!target.classList.contains('removeTodo')) return;
  ajaxDeleteTodo(target);
  ajaxGetTodo();
};

const modifyTodo = (target, keyCode) => {
  if (!target.classList.contains('label-modify')) return;
  const content = target.value;
  ajaxPatchTodoContent(target, content);
  modifyTodoEnterEvent(target, keyCode);
};

const modifyTodoEnterEvent = (target, keyCode) => {
  if (keyCode === 13) {
    target.parentNode.removeChild(target);
    ajaxGetTodo();
  }
};

window.addEventListener('load', () => {
  ajaxGetTodo();
});

$inputTodo.addEventListener('keyup', ({ target, keyCode }) => {
  inputTodo(target, keyCode);
});

$saveTodo.addEventListener('click', ({ target, keyCode }) => {
  inputTodo(target, keyCode);
});

$todos.addEventListener('keyup', ({ target, keyCode }) => {
  modifyTodo(target, keyCode);
});

$todos.addEventListener('change', ({ target }) => {
  checkedTodo(target);
});

$todos.addEventListener('click', ({ target }) => {
  deleteTodo(target);
  btnModifyTodo(target);
});
