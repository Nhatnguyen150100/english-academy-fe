import { Tag } from 'antd';
import React from 'react';

type Props = {
  level: string;
};

export default function TagN1({ level }: Props) {
  return (
    <Tag className="m-0 p-0" color="purple">
      <span className="text-xl flex justify-center items-center px-2">
        {level}
      </span>
    </Tag>
  );
}
