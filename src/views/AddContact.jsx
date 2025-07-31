import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../store/store";

const AddContact = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "" });
  const [errorMessages, setErrorMessages] = useState([]);
  const { addContact, loading } = useContacts();
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    try {
      const success = await addContact(form);
      if (success) navigate("/");
    } catch (error) {
      const messages = error.message.split('\n');
      setErrorMessages(messages.filter(msg => msg.trim()));
    }
  };

  const handleBackToContacts = () => { navigate("/"); };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Add a new contact</h1>
      
      {errorMessages.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">
            {errorMessages.map((msg, index) => <li key={index}>{msg}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="full_name" className="form-label">Full Name</label>
          <input type="text" className={`form-control ${errorMessages.some(m => m.toLowerCase().includes('name')) ? 'is-invalid' : ''}`} id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Enter your Full Name" required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className={`form-control ${errorMessages.some(m => m.toLowerCase().includes('email')) ? 'is-invalid' : ''}`} id="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" required />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="text" className={`form-control ${errorMessages.some(m => m.toLowerCase().includes('phone')) ? 'is-invalid' : ''}`} id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone" />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className={`form-control ${errorMessages.some(m => m.toLowerCase().includes('address')) ? 'is-invalid' : ''}`} id="address" name="address" value={form.address} onChange={handleChange} placeholder="Enter Address" />
        </div>

        <button type="submit" className="btn Save-Btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</> : 'Save'}
        </button>
        
        <div className="mt-3">
          <span onClick={handleBackToContacts} className="back-to-contacts-span">or get back to contacts</span>
        </div>
      </form>
    </div>
  );
};

export default AddContact;