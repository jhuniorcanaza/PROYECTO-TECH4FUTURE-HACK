import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Plus } from 'lucide-react'
import {
  addTask,
  getPendingTasks,
  TASK_EMPTY_ERROR,
  toggleTaskCompletion,
} from '../utils/taskUtils'

export default function TaskManager() {
  const [taskText, setTaskText] = useState('')
  const [error, setError] = useState('')
  const [tasks, setTasks] = useState([])

  const pendingCount = useMemo(() => getPendingTasks(tasks).length, [tasks])

  const handleAddTask = () => {
    const result = addTask(tasks, taskText)
    setTasks(result.tasks)
    setError(result.error)
    if (result.error === TASK_EMPTY_ERROR) return
    setTaskText('')
  }

  const toggleTask = (id) => {
    setTasks((prev) => toggleTaskCompletion(prev, id))
  }

  const pendingTasks = getPendingTasks(tasks)

  return (
    <section id="tareas" className="py-16 bg-gradient-to-b from-emerald-50/60 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Actividad 4: Tareas de Monitoreo</h2>
          <p className="text-gray-600">
            Registra tareas, visualiza pendientes y marca las completadas.
          </p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Ejemplo: Registrar ave observada en el sector norte"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleAddTask}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar tarea
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pendientes</h3>
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {pendingCount}
            </span>
          </div>

          {pendingTasks.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No hay tareas pendientes.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingTasks.map((task, index) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <span className="text-gray-800 text-sm sm:text-base">{task.text}</span>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Completar
                  </button>
                </motion.li>
              ))}
            </ul>
          )}

          {tasks.some((task) => task.completed) && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Completadas</h3>
              <ul className="mt-3 space-y-2">
                {tasks
                  .filter((task) => task.completed)
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-2 text-gray-500 text-sm line-through"
                    >
                      <Circle className="w-3 h-3" />
                      {task.text}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
