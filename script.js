// ============================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// ============================================================
const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 27,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// ============================================================
// DADOS FICTÍCIOS DO BOLETIM — 8º ANO (FALLBACK)
// ============================================================
const dadosPadrao = [
  { disciplina: "Língua Portuguesa",        tri1: 82,   tri2: "7,8", tri3: 85,   faltas: [2, 1, 1] },
  { disciplina: "Matemática",               tri1: 52,   tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências",                 tri1: "8,1", tri2: 76,   tri3: 8.0,  faltas: [1, 2, 0] },
  { disciplina: "História",                 tri1: 7.0,  tri2: 84,   tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia",                tri1: 68,   tri2: 7.3,  tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa",           tri1: 86,   tri2: "8,1", tri3: 8.7,  faltas: [1, 0, 0] },
  { disciplina: "Arte",                     tri1: 9.0,  tri2: 92,   tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física",          tri1: 95,   tri2: 9.0,  tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital",         tri1: 88,   tri2: 9.1,  tri3: 93,   faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira",      tri1: 74,   tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado",         tri1: 8.0,  tri2: 83,   tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura",        tri1: 62,   tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico",        tri1: 48,   tri2: 5.6,  tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais",   tri1: 58,   tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Estado global dos dados do boletim em uso
let dados = JSON.parse(JSON.stringify(dadosPadrao));

// PIN guardado exclusivamente em memória da sessão
let pinSessao = "";

// Média mínima de referência (abaixo disso = "Atenção")
const MEDIA_MINIMA = 6.0;

// Variáveis das instâncias dos gráficos (Chart.js)
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// ============================================================
// FUNÇÃO: normalizarNota(valor)
// ============================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".").trim();
  }

  const numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// ============================================================
// FUNÇÃO: calcularMedia(notas)
// ============================================================
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  let soma = 0;
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas(lista)
// ============================================================
function somarFaltas(lista) {
  if (!Array.isArray(lista)) return 0;
  let total = 0;
  lista.forEach(function (f) {
    const num = Number(f);
    if (!isNaN(num)) {
      total += num;
    }
  });
  return total;
}

// ============================================================
// FUNÇÃO: definirSituacao(media)
// ============================================================
function definirSituacao(media) {
  if (media === null) {
    return { texto: "Nota ainda não disponível", classe: "selo-sem-nota" };
  }
  if (media >= MEDIA_MINIMA) {
    return { texto: "Bom desempenho", classe: "selo-bom" };
  }
  return { texto: "Atenção", classe: "selo-atencao" };
}

// ============================================================
// FUNÇÃO: formatarNota(nota)
// ============================================================
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: montarLinha(item)
// ============================================================
function montarLinha(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  const linha = document.createElement("tr");

  const tdDisc = document.createElement("td");
  tdDisc.textContent = item.disciplina;
  linha.appendChild(tdDisc);

  const tdTri1 = document.createElement("td");
  tdTri1.textContent = formatarNota(n1);
  linha.appendChild(tdTri1);

  const tdTri2 = document.createElement("td");
  tdTri2.textContent = formatarNota(n2);
  linha.appendChild(tdTri2);

  const tdTri3 = document.createElement("td");
  tdTri3.textContent = formatarNota(n3);
  linha.appendChild(tdTri3);

  const tdMedia = document.createElement("td");
  const strongMedia = document.createElement("strong");
  strongMedia.textContent = formatarNota(media);
  tdMedia.appendChild(strongMedia);
  linha.appendChild(tdMedia);

  const tdFaltas = document.createElement("td");
  tdFaltas.textContent = faltas;
  linha.appendChild(tdFaltas);

  const tdSit = document.createElement("td");
  const spanSelo = document.createElement("span");
  spanSelo.className = "selo " + situacao.classe;
  spanSelo.textContent = situacao.texto;
  tdSit.appendChild(spanSelo);
  linha.appendChild(tdSit);

  return linha;
}

// ============================================================
// FUNÇÃO: preencherTabela()
// ============================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");
  corpo.innerHTML = "";

  dados.forEach(function (item) {
    const linha = montarLinha(item);
    corpo.appendChild(linha);
  });
}

// ============================================================
// FUNÇÃO: preencherCards()
// ============================================================
function preencherCards() {
  let somaMedias = 0;
  let qtdMedias = 0;
  let totalFaltas = 0;
  let bonsDesempenhos = 0;
  let precisamAtencao = 0;

  dados.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    totalFaltas += somarFaltas(item.faltas);

    if (media !== null) {
      somaMedias += media;
      qtdMedias++;
      if (media >= MEDIA_MINIMA) {
        bonsDesempenhos++;
      } else {
        precisamAtencao++;
      }
    }
  });

  const mediaGeral = qtdMedias > 0 ? somaMedias / qtdMedias : null;

  document.getElementById("card-media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("card-total-faltas").textContent = totalFaltas;
  document.getElementById("card-bom-desempenho").textContent = bonsDesempenhos;
  document.getElementById("card-atencao").textContent = precisamAtencao;

  document.getElementById("card-frequencia").textContent = "95,2%";
  document.getElementById("card-frequencia-texto").textContent = "Dentro do limite";
}

