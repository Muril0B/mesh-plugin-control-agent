module.exports = {
  name: "ControlAgent",
  version: "1.0",
  description: "Ativa e desativa o agente remotamente pelo painel MeshCentral.",
  startup: function (server) {
    server.debug(1, "PLUGIN ControlAgent carregado com sucesso!");
  },
  handleServerCommand: function (server, ws, command) {
    if (command.cmd === 'stop') {
      server.debug(1, "Parando agente em: " + command.node);
      server.SendCommand(command.node, { action: 'agentexec', type: 1, cmd: 'systemctl stop meshagent' });
    } else if (command.cmd === 'start') {
      server.debug(1, "Iniciando agente em: " + command.node);
      server.SendCommand(command.node, { action: 'agentexec', type: 1, cmd: 'systemctl start meshagent' });
    }
  }
};
