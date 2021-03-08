class NetworkView{
    async  networkView(){
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
      console.log(network_view_SUID)
    }
    
    async getImage(button){
      var imageURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".png"
      const response=await fetch(imageURL,{
        method:"GET",
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
      });
      const json=await response.json()
      console.log(json)
      /*var node=document.getElementById("image")
      node.setAttribute("href",imageURL)
      node.setAttribute("download","")
      document.getElementById("image").click()*/
      successButton(button)
    }
    
    async  getPdf(button){
      var pdfURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".pdf"
      node.setAttribute("href",pdfURL)
      node.setAttribute("download","")
      document.getElementById("pdf").click()
      successButton(button)
    }
}
    
const networkview=new NetworkView()    