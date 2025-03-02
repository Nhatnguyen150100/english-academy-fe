import React from 'react';
import { TLevel } from '../../types/exam.types';
import { Tag } from 'antd';

export function onChooseLevel(levelPram: TLevel | undefined): React.ReactNode {
  if (!levelPram) return null;
  let level;
  switch (levelPram) {
    case 'EASY':
      level = <Tag color="green">Easy</Tag>;
      break;
    case 'MEDIUM':
      level = <Tag color="orange">Medium</Tag>;
      break;
    case 'HARD':
      level = <Tag color="red">Hard</Tag>;
      break;
    default:
      level = <Tag color="green">Easy</Tag>;
      break;
  }
  return level;
}
