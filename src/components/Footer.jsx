// Footer — minimal closing band. (Currently the Contact module already includes
// its own footer; this is a redundant little line for in-page use.)
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <span>© 2026 Felix Wu · A portfolio in 6 acts.</span>
        <span className="serif-cn">从一束到另一束。</span>
        <span>v 1.0 · Aug 2026</span>
      </div>
    </footer>
  );
}
