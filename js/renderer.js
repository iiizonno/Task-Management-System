/** @format */

import { COLUMNS, PRIORITIES } from './constants.js';

function isOverdue(task, columnId) {
	if (!task.dueDate || columnId === 'done') return false;
	return new Date(task.dueDate) < new Date(new Date().toISOString().split('T')[0]);
}

function taskMatchesFilter(task, filters) {
	if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
	if (filters.tag !== 'all' && !task.labels.includes(filters.tag)) return false;
	return true;
}

function createTaskElement(task, columnId) {
	const prio = PRIORITIES[task.priority] || PRIORITIES.medium;
	const overdue = isOverdue(task, columnId);

	const priorityColors = {
		high: '#f6bbbb',
		medium: '#f4df9c',
		low: '#b5edc9',
	};
	const bgColor = priorityColors[task.priority] || priorityColors.medium;

	const div = document.createElement('div');
	div.className = `card ${overdue ? 'overdue' : ''}`;
	div.draggable = true;
	div.dataset.id = task.id;
	div.style.backgroundColor = bgColor;
	div.title = 'Click to edit task';

	let labelsHTML = '';
	if (task.labels && task.labels.length) {
		labelsHTML = `<div class="labels">${task.labels.map((l) => `<span class="label-tag">${l}</span>`).join('')}</div>`;
	}

	let dueHTML = '';
	if (task.dueDate) {
		const dueClass = overdue ? 'overdue' : '';
		const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		dueHTML = `<div class="due-date ${dueClass}">📅 ${task.dueDate}<span class="info-icon" title="Created: ${createdDate}">ℹ️</span></div>`;
	}

	div.innerHTML = `
        <div class="card-header">
            <span class="priority-badge" style="background:${prio.color}">${prio.label}</span>
            <button class="delete-btn" aria-label="Delete">×</button>
        </div>
        <h3>${task.title}</h3>
        ${task.description ? `<p>${task.description}</p>` : ''}
        ${dueHTML}
        ${labelsHTML}
    `;
	return div;
}

export function renderBoard(data, filters = { priority: 'all', tag: 'all' }) {
	const boardEl = document.getElementById('board');
	boardEl.innerHTML = '';

	let shown = 0,
		done = 0,
		overdue = 0;

	COLUMNS.forEach((col) => {
		const allTasks = data[col.id] || [];
		const filteredTasks = allTasks.filter((t) => taskMatchesFilter(t, filters));

		// Sort by dueDate
		filteredTasks.sort((a, b) => {
			const dateA = a.dueDate ? new Date(a.dueDate) : new Date(9999, 0, 1);
			const dateB = b.dueDate ? new Date(b.dueDate) : new Date(9999, 0, 1);
			return dateA - dateB;
		});

		shown += filteredTasks.length;
		if (col.id === 'done') done = filteredTasks.length; // done count is filtered too

		const colEl = document.createElement('div');
		colEl.className = 'column';
		colEl.dataset.columnId = col.id;

		colEl.innerHTML = `
            <div class="column-header">
                <h2>${col.title}</h2>
                <span class="count">${filteredTasks.length}</span>
            </div>
            <div class="task-list" data-column-id="${col.id}"></div>
        `;

		const list = colEl.querySelector('.task-list');
		filteredTasks.forEach((task) => {
			if (isOverdue(task, col.id)) overdue++;
			list.appendChild(createTaskElement(task, col.id));
		});

		boardEl.appendChild(colEl);
	});

	document.getElementById('stats').textContent = `Showing: ${shown} | Done: ${done} | Overdue: ${overdue}`;
}

export function populateTagFilter(data) {
	const select = document.getElementById('filter-tag');
	const currentValue = select.value;

	const allTags = new Set();
	Object.values(data).forEach((column) => {
		column.forEach((task) => {
			task.labels.forEach((tag) => allTags.add(tag));
		});
	});

	select.innerHTML = `<option value="all">All Tags</option>`;
	Array.from(allTags)
		.sort()
		.forEach((tag) => {
			const opt = document.createElement('option');
			opt.value = tag;
			opt.textContent = tag;
			select.appendChild(opt);
		});

	// restore previous selection if still valid
	if (Array.from(allTags).includes(currentValue)) {
		select.value = currentValue;
	} else {
		select.value = 'all';
	}
}
