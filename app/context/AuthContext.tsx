'use client';

import { createContext, Dispatch, SetStateAction, useState } from 'react';

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface IState {
  loading: boolean;
  error: string | null;
  data: IUser | null;
}

interface IAuthState extends IState {
  setAuthState: Dispatch<
    SetStateAction<{
      loading: boolean;
      data: null;
      error: null;
    }>
  >;
}

export const AuthenticationContext = createContext<IAuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState({
    loading: false,
    data: null,
    error: null,
  });

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
