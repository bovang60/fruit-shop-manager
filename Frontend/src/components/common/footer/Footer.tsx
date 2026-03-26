import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="footer-content">
      <p className="footer-title">Fruit Shop Manager</p>
      <p className="footer-meta">Fresh produce marketplace for everyone.</p>
      <p className="footer-meta">© {currentYear} Fruit Shop Manager. All rights reserved.</p>
    </div>
  )
}
