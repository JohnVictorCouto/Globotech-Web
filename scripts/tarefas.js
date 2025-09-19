// scripts/tarefas.js
document.addEventListener("DOMContentLoaded", () => {

  // Mapa de cores fixas para tags conhecidas
  const tagColorMap = {
    urgente: "#c62828",
    estudo: "#1565c0",
    relatorio: "#f9a825",
    importante: "#2e7d32",
    projeto: "#6a1b9a",
    aviso: "#ef6c00"
  };

  // Função para obter cor de uma tag
  function getTagColor(tag) {
    const chave = tag.trim().toLowerCase();
    return tagColorMap[chave] || "#757575"; // cinza para tags desconhecidas
  }

  // Salvar todas as tarefas do DOM no localStorage
  function salvarTarefas() {
    const tarefas = [];
    document.querySelectorAll("li").forEach(li => {
      const containerId = li.closest("ul").id; // salvar também a lista da tarefa
      const titulo = li.querySelector(".task-title").textContent;
      const pessoas = Array.from(li.querySelectorAll(".pessoa")).map(p => ({
        nome: p.dataset.nome,
        img: p.dataset.img,
        email: p.dataset.email
      }));
      const tags = Array.from(li.querySelectorAll(".tag")).map(t => t.textContent);
      const completed = li.classList.contains("completed");
      tarefas.push({ titulo, pessoas, tags, completed, containerId });
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

  // Criar um <li> de tarefa e adicioná-la ao container correto
  function criarTarefa({ titulo, pessoas = [], tags = [], completed = false, container }) {
    if (!container) return; // garante que temos onde colocar a tarefa

    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    const pessoasHTML = pessoas.map(p => `
      <span class="pessoa" data-nome="${p.nome}" data-email="${p.email}" data-img="${p.img}">
        ${p.nome.split(' ')[0]}
        <div class="tooltip-person">
          <div class="info">
            <img src="${p.img}" alt="${p.nome}">
            <div><strong>${p.nome}</strong><span>${p.email}</span></div>
          </div>
        </div>
      </span>
    `).join('');

    const tagsHTML = tags.map(tag => {
      const color = getTagColor(tag);
      return `<span class="tag" style="background-color: ${color}; color: #fff;">${tag}</span>`;
    }).join('');

    li.innerHTML = `
      <div class="task-info">
        <div class="task-title">${titulo}</div>
        <div class="pessoas">${pessoasHTML}</div>
        <div class="tags-container">Tags: <span class="tags-list">${tagsHTML}</span></div>
      </div>
      <div class="actions">
        <button class="concluir">Concluir</button>
        <button class="editar">Editar Tarefa</button>
        <button class="remover">Remover</button>
      </div>
    `;
    container.appendChild(li);
  }

  // Carregar tarefas do localStorage e distribuir nas listas corretas
  function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.forEach(t => {
      const container = document.getElementById(t.containerId);
      if (container) {
        criarTarefa({ ...t, container });
      }
    });
  }

  carregarTarefas();

  // Adicionar nova tarefa ao enviar o formulário
  document.body.addEventListener("submit", (e) => {
    if (e.target.matches(".card-body form")) {
      e.preventDefault();
      const form = e.target;
      const descricao = form.querySelector("input[placeholder='Descrição da tarefa']").value.trim();
      const pessoasInput = form.querySelector("input[placeholder='Pessoas']").value.trim();
      const tagsInput = form.querySelector("input[placeholder='Tags']").value.trim();

      if (!descricao) return;

      const pessoas = pessoasInput ? pessoasInput.split(',').map(p => {
        const [nome, img, email] = p.split('|');
        return { nome, img, email };
      }) : [];

      const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

      // Pega o <ul> relativo ao formulário do card
      const tarefasContainer = form.closest(".card-body").querySelector("ul");

      criarTarefa({ titulo: descricao, pessoas, tags, container: tarefasContainer });

      form.reset();
      salvarTarefas();
    }
  });

  // Delegação de eventos: concluir, remover, editar
  document.body.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    // Concluir tarefa
    if (e.target.classList.contains("concluir")) {
      li.classList.toggle("completed");
      salvarTarefas();
      return;
    }

    // Remover tarefa
    if (e.target.classList.contains("remover")) {
      li.remove();
      salvarTarefas();
      return;
    }

    // Editar tarefa
    if (e.target.classList.contains("editar")) {
      const tituloEl = li.querySelector(".task-title");
      const pessoasEl = li.querySelector(".pessoas");
      const tagsListEl = li.querySelector(".tags-list");

      const novoTitulo = prompt("Editar tarefa:", tituloEl.textContent);
      if (!novoTitulo) return;

      const novasPessoas = prompt(
        "Editar pessoas (formato: Nome|img|email, separado por vírgula):",
        Array.from(pessoasEl.querySelectorAll(".pessoa"))
          .map(p => `${p.dataset.nome}|${p.dataset.img}|${p.dataset.email}`)
          .join(',')
      );
      if (!novasPessoas) return;

      const novasTags = prompt(
        "Editar tags (separadas por vírgula):",
        Array.from(tagsListEl.querySelectorAll(".tag")).map(t => t.textContent).join(',')
      );

      // Atualiza título
      tituloEl.textContent = novoTitulo;

      // Atualiza pessoas
      pessoasEl.innerHTML = novasPessoas.split(',').map(p => {
        const [nome, img, email] = p.split('|');
        return `
          <span class="pessoa" data-nome="${nome}" data-email="${email}" data-img="${img}">
            ${nome.split(' ')[0]}
            <div class="tooltip-person">
              <div class="info">
                <img src="${img}" alt="${nome}">
                <div><strong>${nome}</strong><span>${email}</span></div>
              </div>
            </div>
          </span>
        `;
      }).join('');

      // Atualiza tags
      tagsListEl.innerHTML = novasTags
        ? novasTags.split(',').map(t => {
            const color = getTagColor(t);
            return `<span class="tag" style="background-color: ${color}; color: #fff;">${t.trim()}</span>`;
          }).join('')
        : '';

      salvarTarefas();
    }
  });

});
