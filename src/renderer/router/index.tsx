import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import Hello from '../views/home';
import Index from '../views/index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </Router>
  );
}
