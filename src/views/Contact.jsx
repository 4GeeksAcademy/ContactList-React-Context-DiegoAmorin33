import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [contactos, setContactos] = useState([]);

  const obtenerContactos = async () => {
    try {
      const resp = await fetch("https://assets.breatheco.de/apis/fake/contact/",);
      if (!resp.ok) throw new Error("Error al obtener contactos");
      const data = await resp.json();
      setContactos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    obtenerContactos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Mis Contactos</h2>
      <Link to="/add" className="btn btn-primary mb-3">
        Agregar nuevo contacto
      </Link>
      {contactos.length === 0 ? (
        <p>No hay contactos disponibles.</p>
      ) : (
        <ul className="list-group">
          {contactos.map((contacto) => (
            <li key={contacto.id} className="list-group-item">
              <h5>{contacto.full_name}</h5>
              <p>Email: {contacto.email}</p>
              <p>Teléfono: {contacto.phone}</p>
              <p>Dirección: {contacto.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contact;
