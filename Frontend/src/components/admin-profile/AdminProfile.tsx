import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminFrame, ADMIN_NAV_ITEMS } from '../common/admin-frame'
import { getUserFromStorage } from '../../services/authService'
import { uploadAvatar, updateUserProfile, getUserProfile } from '../../services/profileService'
import type { UserDto as ProfileUserDto } from '../profile/Profile.types'
import { usePopup } from '../common/popup'
import LoadingModal from '../common/loading/LoadingModal'
import './AdminProfile.css'

export default function AdminProfile() {
    const navigate = useNavigate()
    const { showSuccess, showError } = usePopup()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
        localStorage.getItem('sidebar-collapsed') === 'true'
    )

    const userStored = getUserFromStorage()

    const [fullName, setFullName] = useState(userStored?.fullName || '')
    const [phoneNumber, setPhoneNumber] = useState(userStored?.phoneNumber || '')
    const [address, setAddress] = useState('')
    const [avatarUrl, setAvatarUrl] = useState(userStored?.image || '')
    const [email] = useState(userStored?.email || '')
    const [role] = useState(userStored?.role || '')
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        if (!userStored) return
        setLoading(true)
        try {
            const res = await getUserProfile(userStored.userId)
            if (res.resultCd === 0 && res.data) {
                setFullName(res.data.fullName)
                setPhoneNumber(res.data.phoneNumber || '')
                setAddress(res.data.address || '')
                setAvatarUrl(res.data.image || '')
            }
        } catch (e) {
            console.error('Error loading admin profile:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => {
            const next = !prev
            localStorage.setItem('sidebar-collapsed', String(next))
            return next
        })
    }

    const handleEditProfile = () => setIsEditing(true)

    const handleCancelEdit = () => {
        loadData() // Re-fetch or just reset from current storage if you want it synchronous, but loadData is safer
        setIsEditing(false)
    }

    const handleSaveProfile = async () => {
        if (!userStored) return
        setLoading(true)
        try {
            const res = await updateUserProfile(userStored.userId, { fullName, phoneNumber, address })
            if (res.resultCd === 0 && res.data) {
                const updated: ProfileUserDto = {
                    ...userStored,
                    fullName: res.data.fullName,
                    phoneNumber: res.data.phoneNumber,
                    address: res.data.address,
                    image: res.data.image,
                    role: res.data.role
                } as any;
                localStorage.setItem('user', JSON.stringify(updated))
                window.dispatchEvent(new Event('userUpdated'))
                setIsEditing(false)
                showSuccess('Cập nhật thông tin thành công!', 'Thành công')
            } else {
                showError(res.message || 'Không thể cập nhật thông tin', 'Lỗi')
            }
        } catch {
            showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !userStored) return
        if (!file.type.startsWith('image/')) { showError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF)', 'Lỗi'); return }
        if (file.size > 5 * 1024 * 1024) { showError('Kích thước ảnh không được vượt quá 5MB', 'Lỗi'); return }

        setUploadingAvatar(true)
        try {
            const res = await uploadAvatar(userStored.userId, file)
            if (res.resultCd === 0 && res.data) {
                const newUrl = res.data.image || ''
                setAvatarUrl(newUrl)
                const updated = { ...userStored, image: newUrl }
                localStorage.setItem('user', JSON.stringify(updated))
                window.dispatchEvent(new Event('userUpdated'))
                showSuccess('Cập nhật ảnh đại diện thành công!', 'Thành công')
            } else {
                showError(res.message || 'Không thể tải ảnh lên', 'Lỗi')
            }
        } catch {
            showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
        } finally {
            setUploadingAvatar(false)
            e.target.value = ''
        }
    }

    const handleChangePassword = () => navigate('/change-password')

    // Avatar background URL
    const avatarBg = avatarUrl
        ? `url('${avatarUrl}')`
        : `url('https://via.placeholder.com/150/33f20d/ffffff?text=${encodeURIComponent(fullName.charAt(0))}')`

    return (
        <AdminFrame
            sidebarItems={ADMIN_NAV_ITEMS}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
        >
            {/* Reuse exact same layout as customer profile, wrapped inside admin frame */}
            <div className="profile-main" style={{ padding: '1.5rem 2.5rem' }}>
                <div className="profile-container" style={{ maxWidth: '100%' }}>
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        {/* Avatar Card */}
                        <div className="profile-card-avatar">
                            <div className="avatar-section">
                                <div
                                    className="avatar-image"
                                    style={{ backgroundImage: avatarBg }}
                                    role="img"
                                    aria-label={`${fullName} profile picture`}
                                >
                                    {uploadingAvatar && (
                                        <div className="avatar-uploading-overlay">
                                            <div className="spinner"></div>
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="ap-avatar-upload" className="avatar-upload-btn" title="Tải ảnh đại diện mới">
                                    <span className="material-icon">{uploadingAvatar ? '⏳' : '📷'}</span>
                                    <input
                                        id="ap-avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="avatar-upload-input"
                                        aria-label="Upload profile picture"
                                        disabled={uploadingAvatar}
                                    />
                                </label>
                            </div>

                            <div className="profile-info-brief">
                                <h1 className="profile-name">{fullName}</h1>
                                <p className="profile-role">{role}</p>
                            </div>

                            <div className="profile-actions">
                                {isEditing ? (
                                    <>
                                        <button className="btn-save-profile" onClick={handleSaveProfile} disabled={loading}>
                                            <span className="material-icon">💾</span>
                                            Lưu thay đổi
                                        </button>
                                        <button className="btn-cancel-edit" onClick={handleCancelEdit} disabled={loading}>
                                            <span className="material-icon">✖️</span>
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-edit-profile" onClick={handleEditProfile} disabled={loading}>
                                            <span className="material-icon">✏️</span>
                                            Chỉnh sửa Hồ sơ
                                        </button>
                                        <button className="btn-change-password" onClick={handleChangePassword} disabled={loading}>
                                            <span className="material-icon">🔒</span>
                                            Đổi Mật Khẩu
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="profile-content">
                        <section className="profile-card-details">
                            <div className="details-header">
                                <h2 className="details-title">Thông Tin Cá Nhân</h2>
                                <span className="material-icon-large">👤</span>
                            </div>

                            <div className="details-list">
                                {/* Họ và tên */}
                                <div className="detail-item">
                                    <div className="detail-label-group">
                                        <span className="detail-icon">🏷️</span>
                                        <span className="detail-label">Họ và Tên</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="detail-input"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Nhập họ và tên của bạn"
                                        />
                                    ) : (
                                        <span className="detail-value">{fullName}</span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="detail-item">
                                    <div className="detail-label-group">
                                        <span className="detail-icon">✉️</span>
                                        <span className="detail-label">Email</span>
                                    </div>
                                    <span className="detail-value detail-value-readonly">{email}</span>
                                </div>

                                {/* Số điện thoại */}
                                <div className="detail-item">
                                    <div className="detail-label-group">
                                        <span className="detail-icon">📞</span>
                                        <span className="detail-label">Số Điện Thoại</span>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            className="detail-input"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="Nhập số điện thoại của bạn"
                                        />
                                    ) : (
                                        <span className="detail-value">{phoneNumber || '—'}</span>
                                    )}
                                </div>

                                {/* Địa chỉ */}
                                <div className="detail-item detail-item-address">
                                    <div className="detail-label-group">
                                        <span className="detail-icon">📍</span>
                                        <span className="detail-label">Địa Chỉ</span>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            className="detail-textarea"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Nhập địa chỉ của bạn"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="detail-value detail-value-address">
                                            {address || '—'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <LoadingModal
                isOpen={loading}
                message="Đang xử lý..."
                subMessage="Vui lòng chờ trong giây lát"
                theme="green"
            />
        </AdminFrame>
    )
}
