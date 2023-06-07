import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import moment from 'moment';
import Item from 'antd/lib/list/Item';

import { Task } from '../../../types/tasks-types';

import './task-item.scss';
import { useStore } from '../../../store/todolist-store';

interface Props extends Task {
  setCollapsed: (arg: any)=> void,
  onDragStart: (arg: any)=> void,
  onDragOver: (arg: any)=> void,
  onDrop: (arg: any)=> void,
  onDragLeave: (arg: any)=> void,
  index: number,
  isDropArea: boolean,
}

export const TaskItem = observer(({
  title, description, date, id, isCompleted, index, isDropArea,
  setCollapsed, onDragLeave, onDragStart, onDragOver, onDrop,
}: Props) => {
  const { todolistStore } = useStore();
  const formDataId = todolistStore.formData.id;

  const handleItemClick = useCallback(() => {
    setCollapsed(true);

    todolistStore.formData = {
      title, description, date, id, isCompleted,
    };

    todolistStore.isEditable = false;
  }, [setCollapsed, title, description, date, id, isCompleted, todolistStore]);

  return (
    <Item
      onDragLeave={onDragLeave}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-position={index}
      onClick={handleItemClick}
      className={classnames('task border-2 p-2 d-flex flex-column align-items-start text-truncate', {
        'bg-body-secondary': formDataId === id && !isCompleted,
        'bg-success': isCompleted,
        'bg-opacity-75': formDataId !== id && isCompleted,
        'drop-area': isDropArea,
      })}
      draggable
    >
      <div className={classnames('h5 w-100 text-truncate', {
        'text-decoration-line-through': isCompleted,
      })}
      >
        {title || <span className="text-body-secondary">(без заголовка)</span>}
      </div>
      <div className="d-flex justify-content-between w-100">
        <span className="task-created">
          Cоздано:
          {' '}
          <b>{moment(date).format('DD.MM.YYYY hh:mm')}</b>
        </span>
        {isCompleted && <span>выполнено</span>}
      </div>
    </Item>
  );
});
