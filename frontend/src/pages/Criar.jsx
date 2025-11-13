import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Criar() {
  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['', '']);
  const navigate = useNavigate(); // Hook para mudar de página

  const adicionarOpcao = () => setOpcoes([...opcoes, '']);
  
  const handleOpcaoChange = (index, value) => {
    const novas = [...opcoes];
    novas[index] = value;
    setOpcoes(novas);
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/enquetes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta,
        opcoes: opcoes.filter(o => o.trim() !== '')
      }),
    });
    const novaEnquete = await res.json();
    // Redireciona para a página da enquete criada
    navigate(`/enquete/${novaEnquete.id}`);
  };

  return (
    <div className="container">
      <h1>Criar Nova Enquete</h1>
      <form onSubmit={handleCriar}>
        <input 
            value={pergunta} 
            onChange={e => setPergunta(e.target.value)} 
            placeholder="Pergunta" 
            required 
        />
        {opcoes.map((op, i) => (
            <input 
                key={i} 
                value={op} 
                onChange={e => handleOpcaoChange(i, e.target.value)} 
                placeholder={`Opção ${i+1}`} 
            />
        ))}
        <button type="button" onClick={adicionarOpcao}>Mais Opção</button>
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}