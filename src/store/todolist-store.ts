import { createContext, useContext } from 'react';
import { makeAutoObservable } from 'mobx';
import { Task } from '../types/tasks-types';

const todolistStore = () => makeAutoObservable({
  taskList: [] as Task[],
  filteredTasks: null as Task[] | null,
  formData: {} as Task,
  isEditable: false,
});

const store = {
  todolistStore: todolistStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
