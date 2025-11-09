'use client';
import Head from 'next/head';
import React, { useState } from 'react';
import type { ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb } from '@/types';
import { addLocale, locale, PrimeReactProvider } from 'primereact/api';
import locale_br from 'primelocale/pt-BR.json';

addLocale('pt-BR', locale_br['pt-BR']);
locale('pt-BR');
export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
    const [tabs, setTabs] = useState<any>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'slim-plus',
        colorScheme: 'light',
        componentTheme: 'red',
        scale: 14,
        theme: 'red',
        menuTheme: 'primaryColor',
        layoutTheme: 'primaryColor',
        topBarTheme: 'primaryColor'
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });

    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };

    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isSlim = () => {
        return layoutConfig.menuMode === 'slim';
    };

    const isSlimPlus = () => {
        return layoutConfig.menuMode === 'slim-plus';
    };

    const isHorizontal = () => {
        return layoutConfig.menuMode === 'horizontal';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };
    const openTab = (value: number) => {
        setTabs((prevTabs: number[]) => [...prevTabs, value]);
    };
    const closeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
    };

    const value = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar,
        tabs,
        closeTab,
        openTab
    };

    return (
        <PrimeReactProvider value={{ locale: 'pt-BR' }}>
            <LayoutContext.Provider value={value as any}>
                <>
                    <Head>
                        <title>Weather</title>
                        <meta charSet="UTF-8" />
                        <meta name="description" content="Processamento de dados e Exportação" />
                        <meta name="robots" content="index, follow" />
                        <meta name="viewport" content="initial-scale=1, width=device-width" />
                        <meta property="og:type" content="website"></meta>
                        <meta property="og:title" content="Weather"></meta>
                        <meta property="og:description" content="Processamento de dados e Exportação" />
                        <meta property="og:ttl" content="604800"></meta>
                        <link rel="icon" href="/icon.png" type="image/png"></link>
                    </Head>
                    {props.children}
                </>
            </LayoutContext.Provider>
        </PrimeReactProvider>
    );
};
