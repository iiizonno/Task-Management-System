

# Task Management System

A clean, modern **Kanban-style Task Management Web App** built with pure HTML, CSS, and vanilla JavaScript.  
It features drag-and-drop columns (To Do / In Progress / Done), priorities, due dates, labels, filters, backup/restore, and fully persistent data — no backend required.

![Task Board Preview](https://raw.githubusercontent.com/iiizonno/Task-Management-System/refs/heads/main/Screenshot.png)

## Features

- Drag & drop tasks between three columns
- Create, edit, and delete tasks
- Priority levels (Important / Medium / Low) with color coding
- Due dates with automatic overdue highlighting
- Custom labels/tags (comma-separated)
- Real-time filters by priority and tag
- Live statistics (Showing | Done | Overdue)
- Backup & restore data as JSON (with merge support)
- Fully responsive modern UI with glassmorphic design
- Data persists automatically via `localStorage`

## How to Run (Using VS Code Live Server)

1. **Download / Clone** the project folder.
2. Open the folder in **Visual Studio Code**.
3. Install the **Live Server** extension (by Ritwick Dey) if you haven't already.
4. Right-click on `index.html` → **Open with Live Server**.
5. The app will automatically open in your browser at  
   `http://127.0.0.1:5500` (or similar port).

## Project Structure

```
task-management-system/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── renderer.js
│   ├── storage.js
│   ├── models.js
│   ├── constants.js
│   └── actions.js
└── README.md
```
