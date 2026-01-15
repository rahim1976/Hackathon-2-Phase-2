'use client';

import React, { ReactNode } from 'react';
import { AuthProvider as AuthContextProvider } from '../contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const AppAuthProvider: React.FC<Props> = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
};

export default AppAuthProvider;