// ============================================================
// FUNÇÕES DE GRÁFICOS (SOMENTE LEITURA DO ESTADO)
// ============================================================
function atualizarGraficoMedias() {
  const ctx = document.getElementById("graficoMediasDisciplinas");
  if (!ctx) return;

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  const rotulos = [];
  const valoresMedias = [];

  dados.forEach(function (item) {
    rotulos.push(item.disciplina);
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);
    valoresMedias.push(media);
  });

  graficoMedias = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rotulos,
      datasets: [{
        label: "Média",
        data: valoresMedias,
        backgroundColor: "#c96b95",
        borderColor: "#b05780",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: "#4a3b45" },
          grid: { color: "#ede0f7" }
        },
        y: {
          ticks: { color: "#4a3b45", font: { size: 11 } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const val = context.raw;
              if (val === null || val === undefined) return " Média: —";
              return " Média: " + val.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

function atualizarGraficoEvolucao() {
  const ctx = document.getElementById("graficoEvolucaoTrimestres");
  if (!ctx) return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  const notasT1 = [];
  const notasT2 = [];
  const notasT3 = [];

  dados.forEach(function (item) {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    if (n1 !== null) notasT1.push(n1);
    if (n2 !== null) notasT2.push(n2);
    if (n3 !== null) notasT3.push(n3);
  });

  const medT1 = notasT1.length > 0 ? (notasT1.reduce((a, b) => a + b, 0) / notasT1.length) : null;
  const medT2 = notasT2.length > 0 ? (notasT2.reduce((a, b) => a + b, 0) / notasT2.length) : null;
  const medT3 = notasT3.length > 0 ? (notasT3.reduce((a, b) => a + b, 0) / notasT3.length) : null;

  graficoEvolucao = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média Geral",
        data: [medT1, medT2, medT3],
        borderColor: "#c96b95",
        backgroundColor: "#f4a6c6",
        borderWidth: 3,
        pointBackgroundColor: "#c96b95",
        pointRadius: 5,
        tension: 0.2,
        spanGaps: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: "#4a3b45" },
          grid: { color: "#ede0f7" }
        },
        x: {
          ticks: { color: "#4a3b45" },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const val = context.raw;
              if (val === null || val === undefined) return " Média: —";
              return " Média: " + val.toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

function atualizarGraficoFaltas() {
  const ctx = document.getElementById("graficoFaltasTrimestres");
  if (!ctx) return;

  if (graficoFaltas) {
    graficoFaltas.destroy();
  }

  let f1Total = 0;
  let f2Total = 0;
  let f3Total = 0;

  dados.forEach(function (item) {
    if (Array.isArray(item.faltas)) {
      const num1 = Number(item.faltas[0]);
      const num2 = Number(item.faltas[1]);
      const num3 = Number(item.faltas[2]);

      if (!isNaN(num1)) f1Total += num1;
      if (!isNaN(num2)) f2Total += num2;
      if (!isNaN(num3)) f3Total += num3;
    }
  });

  const totalAcumuladoFaltas = f1Total + f2Total + f3Total;
  const REFERENCIA_INTERNA_RISCO = 350;

  const elEstadoFaltas = document.getElementById("estadoFaltas");
  const cardFaltas = document.getElementById("card-grafico-faltas");

  if (elEstadoFaltas && cardFaltas) {
    if (totalAcumuladoFaltas >= REFERENCIA_INTERNA_RISCO) {
      elEstadoFaltas.innerHTML = '<span class="badge-perigo">Perigo</span>';
      cardFaltas.classList.add("card-perigo");
    } else {
      elEstadoFaltas.innerHTML = "";
      cardFaltas.classList.remove("card-perigo");
    }
  }

  graficoFaltas = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [f1Total, f2Total, f3Total],
        backgroundColor: "#c9a7e8",
        borderColor: "#a37acb",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#4a3b45", stepSize: 1 },
          grid: { color: "#ede0f7" }
        },
        x: {
          ticks: { color: "#4a3b45" },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return " " + context.label + ": " + context.raw + " faltas";
            }
          }
        }
      }
    }
  });
}

