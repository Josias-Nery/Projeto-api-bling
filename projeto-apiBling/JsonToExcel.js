var xlsx = require('xlsx')

const jsonObject = require('./index.js')

var workbook = xlsx.utils.book_new()
var workSheet = xlsx.utils.json_to_sheet(jsonObject)
xlsx.utils.book_append_sheet(workbook, workSheet)
xlsx.writeFile(workbook, "convertedJsontoExcel2.xlsx")