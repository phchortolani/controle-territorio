import xlsx from 'xlsx'
import gts from 'excel-date-to-js'
const { readFile, utils, writeFile } = xlsx;
const { getJsDateFromExcel } = gts;

const file = readFile('./sheet/copiateste.xlsx',
   {
      cellStyles: true,
      cellHTML: true
   })

export function getData() {
   let data = []
   const inactiveTerritoryList = [10, 17, 41] //territorios que não estão em uso

   const sheets = file.SheetNames

   for (let i = 0; i < sheets.length; i++) {
      const temp = utils.sheet_to_json(file.Sheets[file.SheetNames[i]])

      temp.forEach((res) => {
         data.push(res)
      })
   }

   data = MapData(data)

   function MapData(data) {
      if (data?.length > 0) {
         let currentTerritory = {};
         return data.map((e, i) => {
            if (e['Território']) {
               currentTerritory.Territorio = e['Território'];
               currentTerritory.Status = e.Status;
               currentTerritory.NumCasas = e['Número de Casas'];
               currentTerritory.Folhas = e['Folhas'];
               currentTerritory.OBS = e.OBS || "";
            }
            if (inactiveTerritoryList.some((t) => t == currentTerritory.Territorio)) {
               return {
                  Territorio: currentTerritory.Territorio,
                  Status: "DESATIVADO"
               };
            }

            return {
               Territorio: currentTerritory.Territorio,
               Rodadas: e.Rodadas != undefined ? +e.Rodadas.replace("ª", "") : 0,
               Saida_1: e['Primeira Saída'] ? getJsDateFromExcel(e['Primeira Saída']) : "",
               Saida_2: e['Segunda Saída'] ? getJsDateFromExcel(e['Segunda Saída']) : "",
               Devolucao: e['Devolução Prevista'] ? getJsDateFromExcel(e['Devolução Prevista']) : "",
               DiaSemana: e['Dia da Semana'],
               Dirigente: e.Dirigente,
               Grupo: e.Grupo,
               Status: currentTerritory.Status,
               NumCasas: currentTerritory.NumCasas,
               Folhas: currentTerritory.Folhas,
               OBS: currentTerritory.OBS

            }
         })
      }
   }

   return data;
}


export function addRow() {
   const worksheet = file.Sheets  //utils.json_to_sheet(getData());
   const workbook = file

   //utils.book_append_sheet(workbook, worksheet, "Dates")
   console.log(file.Sheets["NOVA"]["!merges"])
   
   
   
  writeFile(workbook, "./sheet/forTesting.xlsx", {compression: true});



}

