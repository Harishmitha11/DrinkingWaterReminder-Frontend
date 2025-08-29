import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './styles.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ✅ Make sure you call .render()
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// import React, { useState, useEffect } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile';
// import './styles.css';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   // Optional: update token if localStorage changes in another tab
//   useEffect(() => {
//     const handleStorage = () => setToken(localStorage.getItem('token'));
//     window.addEventListener('storage', handleStorage);
//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
//         />
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/signup" element={<Signup setToken={setToken} />} />
//         <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
//         <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// createRoot(document.getElementById('root')).render(<App />);
// render(<App />);


// import React, { useState, useEffect } from 'react';  // <-- import useState, useEffect
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Profile from './pages/Profile';
// import './styles.css';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   // Update token if localStorage changes (optional)
//   useEffect(() => {
//     const handleStorage = () => setToken(localStorage.getItem('token'));
//     window.addEventListener('storage', handleStorage);
//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
//         />
//         <Route path="/login" element={<Login setToken={setToken} />} />
//         <Route path="/signup" element={<Signup setToken={setToken} />} />
//         <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
//         <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// // Use createRoot instead of old render
// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<App />);




