import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import './Register.css'

export type RegisterValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  acceptTerms: boolean
}

export type Props = {
  values: RegisterValues
  errors: Record<string, string>
  loading: boolean
  onChange: (field: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  onGoToLogin?: () => void
}

export default function RegisterView({ values, errors, loading, onChange, onSubmit, onGoToLogin }: Props) {
  return (
    <main className="register-root">
      <div className="register-wrap">
        <Header />

        <div className="register-card card">
          <h2>Đăng ký</h2>
          <p className="muted">Tạo tài khoản để quản lý cửa hàng của bạn</p>

          <form onSubmit={onSubmit} noValidate>
            <label className="field">
              <span>Họ và tên</span>
              <input
                name="fullName"
                value={values.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                aria-invalid={errors.fullName ? 'true' : undefined}
                aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                required
              />
              {errors.fullName && <div id="err-fullName" className="field-error">{errors.fullName}</div>}
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={(e) => onChange('email', e.target.value)}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'err-email' : undefined}
                required
              />
              {errors.email && <div id="err-email" className="field-error">{errors.email}</div>}
            </label>

            <label className="field">
              <span>Mật khẩu</span>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={(e) => onChange('password', e.target.value)}
                aria-invalid={errors.password ? 'true' : undefined}
                aria-describedby={errors.password ? 'err-password' : undefined}
                required
              />
              {errors.password && <div id="err-password" className="field-error">{errors.password}</div>}
            </label>

            <label className="field">
              <span>Nhập lại mật khẩu</span>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                aria-invalid={errors.confirmPassword ? 'true' : undefined}
                aria-describedby={errors.confirmPassword ? 'err-confirmPassword' : undefined}
                required
              />
              {errors.confirmPassword && <div id="err-confirmPassword" className="field-error">{errors.confirmPassword}</div>}
            </label>

            <label className="field">
              <span>Số điện thoại (tùy chọn)</span>
              <input
                name="phone"
                value={values.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
              />
            </label>

            <label className="field checkbox-field">
              <input
                type="checkbox"
                checked={values.acceptTerms}
                onChange={(e) => onChange('acceptTerms', e.target.checked)}
              />
              <span>Tôi đồng ý với các điều khoản</span>
            </label>

            <div className="form-actions">
              <button className="primary" type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Tạo tài khoản'}</button>
              <button type="button" className="link-btn" onClick={onGoToLogin}>Đã có tài khoản? Đăng nhập</button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </main>
  )
}
