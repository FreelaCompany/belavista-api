"use strict";

const Mail = use("Mail");

class ContatoMailer {
  async send({ request }) {
    try {
      const { nome, email, telefone, mensagem } = request.post();
      const mailContent = { nome, email, telefone, mensagem };
      await Mail.connection("smtp").send(
        "emails.contato",
        mailContent,
        (message) => {
          message
            .to("atendimentodiocesevr@gmail.com") // atendimentodiocesevr@gmail.com
            .from("contato@diocesevr.com.br")
            .subject("Contato via Site");
        }
      );
    } catch (error) {
      console.error(error);
      throw { status: 400, message: "Não foi possível enviar seu email" };
    }
  }
}

module.exports = ContatoMailer;
