// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Maps from './pages/Maps';
import Alerts from './pages/Alerts';
import LivingLabs from './pages/LivingLabs';
import SeriousGames from './pages/SeriousGames';
import Research from './pages/Research';
import Team from './pages/Team';
import Admin from './pages/Admin';
import InternalAccess from './pages/InternalAccess';
import NotFound from './pages/NotFound';

// Make sure both CSS files are imported in the correct order
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/living-labs" element={<LivingLabs />} />
          <Route path="/serious-games" element={<SeriousGames />} />
          <Route path="/research" element={<Research />} />
          <Route path="/team" element={<Team />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/internal-access" element={<InternalAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;