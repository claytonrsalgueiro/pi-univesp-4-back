'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';

function NotFound() {
    const router = useRouter();

    const navigateToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <React.Fragment>
            <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
                <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '14px' }}>
                    <h1 className="font-bold text-2xl mt-0 mb-2">404 - Não Encontrado</h1>
                    <p className="text-color-secondary mb-4">
                        A página que você está tentando acessar não existe ou ocorreu um erro. Tente novamente ou volte para o{' '}
                        <a onClick={navigateToDashboard} className="font-bold text-primary hover:underline" style={{ cursor: 'pointer' }}>
                            dashboard
                        </a>
                        .
                    </p>

                    <Button onClick={navigateToDashboard} label="Ir para Dashboard" className="mt-4"></Button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default NotFound;
