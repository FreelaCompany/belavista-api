"use strict";

const Repo = use("App/Repositories/CadastroRepository");

class CadastroController {
  async enviar({ request, response }) {
    try {
      await new Repo().store({ request });
      return response.status(200).send({
        message: "Cadastro efetuado com sucesso",
      });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }
}

module.exports = CadastroController;
