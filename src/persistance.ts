import { ref } from 'vue'
import { type ITask, TaskStatus } from '@/types'
import { useLocalStorage } from '@vueuse/core'

const done = useLocalStorage<ITask[]>('done-key', [])
const inProgress = useLocalStorage<ITask[]>('in-progress-key', [])
const todo = useLocalStorage<ITask[]>('todo-key', [])

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function remove(task: ITask) {
  todo.value = todo.value.filter((t) => t.id !== task.id)
  inProgress.value = inProgress.value.filter((t) => t.id !== task.id)
  done.value = done.value.filter((t) => t.id !== task.id)
}

function add(task: ITask) {
  const tasks = {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done
  }
  tasks[task.status].value.push({ ...task, id: uuid() })
}

function reset() {
  todo.value = [
    {
      id: uuid(),
      created: '2024-03-18T06:10:19.077Z',
      title: 'This task is in the todo list',
      description: '## This is H2\n### This is H3\n#### This is H4\nThen some smallish paragraph',
      priority: 1,
      status: TaskStatus.Todo
    }
  ]
  inProgress.value = [
    {
      id: uuid(),
      created: '2024-04-13T06:10:19.077Z',
      title: "This task is in progress. You can drag it to the done list when it's done.",
      description:
        '## *Cat picture in cursive* ![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)',
      priority: 2,
      status: TaskStatus.InProgress
    }
  ]
  done.value = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: 'This task is done. You can drag it back to the todo list if you need to do it again.',
      priority: 3,
      status: TaskStatus.Done
    }
  ]
}

function taskById(id: string) {
  return [...todo.value, ...inProgress.value, ...done.value].find((task) => task.id === id)
}

export function usePersistance() {
  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    add,
    remove,
    reset,
    taskById
  }
}
