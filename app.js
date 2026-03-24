const SUPABASE_URL = "https://mrhxutixzunyghetwobu.supabase.co";
const SUPABASE_KEY = "sb_publishable_gMqFSNZ-wINAPC9tZqxqzw_jO2jWqwz";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

// SALVAR
async function salvar() {
  const id = document.getElementById('id').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const idade = document.getElementById('idade').value;

  if (!nome || !email || !idade) {
    mostrarMensagem("Preencha todos os campos!");
    return;
  }

  if (id) {
    await client.from('alunos').update({ nome, email, idade }).eq('id', id);
    mostrarMensagem("Aluno atualizado!");
  } else {
    await client.from('alunos').insert([{ nome, email, idade }]);
    mostrarMensagem("Aluno cadastrado!");
  }

  limpar();
}

// LISTAR
async function listar() {
  const { data } = await client.from('alunos').select('*');

  const lista = document.getElementById('lista');
  lista.innerHTML = "";

  data.forEach(aluno => {
    lista.innerHTML += `
      <tr>
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.idade}</td>
        <td>
          <button class="btn-editar" onclick="editar(${aluno.id}, '${aluno.nome}', '${aluno.email}', ${aluno.idade})">Editar</button>
          <button class="btn-excluir" onclick="deletar(${aluno.id})">Excluir</button>
        </td>
      </tr>
    `;
  });

  document.getElementById('total').innerText = "Total de alunos: " + data.length;
}

// EDITAR
function editar(id, nome, email, idade) {
  fecharModal();
  document.getElementById('id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  document.getElementById('idade').value = idade;
}

// DELETAR
async function deletar(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    await client.from('alunos').delete().eq('id', id);
    mostrarMensagem("Aluno excluído!");
    listar();
  }
}

// LIMPAR
function limpar() {
  document.getElementById('id').value = "";
  document.getElementById('nome').value = "";
  document.getElementById('email').value = "";
  document.getElementById('idade').value = "";
}

// MODAL
function abrirModal() {
  document.getElementById("modal").style.display = "block";
  listar();
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// BUSCA
function filtrar() {
  const termo = document.getElementById('busca').value.toLowerCase();
  const linhas = document.querySelectorAll("tbody tr");

  linhas.forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
}

// MENSAGEM
function mostrarMensagem(msg) {
  const el = document.getElementById('mensagem');
  el.innerText = msg;

  setTimeout(() => {
    el.innerText = "";
  }, 3000);
}