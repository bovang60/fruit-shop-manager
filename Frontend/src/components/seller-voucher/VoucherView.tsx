import { useState } from 'react';
import { Link } from 'react-router-dom';
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

const VoucherView = ({ vouchers, isLoading, onSave, onRefresh }: Props) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        code: '',
        discountValue: 0,
        minOrderValue: 0,
        expiryDate: ''
    });

    if (isLoading) return <div className="loading">Đang tải danh sách ưu đãi...</div>;

    return (
        <div className="seller-page">
            <div className="page-header-content">
                <nav className="breadcrumbs-modern">
                    <Link to="/seller/dashboard">Seller</Link>
                    <span className="material-symbols-outlined">chevron_right</span>
                    <span className="current">Mã giảm giá</span>
                </nav>
                <h1>Quản lý voucher</h1>
                <p>Thiết kế lại theo form-card và bảng dữ liệu thống nhất với seller dashboard.</p>
            </div>

            <section className="management-filter-section">
                <div className="filter-search-actions">
                    <div className="utility-actions">
                        <button type="button" className="btn-primary-admin" onClick={() => setIsAdding(!isAdding)}>
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
                        <form onSubmit={(e) => { e.preventDefault(); onSave(newVoucher); setIsAdding(false); }}>
                            <div className="seller-form-grid">
                            <div className="seller-field">
                                <label>Mã Voucher</label>
                                <input
                                    type="text"
                                    required
                                    value={newVoucher.code}
                                    onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Giá trị giảm (VNĐ):</label>
                                <input
                                    type="number"
                                    required
                                    value={newVoucher.discountValue}
                                    onChange={e => setNewVoucher({...newVoucher, discountValue: Number(e.target.value)})}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Đơn tối thiểu (VNĐ):</label>
                                <input
                                    type="number"
                                    value={newVoucher.minOrderValue}
                                    onChange={e => setNewVoucher({...newVoucher, minOrderValue: Number(e.target.value)})}
                                />
                            </div>
                            <div className="seller-field">
                                <label>Ngày hết hạn:</label>
                                <input
                                    type="date"
                                    required
                                    value={newVoucher.expiryDate}
                                    onChange={e => setNewVoucher({...newVoucher, expiryDate: e.target.value})}
                                />
                            </div>
                            </div>
                            <div className="form-actions">
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
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="seller-empty-state">Chưa có voucher nào được tạo.</td>
                                </tr>
                            ) : (
                                vouchers.map(v => (
                                    <tr key={v.voucherId}>
                                        <td><span className="seller-primary-text seller-voucher-code">{v.code}</span></td>
                                        <td>{v.discountValue.toLocaleString('vi-VN')}đ</td>
                                        <td>{v.minOrderValue.toLocaleString('vi-VN')}đ</td>
                                        <td>{new Date(v.expiryDate).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
        </div>
    );
};

export default VoucherView;
