"use strict";

const DB = use("App/Database/BelaVistaDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class ArquitetoRepository {
  async store({ request }) {
    try {
      const { nome, descricao, instagram, facebook } = request.post();

      const sql = `
      INSERT INTO arquiteto (nome,
        descricao,
        instagram,
        facebook,
        data_cadastro) VALUES ('${nome}', '${descricao}', '${instagram}', '${facebook}', NOW())
      `.trim();

      await Connection.raw(sql);

      const sql2 = `
      SELECT
        MAX(id_arquiteto) as lastInsertID
        FROM arquiteto
      `.trim();

      const [lastInsertID] = await Connection.raw(sql2);

      return {
        Message: "Cadastro realizado com sucesso!",
        id: lastInsertID[0].lastInsertID,
      };
    } catch (error) {
      throw {
        status: 400,
        message: error.message,
      };
    }
  }

  async edit({ request }) {
    try {
      const { id, nome, instagram, facebook, descricao } = request.post();

      const sql = `
          UPDATE arquiteto
            SET nome = '${nome}',
            instagram = '${instagram}',
            facebook = '${facebook}',
            descricao = '${descricao}',
            data_update = NOW()
            WHERE id_arquiteto = ${id}
          `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async list() {
    try {
      const sql = `
      SELECT
        id_arquiteto,
        nome,
        descricao,
        instagram,
        facebook
        FROM arquiteto
        ORDER BY id_arquiteto DESC
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      return { data: dataResult };
    } catch (error) {
      throw { status: 404, message: error.message };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM arquiteto WHERE id_arquiteto = ${id}
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }
}

module.exports = ArquitetoRepository;
