import React from 'react'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import './Login.css'

type Props = {
  email: string
  password: string
  loading: boolean
  showRegister: boolean
  showReset: boolean
  regName: string
  regEmail: string
  regPwd: string
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onToggleRegister: (v: boolean) => void
  onToggleReset: () => void
  onRegisterSubmit: (e: React.FormEvent) => void
  onRegNameChange: (v: string) => void
  onRegEmailChange: (v: string) => void
  onRegPwdChange: (v: string) => void
  onSendReset: (e: React.FormEvent) => void
}

export default function LoginView({
  email,
  password,
  loading,
  showRegister,
  showReset,
  regName,
  regEmail,
  regPwd,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleRegister,
  onToggleReset,
  onRegisterSubmit,
  onRegNameChange,
  onRegEmailChange,
  onRegPwdChange,
  onSendReset,
}: Props) {
  return (
    <main className="home-root login-root">
      <div className="home-container">
        <Header />

        <div className="content">
          <div className="login-wrap">
            {!showRegister && (
              <div className="card login-card">
                <h2>Đăng nhập</h2>
                <p className="muted">Đăng nhập để quản lý cửa hàng của bạn</p>
                <form onSubmit={onSubmit} className="login-form">
                  <label className="field">
                    <span>Email</span>
                    <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required />
                  </label>

                  <label className="field">
                    <span>Mật khẩu</span>
                    <input type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)} required />
                  </label>

                  <div className="auth-links">
                    <button type="button" className="link-btn" onClick={onToggleReset}>
                      Quên mật khẩu?
                    </button>
                    <button type="button" className="link-btn" onClick={() => onToggleRegister(true)}>
                      Đăng ký
                    </button>
                  </div>

                  {showReset && (
                    <form onSubmit={onSendReset} className="reset-card">
                      <label className="field">
                        <span>Nhập email để đặt lại mật khẩu</span>
                        <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="email@domain" />
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="primary" type="submit">Gửi liên kết</button>
                      </div>
                    </form>
                  )}

                  <div className="form-actions">
                    <button className="primary" type="submit" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showRegister && (
              <div className="card login-card">
                <h2>Đăng ký tài khoản</h2>
                <p className="muted">Tạo tài khoản để quản lý cửa hàng</p>
                <form onSubmit={onRegisterSubmit} className="login-form">
                  <label className="field">
                    <span>Họ và tên</span>
                    <input value={regName} onChange={(e) => onRegNameChange(e.target.value)} required />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input type="email" value={regEmail} onChange={(e) => onRegEmailChange(e.target.value)} required />
                  </label>
                  <label className="field">
                    <span>Mật khẩu</span>
                    <input type="password" value={regPwd} onChange={(e) => onRegPwdChange(e.target.value)} required />
                  </label>
                  <div className="form-actions" style={{ justifyContent: 'space-between' }}>
                    <button type="button" className="link-btn" onClick={() => onToggleRegister(false)}>Quay lại</button>
                    <button className="primary" type="submit">Tạo tài khoản</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  )
}
