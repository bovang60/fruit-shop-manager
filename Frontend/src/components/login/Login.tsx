import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginView from './LoginView'
import { login, saveUserToStorage, getDisplayMessage } from '../../services/authService'
import { usePopup } from '../common/popup'

type LoginProps = {
  onSuccess?: () => void
  onGoToRegister?: () => void
}

export default function Login({ onSuccess, onGoToRegister }: LoginProps = {}) {
  const navigate = useNavigate()
  const { showError } = usePopup()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      const result = await login({ email, password })
      
      if (result.resultCd === 0 && result.data) {
        // Login successful
        saveUserToStorage(result.data)
        // alert(`Đăng nhập thành công! Chào mừng ${result.data.fullName}`)
        if (onSuccess) {
          onSuccess()
        } else {
          if (result.data.role === 'ADMIN') {
            navigate('/admin-dashboard')
          } else if (result.data.role === 'SELLER') {
            navigate('/seller-dashboard')
          } else{
            navigate('/home')
          }
        }
      } else {
        // Business logic error
        const displayMessage = getDisplayMessage(result.message || 'Đăng nhập thất bại')
        showError(displayMessage, 'Lỗi đăng nhập')
      }
    } catch (error) {
      console.error('Login error:', error)
      showError('Có lỗi xảy ra. Vui lòng thử lại!', 'Lỗi')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToRegister = () => {
    if (onGoToRegister) {
      onGoToRegister()
    } else {
      navigate('/register')
    }
  }

  const handleGoToForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <LoginView
      email={email}
      password={password}
      loading={loading}
      errors={errors}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoToRegister={handleGoToRegister}
      onGoToForgotPassword={handleGoToForgotPassword}
    />
  )
}
