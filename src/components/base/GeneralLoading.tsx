import { Spin } from 'antd';
import React from 'react';

type Props = {
  isLoading: boolean;
};

export default function GeneralLoading({ isLoading }: Props) {
  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
