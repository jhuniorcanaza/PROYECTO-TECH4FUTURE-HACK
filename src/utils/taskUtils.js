export const TASK_EMPTY_ERROR = 'Ingresa una tarea antes de registrar.'

export function normalizeTaskText(text) {
  return String(text ?? '').trim()
}

export function isTaskTextValid(text) {
  return normalizeTaskText(text).length > 0
}

export function createTask(text, id = Date.now()) {
  return {
    id,
    text: normalizeTaskText(text),
    completed: false,
  }
}

export function addTask(tasks, text, id = Date.now()) {
  if (!isTaskTextValid(text)) {
    return { tasks, error: TASK_EMPTY_ERROR }
  }

  return {
    tasks: [createTask(text, id), ...tasks],
    error: '',
  }
}

export function toggleTaskCompletion(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  )
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => !task.completed)
}
