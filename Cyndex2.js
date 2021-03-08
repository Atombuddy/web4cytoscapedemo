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

async function displayNDExCX(uuid, element) {
  ndex.getRawNetwork(uuid).then((cx) => { displayCX(cx, element); });
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
    console.log("Network UUID",value)
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
        console.log(network_SUID)
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



