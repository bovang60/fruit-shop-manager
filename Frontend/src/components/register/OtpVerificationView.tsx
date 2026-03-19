import { useState, useEffect } from 'react'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import './Register.css'

export type OtpVerificationProps = {
  email: string
  loading: boolean
  error?: string
  onVerify: (otpCode: string) => void
  onResend: () => void
  onBack: () => void
}

export default function OtpVerificationView({
  email,
  loading,
  error,
  onVerify,
  onResend,
  onBack,
}: OtpVerificationProps) {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(300) // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // Format countdown to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otpCode]
    newOtp[index] = value
    setOtpCode(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only accept 6 digits
    if (!/^\d{6}$/.test(pastedData)) return

    const newOtp = pastedData.split('')
    setOtpCode(newOtp)

    // Focus last input
    const lastInput = document.getElementById('otp-5')
    lastInput?.focus()
  }

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otpCode.join('')
    if (code.length === 6) {
      onVerify(code)
    }
  }

  // Handle resend
  const handleResend = () => {
    setCountdown(300) // Reset countdown
    setCanResend(false)
    setOtpCode(['', '', '', '', '', '']) // Clear OTP inputs
    onResend()
  }

  const isOtpComplete = otpCode.every((digit) => digit !== '')

  return (
    <div className="register-root">
      {/* Sticky Header */}
      <header className="register-header">
        <Header />
      </header>

      {/* Main Layout */}
      <main className="register-main">
        {/* Left: Hero Section (Desktop Only) */}
        <div className="register-hero">
          <div className="hero-image">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              Gần Hoàn Thành!
            </h1>
            <p className="hero-subtitle">
              Chỉ còn một bước nữa để tham gia cộng đồng trái cây tươi của chúng tôi.
            </p>
          </div>
        </div>

        {/* Right: OTP Form Section */}
        <div className="register-form-section">
      <div className="register-form-container">
        <div className="register-header-text">
          <h2>Xác nhận mã OTP</h2>
          <p className="muted">
            Mã OTP đã được gửi đến email:<br />
            <strong>{email}</strong>
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div
              className="error-message"
              style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c00',
              }}
            >
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="field">
            <label>Nhập mã OTP (6 chữ số)</label>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                marginTop: '0.5rem',
              }}
            >
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                  }}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Countdown */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            {countdown > 0 ? (
              <p className="muted">
                Mã OTP còn hiệu lực: <strong>{formatTime(countdown)}</strong>
              </p>
            ) : (
              <p className="muted" style={{ color: '#c00' }}>
                Mã OTP đã hết hạn
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="primary"
            disabled={loading || !isOtpComplete}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? 'Đang xác thực...' : 'Xác nhận'}
          </button>

          {/* Resend Button */}
          <button
            type="button"
            className="secondary"
            onClick={handleResend}
            disabled={!canResend || loading}
            style={{ marginTop: '1rem' }}
          >
            {canResend ? 'Gửi lại mã OTP' : `Gửi lại sau ${formatTime(countdown)}`}
          </button>

          {/* Back Button */}
          <button
            type="button"
            className="link-btn"
            onClick={onBack}
            disabled={loading}
            style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}
          >
            ← Quay lại đăng ký
          </button>
        </form>
      </div>
    </div>
      </main>

      {/* Footer */}
      <footer className="register-footer">
        <Footer />
      </footer>
    </div>
  )
}
