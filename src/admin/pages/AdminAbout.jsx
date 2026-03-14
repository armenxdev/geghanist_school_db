import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    deleteAttribute,
    fetchAttributes,
    addAttribute,
    updateAttribute,
} from '../../store/reducers/attributeSlice.js';

import Modal from '../../components/Modal.jsx';
import ConfirmDelete from '../../components/ui/ConfirmDelete.jsx';
import FormInput from '../../components/ui/FormInput.jsx';
import Loader from '../../components/ui/Loader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

const initialFormValues = {attributeName: '', attributeValue: ''};

const AdminAbout = () => {
    const dispatch = useDispatch();
    const {data, loading, actionLoading} = useSelector((s) => s.school);

    const [formModal, setFormModal] = useState({isOpen: false, mode: 'add', item: null});
    const [deleteModal, setDeleteModal] = useState({isOpen: false, id: null, name: ''});
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(fetchAttributes());
    }, [dispatch]);

    const isMobile = useMemo(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 768px)').matches;
    }, []);


    const openAddForm = () => {
        setFormValues(initialFormValues);
        setFormErrors({});
        setFormModal({isOpen: true, mode: 'add', item: null});
    };

    const openEditForm = (item) => {
        setFormValues({
            attributeName: item.attributeName || '',
            attributeValue: item.attributeValue || '',
        });
        setFormErrors({});
        setFormModal({isOpen: true, mode: 'edit', item});
    };

    const closeForm = () => {
        setFormModal({isOpen: false, mode: 'add', item: null});
        setFormValues(initialFormValues);
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formValues.attributeName.trim()) errors.attributeName = 'Required';
        if (!formValues.attributeValue.trim()) errors.attributeValue = 'Required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({...prev, [name]: value}));
        if (formErrors[name]) {
            setFormErrors((prev) => ({...prev, [name]: ''}));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            attributeName: formValues.attributeName.trim(),
            attributeValue: formValues.attributeValue.trim(),
        };

        if (formModal.mode === 'edit') {
            dispatch(updateAttribute({id: formModal.item.id, ...payload}));
        } else {
            dispatch(addAttribute(payload));
        }

        closeForm();
    };


    const openDeleteModal = (item) => {
        setDeleteModal({isOpen: true, id: item.id, name: item.attributeName});
    };

    const closeDeleteModal = () => {
        setDeleteModal({isOpen: false, id: null, name: ''});
    };

    const handleDeleteConfirm = () => {
        const id = deleteModal.id;
        closeDeleteModal();
        dispatch(deleteAttribute(id));
    };


    return (
        <div className="admin-page">
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop/>

            <div className="admin-header">
                <div>
                    <h1>About School</h1>
                    <p>Manage school attributes</p>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={openAddForm}
                    disabled={loading || actionLoading}
                >
                    + Add Attribute
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <Loader message="Loading attributes..."/>
            ) : data.length === 0 ? (
                <EmptyState message="No attributes yet"/>
            ) : (
                <>
                    {/* Desktop Table */}
                    {!isMobile && (
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td>{item.attributeName}</td>
                                        <td>{item.attributeValue}</td>
                                        <td>
                                            <div className="action-group">
                                                <button
                                                    className="btn btn--sm btn--secondary"
                                                    onClick={() => openEditForm(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn--sm btn--danger"
                                                    onClick={() => openDeleteModal(item)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Mobile Cards */}
                    {isMobile && (
                        <div className="card-grid">
                            {data.map((item) => (
                                <div className="card" key={item.id}>
                                    <div className="card__body">
                                        <h3 className="card__title">{item.attributeName}</h3>
                                        <p className="card__text">{item.attributeValue}</p>
                                    </div>
                                    <div className="card__actions">
                                        <button
                                            className="btn btn--sm btn--secondary"
                                            onClick={() => openEditForm(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn--sm btn--danger"
                                            onClick={() => openDeleteModal(item)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Form Modal */}
            <Modal isOpen={formModal.isOpen} onClose={closeForm} size="sm">
                <div className="modal__header">
                    <h2 className="modal__title">
                        {formModal.mode === 'edit' ? 'Edit Attribute' : 'Add Attribute'}
                    </h2>
                    <button
                        className="modal__close"
                        onClick={closeForm}
                        disabled={actionLoading}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="modal__body">
                        <FormInput
                            label="Attribute Name"
                            name="attributeName"
                            value={formValues.attributeName}
                            onChange={handleFormChange}
                            error={formErrors.attributeName}
                            placeholder="e.g. Address"
                            required
                        />
                        <FormInput
                            label="Attribute Value"
                            name="attributeValue"
                            value={formValues.attributeValue}
                            onChange={handleFormChange}
                            error={formErrors.attributeValue}
                            placeholder="e.g. Yerevan"
                            required
                        />
                    </div>

                    <div className="modal__actions">
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={closeForm}
                            disabled={actionLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDelete
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                itemName={deleteModal.name}
                isLoading={actionLoading}
            />
        </div>
    );
};

export default AdminAbout;
