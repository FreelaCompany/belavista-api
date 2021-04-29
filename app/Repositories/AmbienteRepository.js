"use strict";

const DB = use("App/Database/BelaVistaDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class AmbienteRepository {
  async store({ request }) {
    try {
      const { nome, descricao, id_arquiteto } = request.post();

      const arquivos = request.file("fileToUpload");

      const fotoCapa = request.file("fotoCapa");

      const uploadFotoCapa = await new FtpUpload().store(fotoCapa, "ambiente");

      const sql = `
      INSERT INTO ambiente (nome,
        descricao,
        foto_capa,
        id_arquiteto,
       data_cadastro) VALUES ('${nome}', '${descricao}','${uploadFotoCapa}' , ${id_arquiteto}, NOW())
      `.trim();

      await Connection.raw(sql);

      const sql2 = `
      SELECT
        MAX(id_ambiente) as lastInsertID
        FROM ambiente
      `.trim();

      const [lastInsertID] = await Connection.raw(sql2);

      let upload = "";

      for (let i = 0; i < arquivos.files?.length; i++) {
        upload = await new FtpUpload().store(arquivos.files[i], "ambiente");
        const sql3 = `
          INSERT INTO fotos (dono_foto,
            foto,
            data_cadastro, setor) VALUES ('${lastInsertID[0].lastInsertID}','${upload}', NOW(), 'ambiente')
          `.trim();

        await Connection.raw(sql3);
      }

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
      const {
        nome,
        descricao,
        id_ambiente,
        fotoCapa,
        decisao,
      } = request.post();

      if (fotoCapa === undefined) {
        const file = request.file("fotoCapa");

        const uploadFile = await new FtpUpload().store(file, "ambiente");

        const sql = `
          UPDATE ambiente
            SET nome = '${nome}',
            descricao = '${descricao}',
            foto_capa = '${uploadFile}',
            data_update = NOW()
            WHERE id_ambiente = ${id_ambiente}
          `.trim();

        await Connection.raw(sql);
      } else {
        const sql = `
        UPDATE ambiente
        SET nome = '${nome}',
        descricao = '${descricao}',
        data_update = NOW()
        WHERE id_ambiente = ${id_ambiente}
        `.trim();

        await Connection.raw(sql);
      }

      if (decisao === "adicionar") {
        const arquivos = request.file("fileToUpload");
        let upload = "";

        for (let i = 0; i < arquivos?.files?.length; i++) {
          upload = await new FtpUpload().store(arquivos?.files[i], "ambiente");
          const sql3 = `
          INSERT INTO fotos (dono_foto,
            foto,
            data_cadastro, setor) VALUES ('${id_ambiente}','${upload}', NOW(), 'ambiente')
          `.trim();

          await Connection.raw(sql3);
        }
      } else {
        const sql = `
        DELETE FROM fotos WHERE dono_foto = ${id_ambiente} AND setor = "ambiente"
        `.trim();

        await Connection.raw(sql);

        const arquivos = request.file("fileToUpload");
        let upload = "";

        for (let i = 0; i < arquivos?.files?.length; i++) {
          upload = await new FtpUpload().store(arquivos?.files[i], "ambiente");
          const sql3 = `
          INSERT INTO fotos (dono_foto,
            foto,
            data_cadastro, setor) VALUES ('${id_ambiente}','${upload}', NOW(), 'ambiente')
          `.trim();

          await Connection.raw(sql3);
        }
      }
    } catch (error) {
      throw {
        status: 400,
        message: error.message,
      };
    }
  }

  // async list({ request }) {
  //   try {
  //     const { id_arquiteto } = request.get();

  //     const sql = `
  //     SELECT
  //       am.id_ambiente,
  //       am.nome as nome_ambiente,
  //       am.descricao,
  //       ar.instagram,
  //       ar.facebook,
  //       ar.nome as nome_arquiteto
  //       FROM ambiente as am
  //       INNER JOIN arquiteto as ar
  //       ON am.id_arquiteto = ar.id_arquiteto
  //       WHERE am.id_arquiteto = ${id_arquiteto}
  //     `.trim();

  //     const [dataResult] = await Connection.raw(sql);

  //     return {
  //       data: dataResult,
  //     };
  //   } catch (error) {
  //     throw {
  //       status: 404,
  //       message: error.message,
  //     };
  //   }
  // }

  async getFotos({ request }) {
    try {
      const { idAmbiente } = request.all();
      const sql = `
      SELECT
        *
        FROM fotos
        where dono_foto = ${idAmbiente} AND setor = "ambiente"
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      const data = dataResult.map((ambienteUnit) =>
        this.ambienteMapper(ambienteUnit)
      );

      return {
        data: data,
      };
    } catch (error) {
      throw {
        status: 404,
        message: error.message,
      };
    }
  }

  async listAll({ request }) {
    try {
      const sql = `
      SELECT
        am.id_ambiente,
        am.nome as nome_ambiente,
        am.descricao as descricao_ambiente,
        ar.descricao as descricao_arquiteto,
        ar.instagram,
        ar.facebook,
        ar.nome as nome_arquiteto,
        ar.id_arquiteto,
        am.foto_capa as foto
        FROM ambiente as am
        INNER JOIN arquiteto as ar
        ON am.id_arquiteto = ar.id_arquiteto
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      const data = dataResult.map((ambienteUnit) =>
        this.ambienteMapper(ambienteUnit)
      );

      return {
        data: data,
      };
    } catch (error) {
      throw {
        status: 404,
        message: error.message,
      };
    }
  }

  ambienteMapper(ambienteUnit) {
    const { foto, ...rest } = ambienteUnit;
    const ambientesBaseUrl = "http://www.casabelavistavr.com.br/ambiente/";
    return {
      ...rest,
      foto: `${ambientesBaseUrl}${foto}`,
    };
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM ambiente WHERE id_ambiente = ${id}
      `.trim();

      await Connection.raw(sql);

      const sql2 = `
        DELETE FROM fotos WHERE dono_foto = ${id} AND setor = "ambiente"
        `.trim();

      await Connection.raw(sql2);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }
}

module.exports = AmbienteRepository;
