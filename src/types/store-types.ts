import { Task } from './tasks-types';

export interface Store {
  taskList: Task[],
  filteredTasks: Task[] | null,
  formData: Task,
  isEditable: boolean,
}
