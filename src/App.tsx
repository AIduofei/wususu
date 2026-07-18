import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Gallery from '@/pages/Gallery';
import Videos from '@/pages/Videos';
import Dynamic from '@/pages/Dynamic';
import Admin from '@/pages/Admin';
import UploadPage from '@/pages/UploadPage';
import Chat from '@/pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/dynamic" element={<Dynamic />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
