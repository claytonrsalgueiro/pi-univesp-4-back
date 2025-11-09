'use client';
import { Toast } from 'primereact/toast';
import { createContext, ReactNode, useContext, useRef } from 'react';

type ToastOptions = {
    severity: 'success' | 'info' | 'warn' | 'error' | undefined;
    detail: string;
};

type ShowToastContext = {
    showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ShowToastContext | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const toastRef = useRef<Toast>(null);

    const showToast = (options: ToastOptions) => {
        if (!toastRef.current) return;
        const title = getTitle(options.severity);
        toastRef.current?.show({ ...options, summary: title, life: 3000 });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            <div>{children}</div>
            <Toast ref={toastRef} content="" />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToastContext have to be used within ToastContextProvider');
    }

    return context;
};

function getTitle(severity: string | undefined) {
    switch (severity) {
        case 'success':
            return 'Sucesso';
        case 'info':
            return 'Informação';
        case 'warn':
            return 'Alerta';
        case 'error':
            return 'Erro';
        default:
            return 'Informação';
    }
}
