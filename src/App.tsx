import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CardGeneration from './pages/CardGeneration';
import ApiDocumentation from './pages/ApiDocumentation';
import BankIntegrations from './pages/BankIntegrations';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'generate':
        return <CardGeneration />;
      case 'api-docs':
        return <ApiDocumentation />;
      case 'integrations':
        return <BankIntegrations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          <div className="ml-64 p-8">
            {renderPage()}
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
