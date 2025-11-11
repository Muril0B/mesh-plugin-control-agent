//
// ControlAgent Plugin - by MB Desenvolvimento e Tecnologia
// Adiciona botões na interface para ativar e desativar agentes
//

module.exports = {
  name: "ControlAgent",
  version: "1.1.0",
  description: "Permite ativar e desativar agentes diretamente pela interface MeshCentral.",

  startup: function (server, args) {
    console.log("🟢 [PLUGIN] ControlAgent carregado com sucesso!");

    // Cria endpoint HTTP do plugin
    server.express.get("/plugin/controlagent/:action/:id", function (req, res) {
      const { action, id } = req.params;
      if (!id || !action) return res.status(400).send("Parâmetros inválidos");

      const agent = server.devices[id];
      if (!agent) return res.status(404).send("Agente não encontrado");

      if (action === "disable") {
        agent.agentCoreInfo.agentDisconnected = true;
        console.log(`🚫 Agente ${id} desativado via painel.`);
        return res.send("Agente desativado com sucesso!");
      } else if (action === "enable") {
        agent.agentCoreInfo.agentDisconnected = false;
        console.log(`✅ Agente ${id} reativado via painel.`);
        return res.send("Agente ativado com sucesso!");
      }

      res.status(400).send("Ação inválida");
    });

    // Interface visual dentro da aba de dispositivos
    server.webserver.on('devicePageExtraTabs', (req, res, render) => {
      render.push({
        title: 'Control Agent',
        id: 'pCtrlAgent',
        html: `
          <div style="padding:20px;text-align:center;">
            <h2>Controle do Agente</h2>
            <button id="btnEnable" style="background:#4CAF50;color:white;padding:10px 15px;border:none;border-radius:6px;margin:10px;">Ativar Agente</button>
            <button id="btnDisable" style="background:#f44336;color:white;padding:10px 15px;border:none;border-radius:6px;margin:10px;">Desativar Agente</button>
            <div id="resultMessage" style="margin-top:20px;font-weight:bold;"></div>
          </div>

          <script>
            const deviceId = currentNode._id;
            function callAction(action) {
              fetch('/plugin/controlagent/' + action + '/' + deviceId)
                .then(res => res.text())
                .then(msg => { 
                  document.getElementById('resultMessage').innerText = msg;
                  alert(msg);
                })
                .catch(err => { alert('Erro: ' + err); });
            }

            document.getElementById('btnEnable').onclick = () => callAction('enable');
            document.getElementById('btnDisable').onclick = () => callAction('disable');
          </script>
        `
      });
    });

    console.log("🔧 [PLUGIN] ControlAgent interface habilitada no painel de dispositivos.");
  }
};
