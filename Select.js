var node_suid=undefined
var subnetwork_SUID=undefined
var allNodes=[]
var differenceNodes=[]
var nodeName=undefined
class Select{

    async getAllNodes(){
      const getnodesURL =CYREST_BASE_URL + "/v1/networks/"+network_SUID+"/nodes"

      const response = await fetch(getnodesURL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
        var json = await response.json();

        json.forEach(item=>{
            allNodes.push(item)
        })

    }

    async getNode(){
        if(document.getElementById("nodename")!=null){
          var nodeval=document.getElementById("nodename").value
          nodeName=nodeval
        }
        const currentSelected=await this.getSelected()
        if(currentSelected.length!=0){
          return true
        }
        const params = {
            "network": "current",
            "node":nodeName

          };
          const getNodeUrl =CYREST_BASE_URL +"/v1/commands/node/get";
          var response = await fetch(getNodeUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          });
          const json = await response.json();
          if(Object.keys(json["data"]).length==0){
              console.log("No Node with the given name.Try Again")
              return false
          }
          node_suid=json["data"].node
          await this.setSelected([node_suid])  
          return true

        }

    async getSelected(){
      const getSelectedURL =CYREST_BASE_URL + "/v1/networks/"+network_SUID+"/nodes/selected"

      const response = await fetch(getSelectedURL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
        var json = await response.json();
        return json
      
    }


    async setSelected(arr){
      const selectUrl =CYREST_BASE_URL + "/v1/networks/"+network_SUID+"/nodes/selected"
      const response = await fetch(selectUrl, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(arr)
        });
        
    }

    async allNeighbors(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        if(document.getElementById("nodename")!=null){
          if(document.getElementById("nodename").value==""){
            console.log("Node name is required.Enter a node name")
            return
          }
          if(!await this.getNode()){
            return
          }
      }
        var selectedNodes= await this.getSelected()
        const getAllUrl =CYREST_BASE_URL + "/v1/networks/"+network_SUID+"/nodes/selected/neighbors"

        const response = await fetch(getAllUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
      
          },
          });
          var json = await response.json();

          json.forEach(element => {
            selectedNodes.push(element)  
          });
          this.setSelected(selectedNodes)
          var nodebutton=document.getElementById("nodename")
          if(nodebutton==null){
            console.log("Selected")
            return
          }
          else{
            nodebutton.remove()
            button.innerHTML="Select again"
            console.log("Selected")
          }
  
}
    async invert(button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        await this.getAllNodes()
        var selectedNodes=[]
        const jsonReturned=await this.getSelected()

        jsonReturned.forEach(item=>{
          selectedNodes.push(item)
        })
        differenceNodes=allNodes.filter(function(item) {
          return selectedNodes.indexOf(item)<0
        })
        await this.setSelected(differenceNodes)
        console.log("Inverted")
        
    }

    async subNetwork(title,button){
      if(await getCount() && await getCurrent()){

      }
      else{
        return
      }
        if(title==""){
          console.log("Enter a Valid Name")
          return
        }
        await getCurrent()
        const subnetworkURL =CYREST_BASE_URL +"/v1/networks/"+network_SUID+"?title="+title;
        var response = await fetch(subnetworkURL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
        const json = await response.json();
        subnetwork_SUID=json["networkSUID"]
        successButton(button)
        console.log("Created")
      
    }
  }


const select=new Select()