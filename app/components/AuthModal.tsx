'use client';

import { ChangeEvent, useEffect } from 'react';

import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthModalInputs from './AuthModalInputs';
import useAuth from '../../pages/api/hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const { error, loading, data, setAuthState } = useContext(
    AuthenticationContext
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin } = useAuth();

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
  });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const renderContent = (signinContent: string, signupContent: string) => {
    return isSignin ? signinContent : signupContent;
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const { password, email, firstName, lastName, city, phone } = inputs;

    if (isSignin) {
      if (password || email) {
        return setDisabled(false);
      }
    } else {
      if (firstName && lastName && password && email && city && phone) {
        return setDisabled(false);
      }
    }
    setDisabled(true);
  }, [inputs]);

  const handleClick = () => {
    const { password, email, firstName, lastName, city, phone } = inputs;

    if (isSignin) {
      signin({ email, password, handleClose });
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className={`${renderContent(
          'bg-blue-400 text-white',
          ''
        )} border p-1 px-4 rounded mr-3`}
      >
        {renderContent('Sign in', 'Sign up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 px-2 h-[600px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[600px]">
              {error ? (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p id="modal-modal-title" className="text-sm">
                  {renderContent('Sign In', 'Create Account')}
                </p>
              </div>
              <div className="m-auto">
                <h2
                  id="modal-modal-description"
                  className="text-2xl font-light text-center"
                >
                  {renderContent(
                    'Log Into Your Account',
                    'Create Your OpenTable Account'
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                <button
                  disabled={disabled}
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  onClick={handleClick}
                >
                  {renderContent('Sign In', 'Create Account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
