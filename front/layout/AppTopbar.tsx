import { InputText } from 'primereact/inputtext';
import { forwardRef, useContext, useImperativeHandle, useRef, useEffect, useState, use, useCallback } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppTopbarRef } from '@/types';
import { Ripple } from 'primereact/ripple';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { usePathname, useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { logout } from '@/auth/auth-api';
import { useAuth } from '@/app/providers/AuthProvider';
import { Avatar } from 'primereact/avatar';
import { Tooltip } from 'primereact/tooltip';
import { LoggedUserInfo, UserRole } from '@/app/models/logged-user';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { onMenuToggle, layoutConfig, tabs, closeTab } = useContext(LayoutContext);
    const { userPromise } = useAuth();
    const [errorProfileImage, setErrorProfileImage] = useState<boolean>(false);
    const userData = use<LoggedUserInfo>(userPromise);
    const [visible, setVisible] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const menubuttonRef = useRef(null);

    const searchRef = useRef(null);

    const onMenuButtonClick = () => {
        onMenuToggle();
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));

    const logo = () => {
        return '/layout/images/logo_sem_fundo.png';
    };

    useEffect(() => {
        logo();
        setErrorProfileImage(!userData?.foto); // true quando não tiver foto
    }, [userData?.foto]);

    const onCloseTab = (index: number) => {
        if (tabs.length > 1) {
            if (index === tabs?.length - 1) router.push(tabs?.[tabs.length - 2].to);
            else router.push(tabs?.[index + 1].to);
        } else {
            router.push('/');
        }
        closeTab(index);
    };

    const onToggleDialog = (event: boolean) => {
        setVisible(event);
    };

    const photoUrl = () => {
        if (process.env.NEXT_PUBLIC_PHOTO_URL && userData?.foto) {
            return `${process.env.NEXT_PUBLIC_PHOTO_URL}/${userData.foto}`;
        } 
    };

    return (
        <div className="layout-topbar">
            <Link href={'/'} className="app-logo">
                <img alt="app logo" src={logo()} style={{ width: '200px', height: '120px', paddingLeft: '40px' }}/>
            </Link>

            <button ref={menubuttonRef} className="topbar-menubutton p-link" type="button" onClick={onMenuButtonClick}>
                <span></span>
            </button>

            <ul className="topbar-menu">
                {tabs.map((item, i) => {
                    return (
                        <li key={i}>
                            <Link href={item.to} className={classNames({ 'active-route': item.to === pathname })}>
                                <span>{item.label}</span>
                            </Link>
                            <i className="pi pi-times" onClick={() => onCloseTab(i)}></i>
                        </li>
                    );
                })}
                {!tabs || (tabs.length === 0 && <li className="topbar-menu-empty"></li>)}
            </ul>

            <div className="topbar-search">
                {userData?.loggedUser?.tipoUsuario !== UserRole.CLI && (
                    <>
                        <Tooltip target=".topbar-searchbutton" content={'Filtrar Cliente'} />
                        <button className="topbar-searchbutton p-link" onClick={() => onToggleDialog(true)}>
                            <i className="pi pi-search"></i>
                        </button>

                     
                    </>
                )}
            </div>

            <div className="topbar-profile">
                <StyleClass nodeRef={searchRef} selector="@next" enterFromClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                    <button ref={searchRef} className="topbar-profile-button p-link" type="button">
                        <Avatar
                            image={errorProfileImage ? photoUrl() : ''}
                            icon="pi pi-user"
                            style={{ color: 'var(--gray-700)' }}
                            size="large"
                            shape="circle"
                            className="mr-2"
                            onError={() => {
                                setErrorProfileImage(true);
                            }}
                        ></Avatar>
                        <span className="profile-details">
                            <span className="profile-name">Bem Vindo, {userData?.loggedUser?.apelido}</span>
                            {userData?.loggedUser?.tipoUsuario !== UserRole.CLI && <span className="profile-job">Cliente: {userData?.cliente?.apelido ?? '-'}</span>}
                        </span>
                        <i className="pi pi-angle-down"></i>
                    </button>
                </StyleClass>
                <ul className="list-none p-3 m-0 border-round shadow-2 hidden absolute surface-overlay origin-top w-full sm:w-12rem mt-2 right-0 top-auto">
                    <li>
                        <Button
                            className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer w-full"
                            severity="secondary"
                            text
                            onClick={() => {
                                router.push('/perfil');
                            }}
                        >
                            <i className="pi pi-user mr-3"></i>
                            <span>Perfil</span>
                            <Ripple />
                        </Button>

                        <Button
                            className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer w-full"
                            severity="secondary"
                            text
                            onClick={async () => {
                                await logout();
                                router.push('/login');
                            }}
                        >
                            <i className="pi pi-sign-out mr-3"></i>
                            <span>Sair</span>
                            <Ripple />
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
