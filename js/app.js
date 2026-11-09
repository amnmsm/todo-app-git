(function () {
  'use strict';

  const STORAGE_KEY = 'todos';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  // 状態: [{ id, text, done }]
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

    li.append(checkbox, span, del);
    return li;
  }

  function render() {
    list.replaceChildren(...todos.map(createItem));
  }

  function addTodo(text) {
    todos.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 8), text: text, done: false });
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
    addTodo(text);
    input.value = '';
    input.focus();
  });

  render();
})();
