import './ChangePassword.css'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'

export type Props = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  passwordStrength: number
  strengthLabel: string
  errors: Record<string, string>
  loading: boolean
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onToggleCurrentPassword: () => void
  onToggleNewPassword: () => void
  onToggleConfirmPassword: () => void
  onSubmit: (e: React.FormEvent) => void
  onGoBack: () => void
}

export default function ChangePasswordView(props: Props) {
  return (
    <div className="change-password-root">
      <header className="change-password-header">
        <Header />
      </header>

      <main className="change-password-main">
        {/* Left: Hero Section (Desktop only) */}
        <div className="change-password-hero">
          <div className="hero-image">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="hero-icon">
              🔒
            </div>
            <h1 className="hero-title">Bảo Mật Tài Khoản</h1>
            <p className="hero-subtitle">
              Mật khẩu mạnh giúp bảo vệ những lựa chọn lành mạnh và giữ an toàn cho tài khoản của bạn.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="hero-decor hero-decor-1"></div>
          <div className="hero-decor hero-decor-2"></div>
        </div>

        {/* Right: Form Section */}
        <div className="change-password-form-section">
          <div className="change-password-form-container">
            {/* Header */}
            <div className="form-header">
              <div className="form-badge">
                <span className="badge-icon">🛡️</span>
                Cài Đặt Bảo Mật
              </div>
              <h2 className="form-title">Đổi Mật Khẩu</h2>
              <p className="form-subtitle">Vui lòng nhập thông tin để cập nhật mật khẩu của bạn.</p>
            </div>

            {/* Form */}
            <form onSubmit={props.onSubmit} className="password-form">
              {/* General Error */}
              {props.errors.general && (
                <div className="error-message general-error">
                  {props.errors.general}
                </div>
              )}

              {/* Current Password */}
              <div className="field">
                <label htmlFor="currentPassword">Mật Khẩu Hiện Tại</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔓</span>
                  <input
                    id="currentPassword"
                    type={props.showCurrentPassword ? 'text' : 'password'}
                    value={props.currentPassword}
                    onChange={(e) => props.onCurrentPasswordChange(e.target.value)}
                    placeholder="••••••••"
                    disabled={props.loading}
                    aria-invalid={!!props.errors.currentPassword}
                    aria-describedby={props.errors.currentPassword ? 'currentPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={props.onToggleCurrentPassword}
                    aria-label={props.showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {props.showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {props.errors.currentPassword && (
                  <span id="currentPassword-error" className="error-message">
                    {props.errors.currentPassword}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="field">
                <label htmlFor="newPassword">Mật Khẩu Mới</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    id="newPassword"
                    type={props.showNewPassword ? 'text' : 'password'}
                    value={props.newPassword}
                    onChange={(e) => props.onNewPasswordChange(e.target.value)}
                    placeholder="••••••••"
                    disabled={props.loading}
                    aria-invalid={!!props.errors.newPassword}
                    aria-describedby={props.errors.newPassword ? 'newPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={props.onToggleNewPassword}
                    aria-label={props.showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {props.showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {props.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`strength-bar ${level <= props.passwordStrength ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="strength-label">
                      Độ mạnh mật khẩu: {props.strengthLabel}
                    </span>
                  </div>
                )}

                {props.errors.newPassword && (
                  <span id="newPassword-error" className="error-message">
                    {props.errors.newPassword}
                  </span>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="field">
                <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới</label>
                <div className="input-wrapper">
                  <span className="input-icon">✅</span>
                  <input
                    id="confirmPassword"
                    type={props.showConfirmPassword ? 'text' : 'password'}
                    value={props.confirmPassword}
                    onChange={(e) => props.onConfirmPasswordChange(e.target.value)}
                    placeholder="••••••••"
                    disabled={props.loading}
                    aria-invalid={!!props.errors.confirmPassword}
                    aria-describedby={props.errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={props.onToggleConfirmPassword}
                    aria-label={props.showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {props.showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {props.errors.confirmPassword && (
                  <span id="confirmPassword-error" className="error-message">
                    {props.errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Security Tips */}
              <div className="security-tips">
                <p className="tips-title">💡 Gợi ý Mật khẩu:</p>
                <ul className="tips-list">
                  <li>Sử dụng ít nhất 8 ký tự</li>
                  <li>Kết hợp chữ hoa và chữ thường</li>
                  <li>Bao gồm số và ký tự đặc biệt</li>
                  <li>Tránh sử dụng từ phổ biến hoặc thông tin cá nhân</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="primary"
                  disabled={props.loading}
                >
                  {props.loading ? 'Đang cập nhật...' : '🔄 Cập nhật mật khẩu'}
                </button>

                <button
                  type="button"
                  className="link-btn"
                  onClick={props.onGoBack}
                  disabled={props.loading}
                >
                  ← Quay lại Trang chính
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="change-password-footer">
        <Footer />
      </footer>
    </div>
  )
}
