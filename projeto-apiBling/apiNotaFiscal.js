const axios = require("axios");
const xlsx = require("xlsx");
const key = require('./config/config')

const url =
  `https://bling.com.br/Api/v2/notasfiscais/json/&apikey=${key.apikey}?filters=dataEmissao`;
const params = encodeURIComponent("[01/10/2022 TO 03/10/2022];situacao[6]");
const urlFinal = url + params;
console.log(urlFinal);

axios.get(urlFinal).then((resp) => {
  //console.log(resp.data);

  let novoArray = [];

  resp.data.retorno.notasfiscais.forEach((nf) => {
    let resultado = nf.notafiscal;
    const novaNf = {
      id: resultado.id,
      numero: resultado.numero,
      loja: resultado.loja,
      numeroPedidoLoja: resultado.numeroPedidoLoja,
      tipo: resultado.tipo,
      situacao: resultado.situacao,
      nome: resultado.cliente.nome,
      cnpj: resultado.cliente.cnpj,
      email: resultado.cliente.email,
      dataEmissao: resultado.dataEmissao,
      valorNota: resultado.valorNota
    };
    novoArray.push(novaNf);
  });
  console.log(novoArray);
  //código para conversão dos dados em Excel
  const workbook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(novoArray);
  xlsx.utils.book_append_sheet(workbook, workSheet);
  xlsx.writeFile(workbook, "nome_arquivo.xlsx");
});
