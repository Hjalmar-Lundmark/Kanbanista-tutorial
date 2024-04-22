import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '../views/BoardView.vue'
import TaskView from '../views/TaskView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'board',
      component: BoardView,
      children: [
        {
          path: 'create/:type',
          props: true,
          name: 'create-task',
          component: TaskView
        },
        {
          path: 'edit/:taskId',
          props: true,
          name: 'edit-task',
          component: TaskView
        }
      ]
    }
  ]
})

export default router
