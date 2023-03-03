const axios = require("axios");
const xlsx = require("xlsx");
const key = require('./config/config')

const url =
  `https://bling.com.br/b/Api/v2/contasreceber/json/&apikey=${key.apikey}?filters=dataPagamento`;
const params = encodeURIComponent("[22/10/2022 TO 23/10/2022]");
const urlFinal = url + params;
console.log(urlFinal);

axios.get(urlFinal).then((resp) => {
  //console.log(resp.data);

  let novoArray = [];

  resp.data.retorno.contasreceber.forEach((cr) => {
    let resultado = cr.contaReceber;
    //console.log(resultado)
    const novaCr = {
      id: resultado.id,
      situacao: resultado.situacao,
      dataEmissao: resultado.dataEmissao,
      dataPgto: resultado.pagamento.data,
      vencimentoOriginal: resultado.vencimentoOriginal,
      vencimento: resultado.vencimento,
      nfOuNroPedido: resultado.nroDocumento,
      valor: resultado.valor,
      saldo: resultado.saldo,
      historico: resultado.historico,
      categoria: resultado.categoria,
      idFormaPagamento: resultado.idFormaPagamento,
      portador: resultado.portador,
      nroNoBanco: resultado.nroNoBanco,
      nome: resultado.cliente.nome,
      cpf: resultado.cliente.cpf,
      cnpj: resultado.cliente.cnpj,
      email: resultado.cliente.email,
    };
    novoArray.push(novaCr);
  });
  console.log(novoArray);
  const workbook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(novoArray);
  xlsx.utils.book_append_sheet(workbook, workSheet);
  xlsx.writeFile(workbook, "nome_arquivo.xlsx");
});
