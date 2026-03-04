import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginView from './LoginView'
import { login, saveUserToStorage, getDisplayMessage } from '../../services/authService'

type LoginProps = {
  onSuccess?: () => void
  onGoToRegister?: () => void
}

export default function Login({ onSuccess, onGoToRegister }: LoginProps = {}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
          navigate('/home')
        }
      } else {
        // Business logic error
        const displayMessage = getDisplayMessage(result.message || 'Đăng nhập thất bại')
        setErrors({ general: displayMessage })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại!' })
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
