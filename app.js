/**
 * Todo app with local storage persistence.
 * Terminology: todos are referred to as either "completed" or "uncompleted"
 * (based on the `done` property).
 */
(() => {
	const STORAGE_KEY = 'todo.items';
	const THEME_KEY = 'todo.theme';

	const form = document.querySelector('#todoForm');
	const input = document.querySelector('#todoInput');
	const list = document.querySelector('#todoList');
	const footer = document.querySelector('#footer');
	const countEl = document.querySelector('#count');
	const clearBtn = document.querySelector('#clearCompleted');
	const emptyEl = document.querySelector('#empty');
	const themeToggle = document.querySelector('#themeToggle');

	let todos = load();

	function load() {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
		} catch {
			return [];
		}
	}

	function save() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}

	function uid() {
		return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
	}

	function render() {
		list.innerHTML = '';
		for (const t of todos) {
			const li = document.createElement('li');
			li.className = 'todo-item' + (t.done ? ' done' : '');
			li.dataset.id = t.id;

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.className = 'checkbox';
			checkbox.checked = t.done;

			const text = document.createElement('span');
			text.className = 'text';
			text.textContent = t.text;

			const del = document.createElement('button');
			del.className = 'delete';
			del.setAttribute('aria-label', 'Delete todo');
			del.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>';

			li.append(checkbox, text, del);
			list.appendChild(li);
		}

		const remaining = todos.filter(t => !t.done).length;
		countEl.textContent = `${remaining} ${remaining === 1 ? 'item' : 'items'} left`;
		footer.hidden = todos.length === 0;
		emptyEl.hidden = todos.length > 0;
		emptyEl.textContent = 'Nothing to do. Add your first task above.';
	}

	form.addEventListener('submit', e => {
		e.preventDefault();
		const text = input.value.trim();
		if (!text) return;
		todos.unshift({ id: uid(), text, done: false });
		input.value = '';
		save();
		render();
	});

	list.addEventListener('click', e => {
		const li = e.target.closest('.todo-item');
		if (!li) return;
		const id = li.dataset.id;
		const todo = todos.find(t => t.id === id);
		if (!todo) return;

		if (e.target.matches('.checkbox')) {
			todo.done = e.target.checked;
			save();
			render();
		} else if (e.target.closest('.delete')) {
			todos = todos.filter(t => t.id !== id);
			save();
			render();
		}
	});

	clearBtn.addEventListener('click', () => {
		todos = todos.filter(t => !t.done);
		save();
		render();
	});

	const savedTheme = localStorage.getItem(THEME_KEY)
		|| (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	document.documentElement.setAttribute('data-theme', savedTheme);

	themeToggle.addEventListener('click', () => {
		const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem(THEME_KEY, next);
	});

	render();
})();
