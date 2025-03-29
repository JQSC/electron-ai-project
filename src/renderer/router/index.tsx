import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import Hello from '../views/home';
// import Index from '../views/index';
import Chat from '../views/index-v2';
import UserManagement from '../views/user-management';
import CompilePage from '../views/compile';
import ContractComparison from '../views/contract-comparison';
import ContractRecords from '../views/contract-records';
import Navigation from '../components/Navigation';
import Diff from '../views/test';

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
            <Route
              path="/contract-comparison"
              element={<ContractComparison />}
            />
            <Route path="/contract-records" element={<ContractRecords />} />
            <Route path="/test" element={<Diff />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
