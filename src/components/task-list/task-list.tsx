import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UnorderedListOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';
import Sider from 'antd/lib/layout/Sider';
import { List, Descriptions } from 'antd';
import { TaskItem } from './task-item/task-item';
import { InitialDnDState, Task } from '../../types/tasks-types';
import { useStore } from '../../store/todolist-store';

import './task-list.scss';

const initialDnDState : InitialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

export const TaskList = observer(() => {
  const { todolistStore } = useStore();
  const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);

  const { taskList, filteredTasks, isEditable } = todolistStore;

  const [sidebarWidth, setSidebarWidth] = useState('100%');
  const [isCollapsed, setCollapsed] = useState(false);
  const [isCollapsible, setCollapsible] = useState(false);

  const completedTasksCount = taskList.filter(({ isCompleted }: Task) => isCompleted).length;

  const onDragStart = useCallback((event: any) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: taskList,
    });

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData('text/html', '');
  }, [dragAndDrop, taskList]);

  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = useCallback((event: any) => {
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();
    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const { draggedFrom } = dragAndDrop;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom || 0];
    const remainingItems = newList.filter((item: Task, index: number) => index !== draggedFrom);

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo,
      });
    }
  }, [dragAndDrop]);

  const onDrop = useCallback(() => {
    todolistStore.taskList = dragAndDrop.updatedOrder;

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  }, [dragAndDrop, todolistStore]);

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  return (
    <Sider
      collapsedWidth={0}
      width={sidebarWidth}
      theme="light"
      className="task-list"
      breakpoint="md"
      zeroWidthTriggerStyle={{ backgroundColor: blue.primary }}
      trigger={<UnorderedListOutlined style={{ color: 'white' }} />}
      onBreakpoint={(isMobile) => {
        setCollapsible(isMobile);
        setSidebarWidth(isMobile ? '100%' : '350px');
      }}
      collapsed={isCollapsible ? isEditable || isCollapsed : false}
      onCollapse={(collapsed) => {
        if (!isCollapsed) {
          todolistStore.isEditable = false;
        }

        setCollapsed(collapsed);
      }}
    >
      {!taskList.length
        ? (
          <div className="text-center p-3">
            Список задач пуст
          </div>
        ) : (
          <List>
            <Descriptions className="m-2 fw-bold text-center" layout="vertical" bordered>
              <Descriptions.Item label="Выполнено">
                <span className="text-success">
                  {completedTasksCount}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Не выполнено">
                <span className="text-warning">
                  {taskList.length - completedTasksCount}
                </span>
              </Descriptions.Item>
            </Descriptions>
            {(filteredTasks || taskList).map(({
              title, description, date, id, isCompleted,
            }: Task, index) => (
              <TaskItem
                key={id}
                title={title}
                description={description}
                date={date}
                id={id}
                isCompleted={isCompleted}
                setCollapsed={setCollapsed}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragLeave={onDragLeave}
                index={index}
                isDropArea={dragAndDrop?.draggedTo === Number(index)}
              />
            ))}
          </List>
        )}
    </Sider>
  );
});
