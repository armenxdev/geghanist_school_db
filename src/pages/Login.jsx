import {useState, useEffect, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginThunk, clearError} from '../store/reducers/authSlice.js';
import {Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft} from 'lucide-react';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error} = useSelector(state => state.auth);

    const [formData, setFormData] = useState({email: '', password: '', remember: false});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPanel, setShowForgotPanel] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSubmitted, setForgotSubmitted] = useState(false);

    useEffect(() => {
        const remembered = localStorage.getItem('rememberedEmail');
        if (remembered) {
            setFormData(prev => ({...prev, email: remembered, remember: true}));
        }
    }, []);

    useEffect(() => {
        if (error) {
            setErrors(prev => ({...prev, submit: error}));
        }
    }, [error]);

    const validateEmail = useCallback((email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);

    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email-ն պարտադիր է';
                if (!validateEmail(value)) return 'մուտքագրեք վավեր email';
                return '';
            case 'password':
                if (!value) return 'Գաղտնաբառը պարտադիր է';
                if (value.length < 6) return 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ';
                return '';
            default:
                return '';
        }
    }, [validateEmail]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData(prev => ({...prev, [name]: val}));
        if (touched[name]) {
            setErrors(prev => ({...prev, [name]: validateField(name, val)}));
        }
    };

    const handleBlur = (e) => {
        const {name, value} = e.target;
        setTouched(prev => ({...prev, [name]: true}));
        setErrors(prev => ({...prev, [name]: validateField(name, value)}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };
        setErrors(newErrors);
        setTouched({email: true, password: true});
        if (newErrors.email || newErrors.password) return;

        const result = await dispatch(loginThunk({
            email: formData.email,
            password: formData.password,
        }));

        if (loginThunk.fulfilled.match(result)) {
            formData.remember
                ? localStorage.setItem('rememberedEmail', formData.email)
                : localStorage.removeItem('rememberedEmail');

            navigate('/admin');
        }
    };

    const dismissError = () => {
        setErrors(prev => ({...prev, submit: ''}));
        dispatch(clearError());
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail || !validateEmail(forgotEmail)) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        setForgotSubmitted(true);
    };

    return (
        <div className="login-page">
            <div className="login-page__backdrop"/>

            <div className="login-card">
                <div className="login-card__header">
                    <div className="login-card__logo">
                        <img
                            src="/Coat_of_arms_of_Armenia.svg.png"
                            alt="ՀՀ Զինանշան"
                            width={44} height={52}
                        />
                    </div>
                    <div className="login-card__brand">
                        <span className="login-card__title">Գեղանիստի Միջնակարգ Դպրոց</span>
                        <span className="login-card__subtitle">Պետական Ուսումնական հաստատություն</span>
                    </div>
                </div>

                <div className="login-card__divider"/>

                <div className="login-card__body">
                    <h1 className="login-card__heading">Մուտք</h1>
                    <p className="login-card__subheading">Կայքի կառավարման համակարգ</p>

                    {errors.submit && (
                        <div className="login-card__error-banner">
                            <AlertCircle size={18}/>
                            <span>{errors.submit}</span>
                            <button
                                className="login-card__error-dismiss"
                                onClick={dismissError}
                                aria-label="Phakcel"
                            >×
                            </button>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form__group">
                            <div className={`login-form__field
                                ${touched.email && errors.email ? 'login-form__field--error' : ''}
                                ${formData.email ? 'login-form__field--filled' : ''}`}
                            >
                                <Mail size={16} className="login-form__field-icon"/>
                                <input
                                    type="email" id="email" name="email"
                                    className="login-form__input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete="email"
                                />
                                <label htmlFor="email" className="login-form__label">Email</label>
                            </div>
                            {touched.email && errors.email && (
                                <span className="login-form__error">
                                    <AlertCircle size={14}/>{errors.email}
                                </span>
                            )}
                        </div>

                        <div className="login-form__group">
                            <div className={`login-form__field
                                ${touched.password && errors.password ? 'login-form__field--error' : ''}
                                ${formData.password ? 'login-form__field--filled' : ''}`}
                            >
                                <Lock size={16} className="login-form__field-icon"/>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password" name="password"
                                    className="login-form__input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete="current-password"
                                />
                                <label htmlFor="password" className="login-form__label">Գաղտնաբառ</label>
                                <button
                                    type="button"
                                    className="login-form__toggle-password"
                                    onClick={() => setShowPassword(p => !p)}
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <span className="login-form__error">
                                    <AlertCircle size={14}/>{errors.password}
                                </span>
                            )}
                        </div>


                        <div className="login-form__options">
                            <button
                                type="button"
                                className="login-form__forgot"
                                onClick={() => setShowForgotPanel(p => !p)}
                            >
                                Մոռացել եք գաղտնաբառը՞
                            </button>
                        </div>


                        <div
                            className={`login-form__forgot-panel ${showForgotPanel ? 'login-form__forgot-panel--open' : ''}`}>
                            {forgotSubmitted ? (
                                <div className="login-form__forgot-success">
                                    <AlertCircle size={20}/>
                                    <span>Նամակն ուղարկվել է ձեր email-ին</span>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotSubmit}>
                                    <p className="login-form__forgot-title">Վերականգնել</p>
                                    <div className="login-form__forgot-field">
                                        <Mail size={16}/>
                                        <input
                                            type="email"
                                            placeholder="Mutqagreq email-ə"
                                            value={forgotEmail}
                                            onChange={e => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="login-form__forgot-submit">
                                        Ուղարկել վերականգման հղումը
                                    </button>
                                </form>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`login-form__submit ${loading ? 'login-form__submit--loading' : ''}`}
                            disabled={loading}
                        >
                            {loading
                                ? <span className="login-form__spinner"/>
                                : 'Մուտք գործել'
                            }
                        </button>
                    </form>

                    <div className="login-card__divider login-card__divider--text">
                        <span>Կայք</span>
                    </div>

                    <Link to="/" className="login-card__back-link">
                        <ArrowLeft size={16}/>
                        <span>Վերադառնալ կայք</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;