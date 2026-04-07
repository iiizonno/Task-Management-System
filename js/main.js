/** @format */

import { loadTaskData, downloadBackup, mergeTaskData, saveTaskData } from './storage.js';
import { renderBoard, populateTagFilter } from './renderer.js';
import { createTask } from './models.js';

let currentData = {};
let currentFilters = { priority: 'all', tag: 'all' };

const modal = document.getElementById('task-modal');
const form = document.getElementById('task-form');
let editingTaskId = null;

function render() {
	renderBoard(currentData, currentFilters);
	populateTagFilter(currentData);
}

function saveAndRender() {
	saveTaskData(currentData);
	render();
}

/* Open modal for new or edit */
function openModal(task = null) {
	editingTaskId = task ? task.id : null;
	document.getElementById('modal-heading').textContent = task ? 'Edit Task' : 'New Task';

	document.getElementById('task-id').value = task ? task.id : '';
	document.getElementById('task-title').value = task ? task.title : '';
	document.getElementById('task-desc').value = task ? task.description : '';
	document.getElementById('task-priority').value = task ? task.priority : 'medium';
	document.getElementById('task-due').value = task ? task.dueDate : '';
	document.getElementById('task-labels').value = task && task.labels ? task.labels.join(', ') : '';

	modal.showModal();
}

function init() {
	currentData = loadTaskData();
	render();

	document.getElementById('add-task').addEventListener('click', () => openModal());

	document.getElementById('download-backup').addEventListener('click', () => {
		downloadBackup(currentData);
	});

	const fileInput = document.getElementById('file-input');
	document.getElementById('load-backup').addEventListener('click', () => {
		fileInput.click();
	});

	fileInput.addEventListener('change', (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const importedData = JSON.parse(event.target.result);
					currentData = mergeTaskData(currentData, importedData);
					saveAndRender();
					alert('Data loaded and merged successfully!');
				} catch (err) {
					alert('Error loading file: ' + err.message);
				}
			};
			reader.readAsText(file);
			fileInput.value = '';
		}
	});

	window.addEventListener('beforeunload', (e) => {
		const message = 'You have unsaved tasks. Please use the Backup button to save them!';
		e.preventDefault();
		e.returnValue = message;
		return message;
	});

	document.getElementById('modal-cancel').addEventListener('click', () => modal.close());

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const title = document.getElementById('task-title').value.trim();
		if (!title) return;

		const description = document.getElementById('task-desc').value.trim();
		const priority = document.getElementById('task-priority').value;
		const dueDate = document.getElementById('task-due').value;
		const labelsStr = document.getElementById('task-labels').value.trim();

		const newLabels = labelsStr
			? labelsStr
					.split(',')
					.map((l) => l.trim())
					.filter(Boolean)
			: [];

		if (editingTaskId) {
			for (let col in currentData) {
				const idx = currentData[col].findIndex((t) => t.id === editingTaskId);
				if (idx !== -1) {
					currentData[col][idx] = {
						...currentData[col][idx],
						title,
						description,
						priority,
						dueDate,
						labels: newLabels,
					};
					break;
				}
			}
		} else {
			const task = createTask(title, description, priority, dueDate, labelsStr);
			if (!currentData.todo) currentData.todo = [];
			currentData.todo.unshift(task);
		}
		modal.close();
		saveAndRender();
	});

	document.getElementById('board').addEventListener('click', (e) => {
		const card = e.target.closest('.card');
		if (!card) return;

		const taskId = card.dataset.id;

		if (e.target.classList.contains('delete-btn')) {
			if (confirm('Delete this task permanently?')) {
				Object.keys(currentData).forEach((key) => {
					currentData[key] = currentData[key].filter((t) => t.id !== taskId);
				});
				saveAndRender();
			}
		} else {
			let foundTask = null;
			for (let col in currentData) {
				foundTask = currentData[col].find((t) => t.id === taskId);
				if (foundTask) break;
			}
			if (foundTask) openModal(foundTask);
		}
	});

	const prioSelect = document.getElementById('filter-priority');
	const tagSelect = document.getElementById('filter-tag');

	prioSelect.addEventListener('change', () => {
		currentFilters.priority = prioSelect.value;
		render();
	});

	tagSelect.addEventListener('change', () => {
		currentFilters.tag = tagSelect.value;
		render();
	});

	document.getElementById('clear-filters').addEventListener('click', () => {
		currentFilters = { priority: 'all', tag: 'all' };
		prioSelect.value = 'all';
		tagSelect.value = 'all';
		render();
	});

	const boardEl = document.getElementById('board');

	boardEl.addEventListener('dragstart', (e) => {
		const card = e.target.closest('.card');
		if (card) e.dataTransfer.setData('text/plain', card.dataset.id);
	});

	boardEl.addEventListener('dragover', (e) => {
		e.preventDefault();
		const list = e.target.closest('.task-list');
		if (list) {
			document.querySelectorAll('.task-list').forEach((l) => l.classList.remove('drag-over'));
			list.classList.add('drag-over');
		}
	});

	boardEl.addEventListener('dragleave', () => {
		document.querySelectorAll('.task-list').forEach((l) => l.classList.remove('drag-over'));
	});

	boardEl.addEventListener('drop', (e) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData('text/plain');
		const list = e.target.closest('.task-list');
		if (taskId && list) {
			let movedTask = null;
			for (let col in currentData) {
				const idx = currentData[col].findIndex((t) => t.id === taskId);
				if (idx !== -1) {
					movedTask = currentData[col].splice(idx, 1)[0];
					break;
				}
			}
			if (movedTask) {
				const targetCol = list.dataset.columnId;
				if (!currentData[targetCol]) currentData[targetCol] = [];
				currentData[targetCol].unshift(movedTask);
				saveAndRender();
			}
		}
		document.querySelectorAll('.task-list').forEach((l) => l.classList.remove('drag-over'));
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.open) modal.close();
	});
}

init();
