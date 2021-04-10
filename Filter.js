class Filter{
    async create(button){
        const params = {
            "json":'{ "id" : "DegreeFilter", "parameters" : { "criterion" : [0,7], "edgeType" : "ANY", "predicate" : "BETWEEN"} }',
            "name":"testfliter"               
          }
  
          const createUrl =CYREST_BASE_URL + '/v1/commands/filter/create'
  
          const response = await fetch(createUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          });
          const json = await response.json();
          successButton(button)
          console.log("Created 'Default filter'")
        }
        
    async apply(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
          const params = {
              "network":"CURRENT",
              "name":"Default filter"               
            }
    
            const applyUrl =CYREST_BASE_URL + '/v1/commands/filter/apply'
    
            const response = await fetch(applyUrl, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params)
            });
            const json = await response.json();
            successButton(button)
            console.log("Applied 'Default filter'")
   }     

    async delete(button){
        const params = {
            "name":"Default filter"               
          }
      
        const deleteUrl =CYREST_BASE_URL + '/v1/commands/filter/delete'
      
        const response = await fetch(deleteUrl, {
              method: 'POST',
              headers: {
              Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params)
          });
          const json = await response.json();
          successButton(button)
          console.log("Deleted 'Default filter'")
}
     

    async import(button){
      if(document.getElementById("myFile").value==""){
        console.log("Enter a valid Path")
        return
      }
      
      const inputValue = document.getElementById('myFile').value
      const filePath = encodeURIComponent(inputValue).replace(/'/g,"%27").replace(/"/g,"%22");	
      const importUrl =CYREST_BASE_URL + '/v1/commands/filter/import'+"?"+"file="+filePath
      const response = await fetch(importUrl, {
            method: 'GET',
            headers: {
              Accept: 'text/plain',
              'Content-Type': 'text/plain'
            },
            });
            successButton(button)
            console.log("Imported")
          }
                                      
}


var filter=new Filter()