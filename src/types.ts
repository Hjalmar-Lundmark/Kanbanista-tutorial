export interface ITask {
  id: string
  created: string
  title: string
  priority: number
  description?: string
  status: TaskStatus
}

export enum TaskStatus {
  Todo,
  InProgress,
  Done
}
