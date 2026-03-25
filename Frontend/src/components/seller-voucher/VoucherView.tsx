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
    onSave: (data: Partial<VoucherData>) => void;
    onRefresh: () => void;
};

const VoucherView: React.FC<Props> = ({ vouchers, isLoading, onSave, onRefresh }) => {
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
                        <form onSubmit={(e) => { e.preventDefault(); onSave(newVoucher); setIsAdding(false); }}>
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
                    {vouchers.map(v => (
                        <article key={v.voucherId} className="product-card voucher-item">
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
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default VoucherView;
