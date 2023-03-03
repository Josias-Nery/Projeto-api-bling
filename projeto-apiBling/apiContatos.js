const axios = require("axios");
const key = require('./config/config')

async function getContatos() {
  let pagina = 1;
  let novoArray = [];
  while (true) {
    const url = `https://bling.com.br/Api/v2/contatos/page=${pagina}/json/&apikey=${key.apikey}?filters=tipoPessoa[F];tipoPessoa[J]`;
    console.log(url);
    let resp = await axios.get(url);

    if (resp.data.retorno.erros !== undefined) {
        //console.log("Caiu no erro... ");
        if (resp.data.retorno.erros[0].erro.cod === 14) {
          console.log("Não há mais registros, finalizando... ");
          break;
        }
        console.log(
          "erro desconhecido",
          resp.data.retorno.erros[0].erro.cod,
          resp.data.retorno.erros[0].erro.msg
        );
        break;
      }

    resp.data.retorno.contatos.forEach((cont) => {
      let resultado = cont.contato;
      const novoContato = {
        id: resultado.id,
        nome: resultado.nome,
        tipoPessoa: resultado.tipoPessoa,
        cpf: resultado.cpf,
        cnpj: resultado.cnpj,
        email: resultado.email,
      };
      /* if (resultado.tipoPessoa == undefined) {
            novoContato = resultado.tipoPessoa
          } */
      novoArray.push(novoContato);
    });
    console.log(novoArray);
    console.log("Página verificada", pagina);
    console.log(novoArray);
    pagina++;
  }
}

getContatos();
