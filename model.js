// model.ts — the typed core of the app. No DOM code lives here.
export const STATUSES = ["todo", "in-progress", "done"];
/** Returns a new list with the task added. Blank titles are ignored. */
export function addTask(tasks, title) {
    const clean = title.trim();
    if (clean === "") {
        return [...tasks];
    }
    const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
    const task = {
        id: nextId,
        title: clean,
        status: "todo",
        createdAt: Date.now(),
    };
    return [...tasks, task];
}
/** todo -> in-progress -> done -> (back to) todo */
export function nextStatus(status) {
    switch (status) {
        case "todo":
            return "in-progress";
        case "in-progress":
            return "done";
        case "done":
            return "todo";
    }
}
/** Moves one task a step along its status path. */
export function advanceTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: nextStatus(task.status) } : task);
}
/** Removes one task. */
export function removeTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
/** Keeps only tasks matching the status; "all" keeps everything. */
export function filterByStatus(tasks, status) {
    if (status === "all") {
        return [...tasks];
    }
    return tasks.filter((task) => task.status === status);
}
/** Counts per status, plus the total under "all". */
export function countByStatus(tasks) {
    const counts = {
        all: tasks.length,
        todo: 0,
        "in-progress": 0,
        done: 0,
    };
    for (const task of tasks) {
        counts[task.status] += 1;
    }
    return counts;
}
export function isStatusFilter(value) {
    return value === "all" || STATUSES.some((status) => status === value);
}
/** Runtime check used when reading saved tasks back from storage. */
export function isTask(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value;
    return (typeof candidate.id === "number" &&
        typeof candidate.title === "string" &&
        typeof candidate.createdAt === "number" &&
        STATUSES.some((status) => status === candidate.status));
}
