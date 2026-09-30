import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from './pages/Register';
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
function App() {

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/posts/create" element={
        <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
