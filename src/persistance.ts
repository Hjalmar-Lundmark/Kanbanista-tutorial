import { ref } from 'vue'
import { type ITask, TaskStatus } from '@/types'
import { watchDebounced, useMousePressed } from '@vueuse/core'
import mqtt, { type MqttClient } from 'mqtt'

const done = ref<ITask[]>([])
const inProgress = ref<ITask[]>([])
const todo = ref<ITask[]>([])
const { pressed } = useMousePressed()
let client: MqttClient
const topic = 'wtf_is_this_nonsense_12345/board'
const url = 'wss://test.mosquitto.org:8081/mqtt'

function uuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function update() {
  const tasks = {
    [TaskStatus.Todo]: todo.value,
    [TaskStatus.InProgress]: inProgress.value,
    [TaskStatus.Done]: done.value
  }
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(tasks), { retain: true })
  }
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
  const todo = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: 'This task is in the todo list',
      description: '## This is H2\n### This is H3\n#### This is H4\nThen some smallish paragraph',
      priority: 1,
      status: TaskStatus.Todo
    }
  ]
  const InProgress = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: "This task is in progress. You can drag it to the done list when it's done.",
      description:
        '## *Cat picture in cursive* ![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)',
      priority: 2,
      status: TaskStatus.InProgress
    }
  ]
  const done = [
    {
      id: uuid(),
      created: new Date().toISOString(),
      title: 'This task is done. You can drag it back to the todo list if you need to do it again.',
      priority: 3,
      status: TaskStatus.Done
    }
  ]
  if (client && client.connected) {
    client.publish(
      topic,
      JSON.stringify({
        [TaskStatus.Todo]: todo,
        [TaskStatus.InProgress]: InProgress,
        [TaskStatus.Done]: done
      }),
      { retain: true }
    )
  }
}

function taskById(id: string) {
  return [...todo.value, ...inProgress.value, ...done.value].find((task) => task.id === id)
}

export function usePersistance() {
  if (!client && url) {
    //watch all tasks and update mqtt
    watchDebounced(
      [todo, inProgress, done],
      () => {
        // only update if mouse is not pressed this is to avoid updating while dragging
        if (!pressed.value) {
          update()
        }
      },
      { debounce: 500, deep: true }
    )

    client = mqtt.connect(url)

    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log('Subscribed to topic:', topic)
        }
      })
    })

    client.on('message', (topic, buffer) => {
      try {
        const _tasks = JSON.parse(buffer.toString())
        console.log('Received tasks: ', _tasks)

        // update reactive values only if they are different
        if (JSON.stringify(_tasks[TaskStatus.Todo]) !== JSON.stringify(todo.value)) {
          todo.value = _tasks[TaskStatus.Todo]
        }
        if (JSON.stringify(_tasks[TaskStatus.InProgress]) !== JSON.stringify(inProgress.value)) {
          inProgress.value = _tasks[TaskStatus.InProgress]
        }
        if (JSON.stringify(_tasks[TaskStatus.Done]) !== JSON.stringify(done.value)) {
          done.value = _tasks[TaskStatus.Done]
        }
      } catch (e) {
        console.error('Error parsing message, probably not valid JSON')
        // replace with fake initial tasks
        reset()
      }
    })
  }

  return {
    [TaskStatus.Todo]: todo,
    [TaskStatus.InProgress]: inProgress,
    [TaskStatus.Done]: done,
    add,
    remove,
    reset,
    taskById,
    update
  }
}
