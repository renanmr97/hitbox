import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import GameDetailPage from "./pages/GameDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/admin/AdminPage";
import AdminGamesPage from "./pages/admin/AdminGamesPage";
import AdminGameFormPage from "./pages/admin/AdminGameFormPage";
import AdminGenresPage from "./pages/admin/AdminGenresPage";
import AdminPlatformsPage from "./pages/admin/AdminPlatformsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Rotas do painel admin — só para ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/games"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminGamesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/games/new"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminGameFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/games/:id/edit"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminGameFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/genres"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminGenresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/platforms"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminPlatformsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;