import React from 'react';
import { Layout } from 'antd';
import { TodolistHeader } from './todolist-header/todolist-header';
import { TaskList } from './task-list/task-list';
import { TaskEditForm } from './task-edit-form/task-edit-form';

import './app.scss';

const App = () => (
  <div className="todolist-main d-flex flex-column overflow-x-hidden">
    <TodolistHeader />
    <Layout hasSider>
      <TaskList />
      <Layout.Content>
        <TaskEditForm />
      </Layout.Content>
    </Layout>
  </div>
);

export default App;
