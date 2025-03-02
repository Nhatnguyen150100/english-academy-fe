import * as React from 'react';

interface IVisibilityProps {
  visibility: boolean;
  children: React.ReactNode;
  boundaryComponent?: boolean;
  suspenseComponent?: React.JSX.Element |  null
}

export default function Visibility({ children, visibility, boundaryComponent = false, suspenseComponent = null }: IVisibilityProps) {
  return <>{visibility ? children : boundaryComponent ? <div /> : suspenseComponent}</>;
}
