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
            due: isValidDate(t.due) ? t.due : '',
          };
        });
    } catch (e) {
      return [];
    }
  }

  // 'YYYY-MM-DD' かつ実在する日付か(2026-13-45 や 2026-02-30 は不可)
  function isValidDate(s) {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const y = Number(s.slice(0, 4));
    const m = Number(s.slice(5, 7));
    const d = Number(s.slice(8, 10));
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
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

    const overdue = !!todo.due && !todo.done && todo.due < today();
    if (todo.due) {
      const due = document.createElement('span');
      due.className = 'todo-due';
      due.textContent = overdue ? '⚠ 期限切れ' : '期限';
      due.classList.toggle('overdue', overdue);
      li.append(due);
    }
    // 期日の設定・変更・解除(空にすると解除)。どのTODOの入力か分かるようラベルに本文を含める
    const dueInputEl = document.createElement('input');
    dueInputEl.type = 'date';
    dueInputEl.className = 'todo-due-input';
    dueInputEl.value = todo.due;
    dueInputEl.classList.toggle('overdue', overdue);
    dueInputEl.setAttribute('aria-label', '「' + todo.text + '」の期日');
    li.append(dueInputEl);

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

  // 最後に描画した日付。日付が変わったときだけ再描画するために保持する
  let renderedDay = '';

  function render() {
    // 再描画でフォーカスが失われないよう、操作中の要素を覚えて復元する
    const active = document.activeElement;
    const activeLi = active && active !== document.body && list.contains(active) ? active.closest('li') : null;
    const activeId = activeLi ? activeLi.dataset.id : null;
    const activeClass = activeLi ? Array.from(active.classList).find(function (c) {
      return c === 'todo-check' || c === 'todo-due-input' || c === 'todo-delete';
    }) : null;

    renderedDay = today();
    list.replaceChildren(...todos.map(createItem));

    if (activeId && activeClass) {
      const target = Array.from(list.children).find(function (li) {
        return li.dataset.id === activeId;
      });
      const el = target && target.querySelector('.' + activeClass);
      if (el) el.focus();
    }
  }

  function addTodo(text, due) {
    todos.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 8), text: text, done: false, due: due });
    save();
    render();
  }

  // イベント委譲: 完了の切り替え・期日の後付け・削除
  list.addEventListener('change', function (event) {
    const isCheck = event.target.classList.contains('todo-check');
    const isDue = event.target.classList.contains('todo-due-input');
    if (!isCheck && !isDue) return;
    const id = event.target.closest('li').dataset.id;
    const todo = todos.find(function (t) {
      return t.id === id;
    });
    if (!todo) return;
    if (isCheck) {
      todo.done = event.target.checked;
    } else {
      // 空なら解除。不正な値は無視して表示を元に戻す
      const v = event.target.value;
      if (v && !isValidDate(v)) {
        render();
        return;
      }
      todo.due = v;
    }
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
    if (document.visibilityState === 'visible' && today() !== renderedDay) render();
  });

  render();
})();
