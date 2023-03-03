const axios = require("axios");
const xlsx = require('xlsx')
const key = require('./config/config')

async function getDados() {
  let pagina = 1;
  let novoArray = [];
  while (true) {
    const url = `https://bling.com.br/Api/v2/notasfiscais/page=${pagina}/json/&apikey=${key.apikey}?filters=dataEmissao[01/10/2022 TO 31/10/2022];situacao[6]`;
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
