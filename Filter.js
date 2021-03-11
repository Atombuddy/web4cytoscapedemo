//import java.io.file


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
          console.log("Created")
        }
        
    async apply(button){
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
            console.log("Applied")
          }
    
    
    async delete(button){
        const params = {
            "name":"testfilter"               
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
          console.log("Deleted")
}
    

    async import(button){
      if(document.getElementById("myFile").value==""){
        console.log("Enter a valid Path")
        return

      }
      
      var obj = document.getElementById('myFile');
	    var unencoded = obj.value;
	    var result = encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");	
      const importUrl =CYREST_BASE_URL + '/v1/commands/filter/import'+"?"+"file="+result
    
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