function atualizarGraficos() {
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}

// ============================================================
// ACESSO À API (LOGIN)
// ============================================================
async function realizarLogin() {
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Por favor, digite seu PIN.";
    return;
  }

  msgLogin.className = "mensagem-status info";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();
    pinSessao = pinDigitado;
    campoPin.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas)) {
      dados = resultado.dados.disciplinas;
    } else {
      dados = JSON.parse(JSON.stringify(dadosPadrao));
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("area-boletim").style.display = "block";

    preencherTabela();
    preencherCards();
    atualizarGraficos();

  } catch (erro) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// ============================================================
// VALIDAÇÃO E EDIÇÃO
// ============================================================
function validarNotaEdicao(valor) {
  if (valor === null || valor === undefined || valor.trim() === "") {
    return { valido: true, valor: null };
  }
  const str = valor.trim().replace(",", ".");
  const num = Number(str);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function validarFaltaEdicao(valor) {
  if (valor === null || valor === undefined || valor.trim() === "") {
    return { valido: false };
  }
  const str = valor.trim();
  if (!/^\d+$/.test(str)) {
    return { valido: false };
  }
  const num = Number(str);
  if (isNaN(num) || num < 0) {
    return { valido: false };
  }
  return { valido: true, valor: num };
}

function abrirEdicao() {
  const corpo = document.getElementById("corpo-tabela-edicao");
  corpo.innerHTML = "";
  document.getElementById("mensagem-edicao").textContent = "";

  dados.forEach(function (item, index) {
    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.textContent = item.disciplina;
    tr.appendChild(tdDisc);

    const f1 = Array.isArray(item.faltas) ? item.faltas[0] : 0;
    const f2 = Array.isArray(item.faltas) ? item.faltas[1] : 0;
    const f3 = Array.isArray(item.faltas) ? item.faltas[2] : 0;

    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const inputsHtml = `
      <td><input type="text" id="edit-n1-${index}" value="${n1 !== null ? String(n1).replace('.', ',') : ''}" /></td>
      <td><input type="text" id="edit-n2-${index}" value="${n2 !== null ? String(n2).replace('.', ',') : ''}" /></td>
      <td><input type="text" id="edit-n3-${index}" value="${n3 !== null ? String(n3).replace('.', ',') : ''}" /></td>
      <td><input type="text" id="edit-f1-${index}" value="${f1 !== undefined ? f1 : 0}" /></td>
      <td><input type="text" id="edit-f2-${index}" value="${f2 !== undefined ? f2 : 0}" /></td>
      <td><input type="text" id="edit-f3-${index}" value="${f3 !== undefined ? f3 : 0}" /></td>
    `;
    tr.innerHTML += inputsHtml;
    corpo.appendChild(tr);
  });

  document.getElementById("secao-tabela-view").style.display = "none";
  document.getElementById("secao-edicao").style.display = "block";
}

function cancelarEdicao() {
  document.getElementById("secao-edicao").style.display = "none";
  document.getElementById("secao-tabela-view").style.display = "block";
}

async function salvarEdicao() {
  const msgEdicao = document.getElementById("mensagem-edicao");
  msgEdicao.className = "mensagem-status";
  msgEdicao.textContent = "";

  const novosDados = [];
  let temErro = false;

  dados.forEach(function (item, index) {
    const elN1 = document.getElementById(`edit-n1-${index}`);
    const elN2 = document.getElementById(`edit-n2-${index}`);
    const elN3 = document.getElementById(`edit-n3-${index}`);
    const elF1 = document.getElementById(`edit-f1-${index}`);
    const elF2 = document.getElementById(`edit-f2-${index}`);
    const elF3 = document.getElementById(`edit-f3-${index}`);

    [elN1, elN2, elN3, elF1, elF2, elF3].forEach(el => el.classList.remove("campo-invalido"));

    const valN1 = validarNotaEdicao(elN1.value);
    const valN2 = validarNotaEdicao(elN2.value);
    const valN3 = validarNotaEdicao(elN3.value);

    const valF1 = validarFaltaEdicao(elF1.value);
    const valF2 = validarFaltaEdicao(elF2.value);
    const valF3 = validarFaltaEdicao(elF3.value);

    if (!valN1.valido) { elN1.classList.add("campo-invalido"); temErro = true; }
    if (!valN2.valido) { elN2.classList.add("campo-invalido"); temErro = true; }
    if (!valN3.valido) { elN3.classList.add("campo-invalido"); temErro = true; }

    if (!valF1.valido) { elF1.classList.add("campo-invalido"); temErro = true; }
    if (!valF2.valido) { elF2.classList.add("campo-invalido"); temErro = true; }
    if (!valF3.valido) { elF3.classList.add("campo-invalido"); temErro = true; }

    if (!temErro) {
      novosDados.push({
        disciplina: item.disciplina,
        tri1: valN1.valor,
        tri2: valN2.valor,
        tri3: valN3.valor,
        faltas: [valF1.valor, valF2.valor, valF3.valor]
      });
    }
  });

  if (temErro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Verifique os campos destacados em vermelho.";
    return;
  }

  msgEdicao.className = "mensagem-status info";
  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.className = "mensagem-status erro";
      msgEdicao.textContent = "Não foi possível salvar as alterações. Tente novamente.";
      return;
    }

    dados = novosDados;
    msgEdicao.className = "mensagem-status sucesso";
    msgEdicao.textContent = "Dados salvos com sucesso.";

    preencherTabela();
    preencherCards();
    atualizarGraficos();

    setTimeout(function () {
      cancelarEdicao();
    }, 1000);

  } catch (erro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// ============================================================
// EVENTOS
// ============================================================
window.addEventListener("DOMContentLoaded", function () {
  const btnEntrar = document.getElementById("btn-entrar");
  const campoPin = document.getElementById("campo-pin");
  const btnAlterar = document.getElementById("btn-alterar-dados");
  const btnSalvar = document.getElementById("btn-salvar");
  const btnCancelar = document.getElementById("btn-cancelar");

  if (btnEntrar) {
    btnEntrar.addEventListener("click", realizarLogin);
  }

  if (campoPin) {
    campoPin.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        realizarLogin();
      }
    });
  }

  if (btnAlterar) {
    btnAlterar.addEventListener("click", abrirEdicao);
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarEdicao);
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicao);
  }
});