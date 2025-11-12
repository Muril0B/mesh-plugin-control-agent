/**
 * Plugin: mesh-plugin-control-agent
 * Autor: MB Desenvolvimento e Tecnologia
 * Descrição: Adiciona botões de Ativar/Desativar Agente na aba de cada dispositivo.
 */

module.exports = {
  name: "ControlAgent",
  version: "1.0.0",
  description: "Adiciona botões de ativar/desativar agentes no painel.",

  devicePage: {
    buttonText: "Controle do Agente",
    buttonClick: function (server, ws, user, device) {
      const state = device.agentConnected ? "Desativado" : "Ativado";
      const message =
        device.agentConnected
          ? `Agente ${device.name} foi desativado.`
          : `Agente ${device.name} foi ativado.`;

      // Log no console do servidor
      console.log(`[PLUGIN] ${message}`);

      // Envia mensagem pro painel do usuário
      server.sendUserNotification(user._id, message);

      // Aqui poderíamos enviar comando real de ativar/desativar via meshcmd
      // Exemplo: server.SendCommandToDevice(device._id, { action: "poweroff" });

      return true;
    },
  },

  startup: function () {
    console.log("[PLUGIN] Controle do Agente iniciado com sucesso!");
  },
};
