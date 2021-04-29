"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/", "ContatoController.store");
  Route.get("/", "ContatoController.list");
  Route.delete("/:id", "ContatoController.delete");
}).prefix("contato");

Route.group(() => {
  Route.post("/", "AmbienteController.store");
  Route.put("/", "AmbienteController.edit");
  // Route.get("/", "AmbienteController.list");
  Route.get("/fotos", "AmbienteController.getFotos");
  Route.get("/all", "AmbienteController.listAll");
  Route.delete("/:id", "AmbienteController.delete");
}).prefix("ambiente");

Route.group(() => {
  Route.post("/", "ProdutosController.store");
  Route.put("/", "ProdutosController.edit");
  Route.get("/", "ProdutosController.list");
  Route.get("/categorias", "ProdutosController.listCategorias");
  Route.delete("/:id", "ProdutosController.delete");
}).prefix("produtos");

Route.group(() => {
  Route.post("/", "ArquietoController.store");
  Route.put("/", "ArquietoController.edit");
  Route.get("/", "ArquietoController.list");
  Route.get("/categorias", "ArquietoController.listCategorias");
  Route.delete("/:id", "ArquietoController.delete");
}).prefix("arquiteto");

Route.group(() => {
  Route.post("/", "FotosController.store");
  Route.get("/", "FotosController.list");
}).prefix("fotos");

Route.group(() => {
  Route.post("/", "BannerController.store");
  Route.put("/", "BannerController.edit");
  Route.delete("/:id", "BannerController.delete");
  Route.get("/", "BannerController.list");
}).prefix("banner");

Route.group(() => {
  Route.post("/", "CadastroController.enviar");
}).prefix("cadastro");

Route.group(() => {
  Route.post("/", "LoginController.logar");
}).prefix("login");

Route.get("/", () => {
  return { greeting: "Ola amigo" };
});
