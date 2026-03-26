import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerLayoutView from './SellerLayoutView'; // Import View chuẩn

type Props = {
    children?: React.ReactNode;
};

const SellerLayout: React.FC<Props> = ({ children }) => {
    return (
        <SellerLayoutView>
            {children ?? <Outlet />} {/* Hỗ trợ cả children prop và nested routes */}
        </SellerLayoutView>
    );
};

export default SellerLayout;
