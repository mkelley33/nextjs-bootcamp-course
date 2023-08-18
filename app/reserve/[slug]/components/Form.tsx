'use client';

import { CircularProgress } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import useReservation from '../../../../pages/api/hooks/useReservation';

export default function Form({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  const [day, time] = date.split('T');
  const [disabled, setDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const { error, loading, createReservation } = useReservation();

  useEffect(() => {
    const { bookerFirstName, bookerLastName, bookerPhone, bookerEmail } =
      inputs;
    setDisabled(
      !bookerFirstName || !bookerLastName || !bookerPhone || !bookerEmail
    );
  }, [inputs]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled(true);
    const booking = await createReservation({
      slug,
      partySize,
      time,
      day,
      setDidBook,
      ...inputs,
    });
    if (!error) {
      setDisabled(false);
    }
  };

  return (
    <div className="mt-10 w-[660px]">
      {didBook ? (
        <div>
          <h1>You are all booked up</h1>
          <p>Enjoy your reservation</p>
        </div>
      ) : (
        <form
          className="flex flex-wrap justify-between"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            name="bookerFirstName"
            onChange={handleChangeInput}
            value={inputs.bookerFirstName}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            name="bookerLastName"
            onChange={handleChangeInput}
            value={inputs.bookerLastName}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="bookerPhone"
            onChange={handleChangeInput}
            value={inputs.bookerPhone}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="bookerEmail"
            onChange={handleChangeInput}
            value={inputs.bookerEmail}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            name="bookerOccasion"
            onChange={handleChangeInput}
            value={inputs.bookerOccasion}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            name="bookerRequest"
            onChange={handleChangeInput}
            value={inputs.bookerRequest}
          />
          <button
            disabled={disabled || loading}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              'Complete reservation'
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </form>
      )}
    </div>
  );
}
