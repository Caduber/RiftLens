# RIFT LENS — LoL Performance Analyzer

Aplicativo de análise de desempenho avançado para League of Legends, focado em trazer inteligência de dados a partir do histórico de partidas de um jogador.

## Estrutura do Projeto

* `backend/`: Servidor Node.js (Express) para proxy e cache das chamadas à API da Riot Games.
* `frontend/`: Aplicação React (Vite, TypeScript, Tailwind CSS, Recharts) com visual dark premium.

## Como iniciar o projeto

### Requisitos

* Node.js v18+
* Chave de API da Riot Games. Obtenha uma em [Riot Developer Portal](https://developer.riotgames.com/).

### Backend

1. Entre no diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Edite o `.env` e coloque sua `RIOT_API_KEY`.
5. Inicie o servidor:
   ```bash
   npm start
   ```
   (rodará em `http://localhost:3001`)

### Frontend

1. Entre no diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o Vite dev server:
   ```bash
   npm run dev
   ```
   (rodará em `http://localhost:5173`)

## Features

- **Visão Geral**: WinRate, KDA, Dano, Radar de habilidades.
- **Histórico**: Resumo de partidas com detalhes extensos expansíveis.
- **Atributos (Correlações)**: Descubra quais métricas mais impactam seu WinRate.
- **Fases do Jogo**: Desempenho no Early, Mid e Late game.
- **Campeões**: Estatísticas e correlações agrupadas por campeão.

## Design

O app foi projetado com tema escuro elegante usando uma paleta `zinc` com destaques em `amber` (dourado) e `blue`. Gráficos dinâmicos com `recharts` dão clareza visual às métricas.
