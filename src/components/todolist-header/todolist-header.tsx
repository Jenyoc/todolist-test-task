import React, { useCallback } from 'react';
import { Header } from 'antd/lib/layout/layout';
import { Button, Popconfirm } from 'antd';
import { observer } from 'mobx-react-lite';
import {
  DeleteTwoTone, EditTwoTone, CheckOutlined, ReloadOutlined,
} from '@ant-design/icons';
import * as R from 'ramda';
import classNames from 'classnames';
import { SearchInput } from './search-input/search-input';
import { Task } from '../../types/tasks-types';
import { useStore } from '../../store/todolist-store';

import './todolist-header.scss';

export const TodolistHeader = observer(() => {
  const { todolistStore } = useStore();

  const { isEditable, formData, taskList } = todolistStore;
  const { isCompleted } = formData;

  const formDataId = formData.id;

  const handleDeleteButtonClick = useCallback(() => {
    todolistStore.taskList = R.reject(({ id }: Task) => id === formDataId, taskList);
  }, [todolistStore, taskList, formDataId]);

  const handleEditButtonClick = useCallback(() => {
    todolistStore.isEditable = true;
  }, [todolistStore]);

  const setNewForm = useCallback(() => {
    todolistStore.isEditable = true;
    todolistStore.formData = {};
    todolistStore.filteredTasks = null;
  }, [todolistStore]);

  const handleCheckButtonClick = useCallback(() => {
    todolistStore.taskList = taskList.map(
      (item: Task) => {
        if (item.id === formDataId) {
          const newItem = { ...item, isCompleted: !isCompleted };

          todolistStore.formData = newItem;

          return newItem;
        }
        return item;
      },
    );
  }, [todolistStore, taskList, formDataId, isCompleted]);

  const isEditDisabled = isEditable || !formDataId;
  const isDeleteDisabled = !formDataId;

  return (
    <Header className="todolist-header d-flex flex-column-reverse flex-md-row align-items-center justify-content-between text-white py-2 py-md-auto">
      <div className="edit-buttons-container d-flex justify-content-center justify-content-md-between mt-2 mt-md-0">
        <Button
          disabled={todolistStore.isEditable}
          type="primary"
          className={todolistStore.isEditable ? 'bg-white' : ''}
          onClick={setNewForm}
        >
          Добавить задачу
        </Button>
        <Button
          onClick={handleEditButtonClick}
          className={classNames('mx-2 mx-md-0', { 'bg-white': isEditDisabled })}
          type="primary"
          icon={<EditTwoTone twoToneColor={isEditDisabled ? 'gray' : 'white'} />}
          disabled={isEditDisabled}
          title="Редактировать"
        />

        <Popconfirm
          placement="topLeft"
          title="Удалить задачу"
          description="Вы уверены, что хотите удалить задачу?"
          onConfirm={handleDeleteButtonClick}
          okText="Да"
          cancelText="Отмена"
          disabled={!formDataId}
        >
          <Button
            className={classNames('border-0 rounded-1', {
              'bg-danger': !isDeleteDisabled,
              'bg-white': isDeleteDisabled,
            })}
            icon={<DeleteTwoTone twoToneColor={isDeleteDisabled ? 'gray' : 'white'} />}
            disabled={isDeleteDisabled}
            title="Удалить"
          />
        </Popconfirm>

        <Button
          onClick={handleCheckButtonClick}
          className={classNames('todolist-header-completed-button', {
            'bg-white': isCompleted,
            'bg-success': !isCompleted,
            invisible: isEditDisabled,
          })}
          type="link"
          icon={isCompleted
            ? <ReloadOutlined style={{ color: 'black' }} />
            : <CheckOutlined style={{ color: 'white' }} />}
          disabled={isEditDisabled}
          title="Пометить выполненым"
        />
      </div>
      <SearchInput taskList={taskList} isEditable={isEditable} formDataId={formDataId} />
    </Header>
  );
});
