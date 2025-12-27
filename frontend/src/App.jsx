import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentDetail from './pages/EquipmentDetail';
import TeamsPage from './pages/TeamsPage';
import RequestsKanban from './pages/RequestsKanban';
import RequestDetail from './pages/RequestDetail';
import Worksheet from './pages/Worksheet';
import CalendarPage from './pages/CalendarPage';
import AnalysisPage from './pages/AnalysisPage';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Public route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f2e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppProvider>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/equipment" element={<EquipmentPage />} />
                      <Route path="/equipment/:id" element={<EquipmentDetail />} />
                      <Route path="/teams" element={<TeamsPage />} />
                      <Route path="/kanban" element={<RequestsKanban />} />
                      <Route path="/requests/:id" element={<RequestDetail />} />
                      <Route path="/requests/:id/worksheet" element={<Worksheet />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/analysis" element={<AnalysisPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppLayout>
                </AppProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
