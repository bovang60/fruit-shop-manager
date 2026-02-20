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
    <div className="register-root">
      {/* Sticky Header */}
      <header className="register-header">
        <Header />
      </header>

      {/* Main Split Layout */}
      <main className="register-main">
        {/* Left: Hero Section (Desktop Only) */}
        <div className="register-hero">
          <div className="hero-image">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              Start Your<br/>Healthy Journey
            </h1>
            <p className="hero-subtitle">
              Join our community and get the freshest citrus fruits delivered straight to your doorstep.
            </p>
          </div>
        </div>

        {/* Right: Register Form Section */}
        <div className="register-form-section">
          <div className="register-form-container">
            <div className="register-header-text">
              <h2>Create Your Account</h2>
              <p className="muted">Join the fresh movement today.</p>
            </div>

            <form className="register-form" onSubmit={onSubmit} noValidate>
              {/* Full Name */}
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={values.fullName}
                  onChange={(e) => onChange('fullName', e.target.value)}
                  aria-invalid={errors.fullName ? 'true' : undefined}
                  aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                  disabled={loading}
                  required
                />
                {errors.fullName && <span id="err-fullName" className="error-message">{errors.fullName}</span>}
              </div>

              {/* Email */}
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={values.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'err-email' : undefined}
                  disabled={loading}
                  required
                />
                {errors.email && <span id="err-email" className="error-message">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={values.phone || ''}
                  onChange={(e) => onChange('phone', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password Grid */}
              <div className="password-grid">
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    aria-invalid={errors.password ? 'true' : undefined}
                    aria-describedby={errors.password ? 'err-password' : undefined}
                    disabled={loading}
                    required
                  />
                  {errors.password && <span id="err-password" className="error-message">{errors.password}</span>}
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    aria-invalid={errors.confirmPassword ? 'true' : undefined}
                    aria-describedby={errors.confirmPassword ? 'err-confirmPassword' : undefined}
                    disabled={loading}
                    required
                  />
                  {errors.confirmPassword && <span id="err-confirmPassword" className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="terms-field">
                <input
                  id="terms"
                  type="checkbox"
                  checked={values.acceptTerms}
                  onChange={(e) => onChange('acceptTerms', e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="terms">
                  I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>.
                </label>
              </div>
              {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}

              {/* Create Account Button */}
              <button type="submit" className="primary register-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <div className="login-link">
              <span>Already have an account?</span>
              <button type="button" className="link-btn" onClick={onGoToLogin}>
                Login
              </button>
            </div>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">Or continue with</span>
              <div className="divider-line"></div>
            </div>

            {/* Social Registration */}
            <div className="social-register">
              <button type="button" className="social-btn" aria-label="Register with Google">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7c0hccFF0Q2ai4PEyNY0oGUKajtYEc04krya811d0VSpXKb74Y6c7aRpRL_0KUhax2Jm-cWang_w8spWDjfWk2rP3porlxzn7fskgeTm13wQ5bTPlLte43SA3-PfkscLUqW1YaZptO3s4P0AkbvuPtBoukYBjxtzID2pLTSudzQEPF7kWwH1xP-5mxBZ3qYy8Utd7R3QymVZc3UFR6JnB9ofhS4P9UbjH7N8SswCGgMcvUHNbgl2XsvN6oNWkbongOS__zCxPHvU" alt="Google" />
                <span>Google</span>
              </button>
              <button type="button" className="social-btn" aria-label="Register with Apple">
                <span className="apple-icon"></span>
                <span>Apple</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="register-footer">
        <Footer />
      </footer>
    </div>
  )
}
