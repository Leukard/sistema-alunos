const SUPABASE_URL = "https://mrhxutixzunyghetwobu.supabase.co";
const SUPABASE_KEY = "sb_publishable_gMqFSNZ-wINAPC9tZqxqzw_jO2jWqwz";

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cadastrar() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const idade = document.getElementById('idade').value;

  await client.from('alunos').insert([
    { nome, email, idade }
  ]);

  listar();
}

async function listar() {
  const { data } = await client.from('alunos').select('*');

  const lista = document.getElementById('lista');
  lista.innerHTML = "";

  data.forEach(aluno => {
    lista.innerHTML += `
      <li>
        ${aluno.nome} - ${aluno.email} - ${aluno.idade}
        <button onclick="deletar(${aluno.id})">Excluir</button>
      </li>
    `;
  });

  document.getElementById('total').innerText = "Total: " + data.length;
}

async function deletar(id) {
  await client.from('alunos').delete().eq('id', id);
  listar();
}

listar();