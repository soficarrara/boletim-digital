// ============================================================
// DADOS FICTÍCIOS DO BOLETIM — 8º ANO
// ============================================================
// "const" cria uma variável que não vai ser trocada depois.
// Aqui guardamos um ARRAY (lista) de OBJETOS (fichas com informações).
// Cada objeto tem: disciplina, tri1, tri2, tri3 e faltas.
const dados = [
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

// Média mínima de referência (abaixo disso = "Atenção")
const MEDIA_MINIMA = 6.0;

// ============================================================
// FUNÇÃO: normalizarNota(valor)
// ============================================================
// FUNÇÃO = um bloquinho de código com nome, que faz uma tarefa.
// Esta aqui recebe um valor bruto e devolve a nota na escala 0–10.
// Regras:
//  - vazio/null/undefined  → null (nota ainda não lançada)
//  - 0 a 10               → mantém
//  - >10 e <=100          → divide por 10
//  - aceita ponto ou vírgula decimal
//  - fora das regras      → null (inválida, não entra na média)
function normalizarNota(valor) {
  // if = "se". Se o valor for vazio, nulo ou indefinido, retorna null.
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se o valor for texto (string), troca vírgula por ponto
  // e tenta converter para número.
  if (typeof valor === "string") {
    valor = valor.replace(",", ".").trim();
  }

  // Number(...) transforma texto em número.
  const numero = Number(valor);

  // isNaN = "não é número". Se não for número, é inválido.
  if (isNaN(numero)) {
    return null;
  }

  // Faixa válida: 0 até 10
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Faixa "centesimal": 10 < numero <= 100 → divide por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Qualquer outro caso é inválido
  return null;
}

// ============================================================
// FUNÇÃO: calcularMedia(notas)
// ============================================================
// Recebe uma lista com até 3 notas JÁ normalizadas.
// Ignora as que são null. Se nenhuma sobrar, retorna null.
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  let soma = 0;
  // forEach percorre cada item da lista e executa uma ação.
  validas.forEach(function (n) {
    soma += n;
  });

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas(lista)
// ============================================================
// Recebe [2, 1, 1] e devolve 4.
function somarFaltas(lista) {
  let total = 0;
  lista.forEach(function (f) {
    total += f;
  });
  return total;
}

// ============================================================
// FUNÇÃO: definirSituacao(media)
// ============================================================
// Retorna o texto e uma classe CSS (para colorir o selo).
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
// Mostra "—" se for null, senão mostra com uma casa decimal
// usando vírgula (padrão brasileiro).
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: montarLinha(item)
// ============================================================
// Cria a linha (tr) da tabela para uma disciplina.
function montarLinha(item) {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Cria um <tr> novo
  const linha = document.createElement("tr");

  // innerHTML = conteúdo HTML interno do elemento
  linha.innerHTML =
    "<td>" + item.disciplina + "</td>" +
    "<td>" + formatarNota(n1) + "</td>" +
    "<td>" + formatarNota(n2) + "</td>" +
    "<td>" + formatarNota(n3) + "</td>" +
    "<td><strong>" + formatarNota(media) + "</strong></td>" +
    "<td>" + faltas + "</td>" +
    '<td><span class="selo ' + situacao.classe + '">' + situacao.texto + "</span></td>";

  return linha;
}

// ============================================================
// FUNÇÃO: preencherTabela()
// ============================================================
// DOM = a representação da página que o JavaScript pode alterar.
// Aqui pegamos o <tbody> pelo id "corpo-tabela" e colocamos as linhas.
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");

  dados.forEach(function (item) {
    const linha = montarLinha(item);
    corpo.appendChild(linha); // appendChild adiciona o elemento dentro do pai
  });
}

// ============================================================
// FUNÇÃO: preencherCards()
// ============================================================
// Calcula os valores dos cards de resumo.
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

  // Colocando os valores nos elementos da página
  document.getElementById("card-media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  document.getElementById("card-total-faltas").textContent = totalFaltas;
  document.getElementById("card-bom-desempenho").textContent = bonsDesempenhos;
  document.getElementById("card-atencao").textContent = precisamAtencao;

  // ATENÇÃO: este percentual é APENAS FICTÍCIO/DEMONSTRATIVO.
  // No futuro ele será calculado de outra forma (a partir dos dias letivos reais).
  document.getElementById("card-frequencia").textContent = "92%";
  document.getElementById("card-frequencia-texto").textContent = "Frequência adequada";
}

// ============================================================
// INÍCIO — roda quando a página carrega
// ============================================================
preencherTabela();
preencherCards();