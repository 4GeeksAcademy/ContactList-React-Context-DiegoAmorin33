import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ContactContext = createContext();

export const StoreProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSlug, setUserSlug] = useState("");
  const [error, setError] = useState(null);
  const API_BASE = "https://playground.4geeks.com/contact";

  const fetchContacts = useCallback(async (slug = userSlug) => {
    if (!slug) {
      setError("No user agenda initialized");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/agendas/${slug}/contacts`, {
        headers: { "accept": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to fetch contacts (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      console.log("Contacts API Response:", data);
      
      const contactsList = Array.isArray(data.contacts) ? data.contacts : 
                         Array.isArray(data) ? data : [];
      setContacts(contactsList);
      
    } catch (error) {
      console.error("Fetch contacts error:", error);
      setError(error.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [userSlug]);

  useEffect(() => {
    let isMounted = true;
    const initializeApp = async () => {
      try {
        const slug = localStorage.getItem('userSlug') || 
                     `user_${Math.random().toString(36).substring(2, 9)}`;
        
        localStorage.setItem('userSlug', slug);
        if (isMounted) setUserSlug(slug);

        try {
          await fetch(`${API_BASE}/agendas/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              name: slug,
              description: "My contacts agenda"
            })
          });
        } catch (error) {
          if (!error.toString().includes("400")) {
            console.error("Agenda creation error:", error);
          }
        }

        if (isMounted) await fetchContacts(slug);
        
      } catch (err) {
        if (isMounted) {
          console.error("Initialization error:", err);
          setError("Failed to initialize application. Please refresh the page.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [fetchContacts]);

  const addContact = useCallback(async (contact) => {
    if (!userSlug) {
      throw new Error("No user agenda initialized");
    }

    try {
      setLoading(true);
      setError(null);

      const contactData = {
        name: contact.full_name.trim(),
        email: contact.email.trim(),
        phone: contact.phone?.trim() || "",
        address: contact.address?.trim() || ""
      };

      const response = await fetch(`${API_BASE}/agendas/${userSlug}/contacts`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify(contactData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || "Failed to add contact");
      }

      setContacts(prev => [...prev, responseData]);
      return true;

    } catch (error) {
      console.error("Add contact error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userSlug]);

  const updateContact = useCallback(async (id, updatedContact) => {
    if (!userSlug) {
      setError("No user agenda initialized");
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/agendas/${userSlug}/contacts/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          name: updatedContact.name?.trim() || "",
          email: updatedContact.email?.trim() || "",
          phone: updatedContact.phone?.trim() || "",
          address: updatedContact.address?.trim() || ""
          })

      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Update failed (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      setContacts(prev => prev.map(c => c.id === id ? data : c));
      return true;
      
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userSlug]);

  const deleteContact = useCallback(async (id) => {
    if (!userSlug) {
      setError("No user agenda initialized");
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/agendas/${userSlug}/contacts/${id}`, {
        method: "DELETE",
        headers: { "accept": "application/json" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Delete failed (HTTP ${response.status})`);
      }
      
      setContacts(prev => prev.filter(c => c.id !== id));
      return true;
      
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userSlug]);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        loading,
        error,
        userSlug,
        fetchContacts,
        addContact,
        updateContact,
        deleteContact,
        setError
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);