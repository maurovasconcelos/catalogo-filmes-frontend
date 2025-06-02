# Catálogo de Filmes - Frontend

## Descrição

Este projeto é um catálogo de filmes desenvolvido com Vue.js que permite aos usuários buscar filmes, visualizar detalhes e gerenciar uma lista de favoritos. O frontend se comunica com uma API Laravel no backend e utiliza a API do TMDB (The Movie Database) para obter informações sobre os filmes.

## Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo para construção de interfaces de usuário
- **Vite**: Ferramenta de build rápida para desenvolvimento moderno
- **Pinia**: Gerenciamento de estado para Vue.js
- **Vue Router**: Roteamento oficial para aplicações Vue.js
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições
- **Docker**: Containerização da aplicação

## Funcionalidades

- **Página Inicial**: Exibe filmes populares
- **Busca de Filmes**: Permite buscar filmes por título com paginação
- **Detalhes do Filme**: Exibe informações detalhadas sobre um filme específico
- **Gerenciamento de Favoritos**:
  - Adicionar filmes aos favoritos
  - Remover filmes dos favoritos
  - Listar filmes favoritos
  - Filtrar favoritos por gênero

## Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Docker e Docker Compose (para execução em container)

## Instalação e Execução

### Usando npm

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd catalogo-filmes-frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e configure as variáveis necessárias
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

### Usando Docker

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd catalogo-filmes-frontend

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e configure as variáveis necessárias
cp .env.example .env

# Iniciar com Docker Compose
docker-compose up -d
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_API_BASE_URL=http://localhost:8000/api # URL da API Laravel
VITE_TMDB_API_KEY=sua_chave_api_tmdb # Chave da API do TMDB
VITE_TMDB_API_URL=https://api.themoviedb.org/3 # URL base da API do TMDB
```

## Estrutura do Projeto

```
├── public/             # Arquivos públicos
├── src/                # Código fonte
│   ├── assets/         # Recursos estáticos (imagens, fontes, etc)
│   ├── components/     # Componentes Vue reutilizáveis
│   ├── router/         # Configuração de rotas
│   ├── stores/         # Stores Pinia para gerenciamento de estado
│   ├── views/          # Componentes de página
│   ├── App.vue         # Componente raiz
│   └── main.js         # Ponto de entrada da aplicação
├── .env.example        # Exemplo de variáveis de ambiente
├── Dockerfile          # Configuração do Docker
├── docker-compose.yml  # Configuração do Docker Compose
└── package.json        # Dependências e scripts
```

## Integração com Backend

Este frontend foi projetado para se comunicar com uma API Laravel. Certifique-se de que o backend esteja configurado e em execução para o funcionamento completo da aplicação.
