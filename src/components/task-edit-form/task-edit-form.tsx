import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, Checkbox, Descriptions, Form,
} from 'antd';
import moment from 'moment/moment';
import TextArea from 'antd/lib/input/TextArea';
import { Task } from '../../types/tasks-types';
import { useStore } from '../../store/todolist-store';
import { Store } from '../../types/store-types';

import './task-edit-form.scss';

export const TaskEditForm = observer(() => {
  const { todolistStore } = useStore();

  const { formData, isEditable, taskList } : Store = todolistStore;

  const {
    title, description, date, id, isCompleted,
  }: Task = formData;

  const hasId = !!id;

  const handleChange = useCallback(({ target: { dataset: { name }, value } }: any) => {
    todolistStore.formData = {
      ...formData,
      [name]: name === 'isCompleted' ? !isCompleted : value,
    };
  }, [todolistStore, formData, isCompleted]);

  const handleSubmit = useCallback(() => {
    if (hasId) {
      todolistStore.taskList = taskList.map((item: Task) => (item.id === id ? formData : item));
    } else {
      const newItem : Task = {
        ...formData,
        id: Math.random().toString(36),
        date: Date.now(),
        isCompleted: !!isCompleted,
      };

      todolistStore.formData = newItem;

      todolistStore.taskList.push(newItem);
    }

    todolistStore.isEditable = false;
  }, [hasId, todolistStore, taskList, id, formData, isCompleted]);

  return (
    <Form onChange={handleChange} className="d-flex flex-column h-100 px-5 py-3 task-edit-form" onFinish={handleSubmit}>
      <div className="text-center">
        {!!date && moment(date).format('DD.MM.YYYY hh:mm')}
        {!date && (isEditable ? 'Новая задача' : 'Добавьте задачу или выберите из списка')}
      </div>
      {isEditable ? (
        <>
          <TextArea placeholder="Введите название задачи" data-name="title" className="mt-2" value={title} />
          <TextArea placeholder="Введите описание" className="addition-text-input my-2" data-name="description" value={description} />
          <Checkbox data-name="isCompleted" className="mb-5" checked={isCompleted}>Выполнено</Checkbox>
          <Button type="primary" htmlType="submit">
            {hasId ? 'Сохранить' : 'Добавить'}
          </Button>
        </>
      ) : !!(description || title) && (
        <>
          <div className="h1 my-4 w-100 text-truncate text-wrap main-text">{title || <span className="text-body-secondary">(без заголовка)</span>}</div>
          <div className="w-100 text-truncate text-wrap addition-text mb-2">{description}</div>
          <Descriptions className="mt-auto" bordered>
            <Descriptions.Item className="fw-bold" label="Статус">
              {isCompleted
                ? <span className="text-success"> Выполнено</span>
                : <span className="text-warning"> Не выполнено</span>}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Form>
  );
});
