/** @format */

export const STORAGE_KEY = 'taskboard-data';

export const COLUMNS = [
	{ id: 'todo', title: 'To Do' },
	{ id: 'inprogress', title: 'In Progress' },
	{ id: 'done', title: 'Done' },
];

export const PRIORITIES = {
	high: { label: 'IMPORTANT', color: '#ef4444' },
	medium: { label: 'MEDIUM', color: '#eab308' },
	low: { label: 'LOW', color: '#22c55e' },
};
