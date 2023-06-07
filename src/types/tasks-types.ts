export interface Task {
  id?: string,
  title?: string,
  description?: string,
  date?: number,
  isCompleted?: boolean,
}

export interface InitialDnDState {
  draggedFrom: null | number,
  draggedTo: null | number,
  isDragging: boolean,
  originalOrder: Task[],
  updatedOrder: Task[],
}
