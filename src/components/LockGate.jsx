import { useState, useEffect } from 'react';
import './LockGate.css';

// ── Soft access lock ───────────────────────────────────────────────
// This runs entirely in the browser, so it is NOT real security:
// anyone can open DevTools / view source to read the code or set the
// unlock flag. It only keeps out casual visitors. For true protection
// use Netlify's paid password protection (Pro plan) or a server-side
// function.
//
// 👉 CHANGE THE PIN BELOW to your own code before deploying.
const PIN = '2005';
const STORAGE_KEY = 'fw_portfolio_unlocked';

export default function LockGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = unlocked ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [unlocked]);

  const submit = (e) => {
    e.preventDefault();
    if (value === PIN) {
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
      setValue('');
    }
  };

  if (unlocked) return children;

  return (
    <div className="lockgate" role="dialog" aria-modal="true" aria-label="Access code">
      <div className="lockgate-card">
        <div className="lockgate-mark">FW</div>
        <h1 className="lockgate-title">Private Portfolio</h1>
        <p className="lockgate-sub">请输入访问密码 · Enter access code</p>
        <form onSubmit={submit} className="lockgate-form" autoComplete="off">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="••••"
            aria-label="Access code"
            className={error ? 'lockgate-input lockgate-input--err' : 'lockgate-input'}
          />
          <button type="submit" className="lockgate-btn">
            进入 · Enter
          </button>
        </form>
        {error && <p className="lockgate-err">密码错误 · Wrong code</p>}
        <p className="lockgate-foot">Felix Wu · Visual &amp; AI Designer</p>
      </div>
    </div>
  );
}
