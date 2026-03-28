import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChangePasswordView from './ChangePasswordView'
import { callApiWithMethod } from '../../utils/apiClient'
import { LoadingModal } from '../common/loading'
import { getUserFromStorage } from '../../services/authService'
import { usePopup } from '../common/popup'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { showSuccess, showError } = usePopup()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Calculate password strength (0-4)
  const calculatePasswordStrength = (password: string): number => {
    if (password.length === 0) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    return Math.min(strength, 4)
  }

  const passwordStrength = calculatePasswordStrength(newPassword)

  const getStrengthLabel = (strength: number): string => {
    const labels = ['Yếu', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh']
    return labels[strength] || 'Yếu'
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc'
    }

    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Mật khẩu không được vượt quá 50 ký tự'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      // Get user from localStorage
      const user = getUserFromStorage()
      if (!user || !user.userId) {
        setErrors({ general: 'Vui lòng đăng nhập trước' })
        navigate('/login')
        return
      }

      // API call to change password
      const result = await callApiWithMethod('PUT', `/api/users/${user.userId}/change-password`, {
        currentPassword,
        newPassword,
        confirmPassword
      })

      if (result.resultCd === 0) {
        // Success - show success message and redirect
        setErrors({})
        showSuccess(
          result.message || 'Mật khẩu đã được thay đổi thành công!',
          'Thành công'
        )
        
        // Clear form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
      } else {
        showError(
          result.message || 'Không thể cập nhật mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.',
          'Lỗi'
        )
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      showError(
        error.response?.data?.message || 'Lỗi kết nối. Vui lòng thử lại.',
        'Lỗi'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <>
      <ChangePasswordView
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        showCurrentPassword={showCurrentPassword}
        showNewPassword={showNewPassword}
        showConfirmPassword={showConfirmPassword}
        passwordStrength={passwordStrength}
        strengthLabel={getStrengthLabel(passwordStrength)}
        errors={errors}
        loading={loading}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
        onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        onSubmit={handleSubmit}
        onGoBack={handleGoBack}
      />
      <LoadingModal 
        isOpen={loading} 
        message="Đang cập nhật mật khẩu..." 
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  )
}
