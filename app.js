(() => {
	const STORAGE_KEY = 'todo.items';
	const THEME_KEY = 'todo.theme';

	const form = document.getElementById('todoForm');
	const input = document.getElementById('todoInput');
	const list = document.getElementById('todoList');
	const filters = document.getElementById('filters');
	const footer = document.getElementById('footer');
	const countEl = document.getElementById('count');
	const clearBtn = document.getElementById('clearCompleted');
	const emptyEl = document.getElementById('empty');
	const themeToggle = document.getElementById('themeToggle');

	let todos = load();
	let filter = 'all';

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
		const visible = todos.filter(t =>
			filter === 'all' ? true : filter === 'active' ? !t.done : t.done
		);

		list.innerHTML = '';
		for (const t of visible) {
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
		emptyEl.hidden = visible.length > 0;
		if (visible.length === 0 && todos.length > 0) {
			emptyEl.textContent = filter === 'completed'
				? 'No completed tasks yet.'
				: 'All done! Nice work.';
			emptyEl.hidden = false;
		} else if (todos.length === 0) {
			emptyEl.textContent = 'Nothing to do. Add your first task above.';
		}
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

	filters.addEventListener('click', e => {
		const btn = e.target.closest('.filter-btn');
		if (!btn) return;
		filter = btn.dataset.filter;
		filters.querySelectorAll('.filter-btn').forEach(b =>
			b.classList.toggle('active', b === btn)
		);
		render();
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
