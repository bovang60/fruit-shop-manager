import React from 'react';
import { Link } from 'react-router-dom';
import './FruitManager.css';
import type { SellerProductDto } from '../../services/sellerFruitService';
import type { CategoryFilterItemDto } from '../../services/categoryService';
import Pagination from '../common/pagination/Pagination';
import LoadingModal from '../common/loading/LoadingModal';

export type FruitData = SellerProductDto;

export type Props = {
    fruits: FruitData[];
    isLoading: boolean;
    categories: CategoryFilterItemDto[];
    editingFruitId: number | null;
    editForm: {
        name: string;
        description: string;
        categoryId: string;
        price: string;
        stock: string;
        imageUrl: string;
    };
    onCreate: (data: {
        name: string;
        description: string;
        categoryId: string;
        price: string;
        stock: string;
        imageFile?: File | null;
    }) => Promise<boolean>;
    onStartEdit: (fruit: FruitData) => void;
    onCancelEdit: () => void;
    onEditFieldChange: (
        field: 'name' | 'description' | 'categoryId' | 'price' | 'stock' | 'imageUrl',
        value: string,
    ) => void;
    onEditImageFileChange: (file: File | null) => void;
    onSaveEdit: (id: number) => void;
    onSoftDelete: (id: number) => void;
    onReactivate: (id: number) => void;
    onDelete: (id: number) => void;
    onRefresh: () => void;
};

const ITEMS_PER_PAGE = 10;

