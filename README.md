# SecuriCam - Sistema de Vigilância

Sistema profissional de gerenciamento de câmeras de vigilância e equipamentos de segurança desenvolvido em React/TypeScript.

## 🔐 Login de Acesso

**Usuário:** `admin`  
**Senha:** `admin`

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Login seguro com validação
- Controle de acesso baseado em usuários
- Sistema de logs completo

### 📹 Gerenciamento de Equipamentos
- Visualização de câmeras com status em tempo real
- Indicadores visuais de status (online/offline)
- Controle de analíticos e alarmes
- Busca e filtros dinâmicos

### 👥 Grupos de Câmeras
- Criação e gerenciamento de grupos
- Organização visual de equipamentos
- Contadores de câmeras por grupo

### ⚙️ Configuração em Lote
- Detecção de movimento com sensibilidade ajustável
- Agendamento por dias da semana e horários
- Cerca analítica e cruzamento de linha
- Sistema de notificações (email, flash, som, central)

### 🎯 Editor de Cerca Analítica
- Editor visual interativo com canvas
- Suporte a 4 canais por câmera
- Criação de polígonos por pontos clicáveis
- Funcionalidades: adicionar, mover e remover pontos

### 👤 Gerenciamento de Usuários
- Cadastro de usuários com CPF
- Edição e exclusão de usuários
- Controle de permissões

### 📊 Sistema de Logs
- Registro detalhado de todas as ações
- Filtros por usuário e tipo de ação
- Exportação para CSV
- Estatísticas de uso

## 🎨 Design System

- **Cores:** Paleta profissional em tons de azul e cinza
- **Status:** Indicadores coloridos para diferentes estados
- **Responsivo:** Interface adaptável a diferentes telas
- **Acessibilidade:** Componentes otimizados para usabilidade

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Roteamento:** React Router DOM
- **Estado:** Context API + localStorage
- **Ícones:** Lucide React
- **Build:** Vite

## 📱 Como Usar

1. **Login:** Acesse com admin/admin
2. **Equipamentos:** Visualize e gerencie câmeras na tela principal
3. **Grupos:** Crie grupos para organizar suas câmeras
4. **Configuração:** Selecione câmeras e configure detecção em lote
5. **Cerca Analítica:** Clique com botão direito em uma câmera para editar
6. **Usuários:** Gerencie usuários do sistema na aba correspondente
7. **Logs:** Monitore todas as ações realizadas no sistema

## 🔧 Instalação e Desenvolvimento

```sh
# Clone o repositório
git clone <YOUR_GIT_URL>

# Navegue para o diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm i

# Inicie o servidor de desenvolvimento
npm run dev
```

## 📦 Deploy

Para publicar o projeto:

1. Acesse [Lovable](https://lovable.dev/projects/02688ee9-4433-4fde-bb61-1b33eb04dd96)
2. Clique em Share → Publish

## 🌐 Domínio Personalizado

Para conectar um domínio personalizado:

1. Vá em Project > Settings > Domains
2. Clique em Connect Domain
3. Siga as instruções de configuração

[Documentação completa sobre domínios](https://docs.lovable.dev/features/custom-domain#custom-domain)
