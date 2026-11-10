(function () {
  'use strict';

  const STORAGE_KEY = 'todos';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const dueInput = document.getElementById('todo-due');
  const list = document.getElementById('todo-list');

  // 状態: [{ id, text, done, due }]  due は 'YYYY-MM-DD' または ''
  let todos = load();

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(data)) return [];
      return data
        .filter(function (t) {
          return t && typeof t.text === 'string';
        })
        .map(function (t, i) {
          return {
            id: t.id != null ? String(t.id) : String(Date.now() + i),
            text: t.text,
            done: t.done === true,
            due: typeof t.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? t.due : '',
          };
        });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      // 保存できない環境(容量超過・プライベートモード等)では無視する
    }
  }

  function createItem(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.classList.toggle('done', todo.done);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-check';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', '完了');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text; // textContent でHTMLとして解釈させない

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'todo-delete';
    del.textContent = '削除';
    del.setAttribute('aria-label', '削除');

    li.append(checkbox, span);

    if (todo.due) {
      const due = document.createElement('span');
      due.className = 'todo-due';
      const overdue = !todo.done && todo.due < today();
      due.textContent = (overdue ? '⚠ 期限切れ: ' : '期限: ') + todo.due;
      due.classList.toggle('overdue', overdue);
      li.append(due);
    }

    li.append(del);
    return li;
  }

  // ローカル日付を YYYY-MM-DD で返す
  function today() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function render() {
    list.replaceChildren(...todos.map(createItem));
  }

  function addTodo(text, due) {
    todos.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 8), text: text, done: false, due: due });
    save();
    render();
  }

  // イベント委譲: 完了の切り替えと削除
  list.addEventListener('change', function (event) {
    if (!event.target.classList.contains('todo-check')) return;
    const id = event.target.closest('li').dataset.id;
    const todo = todos.find(function (t) {
      return t.id === id;
    });
    if (!todo) return;
    todo.done = event.target.checked;
    save();
    render();
  });

  list.addEventListener('click', function (event) {
    if (!event.target.classList.contains('todo-delete')) return;
    const id = event.target.closest('li').dataset.id;
    todos = todos.filter(function (t) {
      return t.id !== id;
    });
    save();
    render();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text, dueInput.value);
    input.value = '';
    dueInput.value = '';
    input.focus();
  });

  // 日付をまたいだ後にタブへ戻ったとき、期限切れ表示を更新する
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') render();
  });

  render();
})();
