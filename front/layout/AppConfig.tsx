'use client';
import { PrimeReactContext } from 'primereact/api';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import { useContext, useEffect } from 'react';
import { LayoutContext } from './context/layoutcontext';
import type { AppConfigProps } from '@/types';

const AppConfig = (props: AppConfigProps) => {
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState, isSlim, isSlimPlus } = useContext(LayoutContext);
    const { setRipple, changeTheme } = useContext(PrimeReactContext);
    const scales = [12, 13, 14, 15, 16];
    const componentThemes = [{ name: 'red', color: '#94242b' }];
    useEffect(() => {
        if (isSlim() || isSlimPlus()) {
            setLayoutState((prevState) => ({ ...prevState, resetMenu: true }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.menuMode, layoutConfig.colorScheme, layoutConfig.layoutTheme, layoutConfig.componentTheme]);

    const onConfigButtonClick = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: true
        }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prevState) => ({
            ...prevState,
            configSidebarVisible: false
        }));
    };

    const changeMenuMode = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prevState) => ({ ...prevState, menuMode: e.value }));
    };

    const _changeTheme = (componentTheme: string) => {
        changeTheme?.(layoutConfig.componentTheme, componentTheme, 'theme-link', () => {
            setLayoutConfig((prevState) => ({ ...prevState, componentTheme }));
        });
    };
    const changeLayoutTheme = (themeLayout: string) => {
        setLayoutConfig((prevState) => ({ ...prevState, layoutTheme: themeLayout }));
    };

    const decrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale - 1
        }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState) => ({
            ...prevState,
            scale: prevState.scale + 1
        }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };
    useEffect(() => {
        if (layoutConfig.colorScheme === 'dark') {
            changeLayoutTheme('colorScheme');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.colorScheme]);

    useEffect(() => {
        applyScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutConfig.scale]);

    return (
        <>
            <button className="layout-config-button config-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>

            <Sidebar visible={layoutState.configSidebarVisible} onHide={onConfigSidebarHide} position="right" className="layout-config-sidebar" style={{ width: '18rem' }} content="">
                {!props.minimal && (
                    <>
                        <h5>Menu Type</h5>
                        <div className="flex flex-wrap row-gap-3">
                            <div className="flex align-items-center gap-2 w-6">
                                <RadioButton name="menuMode" value={'static'} checked={layoutConfig.menuMode === 'static'} onChange={(e) => changeMenuMode(e)} inputId="mode1"></RadioButton>
                                <label htmlFor="mode1">Static</label>
                            </div>
                            <div className="flex align-items-center gap-2 w-6 pl-2">
                                <RadioButton name="menuMode" value={'overlay'} checked={layoutConfig.menuMode === 'overlay'} onChange={(e) => changeMenuMode(e)} inputId="mode2"></RadioButton>
                                <label htmlFor="mode2">Overlay</label>
                            </div>
                            <div className="flex align-items-center gap-2 w-6">
                                <RadioButton name="menuMode" value={'slim'} checked={layoutConfig.menuMode === 'slim'} onChange={(e) => changeMenuMode(e)} inputId="mode3"></RadioButton>
                                <label htmlFor="mode3">Slim</label>
                            </div>
                            <div className="flex align-items-center gap-2 w-6 pl-2">
                                <RadioButton name="menuMode" value={'slim-plus'} checked={layoutConfig.menuMode === 'slim-plus'} onChange={(e) => changeMenuMode(e)} inputId="mode4"></RadioButton>
                                <label htmlFor="mode4">Slim +</label>
                            </div>
                        </div>
                    </>
                )}
                <hr />
                {!props.minimal && (
                    <>
                        <h5>Layout Theme</h5>
                        <div className="field-radiobutton">
                            <RadioButton name="menuTheme" value="colorScheme" checked={layoutConfig.layoutTheme === 'colorScheme'} onChange={(e) => changeLayoutTheme(e.value)} inputId="menutheme-colorscheme"></RadioButton>
                            <label htmlFor="menutheme-colorscheme">Color Scheme</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton
                                name="menuTheme"
                                value="primaryColor"
                                checked={layoutConfig.layoutTheme === 'primaryColor'}
                                onChange={(e) => changeLayoutTheme(e.value)}
                                disabled={layoutConfig.colorScheme === 'dark'}
                                inputId="menutheme-colorscheme"
                            ></RadioButton>
                            <label htmlFor="menutheme-primarycolor">Primary Color</label>
                        </div>
                    </>
                )}
                <h5>Themes</h5>
                <div className="flex flex-wrap gap-3">
                    {componentThemes.map((t, i) => {
                        return (
                            <div key={i}>
                                <div style={{ cursor: 'pointer' }} onClick={() => _changeTheme(t.name)} title={t.name}>
                                    <a className="inline-flex justify-content-center align-items-center w-2rem h-2rem border-round" style={{ backgroundColor: t.color }}>
                                        {layoutConfig.componentTheme === t.name && (
                                            <span className="check flex align-items-center justify-content-center">
                                                <i className="pi pi-check text-white"></i>
                                            </span>
                                        )}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <h5>Scale</h5>
                <div className="flex align-items-center">
                    <Button icon="pi pi-minus" type="button" onClick={decrementScale} className="w-2rem h-2rem mr-2" rounded text disabled={layoutConfig.scale === scales[0]}></Button>
                    <div className="flex gap-2 align-items-center">
                        {scales.map((s, i) => {
                            return (
                                <i
                                    key={i}
                                    className={classNames('pi pi-circle-fill text-300', {
                                        'text-primary-500': s === layoutConfig.scale
                                    })}
                                ></i>
                            );
                        })}
                    </div>
                    <Button icon="pi pi-plus" type="button" onClick={incrementScale} className="w-2rem h-2rem ml-2" rounded text disabled={layoutConfig.scale === scales[scales.length - 1]}></Button>
                </div>
            </Sidebar>
        </>
    );
};

export default AppConfig;
