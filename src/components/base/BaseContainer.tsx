import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function BaseContainer({ children, className }: Props) {
  return (
    <div
      className={`flex flex-wrap justify-between items-start mx-auto max-w-screen-xl my-10 ${
        className ?? ''
      }`}
    >
      {children}
    </div>
  );
}
