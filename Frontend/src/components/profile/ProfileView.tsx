import './Profile.css'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import type { UserProfile } from './Profile'

export type Props = {
  profile: UserProfile
  loading: boolean
  isEditing: boolean
  editedProfile: UserProfile
  error?: string
  successMessage?: string
  onEditProfile: () => void
  onSaveProfile: () => void
  onCancelEdit: () => void
  onFieldChange: (field: keyof UserProfile, value: string) => void
  onChangePassword: () => void
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onToggleTwoFactor: () => void
  onToggleNotifications: () => void
  onNavigateToHome: () => void
  onNavigateToShop: () => void
  onNavigateToOrders: () => void
  onNavigateToCart: () => void
}

export default function ProfileView(props: Props) {
  const { profile } = props

  return (
    <div className="profile-root">
      <header className="profile-header">
        <Header />
      </header>

      <main className="profile-main">
        <div className="profile-container">
          {/* Sidebar - Profile Summary */}
          <aside className="profile-sidebar">
            {/* Avatar Card */}
            <div className="profile-card-avatar">
              <div className="avatar-section">
                <div 
                  className="avatar-image"
                  style={{ backgroundImage: `url('${profile.avatar}')` }}
                  role="img"
                  aria-label={`${profile.fullName} profile picture`}
                />
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <span className="material-icon">📷</span>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={props.onAvatarChange}
                    className="avatar-upload-input"
                    aria-label="Upload profile picture"
                  />
                </label>
              </div>

              <div className="profile-info-brief">
                <h1 className="profile-name">{profile.fullName}</h1>
                <p className="profile-role">{profile.role || 'Thành viên'}</p>
              </div>

              <div className="profile-actions">
                {props.isEditing ? (
                  <>
                    <button 
                      className="btn-save-profile"
                      onClick={props.onSaveProfile}
                      disabled={props.loading}
                      aria-label="Lưu thay đổi hồ sơ"
                    >
                      <span className="material-icon">💾</span>
                      Lưu thay đổi
                    </button>
                    <button 
                      className="btn-cancel-edit"
                      onClick={props.onCancelEdit}
                      disabled={props.loading}
                      aria-label="Hủy chỉnh sửa"
                    >
                      <span className="material-icon">✖️</span>
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="btn-edit-profile"
                      onClick={props.onEditProfile}
                      disabled={props.loading}
                      aria-label="Chỉnh sửa thông tin hồ sơ"
                    >
                      <span className="material-icon">✏️</span>
                      Chỉnh sửa Hồ sơ
                    </button>
                    <button 
                      className="btn-change-password"
                      onClick={props.onChangePassword}
                      disabled={props.loading}
                      aria-label="Đổi mật khẩu"
                    >
                      <span className="material-icon">🔒</span>
                      Đổi Mật Khẩu
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="profile-card-stats">
              <h3 className="stats-title">Thống Kê Tài Khoản</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <p className="stat-label">Đơn Hàng</p>
                  <p className="stat-value">{profile.stats.orders}</p>
                </div>
                <div className="stat-item">
                  <p className="stat-label">Điểm</p>
                  <p className="stat-value">{profile.stats.points}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Profile Details */}
          <div className="profile-content">
            <section className="profile-card-details">
              <div className="details-header">
                <h2 className="details-title">Thông Tin Cá Nhân</h2>
                <span className="material-icon-large">👤</span>
              </div>

              {/* Error Message */}
              {props.error && (
                <div className="message-container message-error">
                  <span className="message-icon">⚠️</span>
                  <span className="message-text">{props.error}</span>
                </div>
              )}

              {/* Success Message */}
              {props.successMessage && (
                <div className="message-container message-success">
                  <span className="message-icon">✅</span>
                  <span className="message-text">{props.successMessage}</span>
                </div>
              )}

              <div className="details-list">
                <div className="detail-item">
                  <div className="detail-label-group">
                    <span className="detail-icon">🏷️</span>
                    <span className="detail-label">Họ và Tên</span>
                  </div>
                  {props.isEditing ? (
                    <input
                      type="text"
                      className="detail-input"
                      value={props.editedProfile.fullName}
                      onChange={(e) => props.onFieldChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên của bạn"
                    />
                  ) : (
                    <span className="detail-value">{profile.fullName}</span>
                  )}
                </div>

                <div className="detail-item">
                  <div className="detail-label-group">
                    <span className="detail-icon">✉️</span>
                    <span className="detail-label">Email</span>
                  </div>
                  <span className="detail-value detail-value-readonly">{profile.email}</span>
                </div>

                <div className="detail-item">
                  <div className="detail-label-group">
                    <span className="detail-icon">📞</span>
                    <span className="detail-label">Số Điện Thoại</span>
                  </div>
                  {props.isEditing ? (
                    <input
                      type="tel"
                      className="detail-input"
                      value={props.editedProfile.phoneNumber}
                      onChange={(e) => props.onFieldChange('phoneNumber', e.target.value)}
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  ) : (
                    <span className="detail-value">{profile.phoneNumber}</span>
                  )}
                </div>

                <div className="detail-item detail-item-address">
                  <div className="detail-label-group">
                    <span className="detail-icon">📍</span>
                    <span className="detail-label">Địa Chỉ</span>
                  </div>
                  {props.isEditing ? (
                    <textarea
                      className="detail-textarea"
                      value={props.editedProfile.address}
                      onChange={(e) => props.onFieldChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ của bạn"
                      rows={3}
                    />
                  ) : (
                    <p className="detail-value detail-value-address">
                      {profile.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Security & Preferences */}
              <div className="security-section">
                <h3 className="security-title">Bảo Mật & Tùy Chọn</h3>
                <div className="security-grid">
                  <div className="security-item">
                    <div className="security-label-group">
                      <span className="security-icon">✓</span>
                      <span className="security-label">Xác Thực 2 Yếu Tố</span>
                    </div>
                    <button
                      className={`toggle-switch ${profile.settings.twoFactorAuth ? 'active' : ''}`}
                      onClick={props.onToggleTwoFactor}
                      disabled={props.loading}
                      role="switch"
                      aria-checked={profile.settings.twoFactorAuth}
                      aria-label="Bật/tắt xác thực 2 yếu tố"
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>

                  <div className="security-item">
                    <div className="security-label-group">
                      <span className="security-icon">🔔</span>
                      <span className="security-label">Thông Báo Đơn Hàng</span>
                    </div>
                    <button
                      className={`toggle-switch ${profile.settings.orderNotifications ? 'active' : ''}`}
                      onClick={props.onToggleNotifications}
                      disabled={props.loading}
                      role="switch"
                      aria-checked={profile.settings.orderNotifications}
                      aria-label="Bật/tắt thông báo đơn hàng"
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="profile-footer">
        <Footer />
      </footer>
    </div>
  )
}
