import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChangePasswordView from './ChangePasswordView'
import { callApi } from '../../utils/apiClient'

export default function ChangePassword() {
  const navigate = useNavigate()

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
    const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return labels[strength] || 'Weak'
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    } else if (newPassword.length > 50) {
      newErrors.newPassword = 'Password must not exceed 50 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
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
      // Get userId from localStorage
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setErrors({ general: 'Please login first' })
        navigate('/login')
        return
      }

      // API call to change password
      const result = await callApi(`/api/users/${userId}/change-password`, 'PUT', {
        currentPassword,
        newPassword,
        confirmPassword
      })

      if (result.resultCd === 0) {
        // Success - show success message and redirect
        setErrors({})
        alert(result.message || 'Password changed successfully!')
        
        // Clear form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
      } else {
        setErrors({
          general: result.message || 'Failed to update password. Please check your current password.'
        })
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      setErrors({ 
        general: error.response?.data?.message || 'Network error. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  return (
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
  )
}
