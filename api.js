const URL =
  "https://cgdkhufktnclezagrhek.supabase.co/rest/v1/usuario";

const API_KEY =
  "sb_publishable_IPsf8cTazQXIOxTS-EvkdQ_G7bVSGCj";

const headers = {
  apikey: API_KEY,
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// CADASTRAR USUÁRIO
export async function cadastrarUsuario(usuario) {
  const resposta = await fetch(URL, {
    method: "POST",

    headers: {
      ...headers,
      Prefer: "return=representation",
    },

    body: JSON.stringify(usuario),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao cadastrar usuário");
  }

  return await resposta.json();
}

// LOGIN
export async function loginUsuario(email, senha) {
  const resposta = await fetch(
    `${URL}?email=eq.${encodeURIComponent(
      email
    )}&senha=eq.${encodeURIComponent(senha)}`,
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!resposta.ok) {
    throw new Error("Erro ao consultar usuário");
  }

  return await resposta.json();
}

// BUSCAR TODOS OS USUÁRIOS
export async function buscarUsuarios() {
  const resposta = await fetch(URL, {
    method: "GET",
    headers: headers,
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return await resposta.json();
}