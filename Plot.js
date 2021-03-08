class Plot{
    async histPlot(button){
          const params={
            xcolumn:"string"
          }
          const plotUrl =CYREST_BASE_URL + "/v1/commands/cychart/histogram"

          const response = await fetch(plotUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(params)
          });
          const json = await response.json();
          console.log(json)
          successButton(button)
      }

      async scatterPlot(button){
        const params={
          x:"string",
          y:"string"
        }
        const plotUrl =
          CYREST_BASE_URL + "/v1/commands/cychart/scatter"

        const response = await fetch(plotUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(params) 
        });
        const json = await response.json();
        successButton(button)
        console.log(json)
      }
}

const plot=new Plot()