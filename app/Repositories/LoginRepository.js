"use strict";

const DB = use("App/Database/BelaVistaDB");
const Connection = new DB().getConnection();

class LoginRepository {
  async store({ request }) {
    try {
      const { email, password } = request.post();

      const sql = `
      SELECT * FROM users WHERE email = "${email}"
      `.trim();

      const [dataResult] = await Connection.raw(sql);

      if (dataResult.length == 0) {
        throw {
          status: 400,
          message: "E-mail inválido, tente novamente",
        };
      }

      const Hash = use("Hash");
      const decrypted = await Hash.verify(password, dataResult[0].password);

      if (!decrypted) {
        throw {
          status: 400,
          message: "Senha incorreta, tente novamente!",
        };
      }

      return {
        nome: dataResult[0].name,
        email: dataResult[0].email,
      };
    } catch (error) {
      throw {
        status: 400,
        message: error.message,
      };
    }
  }
}

module.exports = LoginRepository;
