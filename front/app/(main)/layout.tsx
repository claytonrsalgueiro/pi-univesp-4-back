import { Metadata, Viewport } from 'next';
import Layout from '../../layout/layout';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Weather',
    description: 'Weather - Processamento de dados e Exportação',
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: 'Weather',
        description: 'Weather - Processamento de dados e Exportação',
        ttl: 604800
    },
    icons: {
        icon: 'icon.png'
    }
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function MainLayout({ children }: MainLayoutProps) {
    return <Layout>{children}</Layout>;
}
