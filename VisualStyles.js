class VisualStyles{
    async getVisualList(button){
      const listURL=CYREST_BASE_URL+"/v1/styles"
      const response = await fetch(listURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      console.log('Response JSON: ' + JSON.stringify(json));
      successButton(button)
    }
    async getCurrentVisual(button){
      const listURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+"/currentStyle"
      const response = await fetch(listURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      console.log('Response JSON: ' + JSON.stringify(json));
      successButton(button)
    }

    async apply(stylename,button){
      const listURL=CYREST_BASE_URL+"/v1/apply/styles/"+stylename+"/"+network_SUID
      const response = await fetch(listURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      successButton(button)
    
    }
}

const visualstyle=new VisualStyles()
