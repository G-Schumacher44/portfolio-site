import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TerminalAnimation from '../hero/TerminalAnimation';
import MicroBanner from './MicroBanner';
import Footer from './Footer';
import MainPage from '../../pages/MainPage';
import TechnicalShowcasePage from '../../pages/TechnicalShowcasePage';
import QuickViewPage from '../../pages/QuickViewPage';

function AppShell() {
  const location = useLocation();
  const isMain = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <>
      {isMain && (
        <>
          {/* Fixed background layers — persist as user scrolls */}
          <TerminalAnimation />
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
            <img
              src="/img/logos/transparent_logo_centered.svg"
              alt=""
              className="h-[600px] w-[600px] object-contain opacity-35"
            />
          </div>
        </>
      )}

      <MicroBanner />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/technical-showcase" element={<TechnicalShowcasePage />} />
        <Route path="/quick-view" element={<QuickViewPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
