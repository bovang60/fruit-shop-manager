import React from 'react';
import './SellerLayout.css'; // Import CSS đúng quy tắc

export type Props = { children: React.ReactNode }; // Khai báo Props rõ ràng

const SellerLayoutView: React.FC<Props> = ({ children }) => {
    return (
        <div className="home-root"> {/* Sử dụng class-name contract */}
            <header className="site-header">Header Seller</header>
            <main className="home-container">
                <aside className="sidebar">Sidebar Menu</aside>
                <section className="content">{children}</section>
            </main>
        </div>
    );
};

export default SellerLayoutView;