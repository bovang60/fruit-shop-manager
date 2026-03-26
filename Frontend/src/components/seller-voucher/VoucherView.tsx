import React, { useState } from 'react';
import './Voucher.css';

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
    const [newVoucher, setNewVoucher] = useState({
        code: '',
        discountValue: 0,
        minOrderValue: 0,
        expiryDate: ''
    });

    if (isLoading) return <div className="loading">Đang tải danh sách ưu đãi...</div>;

    return (
        <div className="home-root">
            <header className="home-actions">
                <h2>Quản lý mã giảm giá</h2>
                <button type="button" className="primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Hủy' : '+ Tạo mã giảm giá mới'}
                </button>
            </header>

            <main className="content">
                {isAdding && (
                    <section className="login-card" style={{ marginBottom: '30px', maxWidth: '100%' }}>
                        <h3>Thông tin mã giảm giá</h3>
                        <form
                            noValidate
                            onSubmit={(e) => { e.preventDefault(); onSave(newVoucher); setIsAdding(false); }}
                        >
                            <div className="field">
                                <label>Mã giảm giá (ví dụ: GIAM20):</label>
                                <input
                                    type="text"
                                    required
                                    value={newVoucher.code}
                                    onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div className="field">
                                <label>Giá trị giảm (VNĐ):</label>
                                <input
                                    type="number"
                                    required
                                    value={newVoucher.discountValue}
                                    onChange={e => setNewVoucher({...newVoucher, discountValue: Number(e.target.value)})}
                                />
                            </div>
                            <div className="field">
                                <label>Ngày hết hạn:</label>
                                <input
                                    type="date"
                                    required
                                    value={newVoucher.expiryDate}
                                    onChange={e => setNewVoucher({...newVoucher, expiryDate: e.target.value})}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="primary">Phát hành ngay</button>
                            </div>
                        </form>
                    </section>
                )}

                <div className="products-grid"> {/* Tận dụng grid cho voucher cards */}
                    {vouchers.map(v => {
                        const isEditing = editingVoucherId === v.voucherId;
                        return (
                            <article key={v.voucherId} className="product-card voucher-item">
                                {isEditing ? (
                                    <div className="voucher-edit-form">
                                        <label>
                                            Mã giảm giá
                                            <input
                                                type="text"
                                                value={editForm.code}
                                                onChange={(e) => onEditFieldChange('code', e.target.value.toUpperCase())}
                                            />
                                        </label>
                                        <label>
                                            Giá trị giảm (VNĐ)
                                            <input
                                                type="number"
                                                min="0"
                                                value={editForm.discountValue}
                                                onChange={(e) => onEditFieldChange('discountValue', e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Đơn tối thiểu (VNĐ)
                                            <input
                                                type="number"
                                                min="0"
                                                value={editForm.minOrderValue}
                                                onChange={(e) => onEditFieldChange('minOrderValue', e.target.value)}
                                            />
                                        </label>
                                        <label>
                                            Ngày hết hạn
                                            <input
                                                type="date"
                                                value={editForm.expiryDate}
                                                onChange={(e) => onEditFieldChange('expiryDate', e.target.value)}
                                            />
                                        </label>
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="primary"
                                                onClick={() => onSaveEdit(v.voucherId)}
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
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="product-name">{v.code}</div>
                                        <div className="price">Giảm {v.discountValue.toLocaleString('vi-VN')}đ</div>
                                        <div className="product-meta">
                                            <label>Đơn tối thiểu:</label>
                                            <span>{v.minOrderValue.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <div className="product-meta">
                                            <label>Hết hạn:</label>
                                            <span>{new Date(v.expiryDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="link-btn"
                                                onClick={() => onStartEdit(v)}
                                            >
                                                ✏️ Chỉnh sửa
                                            </button>
                                            <button
                                                type="button"
                                                className="link-btn delete-btn"
                                                onClick={() => onDelete(v.voucherId)}
                                            >
                                                ❌ Xóa
                                            </button>
                                        </div>
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default VoucherView;
