import { Link } from 'react-router-dom';

const Hero = ({
                title            = 'Բարի գալուստ Գեղանիստի Միջնակարգ Դպրոց',
                subtitle         = 'Գյուղ Արթիկի տարածաշրջանում, Արթիկ քաղաքից մոտ 9կմ հյուսիս-արևելք, մարզկենտրոնից 19կմ հեռավորության վրա:',
                badge            = 'Ընդունելություն 2025–2026',
                ctaText          = 'Իմանալ ավելին',
                ctaLink          = '/about',
                secondaryCtaText = 'Կոնտակտ',
                secondaryCtaLink = '/contact',
                backgroundImage = '/school.jpg',
              }) => {
  return (
      <section className="hero">

        {/* ── Background layers ───────────── */}
        <div className="hero__bg" aria-hidden="true">
          <img src={backgroundImage} alt="" />
        </div>
        <div className="hero__overlay" aria-hidden="true" />

        {/* ── Content ─────────────────────── */}
        <div className="container">
          <div className="hero__content">

            {badge && (
                <span className="hero__badge">{badge}</span>
            )}

            <h1 className="hero__title">{title}</h1>

            <p className="hero__subtitle">{subtitle}</p>

            <div className="hero__actions">
              <Link to={ctaLink} className="btn btn--white">
                {ctaText}
              </Link>
              <Link to={secondaryCtaLink} className="btn btn--ghost">
                {secondaryCtaText}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Scroll hint ─────────────────── */}
        <div className="hero__scroll" aria-hidden="true">
          <div className="hero__scroll-dot" />
        </div>

      </section>
  );
};

export default Hero;