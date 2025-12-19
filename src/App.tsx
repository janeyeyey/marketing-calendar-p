import { Routes, Route, Navigate } from "react-router-dom";
import ViewOnlyApp from "./app/ViewOnlyApp";
import AdminApp from "./app/AdminApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ViewOnlyApp />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
