import React from 'react';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function CustomLink({ href, children }: Props) {
  return (
    <a
      href={href}
      className="hover:cursor-pointer text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
    >
      {children}
    </a>
  );
}
