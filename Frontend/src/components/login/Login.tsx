import { useState } from 'react'
import LoginView from './LoginView'

type LoginProps = {
  onSuccess?: () => void
  onGoToRegister?: () => void
}

export default function Login({ onSuccess, onGoToRegister }: LoginProps = {}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    // TODO: connect API
    setTimeout(() => {
      setLoading(false)
      alert(`Login successful (mock): ${email}`)
      onSuccess?.()
    }, 600)
  }

  const handleGoToRegister = () => {
    onGoToRegister?.()
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
    />
  )
}
