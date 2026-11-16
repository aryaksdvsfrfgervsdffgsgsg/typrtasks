// app.ts — connects the typed model to the page.
import { addTask, advanceTask, removeTask, filterByStatus, countByStatus, isStatusFilter, isTask, } from "./model.js";
const STORAGE_KEY = "docket.tasks.v1";
const form = document.getElementById("add-form");
const titleInput = document.getElementById("title");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty");
const summaryEl = document.getElementById("summary");
const filterButtons = Array.from(document.querySelectorAll("button[data-filter]"));
const STATUS_LABEL = {
    todo: "To do",
    "in-progress": "In progress",
    done: "Done",
};
const ACTION_LABEL = {
    todo: "Start",
    "in-progress": "Complete",
    done: "Reopen",
};
const EMPTY_MESSAGE = {
    all: "Nothing on the docket yet. Add your first task above.",
    todo: "No tasks waiting to start.",
    "in-progress": "Nothing in progress right now.",
    done: "No finished tasks yet. Complete one and it lands here.",
};
let tasks = loadTasks();
let activeFilter = "all";
function loadTasks() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === null) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isTask) : [];
    }
    catch {
        return [];
    }
}
function saveTasks() {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
    catch {
        // Storage can be unavailable (private mode); the app still works in memory.
    }
}
function buildTaskItem(task) {
    const item = document.createElement("li");
    item.className = `task task--${task.status}`;
    item.dataset.id = String(task.id);
    const badge = document.createElement("span");
    badge.className = `badge badge--${task.status}`;
    badge.textContent = STATUS_LABEL[task.status];
    const title = document.createElement("span");
    title.className = "task__title";
    title.textContent = task.title;
    const advance = document.createElement("button");
    advance.type = "button";
    advance.className = "btn btn--advance";
    advance.dataset.action = "advance";
    advance.textContent = ACTION_LABEL[task.status];
    advance.setAttribute("aria-label", `${ACTION_LABEL[task.status]}: ${task.title}`);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn--remove";
    remove.dataset.action = "remove";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete: ${task.title}`);
    item.append(badge, title, advance, remove);
    return item;
}
function render() {
    const visible = filterByStatus(tasks, activeFilter);
    const counts = countByStatus(tasks);
    listEl.replaceChildren(...visible.map(buildTaskItem));
    emptyEl.hidden = visible.length > 0;
    emptyEl.textContent = EMPTY_MESSAGE[activeFilter];
    for (const button of filterButtons) {
        const value = button.dataset.filter;
        if (!isStatusFilter(value)) {
            continue;
        }
        button.setAttribute("aria-pressed", String(value === activeFilter));
        const countEl = button.querySelector(".chip__count");
        if (countEl !== null) {
            countEl.textContent = String(counts[value]);
        }
    }
    summaryEl.textContent =
        counts.all === 0
            ? ""
            : `${counts.done} of ${counts.all} done`;
}
function update(next) {
    tasks = next;
    saveTasks();
    render();
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = addTask(tasks, titleInput.value);
    if (next.length === tasks.length) {
        titleInput.focus();
        return;
    }
    titleInput.value = "";
    update(next);
    titleInput.focus();
});
listEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    const button = target.closest("button[data-action]");
    const item = target.closest("li[data-id]");
    if (button === null || item === null) {
        return;
    }
    const id = Number(item.dataset.id);
    if (button.dataset.action === "advance") {
        update(advanceTask(tasks, id));
    }
    else if (button.dataset.action === "remove") {
        update(removeTask(tasks, id));
    }
});
for (const button of filterButtons) {
    button.addEventListener("click", () => {
        const value = button.dataset.filter;
        if (isStatusFilter(value)) {
            activeFilter = value;
            render();
        }
    });
}
render();
