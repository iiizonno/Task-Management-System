/** @format */

import { STORAGE_KEY, COLUMNS } from './constants.js';

export function loadTaskData() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		let data = saved ? JSON.parse(saved) : null;

		if (!data || !data.todo) {
			data = {};
			COLUMNS.forEach((c) => (data[c.id] = []));
		}
		return data;
	} catch (e) {
		console.error('Load failed', e);
		return Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
	}
}

export function mergeTaskData(existingData, newData) {
	try {
		const merged = { ...existingData };
		COLUMNS.forEach((col) => {
			if (newData[col.id] && Array.isArray(newData[col.id])) {
				merged[col.id] = [...(merged[col.id] || []), ...newData[col.id]];
			}
		});
		return merged;
	} catch (e) {
		console.error('Merge failed', e);
		return existingData;
	}
}

export function downloadBackup(data) {
	try {
		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `task-backup-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	} catch (e) {
		console.error('Download failed', e);
	}
}

export function saveTaskData(data) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (e) {
		console.error('Save failed', e);
	}
}
