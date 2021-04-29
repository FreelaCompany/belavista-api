"use strict";

const DB = use("App/Database/BelaVistaDB");
const Connection = new DB().getConnection();

class CurriculosRepository {
  async store({ request }) {
    try {
      const { nome, email, telefone, mensagem } = request.post();

      const cleanTelefone = telefone.replace(/[^0-9]/g, "");

      const sql = `
      INSERT INTO contato (nome, email, telefone, mensagem, data_cadastro) VALUES ('${nome}', '${email}','${cleanTelefone}', '${mensagem}', NOW())
      `.trim();

      await Connection.raw(sql);
      return "Contato inserido com sucesso!";
    } catch (error) {
      throw {
        status: 400,
        message: error,
      };
    }
  }

  async list({ request }) {
    try {
      const sql = `
        SELECT
          *
        FROM contato
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      return { data: dataResult };
    } catch (error) {
      throw { status: 404, message: "Não existem currículos cadastrados" };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM contato WHERE id_contato = ${id}
      `.trim();

      await Connection.raw(sql);

      return "Contato deletado com sucesso!";
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }
}

module.exports = CurriculosRepository;
