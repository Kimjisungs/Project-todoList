const $memoEditor = document.querySelector('#memoEditor');
const $memoCreate = document.querySelector('#createMemo');
const $memoBox = document.querySelector('#memoBox');
const $memoTextArea = document.querySelector('#memoTextArea');

let $textArea;
let memo = [];

const renderEditor = () => {
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
            <div class="dropdown-menu fontSize" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item fontSize-14" href="#">14</a>
              <a class="dropdown-item fontSize-16" href="#">16</a>
              <a class="dropdown-item fontSize-20" href="#">20</a>
              <a class="dropdown-item fontSize-26" href="#">26</a>
              <a class="dropdown-item fontSize-40" href="#">40</a>
              <a class="dropdown-item fontSize-70" href="#">70</a>
            </div>
          </div>
          <div class="fontColor"><input type="text" id="memoFontColor" class="form-control" value="#" placeholder="" maxlength="7"></div>
          <div class="fontItalic"><button type="button" id="memoFontItalic" class="btn btn-outline-secondary memoItalic">italic</button></div>
        </div>
        <div class="col-4 col-md-2 col-lg-4 text-right">
          <div id="memoBgc" class="dropdown">
            <button class="btn btn-outline-danger" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-palette"></i>
            </button>
            <div class="dropdown-menu type2 border-0 row bg-color" aria-labelledby="dropdownMenuButton">
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
  $textArea = document.querySelector('.memoTextArea');
};

const createMemo = () => {
  $memoEditor.className !== 'active' ? renderEditor() : removeEditor();
};

const removeEditor = () => {
  $memoEditor.innerHTML = '';
  $memoEditor.classList.remove('active');
};

const renderMemo = () => {
  let html = '';
  memo.sort((a, b) => b.id - a.id);
  memo.forEach(({
    id, content, fontWeight, fontSize, fontColor, fontItalic, bgColor
  }) => {
    html += `<li class="col-sm-12 col-md-6" id="memo-${id}">
      <div class="sticker-memo" style="font-weight:${fontWeight};font-size:${fontSize};color:${fontColor};font-style:${fontItalic};background-color:${bgColor};">${content}</div>
      <button type="button" class="memoRemove">X</button>
    </li>`;
  });
  $memoBox.innerHTML = html;
};

const memoData = () => ({
  id: maxId(memo),
  content: $textArea.value,
  fontWeight: $textArea.style.fontWeight || 400,
  fontSize: $textArea.style.fontSize || 20,
  fontColor: $textArea.style.color || '#222',
  fontItalic: $textArea.style.fontStyle || 'normal',
  bgColor: $textArea.style.backgroundColor || 'white'
});

const promiseGetMemo = () => axios.get('http://localhost:9000/memo').then(res => res.data);

const promisePostMemo = () => axios.post('http://localhost:9000/memo', memoData());

const promiseDeleteMemo = (id) => axios.delete(`http://localhost:9000/memo/${id}`);

const ajaxGetMemo = async () => {
  try {
    memo = await promiseGetMemo();
    renderMemo();
  } catch (e) {
    console.log(e);
  }
};

const ajaxPostMemo = async () => {
  try {
    await promisePostMemo();
  } catch (e) {
    console.log(e);
  }
};

const ajaxDeleteMemo = async (id) => {
  try {
    await promiseDeleteMemo(id);
  } catch (e) {
    console.log(e);
  }
};

const font = (() => {
  const style = (fontStyle, target, fn) => {
    const $el = document.querySelector(`.${fontStyle}`);
    [...$el.children].forEach((list) => {
      if (list === target) {
        if (list.classList.contains('memoItalic')) {
          list.classList.toggle('active');
          const italic = list.classList.contains('active') ? 'italic' : 'normal';
          fn(italic, $textArea.style);
        } else {
          fn($textArea.style, target);
        }
      }
    });
  };

  return {
    weight(target) {
      style('fontWeight', target, (textarea) => textarea.fontWeight = target.textContent);
    },
    size(target) {
      style('fontSize', target, (textarea) => textarea.fontSize = `${target.textContent}px`);
    },
    color(target) {
      style('fontColor', target, (textarea) => textarea.color = target.value);
    },
    italic(target) {
      style('fontItalic', target, (italic, textarea) => textarea.fontStyle = italic);
    }
  };
})();

const bgColor = (target) => {
  const $el = document.querySelector('.bg-color');
  [...$el.children].forEach((list) => {
    if (list === target) $textArea.style.backgroundColor = `${target.textContent}`;
  });
};

const memoSave = (target) => {
  if (!target.classList.contains('saveMemo')) return;
  ajaxPostMemo();
  ajaxGetMemo();
  renderMemo();
  removeEditor();
};

const memoCancel = (target) => {
  if (!target.classList.contains('cancelMemo')) return;
  removeEditor();
};

window.addEventListener('load', () => {
  ajaxGetMemo();
});

$memoCreate.addEventListener('click', () => {
  createMemo();
});

$memoEditor.addEventListener('click', (e) => {
  e.preventDefault();
  const { target } = e;

  font.weight(target);
  font.size(target);
  font.italic(target);
  bgColor(target);
  memoSave(target);
  memoCancel(target);
});

$memoEditor.addEventListener('keyup', ({ target, keyCode }) => {
  if (!target.classList.contains('form-control') || keyCode !== 13 || target.value.trim() === '#') return;
  font.color(target);
  target.value = '#';
});

$memoBox.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('memoRemove')) return;
  const $id = +target.parentNode.id.split('-')[1];
  ajaxDeleteMemo($id);
  ajaxGetMemo();
});
