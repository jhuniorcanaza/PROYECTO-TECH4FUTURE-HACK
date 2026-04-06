import { describe, expect, it } from 'vitest'
import {
  TASK_EMPTY_ERROR,
  addTask,
  getPendingTasks,
  isTaskTextValid,
  toggleTaskCompletion,
} from './taskUtils'

describe('taskUtils', () => {
  it('valida que no se registren tareas vacias', () => {
    expect(isTaskTextValid('   ')).toBe(false)
    expect(isTaskTextValid('Registrar observacion')).toBe(true)
  })

  it('registra una tarea nueva con texto limpio', () => {
    const result = addTask([], '  Monitorear ave  ', 101)

    expect(result.error).toBe('')
    expect(result.tasks).toHaveLength(1)
    expect(result.tasks[0]).toEqual({
      id: 101,
      text: 'Monitorear ave',
      completed: false,
    })
  })

  it('retorna error cuando el registro es vacio', () => {
    const existing = [{ id: 1, text: 'Tarea previa', completed: false }]
    const result = addTask(existing, '   ', 102)

    expect(result.error).toBe(TASK_EMPTY_ERROR)
    expect(result.tasks).toEqual(existing)
  })

  it('marca una tarea como completada y lista pendientes', () => {
    const tasks = [
      { id: 1, text: 'Primera', completed: false },
      { id: 2, text: 'Segunda', completed: false },
    ]

    const toggled = toggleTaskCompletion(tasks, 2)
    const pending = getPendingTasks(toggled)

    expect(toggled[1].completed).toBe(true)
    expect(pending).toEqual([{ id: 1, text: 'Primera', completed: false }])
  })
})
