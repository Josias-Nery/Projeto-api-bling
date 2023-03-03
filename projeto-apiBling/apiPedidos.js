const axios = require("axios");
const xlsx = require("xlsx");
const key = require('./config/config')

const url =
  `https://bling.com.br/Api/v2/pedidos/page=1/json/&apikey=${key.apikey}?filters=dataEmissao[01/10/2022 TO 01/10/2022];idSituacao[]`;

console.log(url);

axios.get(url).then((resp) => {
  //console.log(resp.data);

  let novoArray = [];

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
  console.log(novoArray);
  //código para conversão dos dados em Excel
  const workbook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(novoArray);
  xlsx.utils.book_append_sheet(workbook, workSheet);
  xlsx.writeFile(workbook, "nome_arquivo.xlsx");
});
