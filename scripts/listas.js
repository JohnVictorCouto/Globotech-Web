document.addEventListener("DOMContentLoaded", () => {
  const formNovaLista = document.querySelector("form.mb-4.row.g-2");
  const container = document.querySelector(".container");
  const usuarioAtual = localStorage.getItem("usuarioAtual");

  function corEscuraOuClara(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminancia > 0.5 ? "black" : "white";
  }

  const salvarLocalStorage = (listas) => {
    localStorage.setItem("todolist_" + usuarioAtual, JSON.stringify(listas));
  };

  const carregarLocalStorage = () => {
    const data = localStorage.getItem("todolist_" + usuarioAtual);
    return data ? JSON.parse(data) : [];
  };

  const renderizarListas = () => {
    container.querySelectorAll(".card").forEach((card) => card.remove());
    const listas = carregarLocalStorage();

    listas.forEach((lista) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const header = document.createElement("div");
      header.classList.add("card-header");
      header.style.backgroundColor = lista.cor;
      header.style.color = lista.corTexto;
      header.innerHTML = `
        ${lista.nome}
        <div>
          <button class="btn btn-warning btn-sm editar-lista">Editar Lista</button>
          <button class="btn btn-danger btn-sm remover-lista">Apagar Lista</button>
        </div>
      `;
      card.appendChild(header);

      const body = document.createElement("div");
      body.classList.add("card-body");
      body.innerHTML = `
        <form class="row g-2 mb-3">
          <div class="col-md-4"><input type="text" class="form-control" placeholder="Descrição da tarefa"></div>
          <div class="col-md-3"><input type="text" class="form-control" placeholder="Pessoas"></div>
          <div class="col-md-3"><input type="text" class="form-control" placeholder="Tags"></div>
          <div class="col-md-2"><button type="submit" class="btn btn-success w-100">Adicionar</button></div>
        </form>
        <ul></ul>
      `;
      card.appendChild(body);

      // Renderizar tarefas
      const ul = body.querySelector("ul");
      lista.tarefas.forEach((t) => {
        const li = document.createElement("li");
        if (t.completed) li.classList.add("completed");
        li.dataset.timestamp = t.timestamp;
        li.innerHTML = `
          <div class="task-info">
            <div class="task-title">${t.descricao}</div>
            <div class="pessoas">${t.pessoas}</div>
            <div>Tags: ${
              t.tags
                ? t.tags
                    .split(",")
                    .map((tag) => `<span class="tag">${tag.trim()}</span>`)
                    .join("")
                : ""
            }</div>
          </div>
          <div class="actions">
            <button class="concluir">Concluir</button>
            <button class="editar">Editar</button>
            <button class="remover">Remover</button>
          </div>
        `;
        ul.appendChild(li);
      });

      container.appendChild(card);
    });

    // Inicializa a pesquisa depois que os cards são renderizados
    if (typeof window.inicializarPesquisa === "function") {
      window.inicializarPesquisa();
    }
  };

  if (formNovaLista) {
    formNovaLista.addEventListener("submit", (e) => {
      e.preventDefault();
      const nomeInput = formNovaLista.querySelector("input[type=text]");
      const corInput = formNovaLista.querySelector("input[type=color]");
      const nome = nomeInput.value.trim();
      const cor = corInput.value;
      if (!nome) return;

      const listas = carregarLocalStorage();
      listas.push({ nome, cor, corTexto: corEscuraOuClara(cor), tarefas: [] });
      salvarLocalStorage(listas);
      renderizarListas();

      formNovaLista.reset();
      corInput.value = "#990085";
    });
  }

  container.addEventListener("click", (e) => {
    const listas = carregarLocalStorage();
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(container.querySelectorAll(".card")).indexOf(card);

    if (e.target.classList.contains("remover-lista")) {
      listas.splice(index, 1);
      salvarLocalStorage(listas);
      renderizarListas();
    }

    if (e.target.classList.contains("editar-lista")) {
      const listaAtual = listas[index];
      const novoNome = prompt("Novo nome da lista:", listaAtual.nome);
      if (novoNome === null) return;
      const novaCor =
        prompt("Escolha a cor do header (ex: #ff0000):", listaAtual.cor) ||
        listaAtual.cor;
      const novaCorTexto = corEscuraOuClara(novaCor);

      listas[index].nome = novoNome;
      listas[index].cor = novaCor;
      listas[index].corTexto = novaCorTexto;

      salvarLocalStorage(listas);
      renderizarListas();
    }
  });

  renderizarListas();
});
