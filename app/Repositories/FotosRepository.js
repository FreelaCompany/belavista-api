"use strict";

const DB = use("App/Database/BelaVistaDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class FotosRepository {
  async store({ request }) {
    try {
      const { id, owner, destaque } = request.post();

      const file = request.file("foto");

      const uploadFile = await new FtpUpload().store(file, owner);

      const sql3 = `
      INSERT INTO fotos (dono_foto,
        foto,
        data_cadastro, setor) VALUES ('${id}','${uploadFile}', NOW(), '${owner}')
      `.trim();

      await Connection.raw(sql3);
    } catch (error) {}
  }

  async list({ request }) {
    try {
      const { id, owner } = request.get();

      const sql = `
      SELECT
        id_foto,
        foto,
        destaque
        FROM fotos
        WHERE dono_foto = ${id}
        ORDER BY id_foto DESC
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      const data = dataResult.map((bannerUnit) =>
        this.fotosMapper(bannerUnit, owner)
      );
      return data;
    } catch (error) {
      throw { status: 404, message: error.message };
    }
  }

  fotosMapper(arquitetoUnit, owner) {
    const { foto, ...rest } = arquitetoUnit;
    const fotosBaseUrl = `http://www.casabelavistavr.com.br/${owner}/`;
    return {
      ...rest,
      foto: `${fotosBaseUrl}${foto}`,
    };
  }
}

module.exports = FotosRepository;
