import { Routes, Route } from "react-router-dom";
import ContactList from "./views/ContactList";
import AddContact from "./views/AddContact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ContactList />} />
      <Route path="/add" element={<AddContact />} />
    </Routes>
  );
}

export default App;