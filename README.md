# Globotech-Web

Sistema web de **To-Do List** com páginas de **login**, **cadastro** e **gerenciamento de tarefas**.  
O projeto utiliza **HTML5**, **CSS**, **Bootstrap** e **JavaScript** para oferecer uma experiência interativa de organização de tarefas com persistência em **localStorage**.

---

## 🚀 Funcionalidades

### 🔐 Login (`index.html`)
- Formulário de autenticação com:
  - **Usuário ou E-mail**
  - **Senha**
- Botão **Entrar** para acessar o sistema.
- Link direto para a página de **cadastro** caso o usuário não tenha conta.

---

### 📝 Cadastro (`cadastro.html`)
- Formulário de registro com os seguintes campos:
  - **Nome**
  - **Usuário ou E-mail**
  - **Senha**
  - **Imagem de perfil** (upload de arquivo)
- Botão para confirmar e salvar o cadastro.
- Redirecionamento para login após o cadastro.

---

### ✅ Tarefas (`tarefas.html` + `scripts/tarefas.js`)
- **Adicionar nova tarefa**:
  - Descrição da tarefa.
  - Pessoas atribuídas (formato: `Nome|img|email`, separadas por vírgula).
  - Tags associadas (separadas por vírgula).
- **Listagem de tarefas**:
  - Exibe cada tarefa em um card estilizado.
  - Mostra pessoas associadas e tags coloridas.
- **Tags coloridas**:
  - Cores fixas para tags conhecidas:
    - `urgente` → vermelho
    - `estudo` → azul
    - `relatorio` → amarelo
    - `importante` → verde
    - `projeto` → roxo
    - `aviso` → laranja
  - Tags desconhecidas ficam em cinza.
- **Ações em cada tarefa**:
  - **Concluir** → marca/desmarca como concluída.
  - **Editar** → permite alterar título, pessoas e tags.
  - **Remover** → exclui a tarefa.
- **Gerenciamento de pessoas**:
  - Cada pessoa é exibida como “chip” com nome, imagem e e-mail.
  - Tooltip mostra detalhes ao passar o mouse.
- **Persistência de dados**:
  - Todas as tarefas são salvas no **localStorage**.
  - Tarefas permanecem mesmo após recarregar a página.
---
