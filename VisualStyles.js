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
      const json=await response.json()
      
      document.getElementById("visualbutton").remove()
      var selectElement=document.createElement("select")
      selectElement.name="layout"
      selectElement.id="visualselect"
      var element=document.getElementById("visualList")
      element.appendChild(selectElement)
      for(var i=0;i<json.length;i++){
        var option=document.createElement("option")
        option.innerHTML=json[i]
        option.value=json[i]
        option.defaultSelected=false
        selectElement.appendChild(option)
      }
      successButton(button)
    }

    async getCurrentVisual(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        if(network_view_SUID==undefined){
          console.log("Network view ID is required.Click on 'Get Network View' and Try again")
          return
        }
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

    async apply(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
      const select=document.getElementById("visualselect")
      if(select==null){
        console.log("Style name is required.Choose a Style by clicking on 'Get Styles'")
        return
      }
      const stylename=select.options[select.selectedIndex].value  
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
