const SUPABASE_URL = "https://mrhxutixzunyghetwobu.supabase.co";
const SUPABASE_KEY = "sb_publishable_gMqFSNZ-wINAPC9tZqxqzw_jO2jWqwz";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

let grafico = null;

// SALVAR
async function salvar() {
  const id = document.getElementById('id').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const idade = Number(document.getElementById('idade').value);

  if (!nome || !email || !idade) {
    mostrarMensagem("Preencha todos os campos!");
    return;
  }

  try {
    if (id) {
      await client.from('alunos').update({ nome, email, idade }).eq('id', id);
      mostrarMensagem("Aluno atualizado!");
    } else {
      await client.from('alunos').insert([{ nome, email, idade }]);
      mostrarMensagem("Aluno cadastrado!");
    }

    limpar();
  } catch (erro) {
    mostrarMensagem("Erro ao salvar!");
    console.error(erro);
  }
}

// LISTAR
async function listar() {
  const { data, error } = await client.from('alunos').select('*');

  const lista = document.getElementById('lista');
  lista.innerHTML = "";

  if (error) {
    mostrarMensagem("Erro ao carregar dados!");
    return;
  }

  if (!data || data.length === 0) {
    lista.innerHTML = "<tr><td colspan='4'>Nenhum aluno cadastrado</td></tr>";
    document.getElementById('total').innerText = "";
    return;
  }

  data.forEach(aluno => {
    const nomeSeguro = aluno.nome.replace(/'/g, "\\'");

    lista.innerHTML += `
      <tr>
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.idade}</td>
        <td>
          <button class="btn-editar" onclick="editar(${aluno.id}, '${nomeSeguro}', '${aluno.email}', ${aluno.idade})">Editar</button>
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

// RELATÓRIO COM GRÁFICO
async function abrirRelatorio() {
  document.getElementById("modalRelatorio").style.display = "block";

  const { data, error } = await client.from('alunos').select('*');

  if (error || !data || data.length === 0) {
    document.getElementById('relTotal').innerText = "Nenhum aluno cadastrado";
    document.getElementById('relMedia').innerText = "";
    document.getElementById('relMaior').innerText = "";
    document.getElementById('relMenor').innerText = "";
    return;
  }

  const total = data.length;
  const nomes = data.map(a => a.nome);
  const idades = data.map(a => Number(a.idade));

  const soma = idades.reduce((acc, val) => acc + val, 0);
  const media = soma / total;
  const maior = Math.max(...idades);
  const menor = Math.min(...idades);

  document.getElementById('relTotal').innerText = "Total de alunos: " + total;
  document.getElementById('relMedia').innerText = "Média de idade: " + media.toFixed(1);
  document.getElementById('relMaior').innerText = "Maior idade: " + maior;
  document.getElementById('relMenor').innerText = "Menor idade: " + menor;

  // destruir gráfico antigo
  if (grafico) {
    grafico.destroy();
  }

  const ctx = document.getElementById('graficoIdades').getContext('2d');

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nomes,
      datasets: [{
        label: 'Idade dos alunos',
        data: idades
      }]
    }
  });
}

function fecharRelatorio() {
  document.getElementById("modalRelatorio").style.display = "none";
}