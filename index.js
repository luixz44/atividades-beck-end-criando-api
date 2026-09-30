import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Configuração para resolver caminho dos arquivos estáticos no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Banco de dados em memória
let ultimo_id = 1;
let livros = [
  {
    idLivro: 1,
    dsTitulo: "As Crônicas de Nárnia",
    dsAutor: "C.S. Lewis",
    fgDisponivel: true,
  },
];

// Rota raiz da API
app.get("/api", (req, res) => {
  res.json({ mensagem: "Seja bem-vindo à gestão de livros!" });
});

// Listar todos os livros
app.get("/livros", (req, res) => {
  console.log("Chamando rota GET /livros");
  res.json(livros);
});

// Obter livro por ID
app.get("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "O parâmetro precisa ser um número válido." });
  }

  const livro = livros.find((l) => l.idLivro === id);

  if (!livro) {
    return res.status(404).json({ mensagem: "Livro não encontrado." });
  }

  res.json(livro);
});

// Cadastrar novo livro
app.post("/livros", (req, res) => {
  const { dsAutor, dsTitulo } = req.body;

  if (!dsAutor || !dsTitulo) {
    return res
      .status(400)
      .json({ mensagem: "Dados faltando! Verifique 'dsAutor' e 'dsTitulo'." });
  }

  ultimo_id++;
  const novo_livro = {
    idLivro: ultimo_id,
    dsTitulo,
    dsAutor,
    fgDisponivel: true,
  };

  livros.push(novo_livro);

  res.status(201).json(novo_livro);
});

// Emprestar livro
app.patch("/livros/:id/emprestar", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "O parâmetro precisa ser um número válido." });
  }

  const livro = livros.find((l) => l.idLivro === id);

  if (!livro) {
    return res.status(404).json({ mensagem: "Livro não encontrado." });
  }

  if (!livro.fgDisponivel) {
    return res
      .status(400)
      .json({ mensagem: "Livro já se encontra emprestado." });
  }

  livro.fgDisponivel = false;

  res.json({
    mensagem: "Livro emprestado com sucesso!",
    livro,
  });
});

// Devolver livro
app.patch("/livros/:id/devolver", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "O parâmetro precisa ser um número válido." });
  }

  const livro = livros.find((l) => l.idLivro === id);

  if (!livro) {
    return res.status(404).json({ mensagem: "Livro não encontrado." });
  }

  if (livro.fgDisponivel) {
    return res
      .status(400)
      .json({ mensagem: "Livro já está disponível na biblioteca." });
  }

  livro.fgDisponivel = true;

  res.json({
    mensagem: "Livro devolvido com sucesso!",
    livro,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});