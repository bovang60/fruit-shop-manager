import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ForgotPasswordView from './ForgotPasswordView'
import { requestPasswordReset, resetPasswordWithOtp, getDisplayMessage } from '../../services/authService'

type Step = 'request' | 'reset'

export default function ForgotPassword() {
  const navigate = useNavigate()
  
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
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!otpCode.trim()) {
      newErrors.otpCode = 'OTP code is required'
    } else if (!/^\d{6}$/.test(otpCode)) {
      newErrors.otpCode = 'OTP code must be 6 digits'
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Password must not exceed 50 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
        setErrors({ 
          general: getDisplayMessage(result.message || '') || 'Failed to send OTP. Please try again.' 
        })
      }
    } catch (error: any) {
      console.error('Error requesting password reset:', error)
      setErrors({ 
        general: 'Network error. Please try again.' 
      })
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
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        // Business error from backend
        setErrors({ 
          general: getDisplayMessage(result.message || '') || 'Failed to reset password. Please try again.' 
        })
      }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      setErrors({ 
        general: 'Network error. Please try again.' 
      })
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
        alert(getDisplayMessage(result.message || '') || 'OTP resent successfully!')
      } else {
        setErrors({ 
          general: getDisplayMessage(result.message || '') || 'Failed to resend OTP. Please try again.' 
        })
      }
    } catch (error: any) {
      console.error('Error resending OTP:', error)
      setErrors({ 
        general: 'Network error. Please try again.' 
      })
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
