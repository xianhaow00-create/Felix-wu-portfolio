// FlowerStage — a self-composed hero piece.
//
// Replaces the prior right-side video blob with a quiet, generative
// composition: the flower-source material inside a thin red frame
// ("红框") with a slow breathing scale and three soft morphing color
// halos behind it. Entirely CSS-driven, no external video required —
// the deformation is minimal, editorial, and unmistakably self-made.
import './FlowerStage.css';

export function FlowerStage() {
  return (
    <figure className="flower-stage">
      <div className="flower-stage-frame">
        {/* Soft morphing color halos — the "minimal deformation" */}
        <div className="flower-stage-halo" aria-hidden>
          <span className="halo halo--1" />
          <span className="halo halo--2" />
          <span className="halo halo--3" />
        </div>

        {/* The flower material */}
        <img
          className="flower-stage-img"
          src="/works/flower-source.webp"
          alt="Self-composed flower study"
          width="560"
          height="746"
          loading="eager"
          decoding="async"
        />

        {/* Subtle pixel-grid echo to honor the source's pixel character */}
        <div className="flower-stage-grain" aria-hidden />
      </div>

      <figcaption className="flower-stage-cap">
        <span className="flower-stage-cap-dot" aria-hidden />
        <span>Self-composed · 2026</span>
      </figcaption>
    </figure>
  );
}