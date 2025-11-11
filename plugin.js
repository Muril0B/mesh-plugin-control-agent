/*
  Control Agent Plugin - MB Desenvolvimento e Tecnologia
  Mostra botões para ativar/desativar agentes no painel
*/

module.exports = {
  name: "ControlAgent",
  version: "1.0.0",
  description: "Permite ativar e desativar agentes diretamente pelo painel MeshCentral.",

  serverStart: function (server, args) {
    console.log("✅ [ControlAgent] Plugin iniciado com sucesso!");
  },

  serverStop: function (server, args) {
    console.log("🛑 [ControlAgent] Plugin finalizado.");
  }
};
