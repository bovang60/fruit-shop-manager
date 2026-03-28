import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterView, { type RegisterValues } from './RegisterView'
import OtpVerificationView from './OtpVerificationView'
import { requestRegister, verifyOtp, getDisplayMessage } from '../../services/authService'

const initial: RegisterValues = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', acceptTerms: false }

type RegisterStep = 'register' | 'verify-otp'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<RegisterStep>('register')
  const [values, setValues] = useState<RegisterValues>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState<string>('')

  function onChange(field: string, value: any) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const err: Record<string, string> = {}
    if (!values.fullName.trim()) err.fullName = 'Vui lòng nhập họ và tên'
    else if (values.fullName.trim().length < 2 || values.fullName.trim().length > 100) {
      err.fullName = 'Họ tên phải có từ 2-100 ký tự'
    }
    
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      err.email = 'Email không hợp lệ'
    }
    
    if (!values.password) {
      err.password = 'Vui lòng nhập mật khẩu'
    } else if (values.password.length < 6) {
      err.password = 'Mật khẩu tối thiểu 6 ký tự'
    }
    
    if (values.password !== values.confirmPassword) {
      err.confirmPassword = 'Mật khẩu không khớp'
    }
    
    if (values.phone && !/^(0|\+84)[0-9]{9,10}$/.test(values.phone)) {
      err.phone = 'Số điện thoại không hợp lệ'
    }
    
    if (!values.acceptTerms) {
      err.acceptTerms = 'Bạn cần đồng ý điều khoản'
    }
    
    return err
  }

  // Step 1: Request registration and send OTP
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) {
      setErrors(err)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await requestRegister({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phone?.trim() || undefined,
      })

      if (result.resultCd === 0) {
        // Success - move to OTP verification step
        setStep('verify-otp')
        setOtpError('')
      } else {
        // Business logic error
        const displayMessage = getDisplayMessage(result.message || 'Đăng ký thất bại')
        setErrors({ general: displayMessage })
      }
    } catch (error) {
      console.error('Request register error:', error)
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại!' })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP and complete registration
  async function handleVerifyOtp(otpCode: string) {
    setLoading(true)
    setOtpError('')

    try {
      const result = await verifyOtp({
        email: values.email.trim(),
        otpCode,
      })

      if (result.resultCd === 0) {
        // Registration completed successfully
        // Reset form and redirect to login
        setValues(initial)
        setStep('register')
        navigate('/login')
      } else {
        // Business logic error
        const displayMessage = getDisplayMessage(result.message || 'Xác thực OTP thất bại')
        setOtpError(displayMessage)
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      setOtpError('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    setLoading(true)
    setOtpError('')

    try {
      const result = await requestRegister({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phone?.trim() || undefined,
      })

      if (result.resultCd === 0) {
        alert('Mã OTP mới đã được gửi đến email của bạn')
      } else {
        const displayMessage = getDisplayMessage(result.message || 'Gửi lại OTP thất bại')
        setOtpError(displayMessage)
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setOtpError('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // Go back to registration form
  function handleBackToRegister() {
    setStep('register')
    setOtpError('')
  }

  // Navigate to login page
  function handleGoToLogin() {
    navigate('/login')
  }

  // Render appropriate view based on step
  if (step === 'verify-otp') {
    return (
      <OtpVerificationView
        email={values.email}
        loading={loading}
        error={otpError}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackToRegister}
      />
    )
  }

  return (
    <RegisterView
      values={values}
      errors={errors}
      loading={loading}
      onChange={onChange}
      onSubmit={onSubmit}
      onGoToLogin={handleGoToLogin}
    />
  )
}
