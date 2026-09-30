import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from './pages/Register';
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SinglePost from "./pages/SinglePost.jsx";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Overview from './pages/admin/Overview';
import AllPosts from './pages/admin/AllPosts';
import CreatePostAdmin from './pages/admin/CreatePost.jsx';
import EditPost from './pages/admin/EditPost';
import AdminUsers from './pages/admin/AllUsers';
import AddUserByAdmin from './pages/admin/AddUser';
import EditAdminUser from "./pages/admin/EditAdminUser.jsx";
function App() {

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/posts/create" element={
        <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      } />
      <Route
        path="/posts/:id"
        element={
          <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>
        }
      />


      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="posts" element={<AllPosts />} />
          <Route path="posts/create" element={<CreatePostAdmin />} />
          <Route path="posts/edit/:id" element={<EditPost />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/create" element={<AddUserByAdmin />} />
          <Route path="users/edit/:id" element={<EditAdminUser />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
