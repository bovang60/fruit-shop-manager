import React from 'react';
import { Link } from 'react-router-dom';
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
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Sản phẩm</span>
                </nav>
                <h1>Quản lý trái cây</h1>
                <p>Quản lý danh mục sản phẩm theo cùng cấu trúc table và action bar của admin.</p>
            </div>

            <section className="management-filter-section">
                <div className="filter-search-actions">
                    <div className="utility-actions">
                        <button type="button" className="btn-primary-admin" onClick={() => setIsAdding((value) => !value)}>
                            <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
                            {isAdding ? 'Đóng form thêm mới' : 'Thêm sản phẩm'}
                        </button>
                        <button type="button" className="seller-secondary-btn" onClick={onRefresh}>Làm mới</button>
                    </div>
                </div>
            </section>

            {isAdding && (
                <section className="data-card seller-form-card">
                    <div className="seller-form-card-header">
                        <div>
                            <h3>Tạo sản phẩm mới</h3>
                            <p>Nhập thông tin cơ bản để đưa sản phẩm lên gian hàng.</p>
                        </div>
                    </div>
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
                        <div className="seller-form-grid">
                            <div className="seller-field">
                                <label htmlFor="fruit-name">Tên sản phẩm</label>
                                <input
                                    id="fruit-name"
                                    type="text"
                                    value={newFruit.name}
                                    onChange={(e) => setNewFruit({ ...newFruit, name: e.target.value })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="fruit-price">Giá (VNĐ)</label>
                                <input
                                    id="fruit-price"
                                    type="text"
                                    inputMode="decimal"
                                    pattern="^\d+(\.\d+)?$"
                                    value={newFruit.price}
                                    onChange={(e) => setNewFruit({ ...newFruit, price: e.target.value })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="fruit-stock">Tồn kho</label>
                                <input
                                    id="fruit-stock"
                                    type="text"
                                    inputMode="numeric"
                                    value={newFruit.stock}
                                    onChange={(e) => setNewFruit({ ...newFruit, stock: e.target.value })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="fruit-image">Ảnh (URL)</label>
                                <input
                                    id="fruit-image"
                                    type="text"
                                    value={newFruit.imageUrl}
                                    onChange={(e) => setNewFruit({ ...newFruit, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="seller-form-actions">
                            <button type="button" className="seller-ghost-btn" onClick={() => setIsAdding(false)}>Hủy</button>
                            <button type="submit" className="btn-primary-admin">Tạo sản phẩm</button>
                        </div>
                    </form>
                </section>
            )}

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
                            fruits.map((fruit) => {
                                const isActive = fruit.isActive !== false;
                                const isEditing = editingFruitId === fruit.productId;

                                return (
                                    <tr key={fruit.productId}>
                                        <td>
                                            <div className="seller-table-media">
                                                <span className="seller-thumb">
                                                    {fruit.imageUrl ? (
                                                        <img src={fruit.imageUrl} alt={fruit.name} />
                                                    ) : (
                                                        <span className="seller-thumb-fallback">🍎</span>
                                                    )}
                                                </span>
                                                <div>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={(event) => onEditFieldChange('name', event.target.value)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <span className="seller-primary-text">{fruit.name}</span>
                                                            <span className="seller-secondary-text">#{fruit.productId}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="^\d+(\.\d+)?$"
                                                    value={editForm.price}
                                                    onChange={(event) => onEditFieldChange('price', event.target.value)}
                                                />
                                            ) : (
                                                `${fruit.price.toLocaleString('vi-VN')}đ`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={editForm.stock}
                                                    onChange={(event) => onEditFieldChange('stock', event.target.value)}
                                                />
                                            ) : (
                                                fruit.stock
                                            )}
                                        </td>
                                        <td>
                                            <span className={`seller-status-chip ${isActive ? 'is-active' : 'is-discontinued'}`}>
                                                {isActive ? 'Đang bán' : 'Ngừng bán'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="seller-inline-actions">
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editForm.imageUrl}
                                                            onChange={(event) => onEditFieldChange('imageUrl', event.target.value)}
                                                            placeholder="Ảnh (URL)"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-primary-admin"
                                                            onClick={() => onSaveEdit(fruit.productId)}
                                                        >
                                                            Lưu
                                                        </button>
                                                        <button type="button" className="seller-ghost-btn" onClick={onCancelEdit}>
                                                            Hủy
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button type="button" className="seller-secondary-btn" onClick={() => onStartEdit(fruit)}>
                                                            Chỉnh sửa
                                                        </button>
                                                        {isActive ? (
                                                            <button type="button" className="seller-ghost-btn seller-danger-btn" onClick={() => onSoftDelete(fruit.productId)}>
                                                                Ngừng bán
                                                            </button>
                                                        ) : (
                                                            <button type="button" className="seller-ghost-btn" onClick={() => onReactivate(fruit.productId)}>
                                                                Mở bán lại
                                                            </button>
                                                        )}
                                                        <button type="button" className="seller-ghost-btn seller-danger-btn" onClick={() => onDelete(fruit.productId)}>
                                                            Xóa
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default FruitManagerView;
