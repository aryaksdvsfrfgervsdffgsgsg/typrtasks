// model.ts — the typed core of the app. No DOM code lives here.

export type TaskStatus = "todo" | "in-progress" | "done";
export type StatusFilter = TaskStatus | "all";

export const STATUSES: readonly TaskStatus[] = ["todo", "in-progress", "done"];

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

/** Returns a new list with the task added. Blank titles are ignored. */
export function addTask(tasks: readonly Task[], title: string): Task[] {
  const clean = title.trim();
  if (clean === "") {
    return [...tasks];
  }
  const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  const task: Task = {
    id: nextId,
    title: clean,
    status: "todo",
    createdAt: Date.now(),
  };
  return [...tasks, task];
}

/** todo -> in-progress -> done -> (back to) todo */
export function nextStatus(status: TaskStatus): TaskStatus {
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
export function advanceTask(tasks: readonly Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: nextStatus(task.status) } : task
  );
}

/** Removes one task. */
export function removeTask(tasks: readonly Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}

/** Keeps only tasks matching the status; "all" keeps everything. */
export function filterByStatus(
  tasks: readonly Task[],
  status: StatusFilter
): Task[] {
  if (status === "all") {
    return [...tasks];
  }
  return tasks.filter((task) => task.status === status);
}

/** Counts per status, plus the total under "all". */
export function countByStatus(
  tasks: readonly Task[]
): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = {
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

export function isStatusFilter(value: unknown): value is StatusFilter {
  return value === "all" || STATUSES.some((status) => status === value);
}

/** Runtime check used when reading saved tasks back from storage. */
export function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.createdAt === "number" &&
    STATUSES.some((status) => status === candidate.status)
  );
}
