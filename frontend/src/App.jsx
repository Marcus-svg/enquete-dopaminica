import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Criar } from './pages/Criar';
import { Votar } from './pages/Votar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota da Página Inicial */}
        <Route path="/" element={<Home />} />
        
        {/* Rota de Criação */}
        <Route path="/criar" element={<Criar />} />
        
        {/* Rota de Votação (O :id significa que pode ser qualquer numero) */}
        <Route path="/enquete/:id" element={<Votar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
