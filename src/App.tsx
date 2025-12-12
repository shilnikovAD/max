import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TutorDetail } from './pages/TutorDetail';
import { TutorForm } from './pages/TutorForm';
import { About } from './pages/About';
import './styles/global.scss';

function App() {
  return (
    <BrowserRouter basename="/max">
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
