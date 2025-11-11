//
// ControlAgent Plugin - MB Desenvolvimento e Tecnologia
// Versão 2.0 — Controle individual e em massa dos agentes
//

module.exports = {
  name: "ControlAgent",
  version: "2.0.0",
  description: "Ativa ou desativa agentes individualmente ou em massa no MeshCentral.",

  startup: function (server, args) {
    console.log("🟢 [PLUGIN] ControlAgent v2.0 iniciado com sucesso!");

    // --- ENDPOINT PRINCIPAL ---
    server.express.get("/plugin/controlagent/:action/:id?", function (req, res) {
      const { action, id } = req.params;

      if (!action) return res.status(400).send("Parâmetro 'action' obrigatório.");

      // Se vier sem ID, é ação em massa
      if (!id) {
        const allDevices = Object.keys(server.devices || {});
        allDevices.forEach((devId) => {
          const agent = server.devices[devId];
          if (!agent || !agent.agentCoreInfo) return;
          if (action === "disable") agent.agentCoreInfo.agentDisconnected = true;
          if (action === "enable") agent.agentCoreInfo.agentDisconnected = false;
        });
        console.log(`⚙️ Ação em massa executada: ${action} (${allDevices.length} agentes)`);
        return res.send(JSON.stringify({ success: true, action, count: allDevices.length }));
      }

      // Ação individual
      const agent = server.devices[id];
      if (!agent) return res.status(404).send("Agente não encontrado");

      if (action === "disable") {
        agent.agentCoreInfo.agentDisconnected = true;
        console.log(`🚫 Agente ${id} desativado`);
        return res.send(JSON.stringify({ status: "disabled" }));
      } else if (action === "enable") {
        agent.agentCoreInfo.agentDisconnected = false;
        console.log(`✅ Agente ${id} ativado`);
        return res.send(JSON.stringify({ status: "enabled" }));
      } else if (action === "status") {
        const status = agent.agentCoreInfo.agentDisconnected ? "disabled" : "enabled";
        return res.send(JSON.stringify({ status }));
      }

      return res.status(400).send("Ação inválida");
    });

    // --- INTERFACE INDIVIDUAL (dentro da página do dispositivo) ---
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

            async function getStatus() {
              const res = await fetch('/plugin/controlagent/status/' + deviceId);
              const data = await res.json();
              updateStatusDisplay(data.status);
            }

            function updateStatusDisplay(status) {
              if (status === 'enabled') statusBox.innerHTML = '<span style="color:green;">🟢 Agente Ativo</span>';
              else statusBox.innerHTML = '<span style="color:red;">🔴 Agente Desativado</span>';
            }

            async function callAction(action) {
              const res = await fetch('/plugin/controlagent/' + action + '/' + deviceId);
              const data = await res.json();
              updateStatusDisplay(data.status);
              alert('Agente ' + (data.status === 'enabled' ? 'ativado' : 'desativado') + ' com sucesso!');
            }

            document.getElementById('btnEnable').onclick = () => callAction('enable');
            document.getElementById('btnDisable').onclick = () => callAction('disable');
            getStatus();
          </script>
        `
      });
    });

    // --- INTERFACE EM MASSA (página My Devices) ---
    server.webserver.on("serverStatsExtraHtml", (req, res, render) => {
      render.push(`
        <div style="padding:10px;text-align:center;">
          <h3>Controle em Massa dos Agentes</h3>
          <button onclick="massAction('enable')" style="background:#4CAF50;color:white;padding:8px 12px;border:none;border-radius:5px;margin:5px;">🟢 Ativar Todos</button>
          <button onclick="massAction('disable')" style="background:#f44336;color:white;padding:8px 12px;border:none;border-radius:5px;margin:5px;">🔴 Desativar Todos</button>
          <div id="massResult" style="margin-top:10px;font-weight:bold;color:#333;"></div>
        </div>

        <script>
          async function massAction(action) {
            try {
              const res = await fetch('/plugin/controlagent/' + action);
              const data = await res.json();
              document.getElementById('massResult').innerText =
                (action === 'enable' ? '🟢 ' : '🔴 ') +
                'Ação "' + action + '" aplicada a ' + data.count + ' agentes.';
            } catch {
              alert('Erro ao executar ação em massa.');
            }
          }
        </script>
      `);
    });

    console.log("🔧 [PLUGIN] Interface em massa habilitada com sucesso!");
  }
};
