// Felix Wu — brand mark with the founder's portrait photo + wordmark.
// Two stacked squares + dot accent is kept as a fallback for places
// where we don't want a portrait (e.g. print, dark surfaces).
import './LogoMark.css';

export function LogoMark({ size = 36, tone = 'ink' }) {
  return (
    <svg
      className={`logo-mark logo-tone-${tone}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label="Felix Wu"
    >
      <path d="M2 2 H22 V22 H2 Z" />
      <path d="M18 18 H38 V38 H18 Z" />
      <circle cx="30" cy="10" r="2.4" fill="currentColor" />
    </svg>
  );
}

// Photo-based brand mark. Renders a circular portrait + accent dot.
export function PhotoMark({ src, alt = 'Felix Wu', size = 32 }) {
  return (
    <span className="photo-mark" style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="eager"
        decoding="async"
      />
      <span className="photo-mark-dot" aria-hidden />
    </span>
  );
}

export function Wordmark({ text = 'Felix Wu', cn = '吴先浩' }) {
  return (
    <span className="wordmark">
      <span className="wordmark-en">{text}</span>
      <span className="wordmark-cn">{cn}</span>
    </span>
  );
}