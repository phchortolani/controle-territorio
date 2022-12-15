import xlsx from 'xlsx'
import gts from 'excel-date-to-js'
import moment from 'moment/moment.js';

const { readFile, utils, writeFile } = xlsx;
const { getJsDateFromExcel } = gts;

/* const file = readFile('./sheet/CONTROLE_DE_TERRITORIO_2022.xlsx',
   {
      cellStyles: true,
      cellHTML: true
   })
 */

const file = readFile('./sheet/CONTROLE_DE_TERRITORIO_2022.xlsx')

export function getData() {
   let data = []
   const inactiveTerritoryList = [] //territorios que não estão em uso

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
               Dirigente: e.Dirigente,
               Saida_1: e['Primeira Saída'] ? moment(getJsDateFromExcel(e['Primeira Saída'])).add(1, 'days').format('DD/MM/YYYY') : "",
               Saida_2: e['Segunda Saída'] ? moment(getJsDateFromExcel(e['Segunda Saída'])).add(1, 'days').format('DD/MM/YYYY') : "",
               Devolucao: e['Devolução Prevista'] ? moment(getJsDateFromExcel(e['Devolução Prevista'])).add(1, 'days').format('DD/MM/YYYY') : "",
               DiaSemana: e['Dia da Semana'],
               Rodadas: e.Rodadas != undefined ? +e.Rodadas.replace("ª", "") : 0,
               Grupo: e.Grupo,
               Status: currentTerritory.Status,
               NumCasas: currentTerritory.NumCasas,
               Folhas: currentTerritory.Folhas,
               OBS: currentTerritory.OBS,
               Proximos: getNear(currentTerritory.Territorio)
            }
         })
      }
   }

   return data;
}

function getNear(numTerritorio) {
   const list = {
      1: [2, 3, 4],
      2: [1, 3, 4, 8],
      3: [1, 2, 4, 5, 6],
      4: [1, 2, 3, 5, 6, 7, 9],
      5: [3, 4, 6, 10],
      6: [3, 4, 5, 7, 9, 10],
      7: [4, 6, 9, 10, 11, 43, 45],
      8: [2, 4, 9],
      9: [2, 4, 6, 7, 8, 43, 44, 45],
      10: [5, 4, 7, 11, 45],
      11: [7, 10, 12, 13, 19, 45],
      12: [13, 14, 15, 16, 19],
      13: [11, 12, 19],
      14: [12, 15, 17],
      15: [12, 14, 16, 17, 19, 41],
      16: [12, 15, 17, 18, 19, 22, 41],
      17: [14, 15, 16, 22, 41],
      18: [16, 19, 22],
      19: [11, 12, 13, 16, 15, 22, 23, 24, 26],
      20: [21, 22, 25],
      21: [20, 22, 24, 25, 28],
      22: [16, 17, 18, 19, 20, 21, 23, 24, 41],
      23: [19, 21, 22, 24, 26],
      24: [19, 21, 23, 25, 26, 28],
      25: [20, 21, 24, 28, 29],
      26: [19, 23, 24, 27, 28, 30, 31, 34, 35],
      27: [26, 28, 29, 30, 31],
      28: [21, 24, 25, 26, 27, 29, 30],
      29: [25, 27, 28, 30],
      30: [26, 27, 28, 29, 31],
      31: [26, 27, 30, 32, 33, 34, 35],
      32: [31, 33, 36],
      33: [31, 32, 34, 35, 36],
      34: [26, 31, 35, 36, 37],
      35: [26, 31, 33, 34, 36, 37],
      36: [33, 32, 34, 35, 37, 38, 39, 40],
      37: [34, 35, 36, 38, 39, 40],
      38: [36, 37, 39, 40],
      39: [36, 37, 38, 40],
      40: [36, 37, 38, 39],
      41: [15, 16, 17, 22],
      42: [43, 44],
      43: [9, 42, 44, 45],
      44: [9, 42, 43],
      45: [7, 9, 10, 11, 42, 43]
   }

   return list[+numTerritorio]

}

export function addRow() {
   const worksheet = file.Sheets  //utils.json_to_sheet(getData());
   const workbook = file

   //utils.book_append_sheet(workbook, worksheet, "Dates")
   console.log(file.Sheets["NOVA"]["!merges"])



   writeFile(workbook, "./sheet/forTesting.xlsx", { compression: true });



}
function gerar(territorios, casas) {

   let territoriosGerados = []
   let totalCasas = 0;
   let tAnt = 0;


   function generate(removeTerritorio) {
      var tempT = territorios.filter((e) => !removeTerritorio.includes(e.Territorio))

      tempT.forEach((cur) => {

         if (totalCasas < casas) {

            if (cur.Proximos.includes(tAnt) || tAnt == 0) {
               territoriosGerados.push(cur.Territorio)
               tAnt = cur.Territorio;
               if (cur.NumCasas) {
                  totalCasas += cur.NumCasas
               }
            }

         }
      }
      );

   }

   let i = 0;
   while(i++ < territorios){
      if (totalCasas < casas) break;
      generate([territoriosGerados])
   }
   

   return { territoriosAnalisados: territorios, territoriosGerados, totalCasas }
}
