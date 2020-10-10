console.log("in js file about to call replace item panesl");

replaceItemPanels();

var isSmallViewport = window.matchMedia("(max-width: 1000px)");
isSmallViewport.addListener(setMenuCollapsed);
setMenuCollapsed(isSmallViewport);

var selF = document.getElementById('currentFramework').innerHTML
setSelected(selF);

var searchRequest = null;
var suggElement = document.getElementById('suggestions');

function populateItemsPanels( objs ) {
  var itemTitle = "";
  var obj = new Object();
  var itemsHtml = "";
  var itemHtml = "";

  var itemsCurrentFrameworkHtml = "<p id='currentFramework' class='hide'>framework</p>";
  itemsHtml = itemsCurrentFrameworkHtml;
  objs.forEach( obj => {
    itemHtml = "<div class='panel panel-primary " + obj.type + "'>";
    itemTitle = "<H3 class='panel-title'>" + obj.frameworkdisplay + " " + obj.type + " " + obj.id + "</H3>"
    itemHtml += "<div class='panel-heading'>" + itemTitle + "</div>";
    itemHtml += "<div class='panel-body'>" + obj.text + "</div>";
    itemHtml += "</div>";
    itemsHtml += itemHtml;
  });

  document.getElementById('itemsPanels').innerHTML = itemsHtml;
}

function setMenuCollapsed(isSmallViewport) {
  if( isSmallViewport.matches ) {
    document.getElementById("sidepanel").classList.remove('show');
    document.getElementById("sidepanel").classList.remove('in');
  } else {
    document.getElementById("sidepanel").classList.add('show');
  }
}

function setSelected(selectedFramework) {
  if(selectedFramework) {
    document.getElementById(selectedFramework).classList.add('selected');
  }
  //console.log("added .selected to " + selectedFramework)
}

function replaceItemPanels() {
	$.ajax({
		type: "GET",
		url: "/api/agileframeworks/",
		dataType: "json",
		success: function(result) {
			//populateItemsPanels(JSON.stringify(result.items));
			//console.log("value: " + result.items[0].type);
			populateItemsPanels(result.items);
		}
	});
}

$(function() {
  var minlength = 3;

  $("#searchterms").keyup(function() {
    var oldThis = this,
    value = $(this).val();
    console.log("value is " + value);

     if (value.length >= minlength ) {
        if (searchRequest != null) 
            searchRequest.abort();
        searchRequest = $.ajax({
            type: "GET",
            url: "/api/agileframeworks/keywords?",
            data: {
                'keyword' : value
            },
            dataType: "json",
            success: function(msg){
                if(msg.result[0]) {
                  var resultList = '<ul style="list-style-type: none"><li><b>Suggestions</b></li>';
                  var curSearchField = document.getElementById('currentSearchterms');
                  var curSearchTerms = (curSearchField?curSearchField.innerHTML + ",":"");
                  console.log("in success 1 with " + msg.result[0] );
                  //we need to check if the value is the same
                  if (value==$(oldThis).val()) {
                    console.log("in success 2 in if with " + msg.result[0] );
                    msg.result.forEach( element => {
                      resultList = resultList + '<li><a href="/agileframeworks/search?searchterms=' + curSearchTerms + element + '"/>' + element + '</a></li>';
                    });
                    resultList = resultList + '</ul>';
                    suggElement.innerHTML = resultList;
                    suggElement.style.display = 'block';
                  }
                }
            }
        });
    } else {
      suggElement.innerHTML = '';
      suggElement.style.display = 'none';
    }
  });
});

function removeActiveSearchterm(term) {
  console.log("removing " + term);
  var curSearchField = document.getElementById('currentSearchterms');
  var curTerms = curSearchField.innerHTML;
  console.log("curTerms: " + curTerms);
  var countarray = curTerms.split(',');
  var count = countarray.length-1;
  var subCurTerms = '';
  var result = '';
  /*
    do a search on a string and get index
    get substring from 0 to searchreturnedindex-1 ( if not 0 to remove the comma) then, if searchreturnedindex + term.length to full string length and concatenate
  */
  var matchIndex = curTerms.search( term );
  console.log("index is " + matchIndex);
  if(matchIndex>-1) { //value found
    if(matchIndex==0) { //found at first position
      if(term == curTerms.length ) { //this is the only term in current searchterms
        result = ''; //remove the whole thing
      } else { //word is the first of the string but there's more
        result = curTerms.substring(term.length+1,curTerms.length)
      }
    } else {  //it's a word in the middle of the string or at the end
      if( matchIndex+term.length==curTerms.length ) {  //if term is the last word of string
        console.log("term is last word of string");
        result = curTerms.substring(0,matchIndex-1);
      } else { //word in the middle of the string
        console.log("term is in the middle of string");
        var s1 = curTerms.substring(0,matchIndex-1);
        var s2 = curTerms.substring(matchIndex+term.length,curTerms.length)
        result = s1 + s2;
      }
    }
  }
  /*
    if(!curTerms) { curTerms = '' }
    console.log("terms is " + terms);
    curTerms = curTerms + terms;
    console.log("curTerms is " + curTerms);
  */
  console.log("result: " + result + " with count: " + count);
  var href = "/agileframeworks/";
  if(count==0) {
    href = href + "all";
    //curSearchField.innerHTML = "";
    document.getElementById('removetermlinks').innerHTML="";
  } else {
    href = href + "search?searchterms=" + result;
    curSearchField.innerHTML = result;
  }
  //window.location.href = href;
}
