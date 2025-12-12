import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TutorDetail } from './pages/TutorDetail';
import { TutorForm } from './pages/TutorForm';
import { About } from './pages/About';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import './styles/global.scss';

// Use BASE_URL from Vite config (/ for dev, /max/ for production)
const BASE_PATH = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutor/:id" element={<TutorDetail />} />
        <Route path="/tutor/create" element={<TutorForm />} />
        <Route path="/tutor/:id/edit" element={<TutorForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
