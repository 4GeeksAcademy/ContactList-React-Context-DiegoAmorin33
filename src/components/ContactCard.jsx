import React from "react";

const ContactCard = ({ contact }) => {
  return (
    <div>
      <h3>{contact.full_name}</h3>
      <p>Email: {contact.email}</p>
      <p>Teléfono: {contact.phone}</p>
      <p>Dirección: {contact.address}</p>
    </div>
  );
};

export default ContactCard;
