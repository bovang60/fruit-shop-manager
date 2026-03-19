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
            <h1 className="hero-title">Security First</h1>
            <p className="hero-subtitle">
              A strong password ensures your healthy choices remain private and your account stays protected.
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
                Security Settings
              </div>
              <h2 className="form-title">Change Password</h2>
              <p className="form-subtitle">Please enter your details to update your credentials.</p>
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
                <label htmlFor="currentPassword">Current Password</label>
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
                    aria-label={props.showCurrentPassword ? 'Hide password' : 'Show password'}
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
                <label htmlFor="newPassword">New Password</label>
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
                    aria-label={props.showNewPassword ? 'Hide password' : 'Show password'}
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
                      Password Strength: {props.strengthLabel}
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
                <label htmlFor="confirmPassword">Confirm New Password</label>
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
                    aria-label={props.showConfirmPassword ? 'Hide password' : 'Show password'}
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
                <p className="tips-title">💡 Password Tips:</p>
                <ul className="tips-list">
                  <li>Use at least 8 characters</li>
                  <li>Mix uppercase and lowercase letters</li>
                  <li>Include numbers and special characters</li>
                  <li>Avoid common words or personal info</li>
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
                  ← Back to Dashboard
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
