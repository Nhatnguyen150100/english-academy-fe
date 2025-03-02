import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export default function TheLayout({ children }: IProps) {
  return (
    <>
      {children}
    </>
  );
}
