var networkLength=0
var networkcycleIndex=0
var nodecycleIndex=0
var edgecycleIndex=0

var nodeMap=[]
var edgeMap=[]
var networkMap=[]
var Operation=undefined
var networkName=undefined
var sources=new Set()

var dataType=["String","List&ltString&gt","Boolean","Double"]

class Merge{


    async Helper(type,suid,name){
            const params = {
                "network": "SUID:"+suid
            }
            if(type=="keynode" || type=="keyedge" || type=="nodemap"){
                var URL =CYREST_BASE_URL +"/v1/commands/node/list attributes";
            }
            else if(type=="edgemap"){
                var URL =CYREST_BASE_URL +"/v1/commands/edge/list attributes";
            }
            else if(type=="networkmap"){
                var URL =CYREST_BASE_URL +"/v1/commands/network/list attributes";
            }

            var response = await fetch(URL, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            const json = await response.json();

            var selectElement=document.createElement("select")
            selectElement.name=name
            selectElement.id=networkLength
            
            if(type=="keynode"){
                var element=document.getElementById("finalNodeCol")
                selectElement.setAttribute("onchange","merge.Keys('node',this.id,this)")
            }
            else if(type=="keyedge"){
                var element=document.getElementById("finalEdgeCol")
                selectElement.setAttribute("onchange","merge.Keys('edge',this.id,this)")
            }    
            else if(type=="nodemap"){
                var element=document.getElementById("finalNodemapCol")
                selectElement.setAttribute("onchange","merge.MergeMap('node',this.id,this)")
            }
            else if(type=="edgemap"){
                var element=document.getElementById("finalEdgemapCol")
                selectElement.setAttribute("onchange","merge.MergeMap('edge',this.id,this)")
            }
            else if(type=="networkmap"){
                var element=document.getElementById("finalNetmapCol")
                selectElement.setAttribute("onchange","merge.MergeMap('network',this.id,this)")
            }


            var option=document.createElement("option")
            option.setAttribute("disabled","")
            option.setAttribute("hidden","")
            option.setAttribute("selected","")
            option.innerHTML=name
            selectElement.appendChild(option)

            for(var i=1;i<json["data"].length;i++){
                var option=document.createElement("option")

                option.innerHTML=json["data"][i]
                option.value=json["data"][i]
                option.defaultSelected=false
                selectElement.appendChild(option)
            }    
            element.appendChild(selectElement)
                      
}

    
    async availableNetworks(){
        const availableUrl =CYREST_BASE_URL +"/v1/networks.names";
        var response = await fetch(availableUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'

            },
          });
          const json = await response.json();
          var element=document.getElementById("availablenetworks")
          for(var i=0;i<json.length;i++){
            var option=document.createElement("option")
            option.innerHTML=json[i]["name"]
            option.value=json[i]["SUID"]
            element.appendChild(option)
          }     
          element.removeAttribute("onclick")  
          element.setAttribute("onchange","merge.main(this)")


    }

    async FinalResult(){
        
        globalThis.nodeKeys=Array(networkLength).fill(0)
        globalThis.edgeKeys=Array(networkLength).fill(0)
        networkMap.push(Array(networkLength+2).fill(0))
        nodeMap.push(Array(networkLength+2).fill(0))
        edgeMap.push(Array(networkLength+2).fill(0))
        var mergeCol=undefined
        function lastTwocol(type){
            if(type=="inputnode" || type=="inputedge" || type=="inputnet"){
                var Element=document.createElement("input")
            }
            else{
                var Element=document.createElement("select")
            }   
            Element.id=networkLength
            
            if(type=="inputnode" || type=="nodemapdatatype"){
                var element=document.getElementById("finalNodemapCol")
                if(type=="inputnode"){
                    Element.setAttribute("onchange","merge.MergeMap('inputnode',this.id,this)")
                    Element.setAttribute("placeholder","Merged Node Column Name")
                    Element.setAttribute("size","22")
                }
                else{
                    Element.setAttribute("onchange","merge.MergeMap('node',this.id,this)")
                }
                if(type=="nodemapdatatype"){
                    mergeCol=dataType
                }
            }
            else if(type=="inputedge" || type=="edgemapdatatype"){
                var element=document.getElementById("finalEdgemapCol")
                if(type=="inputedge"){
                    Element.setAttribute("onchange","merge.MergeMap('inputedge',this.id,this)")
                    Element.setAttribute("placeholder","Merged Edge Column Name")
                    Element.setAttribute("size","22")
                }
                else{
                    Element.setAttribute("onchange","merge.MergeMap('edge',this.id,this)")
                }

                if(type=="edgemapdatatype"){
                    mergeCol=dataType
                }
            }
            else if(type=="inputnet" || type=="networkdatatype"){
                var element=document.getElementById("finalNetmapCol")
                if(type=="inputnet"){
                    Element.setAttribute("onchange","merge.MergeMap('inputnet',this.id,this)")
                    Element.setAttribute("placeholder","Merged Network Column Name")
                    Element.setAttribute("size","25")
                }
                else{
                    Element.setAttribute("onchange","merge.MergeMap('network',this.id,this)")
                }
                if(type=="networkdatatype"){
                    mergeCol=dataType
                }
            }


            var option=document.createElement("option")
            option.setAttribute("disabled","")
            option.setAttribute("hidden","")
            option.setAttribute("selected","")

            if(type=="inputnode" || type=="inputedge" || type=="inputnet"){
                option.innerHTML="Merged Coulmn Name"

            }
            else{
                option.innerHTML="Merged Column Datatype"
            }
            Element.appendChild(option)

            if(type!="inputnode" && type!="inputedge" && type!="inputnet"){
                mergeCol.forEach(item=>{
                    var option=document.createElement("option")

                    option.innerHTML=item

                    option.value=item
                    option.defaultSelected=false
                    Element.appendChild(option)
                })}
            element.appendChild(Element)            
    
        }

        lastTwocol("inputnet")
        lastTwocol("inputnode")
        lastTwocol("inputedge")
        networkLength+=1
        lastTwocol("nodemapdatatype")
        lastTwocol("edgemapdatatype")
        lastTwocol("networkdatatype")
    }

    async Merge(){
        if(await getCount() && await getCurrent()){

        }
        else{
          return
        }
        const finalEdgeKeys=String(edgeKeys)
        const finalNodeKeys=String(edgeKeys)
        var finalNetworkmap=""
        var finalNodemap=""
        var finalEdgemap=""
        var setlength=0
        var finalSources=""
        const selectsame=document.getElementById("samenet")
        const sameNet=selectsame.options[selectsame.selectedIndex].value
        const selectnodesonly=document.getElementById("nodesonly") 
        const nodesonly=selectnodesonly.options[selectnodesonly.selectedIndex].value
        
        sources.forEach(item=>{
            setlength+=1
            finalSources+=String(item)
            if(sources.length!=setlength){
                finalSources+=","
            }
        })
        
        function finalMap(mapname,finalmap){
            for(var i=0;i<mapname.length;i++){
                finalmap+="{"
                for(var j=0;j<mapname[0].length;j++){
                    finalmap+=String(mapname[i][j]).replace("&lt;","<").replace("&gt;",">")
                    if(j!=mapname[0].length-1){
                        finalmap+=","
                    }
                }
                if(i==mapname.length-1){
                    finalmap+="}"
                }
                else{
                    finalmap+="},"
                }
            }
            return finalmap
        }

        finalNetworkmap=finalMap(networkMap,finalNetworkmap)
        finalNodemap=finalMap(nodeMap,finalNodemap)
        finalEdgemap=finalMap(edgeMap,finalEdgemap)


        const params = {
            "edgeKeys": finalEdgeKeys,
            "edgeMergeMap": finalEdgemap, 
            "inNetworkMerge": sameNet,
            "netName": networkName,
            "networkMergeMap": finalNetworkmap,
            "nodeKeys": finalNodeKeys,
            "nodeMergeMap": finalNodemap,
            "nodesOnly": nodesonly,
            "operation": Operation,
            "sources": finalSources
          }
  
          const mergeUrl =CYREST_BASE_URL + '/v1/commands/network/merge'
  
          const response = await fetch(mergeUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          });
          const json = await response.json();
          //successButton(button)


    }

    async Keys(type,id,select){
        if(Operation==undefined){
            console.log("Please Select an Operation")
            return
        }

        if(type=="node"){
            nodeKeys[id]=select.options[select.selectedIndex].value
        }
        else if(type=="edge"){
            edgeKeys[id]=select.options[select.selectedIndex].value
        }


    }

    async MergeMap(type,id,select){
        if(Operation==undefined){
            console.log("Please Select an Operation")
            return
        }

        if(type=="network" || type=="inputnet"){

            if(networkMap[networkcycleIndex][networkLength]!=0){
                networkMap.push(Array(networkLength+1).fill(0))
                networkcycleIndex+=1

            }
            if(type=="network"){
            networkMap[networkcycleIndex][id]=select.options[select.selectedIndex].innerHTML
            }
            else if(type=="inputnet"){
            networkMap[networkcycleIndex][id]=select.value
            }
        }

        else if(type=="node"|| type=="inputnode"){
            if(nodeMap[nodecycleIndex][networkLength]!=0){
                nodeMap.push(Array(networkLength+1).fill(0))
                nodecycleIndex+=1

            }
            if(type=="node"){
                nodeMap[nodecycleIndex][id]=select.options[select.selectedIndex].innerHTML
            }
            else{
                nodeMap[nodecycleIndex][id]=select.value
            }
        }

        else if(type=="edge" || type=="inputedge"){
            if(edgeMap[edgecycleIndex][networkLength]!=0){
                edgeMap.push(Array(networkLength+1).fill(0))
                edgecycleIndex+=1

            }
            if(type=="edge"){
                edgeMap[edgecycleIndex][id]=select.options[select.selectedIndex].innerHTML
            }
            else if(type=="inputedge"){
                edgeMap[edgecycleIndex][id]=select.value
            }
        }
    
        
}

    async operation(select){

        await this.FinalResult()
        Operation=select.options[select.selectedIndex].value
    }

    async main(select){
        document.getElementById("fullmerge").style.display="block"
        var name=select.options[select.selectedIndex].innerHTML
        if(sources.has(name)){
            return
        }
        else{
            sources.add(name)
        }

        await this.Helper("keynode",select.options[select.selectedIndex].value,select.options[select.selectedIndex].innerHTML)
        await this.Helper("keyedge",select.options[select.selectedIndex].value,select.options[select.selectedIndex].innerHTML)
        await this.Helper("nodemap",select.options[select.selectedIndex].value,select.options[select.selectedIndex].innerHTML)
        await this.Helper("edgemap",select.options[select.selectedIndex].value,select.options[select.selectedIndex].innerHTML)
        await this.Helper("networkmap",select.options[select.selectedIndex].value,select.options[select.selectedIndex].innerHTML,networkLength)
        networkLength+=1
    }
    
    async mergename(button){
        networkName=button.value
    }
}



const merge=new Merge()
