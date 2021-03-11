var node_index=0
var zoom_index=1
var cy=undefined
async function initGraph(){
    globalThis.cy=cytoscape({
    container: document.getElementById('cy'),
  
    layout: {
      name: 'grid'
    },
  
    style: [
      {
        selector: 'node',
        style: {
          "label": "data(id)",
          "background-color":"#800080"
        }
      },
      {
        selector:"edge",
        style:{
          "line-color":"#FF00FF"
        }
      },
      
      {
        selector: ".highlighted",
        style: {
            "background-color":"#FF4500",
            "line-color":"#FF6347"
        }
      }
    ]
});
}

async function addNode(){
  if(cy==undefined){
    initGraph()
  }
  
  cy.add({group:"nodes",data:{"id":node_index},position:{x:100,y:100}})  
  node_index+=1
  
}


async function addEdge(button) {
  if(cy.nodes().length<2){
    console.log("Please Select 2 or more nodes")
  }
  else{
    button.innerHTML="Select two nodes"
    cy.once("tap","node",function(evt){
      var first=evt.target.id()
      cy.once("tap","node",function(evt){
        var second=evt.target.id()
        cy.add({group:"edges","data":{"id":first+second,"source":first,"target":second}})
        button.innerHTML="Add again"              
      })
    })
  }
   
}       

async function getExample(button) {
    globalThis.cy=cytoscape({
    container: document.getElementById('cy'),
    elements:{
      nodes:[
      {data:{"id":"a"}},
      {data:{"id":"b"}},
      {data:{"id":"c"}},
      {data:{"id":"d"}},
      {data:{"id":"e"}},
      {data:{"id":"f"}},
      {data:{"id":"g"}},
      {data:{"id":"h"}},
      {data:{"id":"i"}},
      {data:{"id":"j"}}
      ],
      edges:[
        {data:{"id":"ab","source":"a","target":"b"}},
        {data:{"id":"ac","source":"a","target":"c"}},
        {data:{"id":"ad","source":"a","target":"d"}},
        {data:{"id":"be","source":"b","target":"e"}},
        {data:{"id":"bf","source":"b","target":"f"}},
        {data:{"id":"cg","source":"c","target":"g"}},
        {data:{"id":"ch","source":"c","target":"h"}},
        {data:{"id":"di","source":"d","target":"i"}},
        {data:{"id":"dj","source":"d","target":"j"}}

      ]
      
    },
    layout: {
      name: 'breadthfirst',
      directed:true
    },
  
    style: [
      {
        selector: 'node',
        style: {
          "height":"75px",
          "width":"75px",
          "background-color":"#800080"
        }
      },
      {
        selector:"edge",
        style:{
          "curve-style":"bezier",
          "line-color":"#FF00FF",
          "width":9,
          "target-arrow-shape":"triangle",
          "target-arrow-color":"#00BFFF"
        }
      },
      {
          selector: ".highlighted",
          style: {
              "background-color":"#FF4500",
              "line-color":"#FF6347"	
          }
        }
    ]
});
button.innerHTML="Success"
button.style.background="orange"
}



async function bfs(button){
  button.innerHTML="Select the Starting node"
  cy.once("tap","node",function(evt){
      const first=evt.target.id()
      var bfs =cy.elements().bfs("#"+first, function(){}, false)
      var i = 0
      var highlightNextEle = function(){
        if( i < bfs.path.length ){
          bfs.path[i].addClass('highlighted')
          i++
          setTimeout(highlightNextEle, 700)
        }
      };
      highlightNextEle();
      button.innerHTML="Success"
      button.style.background="orange"
      
})

}

async function dfs(button){
  button.innerHTML="Select the Starting node"
  cy.once("tap","node",function(evt){
    const first=evt.target.id()
    var bfs =cy.elements().bfs("#"+first, function(){}, false)
    var dfs=cy.elements().dfs("#a",function(){},true)
    var i=0
    var highlightNextEle = function(){
      if( i < dfs.path.length ){
        dfs.path[i].addClass('highlighted')
        i++
        setTimeout(highlightNextEle, 700)
      }
    };
    highlightNextEle();
    successButton(button)
})

}

async function getJpg(button){
  var image=cy.jpg()
  var imgtag=document.getElementById("image")
  imgtag.setAttribute("href",image)
  imgtag.setAttribute("download","")
  document.getElementById("image").click()
  button.innerHTML="Success"
  button.style.background="orange"
}

async function zoomIn() {
 zoom_index+=1
 cy.zoom({level:zoom_index,renderedPosition:{x:100,y:100}})

 
}
async function zoomOut() {
  zoom_index-=1
  cy.zoom({level:zoom_index,renderedPosition:{x:100,y:100}})
} 



