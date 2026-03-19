import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ForgotPasswordView from './ForgotPasswordView'
import { requestPasswordReset, resetPasswordWithOtp, getDisplayMessage } from '../../services/authService'
import { usePopup } from '../common/popup'

type Step = 'request' | 'reset'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { showNotice, showError } = usePopup()
  
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const validateEmail = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Địa chỉ email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Địa chỉ email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Vui lòng nhập địa chỉ email hợp lệ'
    }

    if (!otpCode.trim()) {
      newErrors.otpCode = 'Mã OTP là bắt buộc'
    } else if (!/^\d{6}$/.test(otpCode)) {
      newErrors.otpCode = 'Mã OTP phải gồm 6 chữ số'
    }

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Mật khẩu không được vượt quá 50 ký tự'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setLoading(true)
    setErrors({})
    setOtpSent(false)

    try {
      const result = await requestPasswordReset({ email })

      if (result.resultCd === 0) {
        // Success - OTP sent to email
        setOtpSent(true)
        setStep('reset')
      } else {
        // Business error from backend
        const displayMessage = getDisplayMessage(result.message || '')
        showError(displayMessage || 'Không thể gửi OTP. Vui lòng thử lại.', 'Lỗi gửi OTP')
      }
    } catch (error: any) {
      console.error('Error requesting password reset:', error)
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateResetForm()) return

    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const result = await resetPasswordWithOtp({
        email,
        otpCode,
        newPassword,
        confirmPassword
      })

      if (result.resultCd === 0) {
        // Success - password reset
        setSuccess(true)
        showNotice('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...', 'Thành công')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        // Business error from backend
        const displayMessage = getDisplayMessage(result.message || '')
        showError(displayMessage || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.', 'Lỗi đặt lại mật khẩu')
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (step === 'request') {
      handleRequestOtp(e)
    } else {
      handleResetPassword(e)
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (errors.email || errors.general) {
      setErrors({})
    }
  }

  const handleOtpChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6)
    setOtpCode(digitsOnly)
    if (errors.otpCode || errors.general) {
      setErrors({})
    }
  }

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value)
    if (errors.newPassword || errors.general) {
      setErrors({})
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errors.confirmPassword || errors.general) {
      setErrors({})
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setErrors({})

    try {
      const result = await requestPasswordReset({ email })

      if (result.resultCd === 0) {
        setOtpSent(true)
        // Show success notification
        const displayMessage = getDisplayMessage(result.message || '')
        showNotice(displayMessage || 'Gửi lại OTP thành công!', 'Gửi lại OTP')
      } else {
        const displayMessage = getDisplayMessage(result.message || '')
        showError(displayMessage || 'Không thể gửi lại OTP. Vui lòng thử lại.', 'Lỗi gửi OTP')
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error)
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ForgotPasswordView
      step={step}
      email={email}
      otpCode={otpCode}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      errors={errors}
      loading={loading}
      success={success}
      otpSent={otpSent}
      onEmailChange={handleEmailChange}
      onOtpChange={handleOtpChange}
      onNewPasswordChange={handleNewPasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onSubmit={handleSubmit}
      onGoToLogin={handleGoToLogin}
      onResendOtp={handleResendOtp}
    />
  )
}
