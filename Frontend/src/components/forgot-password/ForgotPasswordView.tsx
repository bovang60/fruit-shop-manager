import './ForgotPassword.css'
import Footer from '../common/footer/Footer'
import LoadingModal from '../common/loading/LoadingModal'

export type Props = {
  step: 'request' | 'reset'
  email: string
  otpCode?: string
  newPassword?: string
  confirmPassword?: string
  errors: Record<string, string>
  loading: boolean
  success: boolean
  otpSent?: boolean
  onEmailChange: (value: string) => void
  onOtpChange?: (value: string) => void
  onNewPasswordChange?: (value: string) => void
  onConfirmPasswordChange?: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onGoToLogin: () => void
  onResendOtp?: () => void
}

export default function ForgotPasswordView(props: Props) {
  const isRequestStep = props.step === 'request'
  const isResetStep = props.step === 'reset'

  return (
    <div className="forgot-password-root">
      <main className="forgot-password-main">
        <div className="forgot-password-container">
          
          {/* Icon */}
          <div className="forgot-password-icon-wrap">
            <div className="forgot-password-icon">
              {isRequestStep ? '🔐' : '🔑'}
            </div>
          </div>

          {/* Header Text */}
          <div className="forgot-password-header-text">
            <h1 className="forgot-password-title">
              {isRequestStep ? 'Quên Mật Khẩu?' : 'Đặt Lại Mật Khẩu'}
            </h1>
            <p className="forgot-password-subtitle">
              {isRequestStep 
                ? 'Đừng lo! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.'
                : 'Nhập mã OTP đã gửi đến email của bạn và tạo mật khẩu mới.'
              }
            </p>
          </div>

          {/* OTP Sent Message */}
          {props.otpSent && isResetStep && (
            <div className="info-message">
              <div className="info-icon">📧</div>
              <div>
                <p className="info-title">Đã Gửi OTP!</p>
                <p className="info-text">
                  Chúng tôi đã gửi mã OTP 6 chữ số đến <strong>{props.email}</strong>. Vui lòng kiểm tra email và nhập mã bên dưới.
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {props.success && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <div>
                <p className="success-title">Đặt Lại Mật Khẩu Thành Công!</p>
                <p className="success-text">
                  Mật khẩu của bạn đã được đặt lại thành công. Đang chuyển hướng đến trang đăng nhập...
                </p>
              </div>
            </div>
          )}

          {/* General Error */}
          {props.errors.general && (
            <div className="error-message general-error">
              {props.errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={props.onSubmit} className="forgot-password-form">
            
            {/* Email Field - Always visible */}
            <div className="field">
              <label htmlFor="email" className="field-label">
                Địa Chỉ Email
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  type="email"
                  value={props.email}
                  onChange={(e) => props.onEmailChange(e.target.value)}
                  placeholder="Ví dụ: nguyenvana@example.com"
                  disabled={props.loading || props.success || isResetStep}
                  aria-invalid={!!props.errors.email}
                  aria-describedby={props.errors.email ? 'email-error' : undefined}
                  className="field-input"
                />
              </div>
              {props.errors.email && (
                <span id="email-error" className="error-message">
                  {props.errors.email}
                </span>
              )}
            </div>

            {/* OTP Code Field - Only in reset step */}
            {isResetStep && (
              <div className="field">
                <label htmlFor="otpCode" className="field-label">
                  Mã OTP
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔢</span>
                  <input
                    id="otpCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={props.otpCode || ''}
                    onChange={(e) => props.onOtpChange?.(e.target.value)}
                    placeholder="Nhập mã 6 chữ số"
                    disabled={props.loading || props.success}
                    aria-invalid={!!props.errors.otpCode}
                    aria-describedby={props.errors.otpCode ? 'otp-error' : undefined}
                    className="field-input otp-input"
                  />
                </div>
                {props.errors.otpCode && (
                  <span id="otp-error" className="error-message">
                    {props.errors.otpCode}
                  </span>
                )}
                {/* Resend OTP */}
                <div className="resend-otp">
                  <button
                    type="button"
                    className="link-btn-small"
                    onClick={props.onResendOtp}
                    disabled={props.loading || props.success}
                  >
                    Gửi lại OTP
                  </button>
                </div>
              </div>
            )}

            {/* New Password Field - Only in reset step */}
            {isResetStep && (
              <div className="field">
                <label htmlFor="newPassword" className="field-label">
                  Mật Khẩu Mới
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="newPassword"
                    type="password"
                    value={props.newPassword || ''}
                    onChange={(e) => props.onNewPasswordChange?.(e.target.value)}
                    placeholder="Nhập mật khẩu mới (6-50 ký tự)"
                    disabled={props.loading || props.success}
                    aria-invalid={!!props.errors.newPassword}
                    aria-describedby={props.errors.newPassword ? 'newPassword-error' : undefined}
                    className="field-input"
                  />
                </div>
                {props.errors.newPassword && (
                  <span id="newPassword-error" className="error-message">
                    {props.errors.newPassword}
                  </span>
                )}
              </div>
            )}

            {/* Confirm Password Field - Only in reset step */}
            {isResetStep && (
              <div className="field">
                <label htmlFor="confirmPassword" className="field-label">
                  Xác Nhận Mật Khẩu
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={props.confirmPassword || ''}
                    onChange={(e) => props.onConfirmPasswordChange?.(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={props.loading || props.success}
                    aria-invalid={!!props.errors.confirmPassword}
                    aria-describedby={props.errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    className="field-input"
                  />
                </div>
                {props.errors.confirmPassword && (
                  <span id="confirmPassword-error" className="error-message">
                    {props.errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="primary"
              disabled={props.loading || props.success}
            >
              {props.loading ? (
                <>
                  <span className="loading-spinner"></span>
                  {isRequestStep ? 'Đang gửi...' : 'Đang đặt lại...'}
                </>
              ) : (
                <>
                  {isRequestStep ? 'Gửi mã OTP' : 'Đặt lại mật khẩu'}
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="forgot-password-footer-links">
            <button
              type="button"
              className="link-btn"
              onClick={props.onGoToLogin}
              disabled={props.loading}
            >
              <span className="back-arrow">←</span>
              Quay lại Đăng nhập
            </button>
          </div>

          {/* Security Note */}
          <div className="security-note">
            <span className="security-icon">🔒</span>
            <p className="security-text">
              {isRequestStep 
                ? 'Bảo mật của bạn là ưu tiên hàng đầu. Mã OTP sẽ hết hạn trong 5 phút.'
                : 'Đảm bảo mật khẩu mới của bạn mạnh và duy nhất.'
              }
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="forgot-decor forgot-decor-1"></div>
        <div className="forgot-decor forgot-decor-2"></div>
      </main>

      <footer className="forgot-password-footer">
        <Footer />
      </footer>

      {/* Loading Modal */}
      <LoadingModal 
        isOpen={props.loading} 
        message={props.step === 'request' ? 'Đang gửi mã OTP...' : 'Đang đặt lại mật khẩu...'}
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </div>
  )
}
