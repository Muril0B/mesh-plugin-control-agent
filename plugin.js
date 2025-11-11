module.exports = {
  name: "ControlAgent",
  version: "1.0.0",
  description: "Plugin para ativar e desativar agentes no MeshCentral.",
  startup: function (server, args) {
    console.log("PLUGIN ControlAgent INICIADO!");

    // Exemplo de integração mínima
    server.AddEventDispatcher({
      action: "plugin-controlagent",
      on: function (user, command) {
        console.log(`Comando recebido de ${user.name}:`, command);
      }
    });
  }
};
