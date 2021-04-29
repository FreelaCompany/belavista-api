"use strict";

const Repo = use("App/Repositories/BannerRepository");

class BannerController {
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

  async edit({ request, response }) {
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

  async list({ request, response }) {
    try {
      return await new Repo().list({ request });

      return response.status(200).send({
        success: true,
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

module.exports = BannerController;
