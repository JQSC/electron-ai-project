import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import Hello from '../views/home';
// import Index from '../views/index';
import Chat from '../views/index-v2';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}
