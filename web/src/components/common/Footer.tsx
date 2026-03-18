// src/components/common/Footer.tsx
import { Container } from 'react-bootstrap'
import '../../styles/Footer.css'

const footerLinks = [
  { label: 'About',   href: 'https://trackpulse.com' },
  { label: 'Support', href: 'https://trackpulse.com' },
]

export default function AppFooter() {
  return (
    <div className="app-footer">
      <Container fluid className="px-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div className="footer-copyright order-2 order-md-1">
          <span>2026 &copy; </span>
          <a href="https://trackpulse.com" target="_blank" rel="noreferrer">TrackPulse</a>
        </div>
        <ul className="list-unstyled d-flex gap-4 mb-0 order-1 order-md-2">
          {footerLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  )
}
