import React from 'react';
import './FruitManager.css';
import type { SellerProductDto } from '../../services/sellerFruitService';

export type FruitData = SellerProductDto;

export type Props = {
    fruits: FruitData[];
    isLoading: boolean;
    editingFruitId: number | null;
    editForm: {
        name: string;
        price: string;
        stock: string;
        imageUrl: string;
    };
    onCreate: (data: { name: string; price: string; stock: string; imageUrl?: string }) => Promise<boolean>;
    onStartEdit: (fruit: FruitData) => void;
    onCancelEdit: () => void;
    onEditFieldChange: (
        field: 'name' | 'price' | 'stock' | 'imageUrl',
        value: string,
    ) => void;
    onSaveEdit: (id: number) => void;
    onSoftDelete: (id: number) => void;
    onReactivate: (id: number) => void;
    onDelete: (id: number) => void;
    onRefresh: () => void;
};

const FruitManagerView: React.FC<Props> = ({
    fruits,
    isLoading,
    editingFruitId,
    editForm,
    onCreate,
    onStartEdit,
    onCancelEdit,
    onEditFieldChange,
    onSaveEdit,
    onSoftDelete,
    onReactivate,
    onDelete,
    onRefresh,
}) => {
    const [isAdding, setIsAdding] = React.useState(false);
    const [newFruit, setNewFruit] = React.useState({
        name: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    if (isLoading) return <div className="loading">Đang tải kho hàng...</div>;

    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Kho hàng của tôi</h2>
                <div className="action-row">
                    <button type="button" className="primary" onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Hủy' : '+ Thêm sản phẩm'}
                    </button>
                    <button type="button" className="primary" onClick={onRefresh}>Làm mới</button>
                </div>
            </header>

            <main className="content">
                {isAdding && (
                    <section className="login-card" style={{ marginBottom: '30px', maxWidth: '100%' }}>
                        <h3>Thông tin sản phẩm</h3>
                        <form
                            noValidate
                            onSubmit={async (event) => {
                                event.preventDefault();
                                const created = await onCreate({
                                    name: newFruit.name,
                                    price: newFruit.price,
                                    stock: newFruit.stock,
                                    imageUrl: newFruit.imageUrl || undefined,
                                });
                                if (created) {
                                    setIsAdding(false);
                                    setNewFruit({ name: '', price: '', stock: '', imageUrl: '' });
                                }
                            }}
                        >
                            <div className="field">
                                <label>Tên sản phẩm:</label>
                                <input
                                    type="text"
                                    value={newFruit.name}
                                    onChange={(e) => setNewFruit({ ...newFruit, name: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label>Giá (VNĐ):</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="^\d+(\.\d+)?$"
                                    value={newFruit.price}
                                    onChange={(e) => setNewFruit({ ...newFruit, price: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label>Tồn kho:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newFruit.stock}
                                    onChange={(e) => setNewFruit({ ...newFruit, stock: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label>Ảnh (URL):</label>
                                <input
                                    type="text"
                                    value={newFruit.imageUrl}
                                    onChange={(e) => setNewFruit({ ...newFruit, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="primary">Tạo sản phẩm</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="products-grid">
                    {fruits.map((fruit) => {
                        const isActive = fruit.isActive !== false;
                        const isEditing = editingFruitId === fruit.productId;
                        return (
                        <article
                            key={fruit.productId}
                            className={`product-card ${!isActive ? 'discontinued' : ''}`}
                        >
                            <div className="product-media">
                                {fruit.imageUrl ? (
                                    <img src={fruit.imageUrl} alt={fruit.name} />
                                ) : (
                                    <span className="placeholder-emoji">🍎</span>
                                )}
                            </div>

                            <div className="product-name">{fruit.name}</div>

                            {isEditing ? (
                                <div className="edit-form">
                                    <label>
                                        Tên sản phẩm
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(event) =>
                                                onEditFieldChange('name', event.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Giá
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            pattern="^\d+(\.\d+)?$"
                                            value={editForm.price}
                                            onChange={(event) =>
                                                onEditFieldChange('price', event.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Tồn kho
                                        <input
                                            type="number"
                                            min="0"
                                            value={editForm.stock}
                                            onChange={(event) =>
                                                onEditFieldChange('stock', event.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Ảnh (URL)
                                        <input
                                            type="text"
                                            value={editForm.imageUrl}
                                            onChange={(event) =>
                                                onEditFieldChange('imageUrl', event.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                            ) : (
                                <>
                                    <div className="product-meta">
                                        <label>Giá:</label>
                                        <span className="price">{fruit.price.toLocaleString('vi-VN')}đ</span>
                                    </div>

                                    <div className="product-meta">
                                        <label>Tồn kho:</label>
                                        <span>{fruit.stock}</span>
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            className="primary"
                                            onClick={() => onSaveEdit(fruit.productId)}
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            type="button"
                                            className="link-btn"
                                            onClick={onCancelEdit}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="link-btn"
                                            onClick={() => onStartEdit(fruit)}
                                        >
                                            ✏️ Chỉnh sửa
                                        </button>
                                        {isActive ? (
                                            <button
                                                type="button"
                                                className="link-btn delete-btn"
                                                onClick={() => onSoftDelete(fruit.productId)}
                                            >
                                                🗑️ Ngừng bán
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="link-btn"
                                                onClick={() => onReactivate(fruit.productId)}
                                            >
                                                🔄 Mở bán lại
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="link-btn delete-btn"
                                            onClick={() => onDelete(fruit.productId)}
                                        >
                                            ❌ Xóa
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    )})}
                </div>
            </main>
        </div>
    );
};

export default FruitManagerView;
