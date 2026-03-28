import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Voucher.css';
import Pagination from '../common/pagination/Pagination';
import LoadingModal from '../common/loading/LoadingModal';

export type VoucherData = {
    voucherId: number;
    code: string;
    discountValue: number;
    minOrderValue: number;
    expiryDate: string;
    status: string;
};

export type Props = {
    vouchers: VoucherData[];
    isLoading: boolean;
    editingVoucherId: number | null;
    editForm: {
        code: string;
        discountValue: string;
        minOrderValue: string;
        expiryDate: string;
    };
    onStartEdit: (voucher: VoucherData) => void;
    onCancelEdit: () => void;
    onEditFieldChange: (
        field: 'code' | 'discountValue' | 'minOrderValue' | 'expiryDate',
        value: string,
    ) => void;
    onSaveEdit: (id: number) => void;
    onSave: (data: Partial<VoucherData>) => void;
    onDelete: (id: number) => void;
    onRefresh: () => void;
};

const ITEMS_PER_PAGE = 10;

const VoucherView: React.FC<Props> = ({
    vouchers,
    isLoading,
    editingVoucherId,
    editForm,
    onStartEdit,
    onCancelEdit,
    onEditFieldChange,
    onSaveEdit,
    onSave,
    onDelete,
    onRefresh,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [newVoucher, setNewVoucher] = useState({
        code: '',
        discountValue: 0,
        minOrderValue: 0,
        expiryDate: ''
    });

    const totalPages = Math.max(1, Math.ceil(vouchers.length / ITEMS_PER_PAGE));
    const paginatedVouchers = vouchers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <>
            <div className="seller-page">
                <div className="page-header-content">
                    <nav className="breadcrumbs-modern">
                        <Link to="/seller/dashboard">Seller</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span className="current">Mã giảm giá</span>
                    </nav>
                    <h1>Quản lý voucher</h1>
                    <p>Thiết kế lại theo form-card và bảng dữ liệu đồng nhất với các trang admin.</p>
                </div>

                <section className="management-filter-section">
                    <div className="filter-search-actions">
                        <div className="utility-actions">
                            <button type="button" className="btn-primary-admin" onClick={() => setIsAdding((value) => !value)}>
                                <span className="material-symbols-outlined">{isAdding ? 'close' : 'add'}</span>
                                {isAdding ? 'Đóng form tạo' : 'Tạo mã giảm giá'}
                            </button>
                            <button type="button" className="seller-secondary-btn" onClick={onRefresh}>Làm mới</button>
                        </div>
                    </div>
                </section>

                {isAdding && (
                <section className="data-card seller-form-card">
                    <div className="seller-form-card-header">
                        <div>
                            <h3>Phát hành voucher mới</h3>
                            <p>Tạo nhanh một mã giảm giá để áp dụng cho khách mua hàng.</p>
                        </div>
                    </div>
                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSave(newVoucher);
                            setIsAdding(false);
                        }}
                    >
                        <div className="seller-form-grid">
                            <div className="seller-field">
                                <label htmlFor="voucher-code">Mã giảm giá</label>
                                <input
                                    id="voucher-code"
                                    type="text"
                                    required
                                    value={newVoucher.code}
                                    onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="voucher-discount">Giá trị giảm (VNĐ)</label>
                                <input
                                    id="voucher-discount"
                                    type="number"
                                    min="1"
                                    required
                                    value={newVoucher.discountValue}
                                    onChange={e => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="voucher-min-order">Đơn tối thiểu (VNĐ)</label>
                                <input
                                    id="voucher-min-order"
                                    type="number"
                                    min="0"
                                    value={newVoucher.minOrderValue}
                                    onChange={e => setNewVoucher({ ...newVoucher, minOrderValue: Number(e.target.value) })}
                                />
                            </div>
                            <div className="seller-field">
                                <label htmlFor="voucher-expiry">Ngày hết hạn</label>
                                <input
                                    id="voucher-expiry"
                                    type="date"
                                    required
                                    value={newVoucher.expiryDate}
                                    onChange={e => setNewVoucher({ ...newVoucher, expiryDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="seller-form-actions">
                            <button type="button" className="seller-ghost-btn" onClick={() => setIsAdding(false)}>Hủy</button>
                            <button type="submit" className="btn-primary-admin">Phát hành ngay</button>
                        </div>
                    </form>
                </section>
                )}

                <section className="table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã voucher</th>
                            <th>Giảm giá</th>
                            <th>Đơn tối thiểu</th>
                            <th>Hết hạn</th>
                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="seller-empty-state">Chưa có voucher nào được tạo.</td>
                            </tr>
                        ) : (
                            paginatedVouchers.map((voucher) => {
                                const isEditing = editingVoucherId === voucher.voucherId;

                                return (
                                    <tr key={voucher.voucherId}>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.code}
                                                    onChange={(e) => onEditFieldChange('code', e.target.value.toUpperCase())}
                                                />
                                            ) : (
                                                <span className="seller-primary-text seller-voucher-code">{voucher.code}</span>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editForm.discountValue}
                                                    onChange={(e) => onEditFieldChange('discountValue', e.target.value)}
                                                />
                                            ) : (
                                                `${voucher.discountValue.toLocaleString('vi-VN')}đ`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editForm.minOrderValue}
                                                    onChange={(e) => onEditFieldChange('minOrderValue', e.target.value)}
                                                />
                                            ) : (
                                                `${voucher.minOrderValue.toLocaleString('vi-VN')}đ`
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editForm.expiryDate}
                                                    onChange={(e) => onEditFieldChange('expiryDate', e.target.value)}
                                                />
                                            ) : (
                                                new Date(voucher.expiryDate).toLocaleDateString('vi-VN')
                                            )}
                                        </td>
                                        <td>
                                            <div className="seller-inline-actions">
                                                {isEditing ? (
                                                    <>
                                                        <button type="button" className="btn-primary-admin" onClick={() => onSaveEdit(voucher.voucherId)}>
                                                            Lưu
                                                        </button>
                                                        <button type="button" className="seller-ghost-btn" onClick={onCancelEdit}>
                                                            Hủy
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button type="button" className="seller-secondary-btn" onClick={() => onStartEdit(voucher)}>
                                                            Chỉnh sửa
                                                        </button>
                                                        <button type="button" className="seller-ghost-btn seller-danger-btn" onClick={() => onDelete(voucher.voucherId)}>
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
                </section>
            </div>
            <LoadingModal
                isOpen={isLoading}
                message="Đang tải danh sách ưu đãi..."
                subMessage="Vui lòng chờ trong giây lát"
                theme="green"
            />
        </>
    );
};

export default VoucherView;
