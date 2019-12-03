const $inputTodo = document.querySelector('#inputTodo');
const $saveTodo = document.querySelector('#saveTodo');
const $todos = document.querySelector('#todos');
const $modalClose = document.querySelector('.btn-modal-close');
const $inputAlramMinutes = document.querySelector('.alarm-minutes');
const $inputAlramSeconds = document.querySelector('.alarm-seconds');
const $saveAlarm = document.querySelector('#save-alarm');

let todos = [];

const promiseGetTodo = () => axios.get('http://localhost:9000/todos').then(res => res.data);

const promisePostTodo = (content) => axios.post('http://localhost:9000/todos', {
  id: maxId(todos), content, completed: false, date: dateTodo(), alarm: '-1'
});

const promisePatchTodoCheck = (id, checked) => axios.patch(`http://localhost:9000/todos/${id}`, { completed: checked });

const promisePatchTodoContent = (target, content) => axios.patch(`http://localhost:9000/todos/${thisId(target.parentNode)}`, { content });

const promisePatchTodoAlarm = (target, alarm) => axios.patch(`http://localhost:9000/todos/${thisId(target)}`, { alarm });

const promiseDeleteTodo = (target) => axios.delete(`http://localhost:9000/todos/${thisId(target)}`);

const ajaxGetTodo = async () => {
  try {
    todos = await promiseGetTodo();
    renderTodos();
  } catch (e) {
    console.log(new Error('Error'));
  }
};

const ajaxGetCheck = async () => {
  try {
    todos = await promiseGetTodo();
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

const ajaxPatchAlarmData = async (target, alarm) => {
  try {
    await promisePatchTodoAlarm(target, alarm);
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
    id, content, completed, date, alarm
  }) => {
    html += `
    <li id="${id}">
      <div class="row todos-inner">
        <div class="col-12 col-md-12 col-lg-8 custom-control custom-checkbox chk-type">
          <input type="checkbox" class="custom-control-input" id="inputCheck-${id}" ${completed ? 'checked' : ''}>
          <label class="custom-control-label" for="inputCheck-${id}">${content}</label>
          <div class="label-modify-wrap"></div>
        </div>
        <div class="col-6 col-md-8 col-lg-2 text-right">
          <span id="dateTodo" class="date">${date}</span>
        </div>
        <div class="col-6 col-md-4 col-lg-2 text-right">
          <button type="button" class="btn btn-outline-light modifyTodo"><i class="fas fa-pencil-alt fa-xs"></i></button>
          <button type="button" class="btn btn-outline-light alramTodo" data-toggle="modal" data-target="#exampleModalCenter"><i class="far fa-clock fa-xs"></i><span class="alarm-time">${alarm !== '-' || '-1' ? (alarm.split('-')[0] + '분' + alarm.split('-')[1]) + '초' : ''}</span></button>
          <button type="button" class="btn btn-outline-light removeTodo">x</button>
        </div>
      </div>
    </li>
  `;
  });
  $todos.innerHTML = html;
};

const maxId = (list) => (list.length ? Math.max(...list.map(todo => todo.id)) + 1 : 1);

const thisId = (target) => +target.parentNode.parentNode.parentNode.id;

