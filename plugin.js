//
// ControlAgent Plugin
// by MB Desenvolvimento e Tecnologia
//

module.exports = {
  name: "ControlAgent",
  version: "1.0.1",
  description: "Permite ativar e desativar agentes diretamente pelo painel MeshCentral.",

  startup: function (server, args) {
    console.log("🟢 [PLUGIN] ControlAgent carregado com sucesso!");

    // Adiciona um endpoint na API para ativar/desativar agentes
    server.express.get("/plugin/controlagent/:action/:id", function (req, res) {
      const { action, id } = req.params;

      if (!id || !action) {
        res.status(400).send("Parâmetros inválidos");
        return;
      }

      const agent = server.devices[id];
      if (!agent) {
        res.status(404).send("Agente não encontrado");
        return;
      }

      if (action === "disable") {
        agent.agentCoreInfo.agentDisconnected = true;
        console.log(`🚫 Agente ${id} desativado`);
        res.send(`Agente ${id} desativado com sucesso.`);
      } else if (action === "enable") {
        agent.agentCoreInfo.agentDisconnected = false;
        console.log(`✅ Agente ${id} reativado`);
        res.send(`Agente ${id} ativado com sucesso.`);
      } else {
        res.status(400).send("Ação inválida");
      }
    });

    console.log("🔧 Endpoint do plugin ativo em: /plugin/controlagent/:action/:id");
  }
};
