import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Upload Dados',
            icon: 'pi pi-fw pi-upload',
            to: '/meteo',
            roles: ['F', 'C', 'A']
        },
        {
            label: 'Gráficos',
            icon: 'pi pi-fw pi-home',
            to: '/meteo/graficos',
            roles: ['F', 'C', 'A']
        },
        
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
