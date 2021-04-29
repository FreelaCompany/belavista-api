"use strict";

const DB = use("App/Database/BelaVistaDB");
const Connection = new DB().getConnection();

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

class CadastroRepository {
  async store({ request }) {
    try {
      const { nome, email, password } = request.post();

      const sql = `
        SELECT * FROM users WHERE email = "${email}"
      `.trim();

      await Connection.raw(sql);

      const [dataResult] = await Connection.raw(sql);

      const Hash = use("Hash");
      const encrypted = await Hash.make(password);

      if (dataResult.length > 0) {
        throw {
          status: 400,
          message: "E-mail já cadastrado. Verifique os dados e tente novamente",
        };
      } else {
        const sql = `
          INSERT INTO users
            (name, email, password, created_at)
          VALUES
            ('${nome}', '${email}', '${encrypted}',  NOW())
        `.trim();
        await Connection.raw(sql);
      }

      return {
        message: "Cadastro efetuado com sucesso!",
      };
    } catch (error) {
      throw {
        status: 400,
        message: error.message,
      };
    }
  }
}

module.exports = CadastroRepository;
