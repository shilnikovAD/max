import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TutorDetail } from './pages/TutorDetail';
import { TutorForm } from './pages/TutorForm';
import { About } from './pages/About';
import './styles/global.scss';

const BASE_PATH = import.meta.env.BASE_URL || '/max/';

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutor/:id" element={<TutorDetail />} />
        <Route path="/tutor/create" element={<TutorForm />} />
        <Route path="/tutor/:id/edit" element={<TutorForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
