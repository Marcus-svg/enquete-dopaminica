import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Home() {
  const [enquetes, setEnquetes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/enquetes`)
      .then(res => res.json())
      .then(data => setEnquetes(data));
  }, []);

  return (
    <div className="container">
      <h1>Enquetes Recentes</h1>
      <Link to="/criar">
        <button>+ Criar Nova Enquete</button>
      </Link>
      
      <div className="lista-enquetes">
        {enquetes.map(enquete => (
          <div key={enquete.id} className="card-enquete" style={{border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '8px'}}>
            <h3>{enquete.pergunta}</h3>
            <Link to={`/enquete/${enquete.id}`}>
              <button>Ver e Votar</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}