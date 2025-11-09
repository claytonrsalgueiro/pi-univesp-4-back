'use client';
import React from 'react';
import type { Page } from '@/types';

const ErroPage: Page = () => {
  return (
    <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
      <div
        className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
        style={{ borderRadius: '14px' }}
      >
        <h1 className="font-bold text-2xl mt-0 mb-2">ERRO</h1>
        <p className="text-color-secondary mb-4">
          Ocorreu um erro. Tente acessar essa página novamente mais tarde.
        </p>
        <img
          src="/layout/images/pages/auth/error.svg"
          alt="error"
          className="mb-4 align-self-center"
        />
      </div>
    </div>
  );
};

export default ErroPage;
