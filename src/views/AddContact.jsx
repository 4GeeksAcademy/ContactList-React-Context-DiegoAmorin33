import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddContact = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    full_name: "",
    email: "",
    agenda_slug: "dieguin_agenda",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://assets.breatheco.de/apis/fake/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) throw new Error("Error al guardar el contacto");

      console.log("Contacto guardado correctamente");
      navigate("/"); // volver al home
    } catch (error) {
      console.error("Error al guardar el contacto:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Contacto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          onChange={handleChange}
          className="form-control my-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          onChange={handleChange}
          className="form-control my-2"
        />
        <button type="submit" className="btn btn-primary">
          Guardar Contacto
        </button>
      </form>
    </div>
  );
};

export default AddContact;
