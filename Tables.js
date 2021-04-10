class Tables{
    async getCsv(button){
      const CsvURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+".csv"
      await fetch(CsvURL,{
        method:"GET",
      });
      const csvele=document.getElementById("getcsv")
      csvele.setAttribute("href",CsvURL)
      csvele.setAttribute("download","")
      csvele.setAttribute("target","_blank")
      document.getElementById("getcsv").click()
      successButton(button)
    }
    
    
    async getRows(button){
      const rowsURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows"
      const response=await fetch(rowsURL,{
        method:"GET",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
      });
      const json=await response.json()
      console.log(json)
      successButton(button)
    }
    
    async getColumns(button){
      const columnsURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/columns"
      const response=await fetch(columnsURL,{
        method:"GET",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
      });
      const json=await response.json()
      console.log(json)
      successButton(button)
    }
    
    async getValue(button){
      const primaryKey=network_SUID
      const columnName="annotator"
      const valueURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows/"+primaryKey+"/"+columnName
      const response=await fetch(valueURL,{
        method:"GET",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
      });
      const json=await response.json()
      console.log(json)
      successButton(button)
    }
}
    
const tables=new Tables()    