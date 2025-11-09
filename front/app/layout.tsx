import { LayoutProvider } from '../layout/context/layoutcontext';
import '../styles/layout/layout.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import AuthProvider from './providers/AuthProvider';
import { getLoggedUserInfo } from './auth/dal';
import { ToastProvider } from './providers/ToastProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const userPromise = getLoggedUserInfo().then((res) => res.data);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-link" href={`/theme/theme-light/red/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <LayoutProvider>
                    <ToastProvider>
                        <AuthProvider userPromise={userPromise}>{children}</AuthProvider>
                    </ToastProvider>
                </LayoutProvider>
            </body>
        </html>
    );
}
