import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/6204503.jpg)' }}
      />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
