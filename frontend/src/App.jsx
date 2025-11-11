import React, { useState } from 'react';
import './App.css'; // Vamos criar este arquivo para estilização básica


const API_URL = import.meta.env.VITE_API_URL;

function App() {
  // Estados para controlar os dados da aplicação
  const [pergunta, setPergunta] = useState('');
  const [opcoes, setOpcoes] = useState(['', '']); // Começa com 2 opções
  const [enqueteCriada, setEnqueteCriada] = useState(null); // Guarda os dados da enquete depois de criada
  const [enqueteAtiva, setEnqueteAtiva] = useState(null); // Guarda a enquete que está sendo votada/vista

  // Função para adicionar uma nova opção em branco
  const adicionarOpcao = () => {
    setOpcoes([...opcoes, '']);
  };

  // Função para atualizar o texto de uma opção
  const handleOpcaoChange = (index, value) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = value;
    setOpcoes(novasOpcoes);
  };

  // Função para enviar os dados e criar a enquete
  const handleCriarEnquete = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/enquetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta,
          opcoes: opcoes.filter(o => o.trim() !== '') // Envia apenas opções preenchidas
        }),
      });
      const data = await res.json();
      setEnqueteCriada(data);
      setEnqueteAtiva(data);
    } catch (error) {
      console.error('Erro ao criar enquete:', error);
    }
  };

  // Função para registrar um voto
  const handleVotar = async (opcaoId) => {
    try {
      await fetch(`${API_URL}/opcoes/${opcaoId}/votar`, {
        method: 'PUT',
      });
      // Após votar, busca os dados atualizados da enquete para mostrar os resultados
      const res = await fetch(`${API_URL}/enquetes/${enqueteAtiva.id}`);
      const data = await res.json();
      setEnqueteAtiva(data);
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  };
  
  // Se nenhuma enquete foi criada ou selecionada, mostra o formulário de criação
  if (!enqueteAtiva) {
    return (
      <div className="container">
        <h1>Crie sua Enquete</h1>
        <form onSubmit={handleCriarEnquete}>
          <label>Qual é a sua pergunta?</label>
          <input
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Ex: Qual sua cor favorita?"
            required
          />

          <label>Opções de Resposta</label>
          {opcoes.map((opcao, index) => (
            <input
              key={index}
              type="text"
              value={opcao}
              onChange={(e) => handleOpcaoChange(index, e.target.value)}
              placeholder={`Opção ${index + 1}`}
            />
          ))}
          <button type="button" onClick={adicionarOpcao}>
            Adicionar Opção
          </button>
          <button type="submit">Criar Enquete</button>
        </form>
      </div>
    );
  }

  // Se uma enquete está ativa, mostra a tela de votação/resultados
  return (
    <div className="container">
      <h1>{enqueteAtiva.pergunta}</h1>
      <div className="poll-container">
        {enqueteAtiva.opcoes.map((opcao) => (
          <div key={opcao.id} className="poll-option">
            <span>{opcao.texto} ({opcao.votos} votos)</span>
            <button onClick={() => handleVotar(opcao.id)}>Votar</button>
          </div>
        ))}
      </div>
       <button onClick={() => { setEnqueteAtiva(null); setPergunta(''); setOpcoes(['','']); }}>
         Criar Outra Enquete
       </button>
    </div>
  );
}

export default App;
