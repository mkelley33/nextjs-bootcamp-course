'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import camelCaseObject from '../../utils/camelCaseObject';

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
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    try {
      setAuthState({
        data: null,
        error: null,
        loading: true,
      });
      const jwt = getCookie('jwt');
      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
        });
      }

      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({
        data: camelCaseObject(response.data) as any,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
