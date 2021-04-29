"use strict";

const Mail = use("Mail");

class PedidoOracaoMailer {
  async send({ request }) {
    try {
      const { nome, titulo, mensagem, exibir } = request.post();

      const mailContent = {
        nome,
        titulo,
        mensagem,
        exibir: Number(exibir) === 1 ? "sim" : "não",
      };

      await Mail.connection("smtp").send(
        "emails.pedido-oracao",
        mailContent,
        (message) => {
          message
            .to("atendimentodiocesevr@gmail.com") // atendimentodiocesevr@gmail.com
            .from("contato@diocesevr.com.br")
            .subject("Pedido de oração");
        }
      );
    } catch (error) {
      throw { status: 400, message: "Não foi possível enviar seu email" };
    }
  }
}

module.exports = PedidoOracaoMailer;
