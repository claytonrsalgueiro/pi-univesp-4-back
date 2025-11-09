'use client';
import { Page } from '@/types';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

const ForgotPassword: Page = () => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button label="Esqueci a senha" type="button" text severity="info" onClick={() => setVisible(true)}></Button>
            <Dialog
                visible={visible}
                modal
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
                content={null}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <div className="flex surface-card px-5 flex flex-column" style={{ borderRadius: '14px' }}>
                    <h1 className="font-bold text-2xl mt-0 mb-2">Esqueceu a Senha?</h1>
                    <p className="text-color-secondary mb-4">Informe seu endereço de e-mail para resetar a senha.</p>

                    <span className="p-input-icon-left mb-4">
                        <i className="pi pi-user"></i>
                        <InputText type="text" name="email" placeholder="Email" className="w-full" />
                    </span>
                </div>

                <Button label="Solicitar Reset de Senha"></Button>
            </Dialog>
        </>
    );
};

export default ForgotPassword;
