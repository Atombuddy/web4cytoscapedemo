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

class Cyndex2{
    async importNetwork(username, password,button) {
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
      
    async currentNetworkSummary(button) {
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
    async exportNetwork(username, password,button) {
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

    async openSample(button) {
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


}



const cyndex=new Cyndex2()



