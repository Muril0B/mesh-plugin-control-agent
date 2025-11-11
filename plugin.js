//
// ControlAgent Plugin - by MB Desenvolvimento e Tecnologia
// Permite ativar e desativar agentes diretamente pela interface MeshCentral
//

module.exports = {
  name: "ControlAgent",
  version: "1.2.0",
  description: "Permite ativar e desativar agentes diretamente pela interface MeshCentral.",

  startup: function (server, args) {
    console.log("🟢 [PLUGIN] ControlAgent carregado com sucesso!");

    // --- Endpoint principal do plugin ---
    server.express.get("/plugin/controlagent/:action/:id", function (req, res) {
      const { action, id } = req.params;
      if (!id || !action) return res.status(400).send("Parâmetros inválidos");

      const agent = server.devices[id];
      if (!agent) return res.status(404).send("Agente não encontrado");

      if (action === "disable") {
        agent.agentCoreInfo.agentDisconnected = true;
        console.log(`🚫 Agente ${id} desativado via painel.`);
        return res.send(JSON.stringify({ success: true, status: "disabled" }));
      } else if (action === "enable") {
        agent.agentCoreInfo.agentDisconnected = false;
        console.log(`✅ Agente ${id} reativado via painel.`);
        return res.send(JSON.stringify({ success: true, status: "enabled" }));
      } else if (action === "status") {
        const isActive = !agent.agentCoreInfo.agentDisconnected;
        return res.send(JSON.stringify({ status: isActive ? "enabled" : "disabled" }));
      }

      res.status(400).send("Ação inválida");
    });

    // --- Interface visual no painel ---
    server.webserver.on("devicePageExtraTabs", (req, res, render) => {
      render.push({
        title: "Control Agent",
        id: "pCtrlAgent",
        html: `
          <div style="padding:20px;text-align:center;">
            <h2>Controle do Agente</h2>
            <div id="statusBox" style="font-size:18px;margin:15px 0;font-weight:bold;">
              <span style="color:gray;">Carregando status...</span>
            </div>
            <button id="btnEnable" style="background:#4CAF50;color:white;padding:10px 15px;border:none;border-radius:6px;margin:10px;">Ativar Agente</button>
            <button id="btnDisable" style="background:#f44336;color:white;padding:10px 15px;border:none;border-radius:6px;margin:10px;">Desativar Agente</button>
          </div>

          <script>
            const deviceId = currentNode._id;
            const statusBox = document.getElementById('statusBox');

            function updateStatusDisplay(status) {
              if (status === 'enabled') {
                statusBox.innerHTML = '<span style="color:green;">🟢 Agente Ativo</span>';
              } else if (status === 'disabled') {
                statusBox.innerHTML = '<span style="color:red;">🔴 Agente Desativado</span>';
              } else {
                statusBox.innerHTML = '<span style="color:gray;">⚙️ Status desconhecido</span>';
              }
            }

            async function getStatus() {
              try {
                const res = await fetch('/plugin/controlagent/status/' + deviceId);
                const data = await res.json();
                updateStatusDisplay(data.status);
              } catch {
                statusBox.innerHTML = '<span style="color:red;">Erro ao obter status.</span>';
              }
            }

            async function callAction(action) {
              try {
                const res = await fetch('/plugin/controlagent/' + action + '/' + deviceId);
                const data = await res.json();
                updateStatusDisplay(data.status);
                alert('Agente ' + (data.status === 'enabled' ? 'ativado' : 'desativado') + ' com sucesso!');
              } catch {
                alert('Erro ao comunicar com o servidor.');
              }
            }

            document.getElementById('btnEnable').onclick = () => callAction('enable');
            document.getElementById('btnDisable').onclick = () => callAction('disable');

            getStatus(); // Atualiza status ao abrir a aba
          </script>
        `
      });
    });

    console.log("🔧 [PLUGIN] Interface com status do agente habilitada com sucesso.");
  }
};
