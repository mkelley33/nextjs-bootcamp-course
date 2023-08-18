'use client';
import { useContext } from 'react';

import Link from 'next/link';
import AuthModal from './AuthModal';
import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '../../pages/api/hooks/useAuth';
export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      {loading ? null : (
        <div className="flex">
          {data ? (
            <button
              className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
              onClick={signout}
            >
              Sign out
            </button>
          ) : (
            <>
              <AuthModal isSignin />
              <AuthModal isSignin={false} />
            </>
          )}
        </div>
      )}
    </nav>
  );
}
