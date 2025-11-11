const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors()); 
app.use(express.json()); 


// 1. Endpoint para CRIAR uma nova enquete
app.post('/enquetes', async (req, res) => {
  const { pergunta, opcoes } = req.body; 

  
  const enquete = await prisma.enquete.create({
    data: {
      pergunta,
      opcoes: {
        create: opcoes.map(texto => ({ texto })), 
      },
    },
    include: {
      opcoes: true, 
    },
  });

  res.json(enquete);
});

// 2. Endpoint para OBTER uma enquete específica (para votar ou ver resultados)
app.get('/enquetes/:id', async (req, res) => {
  const { id } = req.params;
  const enquete = await prisma.enquete.findUnique({
    where: { id: Number(id) },
    include: {
      opcoes: {
        orderBy: {
          id: 'asc'
        }
      }
    },
  });

  if (!enquete) {
    return res.status(404).json({ error: 'Enquete não encontrada' });
  }

  res.json(enquete);
});


app.put('/opcoes/:id/votar', async (req, res) => {
  const { id } = req.params;

 
  const opcaoAtualizada = await prisma.opcao.update({
    where: { id: Number(id) },
    data: {
      votos: {
        increment: 1,
      },
    },
  });

  res.json(opcaoAtualizada);
});


// --- INICIANDO O SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
