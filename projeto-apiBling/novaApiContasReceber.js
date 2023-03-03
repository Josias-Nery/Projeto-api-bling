const axios = require("axios");
const xlsx = require('xlsx')
const key = require('./config/config')

async function getDados() {
  let pagina = 1;
  let novoArray = [];
  while (true) {
    const url = `https://bling.com.br/b/Api/v2/contasreceber/page=${pagina}/json/&apikey=${key.apikey}?filters=dataPagamento[1/11/2022 TO 10/11/2022]`;
    //console.log(url)
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
