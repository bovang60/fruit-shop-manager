import React from 'react';
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
        <div className="home-root">
            <header className="home-actions">
                <h2>Kho hàng của tôi</h2>
                <button type="button" className="primary" onClick={onRefresh}>Làm mới</button>
            </header>

            <main className="content">
                <div className="products-grid">
                    {fruits.map((fruit) => (
                        <article
                            key={fruit.fruitId}
                            className={`product-card ${fruit.status === 'DISCONTINUED' ? 'discontinued' : ''}`}
                        >
                            <div className="product-media">
                                {fruit.imageUrl ? (
                                    <img src={fruit.imageUrl} alt={fruit.fruitName} />
                                ) : (
                                    <span className="placeholder-emoji">🍎</span>
                                )}
                            </div>

                            <div className="product-name">{fruit.fruitName}</div>

                            <div className="product-meta">
                                <label>Giá:</label>
                                <span className="price">{fruit.price.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <div className="product-meta">
                                <label>Tồn kho:</label>
                                <span>{fruit.stockQuantity}</span>
                            </div>

                            <div className="form-actions">
                                {fruit.status !== 'DISCONTINUED' ? (
                                    <button
                                        type="button"
                                        className="link-btn delete-btn"
                                        onClick={() => onSoftDelete(fruit.fruitId)}
                                    >
                                        🗑️ Ngừng bán
                                    </button>
                                ) : (
                                    <span className="disabled-text">Đã ngừng kinh doanh</span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FruitManagerView;
