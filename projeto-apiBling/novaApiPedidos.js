const axios = require("axios");
const xlsx = require("xlsx");
const key = require('./config/config')


async function getDados() {
  let pagina = 1;
  let novoArray = [];
  while (true) {
    const url = `https://bling.com.br/Api/v2/pedidos/page=${pagina}/json/&apikey=${key.apikey}?filters=dataEmissao[01/11/2022 TO 15/11/2022];idSituacao[6,9,15,24]`;
    //console.log(url)
    let resp = await axios.get(url);

    if (resp.data.retorno.erros !== undefined) {
      console.log("Caiu no erro... ");
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

    resp.data.retorno.pedidos.forEach((pd) => {
      let resultado = pd.pedido;
      //console.log(resultado)
      const novoPedido = {
        data: resultado.data,
        numero: resultado.numero,
        numeroPedidoLoja: resultado.numeroPedidoLoja,
        situacao: resultado.situacao,
        loja: resultado.loja,
        nome: resultado.cliente.nome,
        cnpj: resultado.cliente.cnpj,
      };
      if (resultado.nota !== undefined) {
        (novoPedido.nf = resultado.nota.numero),
          (novoPedido.dataEmissao = resultado.nota.dataEmissao),
          (novoPedido.valor = resultado.nota.valorNota);
      }
      novoArray.push(novoPedido);
    });
    console.log("Página verificada", pagina);
    console.log(novoArray);
    pagina++;
  }
  //código para conversão dos dados em Excel
  const workbook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(novoArray);
  xlsx.utils.book_append_sheet(workbook, workSheet);
  xlsx.writeFile(workbook, "nome_arquivo.xlsx");
}

getDados();
