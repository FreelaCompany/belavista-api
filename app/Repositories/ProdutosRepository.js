"use strict";

const DB = use("App/Database/BelaVistaDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class ProdutosRepository {
  async store({ request }) {
    try {
      const { nome, id_categoria } = request.post();

      const sql = `
      INSERT INTO produtos (nome,
        id_categoria,
       data_cadastro) VALUES ('${nome}', ${id_categoria}, NOW())
      `.trim();

      await Connection.raw(sql);

      const sql2 = `
      SELECT
        MAX(id_produto) as lastInsertID
        FROM produtos
      `.trim();

      const [lastInsertID] = await Connection.raw(sql2);

      const file = request.file("foto");

      const uploadFile = await new FtpUpload().store(file, "produtos");

      const sql3 = `
      INSERT INTO fotos (dono_foto,
        foto,
        data_cadastro, setor) VALUES ('${lastInsertID[0].lastInsertID}','${uploadFile}', NOW(), 'produtos')
      `.trim();

      await Connection.raw(sql3);

      return {
        Message: "Cadastro realizado com sucesso!",
        id: lastInsertID[0].lastInsertID,
      };
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async edit({ request }) {
    try {
      const { id, nome, id_categoria, foto } = request.post();

      const sql = `
          UPDATE produtos
            SET nome = '${nome}',
            id_categoria = ${id_categoria},
            data_update = NOW()
            WHERE id_produto = ${id}
          `.trim();

      await Connection.raw(sql);

      if (foto === undefined) {
        const file = request.file("foto");

        const uploadFile = await new FtpUpload().store(file, "produtos");

        const sql2 = `
          UPDATE fotos
            SET foto = '${uploadFile}',
            data_update = NOW()
            WHERE dono_foto = '${id}'
          `.trim();

        await Connection.raw(sql2);
      }
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
      p.id_produto,
      p.nome,
      p.id_categoria,
      f.foto
      FROM produtos p
      INNER JOIN fotos f
      ON p.id_produto = f.dono_foto
      WHERE f.setor = "produtos"
      ORDER BY p.id_produto DESC
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      const data = dataResult.map((produtoUnit) =>
        this.produtosMapper(produtoUnit)
      );
      return { data: data };
    } catch (error) {
      throw { status: 404, message: "Não existem produtos cadastrados" };
    }
  }

  produtosMapper(produtoUnit) {
    const { foto, ...rest } = produtoUnit;
    const produtosBaseUrl = "http://www.casabelavistavr.com.br/produtos/";
    return {
      ...rest,
      foto: `${produtosBaseUrl}${foto}`,
    };
  }

  async listCategorias({ request }) {
    try {
      const sql = `
        SELECT
        *
        FROM categoria
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      return { data: dataResult };
    } catch (error) {
      throw { status: 404, message: "Não existem categorias cadastradas" };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM produtos WHERE id_produto = ${id}
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

module.exports = ProdutosRepository;
