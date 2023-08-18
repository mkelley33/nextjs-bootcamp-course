'use client';

import { ChangeEvent, useEffect, useState } from 'react';

export default function Form() {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  });

  const [disabled, setDisabled] = useState(true);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const { bookerFirstName, bookerLastName, bookerPhone, bookerEmail } =
      inputs;
    setDisabled(
      !bookerFirstName || !bookerLastName || !bookerPhone || !bookerEmail
    );
  }, [inputs]);

  const handleSubmit = () => {
    setDisabled(true);

    setDisabled(false);
  };

  return (
    <form
      className="mt-10 flex flex-wrap justify-between w-[660px]"
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
        disabled={disabled}
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
      >
        Complete reservation
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </form>
  );
}
