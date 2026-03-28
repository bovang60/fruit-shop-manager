import React from 'react';
import { Link } from 'react-router-dom';
import './FruitManager.css';

export type FruitData = {
    fruitId: number;
    fruitName: string;
    price: number;
    stockQuantity: number;
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
    imageUrl?: string;
};

export type Props = {
    fruits: FruitData[];
    isLoading: boolean;
    onSoftDelete: (id: number) => void;
    onRefresh: () => void;
};

const FruitManagerView: React.FC<Props> = ({ fruits, isLoading, onSoftDelete, onRefresh }) => {
    if (isLoading) return <div className="loading">Đang tải kho hàng...</div>;

    return (
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Sản phẩm</span>
                </nav>
                <h1>Quản lý trái cây</h1>
                <p>Danh sách sản phẩm theo cùng bố cục bảng dữ liệu của khu vực seller.</p>
            </div>

            <section className="management-filter-section">
                <div className="filter-search-actions">
                    <div className="utility-actions">
                        <button type="button" className="seller-secondary-btn" onClick={onRefresh}>Làm mới</button>
                    </div>
                </div>
            </section>

            <section className="table-card">
                <table className="admin-table seller-fruit-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fruits.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="seller-empty-state">Chưa có sản phẩm nào trong cửa hàng.</td>
                            </tr>
                        ) : (
                            fruits.map((fruit) => (
                                <tr key={fruit.fruitId}>
                                    <td>
                                        <div className="seller-table-media">
                                            <span className="seller-thumb">
                                                {fruit.imageUrl ? (
                                                    <img src={fruit.imageUrl} alt={fruit.fruitName} />
                                                ) : (
                                                    <span className="seller-thumb-fallback">🍎</span>
                                                )}
                                            </span>
                                            <div>
                                                <span className="seller-primary-text">{fruit.fruitName}</span>
                                                <span className="seller-secondary-text">#{fruit.fruitId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{fruit.price.toLocaleString('vi-VN')}đ</td>
                                    <td>{fruit.stockQuantity}</td>
                                    <td>
                                        <span className={`seller-status-chip is-${fruit.status.toLowerCase()}`}>
                                            {fruit.status === 'DISCONTINUED'
                                                ? 'Ngừng bán'
                                                : fruit.status === 'OUT_OF_STOCK'
                                                    ? 'Hết hàng'
                                                    : 'Đang bán'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="seller-inline-actions">
                                            {fruit.status !== 'DISCONTINUED' ? (
                                                <button
                                                    type="button"
                                                    className="seller-ghost-btn seller-danger-btn"
                                                    onClick={() => onSoftDelete(fruit.fruitId)}
                                                >
                                                    Ngừng bán
                                                </button>
                                            ) : (
                                                <span className="seller-secondary-text">Đã ngừng kinh doanh</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default FruitManagerView;
