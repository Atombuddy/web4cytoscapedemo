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


async function searchNetwork(text,button){
      if(text==""){
        console.log("Enter a name")
        return
      }

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
          return
      }
      document.getElementById("searchdiv").removeChild(document.getElementById("searchbox"))
      for(i=0;i<json.networks.length;i++){
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
    console.log("Please select a Value")
  }
  else{
    NETWORK_UUID=select.options[select.selectedIndex].value
    successButton(button)
    console.log("Network UUID",NETWORK_UUID)
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
    console.log(json)
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
        console.log("network SUID",network_SUID)
      }
      
    async updateNetwork(username, password,button) {
        const params = {
          serverUrl: ndexServerUrl,
          username: username,
          password: password
          //metadata: metadata
        }

        const updateNetworkUrl =CYREST_BASE_URL + '/cyndex2/v1/networks/'+network_SUID

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

}



const cyndex=new Cyndex2()



