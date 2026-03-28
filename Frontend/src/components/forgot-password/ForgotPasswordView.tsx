import './ForgotPassword.css'
import Footer from '../common/footer/Footer'

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
              {isRequestStep ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="forgot-password-subtitle">
              {isRequestStep 
                ? 'No worries! Enter your email address below and we\'ll send you an OTP code to reset your password.'
                : 'Enter the OTP code sent to your email and create a new password.'
              }
            </p>
          </div>

          {/* OTP Sent Message */}
          {props.otpSent && isResetStep && (
            <div className="info-message">
              <div className="info-icon">📧</div>
              <div>
                <p className="info-title">OTP Sent!</p>
                <p className="info-text">
                  We've sent a 6-digit OTP code to <strong>{props.email}</strong>. Please check your email and enter the code below.
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {props.success && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <div>
                <p className="success-title">Password Reset Successful!</p>
                <p className="success-text">
                  Your password has been reset successfully. Redirecting to login page...
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
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  id="email"
                  type="email"
                  value={props.email}
                  onChange={(e) => props.onEmailChange(e.target.value)}
                  placeholder="e.g. nature@fruitshop.com"
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
                  OTP Code
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
                    placeholder="Enter 6-digit code"
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
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* New Password Field - Only in reset step */}
            {isResetStep && (
              <div className="field">
                <label htmlFor="newPassword" className="field-label">
                  New Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="newPassword"
                    type="password"
                    value={props.newPassword || ''}
                    onChange={(e) => props.onNewPasswordChange?.(e.target.value)}
                    placeholder="Enter new password (6-50 characters)"
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
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={props.confirmPassword || ''}
                    onChange={(e) => props.onConfirmPasswordChange?.(e.target.value)}
                    placeholder="Re-enter your new password"
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
                  {isRequestStep ? 'Sending...' : 'Resetting...'}
                </>
              ) : (
                <>
                  {isRequestStep ? 'Send OTP Code' : 'Reset Password'}
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
              Back to Login
            </button>
          </div>

          {/* Security Note */}
          <div className="security-note">
            <span className="security-icon">🔒</span>
            <p className="security-text">
              {isRequestStep 
                ? 'Your security is our priority. The OTP code will expire in 5 minutes.'
                : 'Make sure your new password is strong and unique.'
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
    </div>
  )
}
