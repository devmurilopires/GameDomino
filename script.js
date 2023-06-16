let jogador1 = [];
let jogador2 = [];
let mesa = [];
let jogadorAtual = "";

// Função para criar as peças do jogo
function criarPecas() {
  const pecas = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pecas.push({ lado1: i, lado2: j });
    }
  }
  return pecas;
}

// Função para embaralhar as peças do jogo
function embaralharPecas(pecas) {
  for (let i = pecas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pecas[i], pecas[j]] = [pecas[j], pecas[i]];
  }
  return pecas;
}

// Função para distribuir as peças entre os jogadores
function distribuirPecas(pecas) {
  jogador1 = pecas.slice(0, 7);
  jogador2 = pecas.slice(7, 14);
}

// Função para exibir as peças de um jogador na tela
function exibirPecas(container, pecas, onClick) {
  container.innerHTML = "";
  pecas.forEach((peca, index) => {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("piece");
    pieceDiv.innerText = `${peca.lado1} - ${peca.lado2}`;
    pieceDiv.addEventListener("click", () => onClick(index));
    container.appendChild(pieceDiv);
  });
}

// Função para exibir a mensagem de status do jogo
function exibirStatus(mensagem) {
  const statusDiv = document.getElementById("status");
  statusDiv.innerText = mensagem;
}

// Função para jogar uma peça na mesa
function jogarPeca(index) {
  const peca = jogador1[index];
  const lado1 = peca.lado1;
  const lado2 = peca.lado2;

  if (mesa.length === 0) {
    mesa.push(peca);
  } else {
    const pecaAtual = mesa[mesa.length - 1];
    const lado1Atual = pecaAtual.lado1;
    const lado2Atual = pecaAtual.lado2;

    if (lado1 === lado1Atual || lado1 === lado2Atual) {
      mesa.push(peca);
    } else if (lado2 === lado1Atual || lado2 === lado2Atual) {
      peca.lado1 = lado2;
      peca.lado2 = lado1;
      mesa.push(peca);
    } else {
      exibirStatus("Jogada inválida! Escolha outra peça.");
      return;
    }
  }

  jogador1.splice(index, 1);
  exibirPecas(document.getElementById("player-pieces"), jogador1, jogarPeca);
  exibirPecas(document.getElementById("board"), mesa, () => {});
  exibirStatus("Vez do computador jogar!");
  jogadaComputador();
  verificarFimJogo();
  verificarEmpate();
}

// Função para a jogada do computador
function jogadaComputador() {
  const jogadasValidas = [];

  for (let i = 0; i < jogador2.length; i++) {
    const peca = jogador2[i];
    const lado1 = peca.lado1;
    const lado2 = peca.lado2;

    if (mesa.length === 0) {
      jogadasValidas.push({ index: i, peca: peca });
    } else {
      const pecaAtual = mesa[mesa.length - 1];
      const lado1Atual = pecaAtual.lado1;
      const lado2Atual = pecaAtual.lado2;

      if (lado1 === lado1Atual || lado1 === lado2Atual) {
        jogadasValidas.push({ index: i, peca: peca });
      } else if (lado2 === lado1Atual || lado2 === lado2Atual) {
        peca.lado1 = lado2;
        peca.lado2 = lado1;
        jogadasValidas.push({ index: i, peca: peca });
      }
    }
  }

  if (jogadasValidas.length > 0) {
    const index = Math.floor(Math.random() * jogadasValidas.length);
    const jogada = jogadasValidas[index];
    const peca = jogada.peca;
    jogador2.splice(jogada.index, 1);
    mesa.push(peca);
    exibirPecas(document.getElementById("computer-pieces"), jogador2, () => {});
    exibirPecas(document.getElementById("board"), mesa, () => {});
    exibirStatus("Sua vez de jogar!");
    verificarFimJogo();
    verificarEmpate();
  } else {
    exibirStatus("O computador não tem jogada válida. Ele passou a vez.");
  }
}

// Função para iniciar o jogo
function iniciarJogo() {
  const pecas = embaralharPecas(criarPecas());
  distribuirPecas(pecas);
  jogadorAtual = Math.random() < 0.5 ? "jogador1" : "jogador2";

  exibirPecas(document.getElementById("player-pieces"), jogador1, jogarPeca);
  exibirPecas(document.getElementById("computer-pieces"), jogador2, () => {});

  if (jogadorAtual === "jogador1") {
    exibirStatus("Sua vez de jogar!");
  } else {
    exibirStatus("Vez do computador jogar!");
    jogadaComputador();
  }

  const startButton = document.getElementById("start-button");
  startButton.disabled = true;

  const passButton = document.getElementById("pass-button");
  passButton.disabled = false;
}

// Função para verificar se o jogo terminou
function verificarFimJogo() {
  if (jogador1.length === 0) {
    exibirStatus("Você ganhou o jogo!");
    const parabensModal = new bootstrap.Modal(document.getElementById("parabensModal"));
    parabensModal.show();
  } else if (jogador2.length === 0) {
    exibirStatus("Você perdeu o jogo!");
    const derrotaModal = new bootstrap.Modal(document.getElementById("derrotaModal"));
    derrotaModal.show();
  }
}

// Função para verificar se houve empate
function verificarEmpate() {
  if (jogador1.length === 0 && jogador2.length === 0) {
    exibirStatus("O jogo terminou em empate!");
    const empateModal = new bootstrap.Modal(document.getElementById("empateModal"));
    empateModal.show();
  }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  jogador1 = [];
  jogador2 = [];
  mesa = [];
  jogadorAtual = "";

  const playerPiecesContainer = document.getElementById("player-pieces");
  const computerPiecesContainer = document.getElementById("computer-pieces");
  const boardContainer = document.getElementById("board");
  const statusDiv = document.getElementById("status");

  playerPiecesContainer.innerHTML = "";
  computerPiecesContainer.innerHTML = "";
  boardContainer.innerHTML = "";
  statusDiv.innerText = "";

  const startButton = document.getElementById("start-button");
  startButton.disabled = false;

  const passButton = document.getElementById("pass-button");
  passButton.disabled = true;
}

// Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", iniciarJogo);

  const passButton = document.getElementById("pass-button");
  passButton.addEventListener("click", jogadaComputador);

  const restartButtonParabens = document.getElementById("restart-button-parabens");
  restartButtonParabens.addEventListener("click", () => {
    reiniciarJogo();
    const parabensModal = bootstrap.Modal.getInstance(document.getElementById("parabensModal"));
    parabensModal.hide();
  });

  const restartButtonDerrota = document.getElementById("restart-button-derrota");
  restartButtonDerrota.addEventListener("click", () => {
    reiniciarJogo();
    const derrotaModal = bootstrap.Modal.getInstance(document.getElementById("derrotaModal"));
    derrotaModal.hide();
  });

  const restartButtonEmpate = document.getElementById("restart-button-empate");
  restartButtonEmpate.addEventListener("click", () => {
    reiniciarJogo();
    const empateModal = bootstrap.Modal.getInstance(document.getElementById("empateModal"));
    empateModal.hide();
  });
});
