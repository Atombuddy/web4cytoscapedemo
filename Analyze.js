async function analyze(value,button){
  if(await getCount() && await getCurrent()){

  }
  else{
    return
  }
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
    console.log("Completed Analyzing")
    successButton(button)
  
}