const ndexServerUrl = 'http://ndexbio.org/v2';
const ndex = new ndexClient.NDEx(ndexServerUrl);
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
  element.innerHTML="Success"
}
function failureButton(element){
  element.className="btn btn-danger"
  element.innerHTML="Failed"
}
function download(url){
  var a=document.createElement("a")
  a.href=url
  a.setAttribute("download","")
  downloadButton=document.createElement("button")
  downloadButton.innerHTML="Download"
  downloadButton.className="btn btn-primary"
  a.appendChild(downloadButton)
  var getEle=document.getElementById("image")
  getEle.appendChild(a)
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
      if(json.numFound==0){
          console.log("No Network Found.Try Again")
          failureButton(button)
      }
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

class Cyndex2{
    async importNetwork(username, password,button) {
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
        console.log(network_SUID)
      }
      
    async updateNetwork(username, password,button) {
        const params = {
          serverUrl: ndexServerUrl,
          username: username,
          password: password
          //metadata: metadata
        }

        const updateNetworkUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/current'

        const response = await fetch(updateNetworkUrl, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        const json = await response.json();
        successButton(button)
      }

    async currentNetworkSummary(button) {
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
      console.log("inside export",network_SUID)
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

    async importFromcyRest(button){
      const params = {
        serverUrl: ndexServerUrl,
        uuid: NETWORK_UUID,
        username: username,
        password: password
      }

      const importFromcyRestUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/cx'

      const response = await fetch(importFromcyRestUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      const json = await response.json();
      successButton(button)
      //console.log('Response JSON: ' + JSON.stringify(json))
    }

}

/* network image import*/
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
  //2497
  const imageURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".png"
  var node=document.getElementById("image")
  //node.innerHTML="<img src='"+imageURL+"' alt='network image'>"
  download(imageURL)
  successButton(button)
  console.log(imageURL)
}

async  getPdf(button){
  const pdfURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/views/"+network_view_SUID+".pdf"
  successButton(button)
  console.log(pdfURL)
}
}

/* Tables */
class Tables{
async getCsv(button){
  const CsvURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+".csv"
  const response=await fetch(CsvURL,{
    method:"GET",
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json'
    },
  });
  const json=await response.json()
  console.log(json)
  successButton(button)
}


async getRows(button){
  const rowsURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows"
  const response=await fetch(rowsURL,{
    method:"GET",
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json'
    },
  });
  const json=await response.json()
  console.log(json)
  successButton(button)
}

async getColumns(button){
  const columnsURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/columns"
  const response=await fetch(columnsURL,{
    method:"GET",
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json'
    },
  });
  const json=await response.json()
  console.log(json)
  successButton(button)
}

async getValue(button){
  primaryKey=network_SUID
  columnName="annotator"
  const valueURL=CYREST_BASE_URL+"/v1/networks/"+network_SUID+"/tables/"+tableType+"/rows/"+primaryKey+"/"+columnName
  const response=await fetch(valueURL,{
    method:"GET",
    headers:{
      Accept:'application/json',
      'Content-Type':'application/json'
    },
  });
  const json=await response.json()
  console.log(json)
  successButton(button)
}
}

/* Layout */
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
        selectElement.appendChild(option)
      }
      var sel=document.getElementById("layoutName")
      console.log(sel)
      console.log(sel.value)
      

    }

    async getInfoLayout(button,layoutname){

        const infoURL=CYREST_BASE_URL+"/v1/apply/layouts/"+layoutname
        const response=await fetch(infoURL,{
          method:"GET",
        });
        const json=await response.json()
        console.log(json)
    }

    async applyLayout(layout) {
      const applyLayoutURL =CYREST_BASE_URL + '/v1/apply/layouts/' + encodeURI(layout) + '/' + network_SUID;
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
}

/* Visual Styles */
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
    }
}

/* analyze */
async function analyze(value,button){
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
  console.log(json)
  //console.log('Response JSON: ' + JSON.stringify(json))
}

/* plot */

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
const cyndex=new Cyndex2()
const layout=new Layout()
const tables=new Tables()
const networkview=new NetworkView()
const visualstyle=new VisualStyles()