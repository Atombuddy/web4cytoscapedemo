class Layout{

    async getAllLayout(button){
      const getListUrl=CYREST_BASE_URL+"/v1/apply/layouts"
      const response=await fetch(getListUrl,{
        method:"GET",
      });
      const json=await response.json()

      document.getElementById("layoutButton").remove()
      var selectElement=document.createElement("select")
      selectElement.name="layout"
      selectElement.id="layoutName"
      var element=document.getElementById("dropDownList")
      element.appendChild(selectElement)
      for(var i=0;i<json.length;i++){
        var option=document.createElement("option")
        option.innerHTML=json[i]
        option.value=json[i]
        option.defaultSelected=false
        selectElement.appendChild(option)
      }
      

    }

    async getInfoLayout(button){
        const select=document.getElementById("layoutName")
        if(select==null){
          console.log("Layout Name is required.Choose a Layout from 'Get Available Layouts'")
          return
        }
        const layoutname=select.options[select.selectedIndex].value
        const infoURL=CYREST_BASE_URL+"/v1/apply/layouts/"+layoutname
        const response=await fetch(infoURL,{
          method:"GET",
        });
        const json=await response.json()
        successButton(button)
        console.log(json)
    }

    async applyLayout(button) {
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
      const select=document.getElementById("layoutName")
      if(select==null){
          console.log("Layout Name is required.Choose a Layout from 'Get Available Layouts'")
          return
      }
      const layout=select.options[select.selectedIndex].value
      const applyLayoutURL =CYREST_BASE_URL + '/v1/apply/layouts/' + layout+ '/' + network_SUID;
      await fetch(applyLayoutURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      successButton(button)
    }
}


const layout=new Layout()