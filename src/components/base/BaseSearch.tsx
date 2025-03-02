import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchInputProps {
  placeholder: string;
  onSearch: () => void;
  value: string;
  onHandleChange: (value: string) => void;
}

const BaseSearch: React.FC<SearchInputProps> = ({
  placeholder,
  onSearch,
  onHandleChange,
  value,
}) => {
  return (
    <div className="flex flex-row justify-center items-center h-[60px]">
      <div className="flex items-center border-[1px] border-solid border-gray-300 rounded-3xl overflow-hidden shadow-sm focus-within:shadow-md transition-shadow duration-300 h-full w-[400px]">
        <div className="ps-5">
          <SearchOutlined className="text-gray-500 text-2xl" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onHandleChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          className="flex-1 p-2 outline-none border-none focus:ring-0"
        />
      </div>

      <Button
        className="h-[60px] ms-5 rounded-2xl"
        type="primary"
        onClick={onSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default BaseSearch;
