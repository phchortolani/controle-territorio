import xlsx from 'xlsx'
import gts from 'excel-date-to-js'
import moment from 'moment/moment.js';

const { readFile, utils, writeFile } = xlsx;
const { getJsDateFromExcel } = gts;

const leaders = ["MARCOS MARQUES", "JOAO LIMA", "ARNALDO", "GERONIMO", "NATANAEL", "BRUNO", "SEBASTIAO", "FERNANDO", "ALEX", "VOLNEI"]
const fieldDays = ["TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"]
const domLeaders = ["JOAO LIMA", "BRUNO", "ARNALDO", "VOLNEI"]
const terLeaders = ["FERNANDO", "SEBASTIAO"]
const sexLeaders = ["ARNALDO"]
const quiLeaders = ["GERONIMO", "NATANAEL"]
const sabLeader = "JOAO LIMA"

const currentDate = () => getCurrentDate();

const UsarMenosTerritorios = false // caso seja false utilizara os mais antigos
const devTest = false;
const numMinCasas = 120
/* const file = readFile('./sheet/CONTROLE_DE_TERRITORIO_2022.xlsx') */
const file = readFile(devTest ? './sheet/teste.xlsx' : './sheet/CONTROLE_DE_TERRITORIO_2022.xlsx')

export function getData() {
   let data = []
   const inactiveTerritoryList = [17] //territorios que não estão em uso

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

/* export function addRow() {
   const worksheet = file.Sheets  //utils.json_to_sheet(getData());
   const workbook = file

   //utils.book_append_sheet(workbook, worksheet, "Dates")
   console.log(file.Sheets["NOVA"]["!merges"])



   writeFile(workbook, "./sheet/forTesting.xlsx", { compression: true });

} */


export function Generate() {
   return gerar(Latest(getData()), numMinCasas,sabLeader)
}
function gerar(territorios, casas, DirigenteSabado) {

   let ret = {}

   //OBTER APENAS TERRITORIOS OK
   let analisados = new Filters(null, "OK", null, territorios).GetAllLastByStatus();

   //ORDERNAR TERRITORIOS POR DATA MAIS ANTIGA PARA A MAIS NOVA

   analisados = analisados.sort((a, b) => {
      var aDate = a.Saida_2 || a.Saida_1
      var bDate = b.Saida_2 || b.Saida_1
      var ADC = new Date(aDate.split('/').reverse())
      var BDC = new Date(bDate.split('/').reverse())

      return ADC.getTime() - BDC.getTime()
   })


   //GERAR APENAS DIAS EM QUE NÃO HÁ TERRITÓRIOS ABERTOS - SEMANA e DOMINGO

   let DaysForGeneration = []
   var temp = getOpen()
   let templeaderOfDomingo = []

   for (let i in temp) {

      for (let l of leaders) {
         if (temp[i].hasOwnProperty(l)) {
            if (i == "DOMINGO") {
               templeaderOfDomingo = temp[i]
            }
            DaysForGeneration.push(i);
         }
      }

   }

   let leaderOfDomingo = []
   for (let prop in templeaderOfDomingo) {
      if (domLeaders.includes(prop)) {
         leaderOfDomingo.push(prop)
      }
   }


   leaderOfDomingo = domLeaders.filter(x => !leaderOfDomingo.includes(x))

   DaysForGeneration = fieldDays.filter((e) => !DaysForGeneration.includes(e))

   
   if (leaderOfDomingo.length > 0 && !DaysForGeneration.includes("DOMINGO")) {
      DaysForGeneration.push("DOMINGO")
   }

    /*   DaysForGeneration.push("SABADO") */
   //GERAR APENAS TERRITORIOS EM DIAS DIFERENTES AO ULTIMO TRABALHADO
   let ListaGerada = {};

   DaysForGeneration.forEach(day => {
      ListaGerada[day] = analisados.filter((e) => e.DiaSemana != day).map((e) => {
         return {
            Territorio: e.Territorio,
            Dirigente: e.Dirigente,
            Dia: e.DiaSemana,
            Proximos: e.Proximos,
            NumCasas: e.NumCasas
         }
      }
      )
   });


   //GERAR APENAS PARA IRMAO DIFERENTE DO ULTIMO TRABALHADO
   var tempGenerate = {}
   DaysForGeneration.forEach(day => {
      var tempLeaders = []
      var tempListaGerada = []

      if (day != "DOMINGO") {

         if (day == "TERCA") tempLeaders = terLeaders
         if (day == "QUARTA" || day == "SEXTA") tempLeaders = sexLeaders
         if (day == "QUINTA") tempLeaders = quiLeaders
         if (day == "SABADO") if (DirigenteSabado) tempLeaders = [DirigenteSabado]


         tempListaGerada = ListaGerada[day].filter(e => !tempLeaders.includes(e.Dirigente))
         tempGenerate[day] = tempListaGerada
      } else {
         tempGenerate[day] = {}

         leaderOfDomingo.forEach(curLeader => {
            tempListaGerada = ListaGerada[day].filter(e => e.Dirigente != curLeader)
            tempGenerate[day][curLeader] = tempListaGerada
         });
      }

   })

   //VERIFICAR CADA TERRITÓRIO GERADO E SE OS TERRITÓRIOS PERTOS ESTÃO DISPONIVEIS NA LISTA GERADA, 
   let sugestoes = {}

   for (let day in tempGenerate) {
      let tlist = []

      if (day == "DOMINGO") {

         sugestoes[day] = {}
         for (let leader in leaderOfDomingo) {
            let nameofLeader = leaderOfDomingo[leader]

            let ArrayLeaderTerritorios = []
            for (let leaderTerritorioIndex in tempGenerate[day][nameofLeader]) {
               let t = tempGenerate[day][nameofLeader][leaderTerritorioIndex]
               ArrayLeaderTerritorios.push(t)
            }

            ArrayLeaderTerritorios.forEach(t => {
               let qtTerritorio = 1
               let nearsInList = ArrayLeaderTerritorios.filter((x) => t.Proximos.includes(x.Territorio))
               let TerritoriosProximosSuficientes = []
               let totalCasas = nearsInList.reduce((acc, cur) => {
                  if (acc <= casas) {
                     qtTerritorio++
                     TerritoriosProximosSuficientes.push(cur.Territorio)
                     return (acc + cur.NumCasas || 0)
                  }
                  return acc
               }, t.NumCasas || 0)

               if (totalCasas >= casas) {

                  tlist.push({
                     Territorio: t.Territorio,
                     TotalCasas: totalCasas,
                     TerritoriosProximosSuficiente: TerritoriosProximosSuficientes,
                     qtTerritorios: qtTerritorio
                  })

               }

            });

            sugestoes[day][nameofLeader] = tlist
         }
      } else {

         tempGenerate[day].forEach(t => {
            let qtTerritorio = 1
            let nearsInList = tempGenerate[day].filter((x) => t.Proximos.includes(x.Territorio))
            let TerritoriosProximosSuficientes = []
            let totalCasas = nearsInList.reduce((acc, cur) => {
               if (acc <= casas) {
                  qtTerritorio++
                  TerritoriosProximosSuficientes.push(cur.Territorio)
                  return (acc + cur.NumCasas || 0)
               }
               return acc
            }, t.NumCasas || 0)

            if (totalCasas >= casas) {
               tlist.push({
                  Territorio: t.Territorio,
                  TotalCasas: totalCasas,
                  TerritoriosProximosSuficiente: TerritoriosProximosSuficientes,
                  qtTerritorios: qtTerritorio
               })
            }

         });

         sugestoes[day] = tlist
      }

   }

   // OTIMIZAR SUGESTOES PARA UTILIZAR MENOS TERRITORIOS 

   if (UsarMenosTerritorios) Otimizar(sugestoes)

   //SE OS TERRITORIOS GERADOS ESTIVEREM PRÓXIMOS UTILIZAR ELES SOMENTE SE O TOTAL DE CASAS FOR PRÓXIMO DE 120
   //SE FOR MENOR QUE 120 VERIFICAR PRÓXIMO TERRITÓRIO DA LISTA DE GERADA

   let gerados = {}
   let _sugestoes = []
   DaysForGeneration.forEach((day) => {

      if (day == "DOMINGO") {
         gerados[day] = {}
         for (let leader in leaderOfDomingo) {
            sugestoes[day][leaderOfDomingo[leader]].forEach((e) => {
               const element = e

               let TempGen = (element.TerritoriosProximosSuficiente.concat(element.Territorio))

               if (element.TotalCasas >= casas && !gerados[day][leaderOfDomingo[leader]] && !TempGen.find(x => _sugestoes.includes(x))) {
                  gerados[day][leaderOfDomingo[leader]] = { Territorios: TempGen, TotalCasas: element.TotalCasas }
                  _sugestoes = _sugestoes.concat(TempGen)
               }
            });
         }
      } else {
         sugestoes[day].forEach((e) => {
            const element = e
            let TempGen = (element.TerritoriosProximosSuficiente.concat(element.Territorio))

            if (element.TotalCasas >= casas && !gerados[day] && !TempGen.find(x => _sugestoes.includes(x))) {
               gerados[day] = { TerritoriosGerados: TempGen, TotalCasas: element.TotalCasas }
               _sugestoes = _sugestoes.concat(TempGen)
            }

         });
      }
   })
   //SE TODOS OS TERRITORIOS COM SEUS PRÓXIMOS FOREM MENOR QUE O 12O, UTILIZAR A LISTA GERADA.

   ret.gerados = gerados
   ret.GeradosPara = DaysForGeneration
   ret.analisados = analisados.map((e) => { return e.Territorio })
   ret.sobrou = analisados.filter(x => !_sugestoes.includes(x.Territorio)).map((e) => { return { T: e.Territorio, D: e.Dirigente, Day: e.DiaSemana } })
   return ret;
}

function Otimizar(sugestoes) {

   let ret = {}
   for (let day in sugestoes) {

      let sortable;

      if (day != "DOMINGO") {

         sortable = sugestoes[day].sort((a, b) => {

            if (a.qtTerritorios < b.qtTerritorios) {
               return -1;
            }
            if (a.qtTerritorios > b.qtTerritorios) {
               return 1;
            }
            // a deve ser igual a b
            return 0;

         })
         ret[day] = sortable
      } else {

         for (let leader in sugestoes[day]) {

            ret[day] = {}
            sortable = sugestoes[day][leader].sort((a, b) => {

               if (a.qtTerritorios < b.qtTerritorios) {
                  return -1;
               }
               if (a.qtTerritorios > b.qtTerritorios) {
                  return 1;
               }
               // a deve ser igual a b
               return 0;
            })
            ret[day][leader] = sortable
         }


      }

   }

   return new Object(ret);
}



function getCurrentDate() {
   return new Date(new Date().toISOString().split('T')[0].split("-")[0], new Date().toISOString().split('T')[0].split("-")[1], new Date().toISOString().split('T')[0].split("-")[2]);
}
export function getDevolucao() {
   let territorys = getData();
   let ret = {}
   territorys = Latest(territorys) // obtem somente as ultimas rodadas


   fieldDays.forEach((day) => {
      ret[day] = {}

      leaders.forEach((brother) => {

         var territorysAfterFilters = new Filters(brother, "ABERTO", day, territorys).Equals();
         var tlist = []
         territorysAfterFilters.forEach((element, i) => {
            const { Territorio, Devolucao } = element

            var dateDevolucao = new Date(Devolucao.split("/")[2], Devolucao.split("/")[1], Devolucao.split("/")[0])

            if (dateDevolucao <= currentDate()) {  //filtro por data
               tlist.push(Territorio);
               ret[day][brother] = { Devolucao, Territorios: tlist }
            }

         });

      })

   })

   return ret
}


function getAllByStatus(status, leader) {
   const territorios = Latest(getData());
   //let territorys = new Filters(leader, "ABERTO", null, territorios).GetAllLastByStatus();

   let ret = {}

   fieldDays.forEach((day) => {
      ret[day] = {}

      leaders.forEach((brother) => {
         if (leader) brother = leader
         var tlist = []

         var territorysAfterFilters = new Filters(brother, status, day, territorios).Equals();

         territorysAfterFilters.forEach((element) => {
            const { Territorio, Saida_1, Saida_2, Devolucao } = element

            tlist.push(Territorio);
            ret[day][brother] = { Saida_1, Saida_2, Devolucao, Territorios: tlist }
         });

      })

   })


   return ret
}

export function getOpen(leader) {

   return getAllByStatus("ABERTO", leader)

}
export function getClose(leader) {
   const territorios = Latest(getData());
   let ret = new Filters(leader, "OK", null, territorios).GetAllLastByStatus().map(
      (e) => {
         var obj = { Territorio: e.Territorio, UltimoTrabalhadoEm: (e.Saida_2 || e.Saida_1), Dia: e.DiaSemana, Dirigente: e.Dirigente, Rodadas: e.Rodadas }
         return obj
      }
   );
   return ret

}


function Latest(t) {

   let rodadasList = []
   t.forEach((e) => {
      const index = rodadasList.findIndex((x) => x?.Territorio == e.Territorio);
      if (index > -1) {
         rodadasList.splice(index, 1);
         rodadasList[index] = e;
      } else {
         rodadasList.push(e)
      }
   })

   return rodadasList;

}


class Filters {

   constructor(leaderName, status, day, listOfTerritory) {
      this.leader = leaderName
      this.status = status
      this.day = day
      this.list = listOfTerritory
   }

   obterultimo(territorio) {
      return this.list.find((e) => e.Territorio == territorio).Rodadas
   }


   Equals() {
      return this.list.filter((e) => {
         return (e.Dirigente?.toUpperCase() == this.leader) && (this.obterultimo(e.Territorio) == e.Rodadas) && (e.Status?.toUpperCase() == this.status && e.DiaSemana == this.day)
      })
   }

   NotEquals() {
      return this.list.filter((e) => {
         return (e.Dirigente?.toUpperCase() != this.leader) && (this.obterultimo(e.Territorio) == e.Rodadas) && (e.Status?.toUpperCase() != this.status && e.DiaSemana != this.day)
      })
   }

   GetAllLastByStatus() {

      return this.list.filter((e) => {
         if (this.leader) {
            return (e.Dirigente?.toUpperCase() == this.leader) && (this.obterultimo(e.Territorio) == e.Rodadas) && (e.Status?.toUpperCase() == this.status)
         }
         return (this.obterultimo(e.Territorio) == e.Rodadas) && (e.Status?.toUpperCase() == this.status)
      })
   }
}