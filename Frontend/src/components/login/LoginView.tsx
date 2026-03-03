import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
import './Login.css'

export type Props = {
  email: string
  password: string
  loading: boolean
  errors: { email?: string; password?: string; general?: string }
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onGoToRegister: () => void
  onGoToForgotPassword: () => void
}

export default function LoginView({
  email,
  password,
  loading,
  errors,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoToRegister,
  onGoToForgotPassword,
}: Props) {
  return (
    <div className="login-root">
      {/* Sticky Header */}
      <header className="login-header">
        <Header />
      </header>

      {/* Main Split Layout */}
      <main className="login-main">
        {/* Left: Hero Section */}
        <div className="login-hero">
          <div className="hero-image">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <h1 className="hero-title">Freshness Awaits</h1>
            <p className="hero-subtitle">
              Join our community of fruit lovers and get the season's best harvests delivered straight to your doorstep.
            </p>
          </div>
        </div>

        {/* Right: Login Form Section */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header-text">
              <h2>Welcome Back!</h2>
              <p className="muted">Login to access your favorite harvests.</p>
            </div>

            <form className="login-form" onSubmit={onSubmit}>
              {/* General Error Message */}
              {errors.general && (
                <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c00' }}>
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="field">
                <label htmlFor="email">Email or Username</label>
                <div className="input-wrapper">
                  {/* <span className="input-icon">✉️</span> */}
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="Enter your email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <span id="email-error" className="error-message">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="field">
                <div className="field-header">
                  <label htmlFor="password">Password</label>
                  <button type="button" className="forgot-link" onClick={onGoToForgotPassword}>
                    Forgot Password?
                  </button>
                </div>
                <div className="input-wrapper">
                  {/* <span className="input-icon">🔒</span> */}
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <span id="password-error" className="error-message">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>

              {/* Login Button */}
              <button type="submit" className="primary login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">Or continue with</span>
              <div className="divider-line"></div>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <button type="button" className="social-btn" aria-label="Login with Google">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7c0hccFF0Q2ai4PEyNY0oGUKajtYEc04krya811d0VSpXKb74Y6c7aRpRL_0KUhax2Jm-cWang_w8spWDjfWk2rP3porlxzn7fskgeTm13wQ5bTPlLte43SA3-PfkscLUqW1YaZptO3s4P0AkbvuPtBoukYBjxtzID2pLTSudzQEPF7kWwH1xP-5mxBZ3qYy8Utd7R3QymVZc3UFR6JnB9ofhS4P9UbjH7N8SswCGgMcvUHNbgl2XsvN6oNWkbongOS__zCxPHvU" alt="Google" />
              </button>
              <button type="button" className="social-btn" aria-label="Login with Facebook">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArhJrCRLkSbiRUDunubHsZ0zgAlQyf9edRhFpGXdUtmXvsAPE7xTPEjv6Bw3tNiasJlAK6l7K3fLo_eB44O97YwyKkhtl8EMK-Qv166111KaAzA40cfMI7UrsKuqHNAzKKHofJ6FNPtgRB4_aXOD0oBPEa-rDQPWXqCwGrnHFEAnbVoFrJN43V3aL5aNxdliWHVPcfmi4tyt1Un8IGkC5na1hAfDJM9gljEWY-B9r7v7bLVajj6pBUBGEGY6f1F6miTJuT--1ZeOI" alt="Facebook" />
              </button>
            </div>

            {/* Footer Link */}
            <p className="signup-link">
              Don't have an account?
              <button type="button" className="link-btn" onClick={onGoToRegister}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <Footer />
      </footer>
    </div>
  )
}
