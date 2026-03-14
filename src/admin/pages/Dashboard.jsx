import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
    Users,
    FileText,
    Calendar,
    Folder,
    School,
    UserPlus,
    FilePlus,
    FolderPlus,
} from 'lucide-react';
import api from '../../api/axios.js';

const QUICK_ACTIONS = [
    { id: 1, label: 'Ավելացնել Տեղեկություն Դպրոցի Մասին', to: '/admin/about',     icon: School    },
    { id: 2, label: 'Ավելացնել Աշխատակից',                  to: '/admin/staff',     icon: UserPlus  },
    { id: 3, label: 'Նոր Հրապարակում',                      to: '/admin/posts/new', icon: FilePlus  },
    { id: 4, label: 'Ավելացնել Փաստաթուղթ',                 to: '/admin/documents', icon: FolderPlus},
];

const getArmenianDate = () => {
    const today  = new Date();
    const days   = ['Կիրակի','Երկուշաբթի','Երեքշաբթի','Չորեքշաբթի','Հինգշաբթի','Ուրբաթ','Շաբաթ'];
    const months = ['Հունվար','Փետրվար','Մարտ','Ապրիլ','Մայիս','Հունիս',
        'Հուլիս','Օգոստոս','Սեպտեմբեր','Հոկտեմբեր','Նոյեմբեր','Դեկտեմբեր'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`;
};

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
    <div className="dashboard__stat-card">
        <div className="dashboard__stat-card-icon" style={{ backgroundColor: `${color}15`, color }}>
            <Icon size={22} />
        </div>
        <div className="dashboard__stat-card-content">
            {loading
                ? <span className="dashboard__stat-card-skeleton" />
                : <span className="dashboard__stat-card-value">{value}</span>
            }
            <span className="dashboard__stat-card-label">{label}</span>
        </div>
        <div className="dashboard__stat-card-accent" style={{ backgroundColor: color }} />
    </div>
);

const QuickAction = ({ label, to, icon: Icon }) => (
    <NavLink to={to} className="dashboard__quick-action">
        <div className="dashboard__quick-action-icon">
            <Icon size={20} />
        </div>
        <span className="dashboard__quick-action-label">{label}</span>
    </NavLink>
);

const Dashboard = () => {
    const { admin } = useSelector((state) => state.auth);

    const [stats,   setStats]   = useState({
        about: null, staff: null, news: null,
        events: null, announcements: null, documents: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [aboutRes, staffRes, newsRes, eventsRes, announcRes, docsRes] =
                    await Promise.allSettled([
                        api.get('/attributes'),
                        api.get('/staff',   { params: { limit: 1 } }),
                        api.get('/posts',   { params: { type: 'news',          limit: 1 } }),
                        api.get('/posts',   { params: { type: 'events',        limit: 1 } }),
                        api.get('/posts',   { params: { type: 'announcements', limit: 1 } }),
                        api.get('/reports', { params: { limit: 1 } }),
                    ]);

                const pick = (res) => {
                    if (res.status !== 'fulfilled') return '—';
                    const d = res.value.data;
                    return d?.meta?.total ?? d?.count ?? d?.total ??
                        (Array.isArray(d) ? d.length :
                            (Array.isArray(d?.data) ? d.data.length : '—'));
                };

                setStats({
                    about:         pick(aboutRes),
                    staff:         pick(staffRes),
                    news:          pick(newsRes),
                    events:        pick(eventsRes),
                    announcements: pick(announcRes),
                    documents:     pick(docsRes),
                });
            } catch (_) {}
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    const STATS_DATA = [
        { id: 1, label: 'Դպրոցի Մասին',      value: stats.about,         icon: School,   color: '#8a3f00' },
        { id: 2, label: 'Աշխատակից',          value: stats.staff,         icon: Users,    color: '#3b82f6' },
        { id: 3, label: 'Նորություններ',       value: stats.news,          icon: FileText, color: '#10b981' },
        { id: 4, label: 'Միջոցառումներ',      value: stats.events,        icon: Calendar, color: '#f59e0b' },
        { id: 5, label: 'Հայտարարություններ', value: stats.announcements, icon: FileText, color: '#ef4444' },
        { id: 6, label: 'Փաստաթղթեր',         value: stats.documents,     icon: Folder,   color: '#8b5cf6' },
    ];

    return (
        <div className="dashboard">
            <div className="dashboard__welcome">
                <div className="dashboard__welcome-content">
                    <h1 className="dashboard__welcome-title">
                        Բարի գալուստ, {admin?.fullName || 'Admin'}
                    </h1>
                    <p className="dashboard__welcome-date">{getArmenianDate()}</p>
                </div>
            </div>

            <section className="dashboard__section">
                <h2 className="dashboard__section-title">Վիճակագրություն</h2>
                <div className="dashboard__stats-grid">
                    {STATS_DATA.map((stat) => (
                        <StatCard key={stat.id} {...stat} loading={loading} />
                    ))}
                </div>
            </section>

            <section className="dashboard__section">
                <h2 className="dashboard__section-title">Արագ Գործողություններ</h2>
                <div className="dashboard__quick-grid">
                    {QUICK_ACTIONS.map((action) => (
                        <QuickAction key={action.id} {...action} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;