(function () {
  'use strict';

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  function addTodo(text) {
    const li = document.createElement('li');
    li.textContent = text; // textContent でHTMLとして解釈させない
    list.appendChild(li);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    input.focus();
  });
})();
