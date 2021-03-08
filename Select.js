var node_suid=undefined
var subnetwork_SUID=undefined
class Select{
    async getNode(button){
        var nodeval=document.getElementById("nodename").value
        if (nodeval==null){
          console.log("Please provide the name of the Node")
          return 
        }
        const params = {
            "network": "current",
            "node":nodeval

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
          node_suid=json["data"].node

          
          await this.setSelected([node_suid])  
          

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
        if(node_suid==undefined){
            await this.getNode()
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
            return
          }
          else{
            nodebutton.remove()
            button.innerHTML="Select again"
          }
  }


    async subNetwork(title,button){
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
      
    }

}


const select=new Select()