import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import * as R from 'ramda';
import { Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Task } from '../../../types/tasks-types';
import { useStore } from '../../../store/todolist-store';

import './search-input.scss';

const selectOptions = [
  {
    label: 'Все',
    value: 'all',
  },
  {
    label: 'Выполненные',
    value: true,
  },
  {
    label: 'Не выполненные',
    value: false,
  },
];

type Props = {
  taskList: Task[],
  isEditable: boolean,
  formDataId?: string,
};

export const SearchInput = observer(({ taskList, isEditable, formDataId }: Props) => {
  const { todolistStore } = useStore();

  const [searchValue, setSearchValue] = useState('');

  const handleChange = useCallback(({ currentTarget: { value } }: any) => {
    setSearchValue(value);

    if (value) {
      if (formDataId || isEditable) {
        todolistStore.formData = {};
      }
      todolistStore.filteredTasks = taskList.filter(
        ({ title, description }: Task) => R.includes(value, title || '') || R.includes(value, description || ''),
      );
    } else {
      todolistStore.filteredTasks = null;
    }
  }, [formDataId, isEditable, taskList, todolistStore]);

  const handleSelect = useCallback((value: any) => {
    todolistStore.filteredTasks = taskList.filter(
      ({ isCompleted }: Task) => value === 'all' || isCompleted === value,
    );
  }, [taskList, todolistStore]);

  return (
    <Input
      className="search-input"
      placeholder="Поиск по тексту"
      onChange={handleChange}
      value={searchValue}
      addonAfter={(
        <Select
          className="z-0"
          onSelect={handleSelect}
          defaultValue={selectOptions[0]}
          suffixIcon={(
            <FilterOutlined className="z-n1" style={{ color: 'white' }} />
          )}
          options={selectOptions}
          dropdownStyle={{ minWidth: 180 }}
        />
      )}
    />
  );
});
