import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../store/store";

const ContactList = () => {
  const { contacts, loading, error, fetchContacts, deleteContact, updateContact } = useContacts();
  const navigate = useNavigate();
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [editError, setEditError] = useState(null);

  const loadContacts = useCallback(() => { fetchContacts(); }, [fetchContacts]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleEditClick = useCallback((contact) => {
    setEditingId(contact.id);
    setEditForm({ name: contact.name || '', email: contact.email || '', phone: contact.phone || '', address: contact.address || '' });
    setEditError(null);
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setEditError("Name and email are required");
      return;
    }

    try {
      const success = await updateContact(editingId, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim()
      });
      
      if (success) setEditingId(null);
    } catch (error) {
      setEditError(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleConfirmDelete = (id) => {
    setContactToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      await deleteContact(contactToDelete);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const hasContacts = contacts.length > 0;
  const isLoading = loading && !hasContacts;

  if (isLoading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contacts</h2>
        <button onClick={() => navigate("/add")} className="btn btn-success">Add new contact</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!hasContacts ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No contacts registered</h4>
          <button onClick={() => navigate("/add")} className="btn btn-primary btn-lg mt-3">Create First Contact</button>
        </div>
      ) : (
        <div className="list-group">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              {editingId === contact.id ? (
                <EditForm form={editForm} error={editError} onChange={handleEditChange} onSubmit={handleUpdate} onCancel={handleCancelEdit} />
              ) : (
                <ContactItem contact={contact} onEdit={handleEditClick} onDelete={handleConfirmDelete} />
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal show={showModal} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
};

const EditForm = ({ form, error, onChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="p-3">
    {error && <div className="alert alert-danger mb-3">{error}</div>}
    
    {['name', 'email', 'phone', 'address'].map((field) => (
      <div key={field} className="mb-3">
        <label className="form-label">
          {field.charAt(0).toUpperCase() + field.slice(1)}
          {['name', 'email'].includes(field) && ' *'}
        </label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          value={form[field]}
          onChange={onChange}
          className="form-control"
          required={['name', 'email'].includes(field)} />
      </div>
    ))}

    <div className="d-flex gap-2">
      <button type="submit" className="btn btn-success">Save Changes</button>
      <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
    </div>
  </form>
);

const ContactItem = ({ contact, onEdit, onDelete }) => (
  <div className="contact-content">
    <div className="contact-info">
      <img src="https://i.pinimg.com/1200x/65/1c/6d/651c6da502353948bdc929f02da2b8e0.jpg" alt="" className="contact-avatar" />
      <div className="contact-details">
        <h5>{contact.name}</h5>
        <ContactDetail icon="location-dot" text={contact.address} />
        <ContactDetail icon="phone" text={contact.phone} />
        <ContactDetail icon="envelope" text={contact.email} />
      </div>
    </div>
    <div className="contact-actions">
      <ActionButton icon="pen" onClick={() => onEdit(contact)} title="Edit contact" />
      <ActionButton icon="trash" onClick={() => onDelete(contact.id)} title="Delete contact" />
    </div>
  </div>
);

const ContactDetail = ({ icon, text }) => (
  text && <p className="mb-1"><i className={`fa-solid fa-${icon} text-secondary me-2`}></i>{text}</p>
);

const ActionButton = ({ icon, onClick, title }) => (
  <button onClick={onClick} className="btn btn-link text-dark" title={title}>
    <i className={`fa-solid fa-${icon}`}></i>
  </button>
);

const ConfirmationModal = ({ show, onConfirm, onCancel }) => (
  show && (
    <div className="modal d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm deletion</h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this contact?</p>
          </div>
          <div className="modal-footer">
            <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
            <button onClick={onConfirm} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
);

export default ContactList;