import { useState } from 'react'
import LoginView from './LoginView'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPwd, setRegPwd] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Đăng nhập (mock): ${email}`)
    }, 800)
  }

  const doRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Đăng ký thành công (mock): ${regName} <${regEmail}>'`)
      setShowRegister(false)
      setRegEmail('')
      setRegName('')
      setRegPwd('')
    }, 900)
  }

  const sendReset = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert(`Gửi email đặt lại mật khẩu (mock) tới: ${email || regEmail}`)
      setShowReset(false)
    }, 700)
  }

  return (
    <LoginView
      email={email}
      password={password}
      loading={loading}
      showRegister={showRegister}
      showReset={showReset}
      regName={regName}
      regEmail={regEmail}
      regPwd={regPwd}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={submit}
      onToggleRegister={setShowRegister}
      onToggleReset={() => setShowReset((s) => !s)}
      onRegisterSubmit={doRegister}
      onRegNameChange={setRegName}
      onRegEmailChange={setRegEmail}
      onRegPwdChange={setRegPwd}
      onSendReset={sendReset}
    />
  )
}
