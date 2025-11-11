const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições

// --- ENDPOINTS DA API ---

// 1. Endpoint para CRIAR uma nova enquete
app.post('/enquetes', async (req, res) => {
  const { pergunta, opcoes } = req.body; // Pega a pergunta e as opções do corpo da requisição

  // Usa uma transação para garantir que a enquete e suas opções sejam criadas juntas
  const enquete = await prisma.enquete.create({
    data: {
      pergunta,
      opcoes: {
        create: opcoes.map(texto => ({ texto })), // Cria cada opção
      },
    },
    include: {
      opcoes: true, // Inclui as opções na resposta
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

// 3. Endpoint para REGISTRAR um voto
app.put('/opcoes/:id/votar', async (req, res) => {
  const { id } = req.params;

  // Encontra a opção e incrementa o contador de votos em 1
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