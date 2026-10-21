import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';

export default function App() {
  const [containerHost, setContainerHost] = useState('');

  return (
    <div className="app-container">
      <Navbar containerHost={containerHost} />
      <Home onHostUpdate={setContainerHost} />
    </div>
  );
}
