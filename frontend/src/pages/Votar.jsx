import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Votar() {
  const { id } = useParams(); // Pega o ID da URL (ex: 42)
  const [enquete, setEnquete] = useState(null);

  // Função para carregar dados
  const carregarEnquete = () => {
    fetch(`${API_URL}/enquetes/${id}`)
      .then(res => res.json())
      .then(data => setEnquete(data));
  };

  useEffect(() => {
    carregarEnquete();
  }, [id]);

  const handleVotar = async (opcaoId) => {
    await fetch(`${API_URL}/opcoes/${opcaoId}/votar`, { method: 'PUT' });
    carregarEnquete(); // Recarrega para ver o novo voto
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado! Mande para seus amigos.");
  };

  if (!enquete) return <p>Carregando...</p>;

  return (
    <div className="container">
      <Link to="/">← Voltar para Início</Link>
      <h1>{enquete.pergunta}</h1>
      
      <button onClick={copiarLink} style={{backgroundColor: '#4CAF50', marginBottom: '20px'}}>
        🔗 Copiar Link para Compartilhar
      </button>

      <div className="poll-container">
        {enquete.opcoes.map(op => (
          <div key={op.id} className="poll-option">
            <span>{op.texto} - <strong>{op.votos} votos</strong></span>
            <button onClick={() => handleVotar(op.id)}>Votar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
