import { MapPin, Phone, Mail, Facebook, MessageCircle } from 'lucide-react';

const contactItems = [
    {
        id: 1,
        icon: MapPin,
        label: 'Հասցե',
        value: 'Շիրակի մարզ, Արթիկ համայնք, գյուղ Գեղանիստ, 1 փողոց, շ. 6',
        href: null,
    },
    {
        id: 2,
        icon: Phone,
        label: 'Հեռախոս',
        value: '093 35-56-51',
        href: 'tel:+37493355651',
    },
    {
        id: 3,
        icon: Facebook,
        label: 'Facebook',
        value: 'Գեղանիստի միջնակարգ դպրոց Շիրակ',
        href: 'https://www.facebook.com/geganisti.mijnakarg.dproc.sirak',
        external: true,
    },
    {
        id: 4,
        icon: Mail,
        label: 'Էլ. փոստ',
        value: 'geghanist-shirak@schools.am',
        href: 'mailto:geghanist-shirak@schools.am',
    }
];

const Contact = () => {
    return (
        <div className="page-content">
            <section className="contact-section">
                <div className="container">

                    {/* ── Header ──────────────────── */}
                    <div className="contact-header">
                        <span className="contact-header__label">
                            <MessageCircle size={12} aria-hidden="true" />
                            Հետադարձ Կապ
                        </span>
                        <h1 className="contact-header__title">կոնտակտ</h1>
                        <p className="contact-header__subtitle">
                            ՀՀ   ՇԻՐԱԿԻ  ՄԱՐԶ   ԱՐԹԻԿԻ ՏԱՐԱԾԱՇՐՋԱՆ Գ.ԳԵՂԱՆԻՍՏ

                        </p>
                    </div>

                    {/* ── Cards ───────────────────── */}
                    <div className="contact-grid">
                        {contactItems.map((item) => {
                            const IconComp = item.icon;
                            const inner = (
                                <>
                                    <div className="contact-card__icon">
                                        <IconComp size={18} aria-hidden="true" />
                                    </div>
                                    <div className="contact-card__body">
                                        <span className="contact-card__label">{item.label}</span>
                                        <span className="contact-card__value">{item.value}</span>
                                    </div>
                                    {item.href && (
                                        <div className="contact-card__arrow" aria-hidden="true">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    )}
                                </>
                            );

                            return item.href ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className="contact-card contact-card--link"
                                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                >
                                    {inner}
                                </a>
                            ) : (
                                <div key={item.id} className="contact-card">
                                    {inner}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Contact;