import React from 'react';
import Image from 'next/image';
import logo from '@/public/layout/images/logo_novo.png';

const AppFooter = () => {
    return (
        <div className="layout-footer mt-auto">
            <div className="footer-start">
                <Image src={logo} alt="logo" style={{ width: '200px', height: '120px', paddingLeft: '40px' }}/>
            </div>
            <div className="footer-right"></div>
        </div>
    );
};

export default AppFooter;
