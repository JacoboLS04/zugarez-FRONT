import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
  
      <div className="footer__bottom">

        <div className="footer__social" aria-label="Redes sociales">
            <a href="https://www.instagram.com/andr3s.15?igsh=MXJmNmgwdjRuYzltNQ==" aria-label="Instagram" className="footer__social-btn">
              {/* Instagram */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="17" cy="7" r="1.2" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://api.whatsapp.com/send?phone=573154530677&text=Hola%20que%20caf%C3%A9%20venden%3F%20" aria-label="WhatsApp" className="footer__social-btn" target="_blank" rel="noopener noreferrer">
              {/* WhatsApp */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L6 20l1-2.9A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M9.6 8.9c.2-.4.2-.5.6-.5h.5c.2 0 .4 0 .5.3l.7 1.7c.1.2 0 .5-.2.7l-.4.4c-.1.1 0 .3 0 .4.4.6 1 1.2 1.7 1.6.2.1.3 0 .4 0l.6-.5c.2-.1.5-.1.7.1l1.5 1c.2.1.2.4.1.6-.4.7-1.2 1.3-2 1.3-.5 0-1 0-1.5-.2a6.4 6.4 0 0 1-3.3-2.5 5.2 5.2 0 0 1-.9-3c0-.6.2-1.1.5-1.6Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        <p>© {new Date().getFullYear()} Zugarez S.A.S  Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
