export function generateId(prefix = 't') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function createTask(title, description = '', priority = 'medium', dueDate = '', labelsStr = '') {
    return {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        priority: ['high','medium','low'].includes(priority) ? priority : 'medium',
        dueDate: dueDate.trim(),
        labels: labelsStr ? labelsStr.split(',').map(l => l.trim()).filter(Boolean) : [],
        createdAt: Date.now()
    };
}