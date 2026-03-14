import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    fetchStaff,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    resetStaff,
} from '../../store/reducers/staffSlice.js';
import Modal       from '../../components/Modal.jsx';
import FormInput   from '../../components/ui/FormInput.jsx';
import DeleteConfirm from "../../components/DeleteConfirm.jsx";
const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();

const initialFormValues = { fullName: '', role: '' };

const validateStaff = (values) => {
    const errors = {};
    const words = values.fullName.trim().split(/\s+/);
    if (!values.fullName.trim()) {
        errors.fullName = 'Անուն Ազգանունը պարտադիր է';
    } else if (words.length < 2 || words.some(w => w.length < 2)) {
        errors.fullName = 'Ամեն Բառ պետք է լինի առնավազն 2տառ';
    }
    if (!values.role.trim()) {
        errors.role = 'Պաշտոնը պարտադիր է';
    }
    return errors;
};

// ── AdminStaff ─────────────────────────────────────────────
const AdminStaff = () => {
    const dispatch = useDispatch();
    const { staffList, loading, error, page, limit, hasMore, total } =
        useSelector(state => state.staff);

    const bottomRef = useRef(null);
    const [search,      setSearch]      = useState('');
    const [formModal,   setFormModal]   = useState({ isOpen: false, mode: 'add', item: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
    const [formValues,  setFormValues]  = useState(initialFormValues);
    const [formErrors,  setFormErrors]  = useState({});

    // ── Fetch ──────────────────────────────────────────────
    useEffect(() => {
        dispatch(resetStaff());
        dispatch(fetchStaff({ page: 1, limit }));
    }, [dispatch]);

    // ── Search filter ──────────────────────────────────────
    const filtered = staffList.filter(s =>
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase())
    );

    // ── Form Modal ─────────────────────────────────────────
    const openAdd = () => {
        setFormValues(initialFormValues);
        setFormErrors({});
        setFormModal({ isOpen: true, mode: 'add', item: null });
    };

    const openEdit = (item) => {
        setFormValues({ fullName: item.fullName || '', role: item.role || '' });
        setFormErrors({});
        setFormModal({ isOpen: true, mode: 'edit', item });
    };

    const closeForm = () => {
        setFormModal({ isOpen: false, mode: 'add', item: null });
        setFormValues(initialFormValues);
        setFormErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const errs = validateStaff(formValues);
        if (Object.keys(errs).length) { setFormErrors(errs); return; }

        const payload = {
            fullName: formValues.fullName.trim(),
            role:     formValues.role.trim(),
        };

        if (formModal.mode === 'edit') {
            dispatch(updateEmployee({ id: formModal.item.id, ...payload }));
        } else {
            dispatch(createEmployee(payload));
        }
        closeForm();
    };

    // ── Delete Modal ───────────────────────────────────────
    const openDelete  = (item) => setDeleteModal({ isOpen: true, id: item.id, name: item.fullName });
    const closeDelete = () => setDeleteModal({ isOpen: false, id: null, name: '' });

    const handleDeleteConfirm = () => {
        const id = deleteModal.id;
        closeDelete();
        dispatch(deleteEmployee(id));
    };


    const handleLoadMore = () => {
        if (!hasMore || loading) return;
        dispatch(fetchStaff({ page, limit }));
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="staff-page">
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />

            <div className="staff-page__toolbar">
                <div className="search-box">
                    <svg className="search-box__icon" width="16" height="16" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        className="search-box__input"
                        placeholder="Փնտրել աշխատակից..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn--primary" onClick={openAdd} disabled={loading}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Ավելացնել
                </button>
            </div>

            <p className="staff-page__count">
                Ընդհամենը՝ <strong>{total}</strong> Աշխատակից
            </p>


            {loading && staffList.length === 0 ? (
                <div className="empty-state">
                    <div className="spinner" />
                    <p>Бернвум е...</p>
                </div>

            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    <p>Աշխատակից չի գտնվել</p>
                </div>

            ) : (
                <>
                    <div className="staff-table-wrap">
                        <table className="staff-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Անուն Ազգանուն</th>
                                <th>Պաշտոն / Առարկա</th>
                                <th>Գործողություններ</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="staff-table__num">{index + 1}</td>
                                    <td>
                                        <div className="staff-cell">
                                            <div className="staff-cell__avatar">
                                                {getInitials(item.fullName)}
                                            </div>
                                            <span className="staff-cell__name">{item.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="staff-table__role">{item.role}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button
                                                className="action-btn action-btn--edit"
                                                onClick={() => openEdit(item)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                                                </svg>
                                                Խմբագրել
                                            </button>
                                            <button
                                                className="action-btn action-btn--delete"
                                                onClick={() => openDelete(item)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14H6L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4h6v2"/>
                                                </svg>
                                                Ջնջել
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="staff-cards">
                        {filtered.map((item) => (
                            <div className="staff-card" key={item.id}>
                                <div className="staff-card__header">
                                    <div className="staff-cell">
                                        <div className="staff-cell__avatar">{getInitials(item.fullName)}</div>
                                        <div>
                                            <div className="staff-cell__name">{item.fullName}</div>
                                            <div className="staff-card__role">{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="staff-card__actions">
                                    <button className="action-btn action-btn--edit" onClick={() => openEdit(item)}>
                                        Խմբագրել
                                    </button>
                                    <button className="action-btn action-btn--delete" onClick={() => openDelete(item)}>
                                        Ջնջել
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="staff-page__load-more">
                            <button className="btn btn--ghost" onClick={handleLoadMore} disabled={loading}>
                                {loading ? 'Բեռնվում է...' : 'Ավելին'}
                            </button>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </>
            )}

            <Modal isOpen={formModal.isOpen} onClose={closeForm} size="sm">
                <div className="modal__header">
                    <h2 className="modal__title">
                        {formModal.mode === 'edit' ? 'Խմբագրել' : 'Ավելացնել Աշխատակից'}
                    </h2>
                    <button className="modal__close" onClick={closeForm} aria-label="Пakел">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="modal__body">
                        <FormInput
                            label="Անուն Ազգանուն"
                            name="fullName"
                            value={formValues.fullName}
                            onChange={handleFormChange}
                            error={formErrors.fullName}
                            placeholder="Оr.՝ Արմեն Պետրոսյան"
                            required
                        />
                        <FormInput
                            label="Պաշտոն / Առարկա"
                            name="role"
                            value={formValues.role}
                            onChange={handleFormChange}
                            error={formErrors.role}
                            placeholder="Оr.՝ Տնորեն"
                            required
                        />
                    </div>

                    <div className="modal__actions">
                        <button type="button" className="btn btn--ghost" onClick={closeForm} disabled={loading}>
                            Չեղարկել
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Բեռնվում է...' : 'Պահպանել'}
                        </button>
                    </div>
                </form>
            </Modal>


            <DeleteConfirm
                isOpen={deleteModal.isOpen}
                onClose={closeDelete}
                onConfirm={handleDeleteConfirm}
                name={deleteModal.name}
            />
        </div>
    );
};

export default AdminStaff;