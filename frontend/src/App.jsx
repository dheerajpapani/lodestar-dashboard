import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Maps from './pages/Maps';
import Forecasts from './pages/Forecasts';
import Alerts from './pages/Alerts';
import Community from './pages/Community';
import Games from './pages/Games';
import Research from './pages/Research';
import NotFound from './pages/NotFound';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/forecasts" element={<Forecasts />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/community" element={<Community />} />
        <Route path="/games" element={<Games />} />
        <Route path="/research" element={<Research />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ThemeToggle />
    </Router>
  );
}

export default App;
