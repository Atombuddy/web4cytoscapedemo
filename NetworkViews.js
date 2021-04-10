class NetworkView{
    async  networkView(){
      if(await local() && await getCount() && await getCurrent()){

      }
      else{
        return
      }
      const networkViewURL=CYREST_BASE_URL+"/v1/networks/views/currentNetworkView"
    
      const response=await fetch(networkViewURL,{
        method:"GET",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
      });
      const json=await response.json()
      network_view_SUID= json.data.networkViewSUID
      console.log("nework view SUID",network_view_SUID)
    }
    
    async getImage(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        if(network_view_SUID==undefined){
          console.log("Network view ID is required.Click on 'Get Network View' and Try again")
          return
        }
      const imageURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".png"
  
      await fetch(imageURL,{
        method:"GET",
      });
      const imagele=document.getElementById("image")
      imagele.setAttribute("href",imageURL)
      imagele.setAttribute("download","")
      imagele.setAttribute("target","_blank")
      document.getElementById("image").click()
      successButton(button)
    }
    async  getPdf(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        if(network_view_SUID==undefined){
          console.log("Network view ID is required.Click on 'Get Network View' and Try again")
          return
        }
      const pdfURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".pdf"
      await fetch(pdfURL,{
        method:"GET",
      });
      const pdfele=document.getElementById("pdf")
      pdfele.setAttribute("href",pdfURL)
      pdfele.setAttribute("download","")
      pdfele.setAttribute("target","_blank")
      document.getElementById("pdf").click()
      successButton(button)
    }
  }
    
const networkview=new NetworkView()    