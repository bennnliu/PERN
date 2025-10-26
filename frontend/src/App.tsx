import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { BrowsePage } from "./components/BrowsePage";
import { AddPropertyPage } from "./components/AddPropertyPage";
import { EditPropertyPage } from "./components/EditPropertyPage";
import { Dashboard } from "./components/Dashboard";
import { PropertyDetailPage } from "./components/PropertyDetailPage";
import { authApi } from "./services/api";

function HomePage() {
  const user = authApi.getUser();
  
  // Redirect to dashboard if logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = authApi.getUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function ListerRoute({ children }: { children: React.ReactNode }) {
  const user = authApi.getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.user_type !== 'lister') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-property" 
            element={
              <ListerRoute>
                <AddPropertyPage />
              </ListerRoute>
            } 
          />
          
          <Route 
            path="/edit-property/:id" 
            element={
              <ListerRoute>
                <EditPropertyPage />
              </ListerRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
