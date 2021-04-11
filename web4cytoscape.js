const ndexServerUrl = 'http://ndexbio.org/v2';
const ndex = new ndexClient.NDEx(ndexServerUrl);
var NETWORK_UUID =undefined

const tableType="defaultnode"

var network_SUID = undefined;


var new_network_UUID = undefined;

var network_view_SUID=undefined;

const CYREST_BASE_URL = 'http://127.0.0.1:1234';
const ndex_url="http://www.ndexbio.org/v2";

function successButton(element) {
  element.className="btn btn-success"
  element.innerHTML="Success"
}
function failureButton(element){
  element.className="btn btn-danger"
  element.innerHTML="Failed"
}


async function getCurrent(){
    const geturl=CYREST_BASE_URL +"/v1/networks/currentNetwork"
    try{
          const response=await fetch(geturl,{
          method:"GET",
          headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          })
          if(response.status>=200 && response.status<=299){
          const json=await response.json()
          network_SUID=json["data"]["networkSUID"]
          return true
      }
    else{
      throw "No Network Selected.Select a Network in the Cytoscape App"
    }}
    catch(err){
      console.log(err)
      return false
    }}
  
  
async function getCount(){
    const getcounturl=CYREST_BASE_URL +"/v1/networks/count"
    const response=await fetch(getcounturl,{
      method:"GET",
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      }
    )
    const json=await response.json()
    if(json["count"]==0){
      console.log("No Networks Found.Import a network")
      return false
    }
    else{
      return true
    }
    
  }
  
async function getSuid(button){
    if(await getCount()){
      await getCurrent()
      console.log("Network SUID",network_SUID)
      successButton(button)
    }
}

async function searchNetwork(text){
        if(text==""){
          console.log("Enter a Network Name")
          return
        }
        const d=document.getElementById("searchdiv")
        const rem=document.getElementById("searchbox")
        d.removeChild(rem)
        var searchArray=[]
        const searchURL=ndex_url+"/search/network" //Search network by name
  
        const parameter={
          "searchString":text //text is the input network name
        }
  
        const response=await fetch(searchURL,{
          method:"POST",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(parameter)
        });
  
        const json=await response.json() //returned JSON with names and Id's
  
        if(json.numFound==0) //if no networks found for the provided name
        {
            console.log("No Network(s) Found.Try Again")
            return
        }
  
        for(i=0;i<json.networks.length;i++)//Add each names  to searchArray list
        {
          searchArray.push([json.networks[i].name,json.networks[i].externalId])
        }
        var selectElement=document.createElement("select")
        selectElement.setAttribute("id","selectele")
        var option=document.createElement("option")
        option.setAttribute("disabled","")
        option.setAttribute("hidden","")
        option.setAttribute("selected","")
        option.innerHTML="Select a Network"
        selectElement.appendChild(option)
  
        for(i=0;i<searchArray.length;i++){
            var option=document.createElement("option")
            option.innerHTML=searchArray[i][0]
            option.value=searchArray[i][1]
            option.defaultSelected=false
            selectElement.appendChild(option)
        }
  
        document.getElementById("searchResults").appendChild(selectElement)
  
        elementButton=document.createElement("button")
        elementButton.setAttribute("type","button")
        elementButton.setAttribute("class","btn-md btn-primary")
        elementButton.setAttribute("onclick","getUUID(this)")
        elementButton.innerHTML="Get UUID"
        document.getElementById("searchResults").appendChild(elementButton)
    }
  
  
async function getUUID(button){
    const select=document.getElementById("selectele")
    if(select.selectedIndex==null){
      console.log("Please Select a Value")
    }
    else{
      NETWORK_UUID=select.options[select.selectedIndex].value
  
      console.log("Network UUID",NETWORK_UUID)
    }
    
  }

/*Cyndex2*/  
async function importNetwork(username, password,button) {
    if(NETWORK_UUID==undefined){
      console.log("Search the network from the above Search box and Try again")
      return
    }
    const params = {
      serverUrl: ndexServerUrl,
      uuid: NETWORK_UUID,
      username: username,
      password: password
      //accessKey:key,
      //idToken:id

    }

    const importNetworkUrl =CYREST_BASE_URL + '/cyndex2/v1/networks'

    const response = await fetch(importNetworkUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const json = await response.json();
    network_SUID = json.data.suid;
    successButton(button)
    console.log("network SUID",network_SUID)

    const parameters = {
      "networkSUID": network_SUID,
     
    }
    const seturl=CYREST_BASE_URL +"/v1/networks/currentNetwork"
    const setresponse=await fetch(seturl,{
      method:"PUT",
      headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parameters)
      }
    );
    
  }
  
async function currentNetworkSummary(button) {
  if(await getCount() && await getCurrent()){

  }
  else{
    return
  }
  const currentUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/current'

  const response = await fetch(currentUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    console.log(json)
    successButton(button)
}

async function exportNetwork(username, password,button) {
  if(await getCount() && await getCurrent()){

  }
  else{
    return
  }
  const params = {
    serverUrl: ndexServerUrl,
    username: username,
    password: password,
    isPublic: false
  };

  const exportNetworkUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/' + network_SUID;

  const response = await fetch(exportNetworkUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });
  const json = await response.json();
  new_network_UUID = json.data.uuid;
  successButton(button)
}

async function openSample(button) {
   const path=document.getElementById("mySampleFile").value
   var filepath=""
   if(path==""){
      filepath='sampleData/sessions/Yeast Perturbation.cys'
   }
   else{
     filepath=path
   }
  const finalfilepath=encodeURIComponent(filepath).replace(/'/g,"%27").replace(/"/g,"%22");	
  const pathUrl =CYREST_BASE_URL + '/v1/session'+'?'+'file='+finalfilepath

  const response = await fetch(pathUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    successButton(button)
}

/*Network View */
async  function networkView(){
    if(await getCount() && await getCurrent()){

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
  
async function getImage(button){
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

async function  getPdf(button){
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

 /*Layouts*/ 
 async function getAllLayout(button){
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

async function getInfoLayout(button){
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

async function applyLayout(button) {
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

/*Visual Style*/ 
async function getVisualList(button){
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

async function getCurrentVisual(button){
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

async function apply(button){
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
/*Analyze */
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

/*Plot */  
async function histPlot(button){
    if(await getCount() && await getCurrent()){

    }
    else{
      return
    }
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
        successButton(button)
    
  }
async function scatterPlot(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
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
    }