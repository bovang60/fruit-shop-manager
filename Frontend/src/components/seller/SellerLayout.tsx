import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerLayoutView from './SellerLayoutView'; // Import View chuẩn

const SellerLayout = () => {
    return (
        <SellerLayoutView>
            <Outlet /> {/* Để hiển thị các route con như Dashboard, Fruits... */}
        </SellerLayoutView>
    );
};

export default SellerLayout;