const inputTodo = (target) => {
  const content = $inputTodo.value.trim();
  if (content === '') return;
  $inputTodo.value = '';
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

const alarmCheck = () => {
  setInterval (() => {
    ajaxGetCheck();
    alarmWork();
  }, 1000);
};

const alarmWork = () => {
  const timeDate = new Date();
  const timeMinute = timeDate.getMinutes();
  const timeSecond = timeDate.getSeconds();
  todos.forEach(({ alarm, content }) => {
    const _alarmMinute = alarm.split('-')[0];
    const _alarmSecond = alarm.split('-')[1];
    console.log(+_alarmMinute, +_alarmSecond);
    console.log(timeMinute, timeSecond);
    if (+_alarmMinute === timeMinute && +_alarmSecond === timeSecond) alert(content);
  });
};

const buttonCondition = (btnTarget, target, fn) => {
  if (btnTarget.classList.contains(target) || (btnTarget.tagName === 'svg' && btnTarget.parentNode.classList.contains(target)) || (btnTarget.tagName === 'path' && btnTarget.parentNode.parentNode.classList.contains(target))) {
    if (btnTarget.tagName === 'svg') btnTarget = btnTarget.parentNode;
    else if (btnTarget.tagName === 'path') btnTarget = btnTarget.parentNode.parentNode;
    fn(btnTarget);
  }
};

const btnModifyTodo = (btnTarget) => {
  buttonCondition(btnTarget, 'modifyTodo', (value) => createModifyInput(value));
};

const btnAlramTodo = (btnTarget) => {
  buttonCondition(btnTarget, 'alramTodo', (value) => saveAlramTodo(value));
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
  renderUiInput(target, $createInput);
};

const saveAlramTodo = (btnTarget) => {
  $inputAlramMinutes.id = `alarmMinutes-${thisId(btnTarget)}`;
  $inputAlramSeconds.id = `alarmSeconds-${thisId(btnTarget)}`;
  $saveAlarm.addEventListener('click', () => {
    if ($inputAlramMinutes.id === `alarmMinutes-${thisId(btnTarget)}` && $inputAlramSeconds.id === `alarmSeconds-${thisId(btnTarget)}`) {
      const alarmMinutes = $inputAlramMinutes.value;
      const alarmSeconds = $inputAlramSeconds.value;
      ajaxPatchAlarmData(btnTarget, `${alarmMinutes}-${alarmSeconds}`);
      alarmDataClear();
      alarmTimeAdded(alarmMinutes, alarmSeconds, btnTarget);
      // renderTodos();
    }
  });
};

const alarmDataClear = () => {
  $inputAlramMinutes.value = '';
  $inputAlramSeconds.value = '';
  $modalClose.click();
};

const alarmTimeAdded = (alarmMinutes, alarmSeconds, btnTarget) => {
  const $alarmTime = document.querySelector('.alarm-time');
  todos.forEach(todo => {
    if (todo.id === +$alarmTime.parentNode.parentNode.parentNode.parentNode.id) {
      btnTarget.children[1].innerHTML = `${alarmMinutes}분 ${alarmSeconds}초`;
    }
  });
};

const renderUiInput = (target, $createInput) => {
  [...$todos.children].forEach((list) => {
    const labelModifyWrap = list.children[0].children[0].children[2];
    if (+list.id === thisId(target)) {
      labelModifyWrap.innerHTML = '';
      labelModifyWrap.appendChild($createInput);
    } else {
      labelModifyWrap.innerHTML = '';
    }
  });
};

const modifyTodoEvent = (target, keyCode, event) => {
  if (event === 'keyup' || event === 'focusout') {
    if (event === 'keyup' && keyCode !== 13) return;
    target.parentNode.removeChild(target);
    ajaxGetTodo();
  }
};

const modifyTodo = (target, keyCode, event) => {
  if (!target.classList.contains('label-modify')) return;
  const content = target.value;
  ajaxPatchTodoContent(target, content);
  modifyTodoEvent(target, keyCode, event);
};

const deleteTodo = async (target) => {
  if (!target.classList.contains('removeTodo')) return;
  ajaxDeleteTodo(target);
  ajaxGetTodo();
};

window.addEventListener('load', () => {
  ajaxGetTodo();
  alarmCheck();
});

$inputTodo.addEventListener('keyup', ({ target, keyCode }) => {
  if (keyCode !== 13 || !target.classList.contains('form-control')) return;
  inputTodo();
});

$saveTodo.addEventListener('click', () => {
  inputTodo();
});

$todos.addEventListener('keyup', ({ target, keyCode }) => {
  modifyTodo(target, keyCode, 'keyup');
});

$todos.addEventListener('focusout', ({ target, keyCode }) => {
  modifyTodo(target, keyCode, 'focusout');
});

$todos.addEventListener('change', ({ target }) => {
  checkedTodo(target);
});

$todos.addEventListener('click', ({ target }) => {
  deleteTodo(target);
  btnModifyTodo(target);
  btnAlramTodo(target);
});
