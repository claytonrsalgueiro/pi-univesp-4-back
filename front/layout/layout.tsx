import React, { Suspense } from 'react';
import type { ChildContainerProps } from '@/types';
import AppTopBarMenu from './AppTopBarMenu';

const Layout = (props: ChildContainerProps) => {
    return (
    <Suspense fallback={null}>
      <AppTopBarMenu>{props.children}</AppTopBarMenu>
    </Suspense>
  );
};

export default Layout;
