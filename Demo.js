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
          "background-color":"#ff6464"
        }
      },
      {
        selector:"edge",
        style:{
          "line-color":"#5ac8fa"
        }
      },
      
      {
        selector: ".highlighted",
        style: {
            "background-color":"#bd13d2",
            "line-color":"#ff7ee3"
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
        
      })
    })
  } 
}       

async function getExample() {
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
          "background-color":"#ea5817"
        }
      },
      {
        selector:"edge",
        style:{
          "line-color":"#ffaa77"
          //"target-arrow-shape":"triangle"
        }
      },
      {
          selector: ".highlighted",
          style: {
              "background-color":"#bd13d2",
              "line-color":"#ff7ee3"
          }
        }
    ]
});
}



async function bfs(button){
  
  button.innerHTML="Select the starting node"
  cy.once("tap","node",function(evt){
      var start=evt.target.id()
      var bfs =cy.elements().bfs(start, function(){}, true)
      var i = 0
      var highlightNextEle = function(){
        if( i < bfs.path.length ){
          bfs.path[i].addClass('highlighted')
          i++
          setTimeout(highlightNextEle, 700)
        }
      };
      highlightNextEle();
})
}

async function dfs(button){
  button.innerHTML="Select the starting node"
  cy.once("tap","node",function(evt){
    var start=evt.target.id()
    var dfs=cy.elements().dfs(start,function(){},true)
    var i=0
    var highlightNextEle = function(){
      if( i < dfs.path.length ){
        dfs.path[i].addClass('highlighted')
        i++
        setTimeout(highlightNextEle, 700)
      }
    };
    highlightNextEle();

})
}

async function getJpg(){
  var image=cy.jpg()
  var imgtag=document.getElementById("image")
  imgtag.setAttribute("href",image)
  imgtag.setAttribute("download","")
  document.getElementById("image").click()
}

async function zoomIn() {
 zoom_index+=1
 cy.zoom({level:zoom_index,renderedPosition:{x:100,y:100}})
 
}
async function zoomOut() {
  zoom_index-=1
  cy.zoom({level:zoom_index,renderedPosition:{x:100,y:100}})
} 


