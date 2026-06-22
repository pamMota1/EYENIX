import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// --- 1. La Landing Page ---
const Home = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
    {/* Fondo decorativo */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 blur-3xl opacity-60 rounded-full pointer-events-none"></div>
    
    <div className="z-10 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Bienvenido a <span className="text-red-600">OptoServer</span>
      </h1>
      <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
        Precisión Quirúrgica para tu Salud Visual. Accede a tu portal médico.
      </p>
      <a href="/login" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-md shadow-red-200 hover:-translate-y-1 inline-block">
        Ir al Portal de Acceso
      </a>
    </div>
  </div>
);

// --- 2. Pantalla de Login (Conectada al Backend) ---
const Login = ({ setRole }) => {
  const navigate = useNavigate();
  // Estados para manejar los inputs y errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setErrorMsg(''); // Limpiamos errores previos

    try {
      // Hacemos la petición a nuestra API
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (data.success) {
        // Si las credenciales son correctas, guardamos el rol que viene de MySQL
        setRole(data.user.rol); 
        navigate('/dashboard');
      } else {
        // Si hay un error (contraseña incorrecta o correo no existe)
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setErrorMsg('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          Acceso al Sistema
        </h2>
        
        {/* Alerta de error si las credenciales fallan */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* Formulario real para el Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="Ej: admin@eyenix.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-200 active:scale-95"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 3. El Enrutador de Dashboards ---
const DashboardRouter = ({ role, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  if (!role) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <div className="font-bold text-xl tracking-tight text-gray-900">
          Opto<span className="text-red-600">Server</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="font-medium text-gray-600">Panel Activo: <span className="text-red-600 capitalize font-bold">{role}</span></span>
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-400 hover:text-red-600 transition-colors">Cerrar Sesión</button>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-8">
        {/* Vistas específicas dependiendo del rol que nos devolvió la Base de Datos */}
        {role === 'admin' && <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios y Alta de Personal ⚙️</h2>}
        {role === 'doctor' && <h2 className="text-3xl font-bold text-gray-800">Expedientes Clínicos y Quirófanos 🩺</h2>}
        {role === 'enfermero' && <h2 className="text-3xl font-bold text-gray-800">Triage y Preparación de Pacientes 📋</h2>}
        {role === 'paciente' && <h2 className="text-3xl font-bold text-gray-800">Mis Resultados de Laboratorio y Citas 👁️</h2>}
      </main>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [role, setRole] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/dashboard" element={<DashboardRouter role={role} setRole={setRole} />} />
      </Routes>
    </BrowserRouter>
  );
}