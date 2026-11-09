(function () {
  'use strict';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  function addTodo(text) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-check';
    checkbox.setAttribute('aria-label', '完了');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text; // textContent でHTMLとして解釈させない

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'todo-delete';
    del.textContent = '削除';
    del.setAttribute('aria-label', '削除');

    li.append(checkbox, span, del);
    list.appendChild(li);
  }

  // イベント委譲: 完了の切り替えと削除
  list.addEventListener('change', function (event) {
    if (!event.target.classList.contains('todo-check')) return;
    event.target.closest('li').classList.toggle('done', event.target.checked);
  });

  list.addEventListener('click', function (event) {
    if (!event.target.classList.contains('todo-delete')) return;
    event.target.closest('li').remove();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    input.focus();
  });
})();
