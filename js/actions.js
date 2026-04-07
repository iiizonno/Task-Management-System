/** @format */

import { createTask } from './models.js';
import { saveTaskData } from './storage.js';

export function addNewTask(data, title, description, priority) {
	const task = createTask(title, description, priority);
	if (!data.todo) data.todo = [];
	data.todo.unshift(task); // newest first
	saveTaskData(data);
	return data;
}

export function deleteTaskById(data, id) {
	Object.keys(data).forEach((key) => {
		data[key] = data[key].filter((t) => t.id !== id);
	});
	saveTaskData(data);
	return data;
}

export function moveTaskToColumn(data, taskId, targetColumn) {
	let movedTask = null;

	for (let col in data) {
		const idx = data[col].findIndex((t) => t.id === taskId);
		if (idx !== -1) {
			movedTask = data[col].splice(idx, 1)[0];
			break;
		}
	}

	if (movedTask) {
		if (!data[targetColumn]) data[targetColumn] = [];
		data[targetColumn].unshift(movedTask);
		saveTaskData(data);
	}
	return data;
}
