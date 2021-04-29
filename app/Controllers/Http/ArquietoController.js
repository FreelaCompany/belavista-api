"use strict";

const Repo = use("App/Repositories/ArquitetoRepository");

class ArquietoController {
  async store({ request, response }) {
    try {
      return await new Repo().store({ request });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async list({ request, response }) {
    try {
      return await new Repo().list({ request });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async delete({ params, response }) {
    try {
      return await new Repo().delete({ params });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }

  async edit({ response, request }) {
    try {
      return await new Repo().edit({ request });
    } catch (error) {
      return response.status(error.status || 400).send({
        error: {
          message: error.message || "Erro ao consultar a api",
        },
      });
    }
  }
}

module.exports = ArquietoController;
