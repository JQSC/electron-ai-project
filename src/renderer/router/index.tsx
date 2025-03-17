import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import Hello from '../views/home';
// import Index from '../views/index';
import Chat from '../views/index-v2';
import UserManagement from '../views/user-management';
import CompilePage from '../views/compile';
import Navigation from '../components/Navigation';

export default function App() {
  return (
    <Router>
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <Navigation />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/compile" element={<CompilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
