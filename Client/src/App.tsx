import './index.css';
import Navbar from './components/navbar';
import YouTube from './page/youtube';
import Instagram from './page/instagram';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className="w-full md:w-[80%] mx-auto">
      <Navbar />
      <Routes>
        <Route path="/" element={<YouTube />} />
        <Route path="/instagram" element={<Instagram />} />
      </Routes>
    </div>
  );
}

export default App;