const FruitManagerView: React.FC<Props> = ({
    fruits,
    isLoading,
    categories,
    editingFruitId,
    editForm,
    onCreate,
    onStartEdit,
    onCancelEdit,
    onEditFieldChange,
    onEditImageFileChange,
    onSaveEdit,
    onSoftDelete,
    onReactivate,
    onDelete,
    onRefresh,
}) => {
    const [isAdding, setIsAdding] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [newFruit, setNewFruit] = React.useState({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        stock: '',
        imageFile: null as File | null,
    });
    const [newImagePreview, setNewImagePreview] = React.useState('');

    const totalPages = Math.max(1, Math.ceil(fruits.length / ITEMS_PER_PAGE));
    const paginatedFruits = fruits.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    React.useEffect(() => {
        return () => {
            if (newImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(newImagePreview);
            }
        };
    }, [newImagePreview]);

    const getCategoryName = (categoryId?: number) => {
        if (!categoryId) return 'Chưa phân loại';
        const category = categories.find((item) => item.categoryId === categoryId);
        return category?.categoryName || `#${categoryId}`;
    };
    const editingFruit = editingFruitId
        ? fruits.find((fruit) => fruit.productId === editingFruitId) || null
        : null;

    return (
        <>
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
                                description: newFruit.description,
                                categoryId: newFruit.categoryId,
                                price: newFruit.price,
                                stock: newFruit.stock,
                                imageFile: newFruit.imageFile,
                            });
                            if (created) {
                                setIsAdding(false);
                                setNewImagePreview('');
                                setNewFruit({
                                    name: '',
                                    description: '',
                                    categoryId: '',
                                    price: '',
                                    stock: '',
                                    imageFile: null,
                                });
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
                                <label htmlFor="fruit-category">Danh mục</label>
                                <select
                                    id="fruit-category"
                                    value={newFruit.categoryId}
                                    onChange={(e) => setNewFruit({ ...newFruit, categoryId: e.target.value })}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="seller-field seller-field-full">
                                <label htmlFor="fruit-description">Mô tả</label>
                                <textarea
                                    id="fruit-description"
                                    rows={3}
                                    value={newFruit.description}
                                    onChange={(e) => setNewFruit({ ...newFruit, description: e.target.value })}
                                />
                            </div>
                            <div className="seller-field seller-field-full">
                                <label htmlFor="fruit-image">Ảnh từ máy</label>
                                <input
                                    id="fruit-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setNewFruit({ ...newFruit, imageFile: file });
                                        if (!file) {
                                            if (newImagePreview.startsWith('blob:')) {
                                                URL.revokeObjectURL(newImagePreview);
                                            }
                                            setNewImagePreview('');
                                            return;
                                        }
                                        if (newImagePreview.startsWith('blob:')) {
                                            URL.revokeObjectURL(newImagePreview);
                                        }
                                        const objectUrl = URL.createObjectURL(file);
                                        setNewImagePreview(objectUrl);
                                    }}
                                />
                                {newImagePreview && (
                                    <img src={newImagePreview} alt="Xem trước ảnh sản phẩm" className="seller-fruit-image-preview" />
                                )}
                            </div>
                        </div>
                        <div className="seller-form-actions">
                            <button
                                type="button"
                                className="seller-ghost-btn"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewImagePreview('');
                                    setNewFruit({
                                        name: '',
                                        description: '',
                                        categoryId: '',
                                        price: '',
                                        stock: '',
                                        imageFile: null,
                                    });
                                }}
                            >
                                Hủy
                            </button>
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
                            <th>Danh mục</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fruits.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="seller-empty-state">Chưa có sản phẩm nào trong cửa hàng.</td>
                            </tr>
                        ) : (
                            paginatedFruits.map((fruit) => {
                                const isActive = fruit.isActive !== false;

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
                                                    <>
                                                        <span className="seller-primary-text">{fruit.name}</span>
                                                        <span className="seller-secondary-text">#{fruit.productId}</span>
                                                    </>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {getCategoryName(fruit.categoryId)}
                                        </td>
                                        <td>
                                            {fruit.description || 'N/A'}
                                        </td>
                                        <td>
                                            {`${fruit.price.toLocaleString('vi-VN')}đ`}
                                        </td>
                                        <td>
                                            {fruit.stock}
                                        </td>
                                        <td>
                                            <span className={`seller-status-chip ${isActive ? 'is-active' : 'is-discontinued'}`}>
                                                {isActive ? 'Đang bán' : 'Ngừng bán'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="seller-inline-actions">
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
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
                </section>
            </div>
            {editingFruitId && (
                <div className="seller-fruit-modal-overlay" onClick={onCancelEdit}>
                    <div className="seller-fruit-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="seller-fruit-modal-header">
                            <div>
                                <h3>Cập nhật sản phẩm</h3>
                                <p>#{editingFruitId} - Chỉnh sửa thông tin sản phẩm</p>
                            </div>
                            <button type="button" className="seller-secondary-btn" onClick={onCancelEdit}>
                                Đóng
                            </button>
                        </div>
                        <div className="seller-form-grid">
                            <div className="seller-field">
                                <label>Tên sản phẩm</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(event) => onEditFieldChange('name', event.target.value)}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Danh mục</label>
                                <select
                                    value={editForm.categoryId}
                                    onChange={(event) => onEditFieldChange('categoryId', event.target.value)}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="seller-field seller-field-full">
                                <label>Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(event) => onEditFieldChange('description', event.target.value)}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Giá (VNĐ)</label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={editForm.price}
                                    onChange={(event) => onEditFieldChange('price', event.target.value)}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Tồn kho</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={editForm.stock}
                                    onChange={(event) => onEditFieldChange('stock', event.target.value)}
                                />
                            </div>
                            <div className="seller-field seller-field-full">
                                <label>Ảnh từ máy (tùy chọn)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => onEditImageFileChange(event.target.files?.[0] || null)}
                                />
                                {editingFruit?.imageUrl && (
                                    <img
                                        src={editingFruit.imageUrl}
                                        alt={editingFruit.name}
                                        className="seller-fruit-image-preview"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="seller-form-actions">
                            <button type="button" className="seller-ghost-btn" onClick={onCancelEdit}>
                                Hủy
                            </button>
                            <button
                                type="button"
                                className="btn-primary-admin"
                                onClick={() => onSaveEdit(editingFruitId)}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <LoadingModal
                isOpen={isLoading}
                message="Đang tải kho hàng..."
                subMessage="Vui lòng chờ trong giây lát"
                theme="green"
            />
        </>
    );
};

export default FruitManagerView;
