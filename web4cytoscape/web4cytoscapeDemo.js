const ndexServerUrl = 'https://ndexbio.org/v2';
const ndex = new ndexClient.NDEx(ndexServerUrl);
//0db1f2dc-103f-11e8-b939-0ac135e8bacf
//b1e9a489-bbe7-11ea-aaef-0ac135e8bacf
var NETWORK_UUID =undefined
const STYLE_NETWORK_UUID = 'b1c1aa27-bbe7-11ea-aaef-0ac135e8bacf'
const tableType="defaultnode"

var network_SUID = undefined;
var style_network_SUID = undefined;

var new_network_UUID = undefined;

var network_view_SUID=undefined;

const CYREST_BASE_URL = 'http://127.0.0.1:1234';
const ndex_url="http://www.ndexbio.org/v2";

function successButton(element) {
  element.className="btn btn-success"
}
function failureButton(element){
  element.className="btn btn-danger"
}

async function searchNetwork(text,button){
    var searchArray=[]
    const searchURL=ndex_url+"/search/network"
    const data={
      "searchString":text
    }
    const response=await fetch(searchURL,{
      method:"POST",
      headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    });
    const json=await response.json()
    for(i=0;i<json.numFound;i++){
      searchArray.push([json.networks[i].name,json.networks[i].externalId])
    }
    for(i=0;i<searchArray.length;i++){
          elementInput=document.createElement("input")
          elementLabel=document.createElement("label")
          newline=document.createElement("br")
          elementInput.setAttribute("type","radio")
          elementInput.setAttribute("name",searchArray[i][0])
          elementInput.setAttribute("value",searchArray[i][1])
          

          elementLabel.setAttribute("for",searchArray[i][0])
          elementLabel.innerHTML=searchArray[i][0]
          
          document.getElementById("searchResults").appendChild(elementInput) 
          document.getElementById("searchResults").appendChild(elementLabel)         
          document.getElementById("searchResults").appendChild(newline)
    }
    elementButton=document.createElement("button")
    elementButton.setAttribute("type","button")
    elementButton.setAttribute("class","btn btn-primary")
    elementButton.setAttribute("onclick","getUUID(this)")
    elementButton.innerHTML="Get UUID"
    document.getElementById("searchResults").appendChild(elementButton)
    

}
async function getUUID(button){
  var radio=document.querySelectorAll('input[type="radio"]:checked')
  var value=radio.length>0? radio[0].value:null
  if(value===null){
    console.log("Please select a Value")
  }
  else{
    elementButton.innerHTML="Success"
    NETWORK_UUID=value
    successButton(button)
    console.log(value)
  }
  
}
async function getinfo(button){
  const infoUrl =CYREST_BASE_URL + '/cyndex2/v1'

  const response = await fetch(infoUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    console.log(json.data.appVersion)
    console.log('Responeded JSON: ' + JSON.stringify(json))
    console.log(response.status)
    successButton(button)
      
}
async function getNetworkSummary(uuid, button) {

    ndex.getNetworkSummary(uuid).then((response) => {
      console.log(JSON.stringify(response, null, 2))
      successButton(button)
    });
  }

async function importNetwork(username, password) {

    const cyRESTParams = {
      serverUrl: ndexServerUrl.replace('https', 'http'),
      uuid: NETWORK_UUID,
      username: username,
      password: password

    }

    const importNetworkUrl =
      CYREST_BASE_URL + '/cyndex2/v1/networks'

    const response = await fetch(importNetworkUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cyRESTParams)
    });
    const json = await response.json();
    //console.log('Response JSON: ' + JSON.stringify(json))
    network_SUID = json.data.suid;
    console.log(network_SUID)
  }

async function updateNetwork(username, password) {

    const cyRESTParams = {
      serverUrl: ndexServerUrl.replace('https', 'http'),
      uuid: NETWORK_UUID,
      username: username,
      password: password
    }

    const updateNetworkUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/current'

    const response = await fetch(updateNetworkUrl, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cyRESTParams)
    });
    const json = await response.json();
    console.log('Response JSON: ' + JSON.stringify(json))
  }

async function currentNetworkSummary() {
  const currentUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/current'

  const response = await fetch(currentUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    console.log('Responeded JSON: ' + JSON.stringify(json))
}

async function exportNetwork(username, password) {
  console.log("newr",network_SUID)
  const cyRESTParams = {
    serverUrl: ndexServerUrl.replace('https', 'http'),
    username: username,
    password: password,
    isPublic: false
  };

  const exportNetworkUrl =
    CYREST_BASE_URL + '/cyndex2/v1/networks/' + network_SUID;

  const response = await fetch(exportNetworkUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cyRESTParams)
  });
  const json = await response.json();
  //console.log('Response JSON: ' + JSON.stringify(json));
  new_network_UUID = json.data.uuid;
  successButton(button)
}

async function updateNetworkEntry(username,password){
  const cyRESTParams = {
    serverUrl: ndexServerUrl.replace('https', 'http'),
    uuid: NETWORK_UUID,
    username: username,
    password: password
  }

  const updateNetworkEntryUrl =
    CYREST_BASE_URL + '/cyndex2/v1/networks/'+network_SUID

  const response = await fetch(updateNetworkEntryUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cyRESTParams)
  });
  const json = await response.json();
  //console.log('Response JSON: ' + JSON.stringify(json))
}

async function importFromcyRest(){
  const cyRESTParams = {
    serverUrl: ndexServerUrl.replace('https', 'http'),
    uuid: NETWORK_UUID,
    username: username,
    password: password
  }

  const importFromcyRestUrl =
    CYREST_BASE_URL + '/cyndex2/v1/networks/cx'

  const response = await fetch(importFromcyRestUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cyRESTParams)
  });
  const json = await response.json();
  //console.log('Response JSON: ' + JSON.stringify(json))
}


/* network image import*/

async function networkView(){
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

async function getImage(button){
  console.log(network_SUID,network_view_SUID)
  const imageURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".png"
  var node=document.getElementById("image")
  node.innerHTML="<img src='"+imageURL+"' alt='network image'>"
  successButton(button)
  console.log(imageURL)
}

async function getPdf(button){
  const pdfURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".pdf"
  successButton(button)
  console.log(pdfURL)
}

async function getCsv(button){
  const CsvURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+".csv"
  successButton(button)
}


async function getRows(button){
  const rows=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows"
  successButton(button)
  console.log(rows)
}

async function getColumns(button){
  const columns=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/columns"
  successButton(button)
  console.log(columns)
}

async function getValue(button){
  primaryKey=network_SUID
  columnName="annotator"
  const value=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows/"+primaryKey+"/"+columnName
  console.log(value)
}

async function applyLayout(layout) {

  const applyLayoutURL =
    CYREST_BASE_URL + '/v1/apply/layouts/' + encodeURI(layout) + '/' + network_SUID;
  console.log('Calling CyREST POST:', applyLayoutURL)

  const response = await fetch(applyLayoutURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });
  const json = await response.json();
  console.log('Response JSON: ' + JSON.stringify(json));
}

async function getVisualList(){
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
}
async function getCurrentVisual(){
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
}

async function show(){
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
}