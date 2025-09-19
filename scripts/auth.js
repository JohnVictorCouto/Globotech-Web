// scripts/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastroForm");
  const loginForm = document.getElementById("loginForm");

  // Função auxiliar para converter imagem em Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  // Mostrar alert Bootstrap
  const showAlert = (msg, type = "success") => {
    const container = document.getElementById("alert-container");
    if (container) {
      container.innerHTML = `<div class="alert alert-${type} mt-2">${msg}</div>`;
      setTimeout(() => (container.innerHTML = ""), 3000);
    } else {
      alert(msg);
    }
  };

  // Cadastro
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const usuario = document.getElementById("usuario").value;
      const senha = document.getElementById("senha").value;
      const fileInput = cadastroForm.querySelector("input[type=file]");

      let avatar = "";
      if (fileInput.files[0]) {
        avatar = await toBase64(fileInput.files[0]);
      }

      const novoUsuario = { nome, usuario, senha, avatar };

      localStorage.setItem("usuario_" + usuario, JSON.stringify(novoUsuario));

      showAlert("Cadastro realizado com sucesso!");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuarioLogin").value;
      const senha = document.getElementById("senhaLogin").value;

      const dados = localStorage.getItem("usuario_" + usuario);
      if (!dados) {
        showAlert("Usuário não encontrado!", "danger");
        return;
      }

      const usuarioSalvo = JSON.parse(dados);
      if (usuarioSalvo.senha === senha) {
        localStorage.setItem("usuarioAtual", usuario); // sessão ativa
        showAlert("Login realizado!");
        setTimeout(() => (window.location.href = "tarefas.html"), 1000);
      } else {
        showAlert("Senha incorreta!", "danger");
      }
    });
  }

  // Verificar sessão em tarefas.html
  if (window.location.pathname.includes("tarefas.html")) {
    const usuarioAtual = localStorage.getItem("usuarioAtual");
    if (!usuarioAtual) {
      window.location.href = "index.html";
    } else {
      const dados = JSON.parse(localStorage.getItem("usuario_" + usuarioAtual));
      if (dados?.avatar) {
        document.querySelector(".profile-pic").src = dados.avatar;
      }
    }

    // Logout
    const sair = document.getElementById("logout");
    if (sair) {
      sair.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuarioAtual");
        window.location.href = "index.html";
      });
    }

    // Dark/Light mode
    const toggle = document.getElementById("toggle-theme");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.toggle("dark-mode");
      });
    }
  }
});
