import {Link, NavLink} from 'react-router-dom';
import {Lock} from 'lucide-react';
import {useSelector} from 'react-redux';
import coatOfArms from '../../../public/Coat_of_arms_of_Armenia.svg.png';


const menuItems = [
    { id: 1, label: 'Գլխավոր', path: '/' },
    { id: 2, label: 'Մեր մասին', path: '/about' },
    { id: 3, label: 'Հրապակումներ', path: '/publications' },
    { id: 4, label: 'Աշխատակազմ', path: '/staff' },
    { id: 5, label: 'Փաստաթղթեր', path: '/documents' },
    { id: 6, label: 'Հետադարձ Կապ', path: '/contact' },
];

const socialLinks = [
    {id: 1, label: 'Facebook', href: 'https://www.facebook.com/geganisti.mijnakarg.dproc.sirak?rdid=EVHRGZNQAMU84YIB&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DWjQsnY5H%2F#', icon: 'facebook'},
];

const Footer = () => {
    const {admin} = useSelector(state => state.auth);

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__grid">
                    <div className="footer__column footer__column--brand">
                        <div className="footer__logo">
                            <img src={coatOfArms} alt="ՀՀ Զինանշան" className="footer__logo-img"/>
                        </div>
                        <h3 className="footer__title">ՀՀ Կրթության, գիտության, մշակույթի և սպորտի նախարարություն</h3>
                        <p className="footer__subtitle">Շիրակի Մարզի Գեղանիստի Միջնակարգ Դպրոց</p>
                        <p className="footer__description">
                            Պետական ուսումնական հաստատություն, որտեղ յուրաքանչյուր սովորող ստանում է որակյալ կրթություն
                            և զարգացնում է իր հմտությունները:
                        </p>

                        <div className="official_documents">
                            <h4>Պաշտոնական փաստաթղթեր</h4>

                            <div className="official_documents__links">
                                <a href="/license/լիցենզիա.pdf" target="_blank" rel="noopener noreferrer">Լիցենզիա</a>
                                <a href="/license/լիցենզիա-ներդիր.pdf" target="_blank" rel="noopener noreferrer">Լիզենզիա Ներդիր</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer__column">
                        <h4 className="footer__column-title">Հղումներ</h4>
                        <ul className="footer__links">
                            {menuItems.map((link) => (
                                <li key={link.id} className="footer__link-item">
                                    <NavLink to={link.path}>{link.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__column">
                        <h4 className="footer__column-title">Կոնտակտ</h4>
                        <ul className="footer__contact">
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">📍</span>
                                <span>Շիրակի մարզ, Արթիկ համայնք, գյուղ Գեղանիստ, 1 փողոց, շենք 6</span>
                            </li>
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">📞</span>
                                <a href="tel:+37493355651">+374 93-35-56-51</a>
                            </li>
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">✉️</span>
                                <a href="mailto:geghanist-shirak@schools.am">geghanist-shirak@schools.am</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__column">
                        <h4 className="footer__column-title">Հետևեք մեզ</h4>
                        <div className="footer__social">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    className={`footer__social-link footer__social-link--${social.icon}`}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        &copy; {new Date().getFullYear()} Գեղանիստի Միջնակարգ Դպրոց: Բոլոր իրավունքները պաշտպանված են:
                    </p>

                    {admin ? (
                        <Link to="/admin" className="footer__login-link">
                            <span>Կառավարման Համակարգ</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="footer__login-link">
                            <Lock size={12}/>
                            <span>Մուտք</span>
                        </Link>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;