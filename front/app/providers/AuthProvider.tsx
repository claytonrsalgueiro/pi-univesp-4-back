'use client';
import { createContext, ReactNode, useContext } from 'react';
import { SWRConfig } from 'swr';
import { useToast } from './ToastProvider';

type CurrentUserContext = {
    userPromise: any | null;
};

const AuthContext = createContext<CurrentUserContext | null>({} as CurrentUserContext);

export default function AuthProvider({ children, userPromise }: { children: ReactNode; userPromise: Promise<any | null> }) {
    const { showToast } = useToast();

    return (
        <>
            <AuthContext.Provider value={{ userPromise }}>
                <SWRConfig
                    value={{
                        onError: (error) => {
                            if (error.status !== 403 && error.status !== 404) {
                                showToast({ severity: 'error', detail: error.message || 'Erro' });
                            }
                        }
                    }}
                >
                    {children}
                </SWRConfig>
            </AuthContext.Provider>
        </>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null || context === undefined) {
        throw new Error('useAuth must be used inside of a AuthProvider.');
    }

    return context;
}
