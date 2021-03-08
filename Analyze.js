async function analyze(value,button){
    const cyRESTParams = {
        directed:value
    }
  
    const analyzeUrl =CYREST_BASE_URL + "/v1/commands/analyzer/analyze"
  
    const response = await fetch(analyzeUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cyRESTParams)
    });
    const json = await response.json();
    console.log(json)
    //console.log('Response JSON: ' + JSON.stringify(json))
  }
  