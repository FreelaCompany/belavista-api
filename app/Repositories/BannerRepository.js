"use strict";

const DB = use("App/Database/BelaVistaDB");
const FtpUpload = use("App/Services/FtpUpload");
const Connection = new DB().getConnection();

class BannerRepository {
  async store({ request }) {
    try {
      const { link } = request.post();

      const banner = request.file("banner");

      const uploadBanner = await new FtpUpload().store(banner, "banner");

      const banner_mobile = request.file("banner_mobile");

      const uploadBannerMobile = await new FtpUpload().store(
        banner_mobile,
        "banner_mobile"
      );

      const sql = `
      INSERT INTO banner_home (banner, banner_mobile, link, data_cadastro) VALUES ('${uploadBanner}', '${uploadBannerMobile}','${link}', NOW())
      `.trim();

      await Connection.raw(sql);

      return "Banner cadastrado com sucesso!";
    } catch (error) {
      throw {
        status: 400,
        message: error,
      };
    }
  }

  async edit({ request }) {
    try {
      const { link, id, banner, banner_mobile } = request.post();

      if (banner === undefined && banner_mobile === undefined) {
        const banner = request.file("banner");

        const uploadBanner = await new FtpUpload().store(banner, "banner");

        const banner_mobile = request.file("banner_mobile");

        const uploadBannerMobile = await new FtpUpload().store(
          banner_mobile,
          "banner_mobile"
        );

        const sql = `
      UPDATE banner_home
        SET banner = '${uploadBanner}',
        banner_mobile = '${uploadBannerMobile}',
        link = '${link}',
        data_update = NOW()
        WHERE id_banner = ${id}
      `.trim();

        await Connection.raw(sql);
      } else if (banner === undefined && banner_mobile !== undefined) {
        const banner = request.file("banner");

        const uploadBanner = await new FtpUpload().store(banner, "banner");

        const sql = `
      UPDATE banner_home
        SET banner = '${uploadBanner}',
        link = '${link}',
        data_update = NOW()
        WHERE id_banner = ${id}
      `.trim();

        await Connection.raw(sql);
      } else if (banner !== undefined && banner_mobile === undefined) {
        const banner_mobile = request.file("banner_mobile");

        const uploadBannerMobile = await new FtpUpload().store(
          banner_mobile,
          "banner_mobile"
        );

        const sql = `
      UPDATE banner_home
        SET banner_mobile = '${uploadBannerMobile}',
        link = '${link}',
        data_update = NOW()
        WHERE id_banner = ${id}
      `.trim();

        await Connection.raw(sql);
      } else {
        const sql = `
        UPDATE banner_home
          SET link = '${link}',
          data_update = NOW()
          WHERE id_banner = ${id}
        `.trim();

        await Connection.raw(sql);
      }
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async delete({ params }) {
    try {
      const { id } = params;

      const sql = `
      DELETE FROM banner_home WHERE id_banner = ${id}
      `.trim();

      await Connection.raw(sql);
    } catch (error) {
      throw {
        status: 400,
        message: "Erro ao gravar o registro no banco de dados",
      };
    }
  }

  async list({ request }) {
    try {
      const sql = `
        SELECT
          *
        FROM banner_home
        ORDER BY id_banner DESC
      `.trim();

      const [dataResult] = await Connection.raw(sql);
      const data = dataResult.map((bannerUnit) =>
        this.bannerMapper(bannerUnit)
      );
      return data;
    } catch (error) {
      throw { status: 404, message: "Não existem currículos cadastrados" };
    }
  }

  bannerMapper(bannerUnit) {
    const { banner, banner_mobile, ...rest } = bannerUnit;
    const bannerBaseUrl = "http://www.casabelavistavr.com.br/banner/";
    const bannerMobileBaseUrl =
      "http://www.casabelavistavr.com.br/banner_mobile/";
    return {
      ...rest,
      banner: `${bannerBaseUrl}${banner}`,
      banner_mobile: `${bannerMobileBaseUrl}${banner_mobile}`,
    };
  }
}

module.exports = BannerRepository;
