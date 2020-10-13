const debug = false;
replaceFrameworksPanel();
replaceItemsPanels('all');
/*
calling these functions in the replace frameworks panel ajax call
as an exercise later can try to figure out how to make this work with async await
	isSmallViewport.addListener(setMenuCollapsed);
	setMenuCollapsed(isSmallViewport);
*/

var isSmallViewport = window.matchMedia("(max-width: 1000px)");

var selF = document.getElementById('selectedFramework').innerHTML;
setSelected(selF);

var searchRequest = null;
var suggElement = document.getElementById('suggestions');
var frameworksArray = new Array();

async function populateItemsPanels( objs ) {
	var itemTitle = "";
	var obj = new Object();
	var itemsHtml = "";
	var itemHtml = "";
	//if(debug) console.log('in populateItemsPanels with obj size: ' + objs.length)

	objs.forEach( obj => {
		itemHtml = "<div class='panel panel-primary " + obj.type + "'>";
		itemTitle = "<h3 class='panel-title'>" + obj.frameworkdisplay + " " + obj.type + " " + obj.id + "</h3>"
		itemHtml += "<div class='panel-heading'>" + itemTitle + "</div>";
		itemHtml += "<div class='panel-body'>" + obj.text + "</div>";
		itemHtml += "</div>";
		itemsHtml += itemHtml;
	});
	
	document.getElementById('itemsPanels').innerHTML = itemsHtml;
}

/*

          div.panel.panel-default
            div.panel-heading
              a.plain(href='#sidepanel' data-toggle='collapse')
                h3.panel-title Frameworks
                  //a(href='/agileframeworks/all' data-toggle='collapse') Frameworks
            div.panel-collapse.collapse.show#sidepanel
              ul.list-group
                each f in frameworks
                  li.list-group-item 
                    a.menu(href='/agileframeworks/' + f.framework ) <span id=#{f.framework}>#{f.frameworkdisplay}</span>
*/

async function populateFrameworksPanel( objs ) {
	var framework = "";
	var obj = new Object();
	var itemsHtml = "";
	var jscriptString = "";
	
	itemsHtml  = "<div class='panel panel-default'>";
	itemsHtml += "<div class='panel-heading'>";
	itemsHtml += "<a id='sidepanelheader' class='plain' href='#sidepanel' data-toggle='collapse'><h3 class='panel-title'>Choose Framework</h3>";
	itemsHtml += "</div>"; //close div panel heading
	itemsHtml += "<div class='panel-collapse collapse' id='sidepanel'>"
	itemsHtml += "<ul class='list-group'>";
	objs.forEach( obj => {
		frameworksArray.push(obj.framework);
		itemsHtml += "<li class='list-group-item'>";
		jscriptString = "javascript:replaceItemsPanels('" + obj.framework + "')";
		itemsHtml += "<a class='menu' href='javascript:void(0)' onclick=" + jscriptString + "> <span id='" + obj.framework + "'>" + obj.frameworkdisplay + "</span>";
		itemsHtml += "</li>";
	});
	itemsHtml += "</ul>";
	itemsHtml += "</div>"; //close div panel-collapse
	itemsHtml += "</div>"; //close div panel-default
	
	//if(debug) console.log('setsidepanel');
	//if(debug) console.log('about to populate frameworksMenuPanel with ' + itemsHtml);
	document.getElementById('frameworksMenuPanel').innerHTML = itemsHtml;
}

function setMenuCollapsed(isSmallViewport) {
	//if(debug) console.log('calling set Menu Collapsed');
	if( isSmallViewport.matches ) {
		//document.getElementById("sidepanel").classList.remove('show');
		document.getElementById("sidepanel").classList.remove('in');
	} else {
		//document.getElementById("sidepanel").classList.add('show');
		document.getElementById("sidepanel").classList.add('in');
	}
}

function setSelected(selectedFramework) {
	if(debug) console.log('set selected fra: selF: ' + selectedFramework);
	if(selectedFramework != "" && selectedFramework != "all") {
		var frameElement;
		frameworksArray.forEach( f => {
			if(debug) console.log("in set selected fr: in array loop removing selected on " + f + " div");
			frameElement = document.getElementById(f);
			if(frameElement && frameElement.classList.contains('selected')) {
				document.getElementById(f).classList.remove('selected');
			}
		});
		if(debug) console.log("in set selected fr: setting selected to " + selectedFramework + " div");
		var currFramElement = document.getElementById('selectedFramework')
		if(currFramElement) {
			currFramElement.innerHTML = selectedFramework;
		}
		frameworksArray.forEach( f => {
			document.getElementById(f).classList.remove('selected');
		});
		document.getElementById(selectedFramework).classList.add('selected');
	} else {
		var currFramElement = document.getElementById('selectedFramework')
		if(currFramElement) {
			currFramElement.innerHTML = "";
		}
	}
//if(debug) console.log("added .selected to " + selectedFramework)
}

async function replaceItemsPanels(framework) {
	await $.ajax({
		type: "GET",
		url: "/api/agileframeworks/" + framework,
		dataType: "json",
		success: async function(result) {
			await populateItemsPanels(result.items);
			setSelected(framework);
			isSmallViewport.addListener(setMenuCollapsed);
			setMenuCollapsed(isSmallViewport);
		}
	});
}

let termsObj = new currentTermsObject();

function replaceFilteredItemsPanels() {
	//if(debug) console.log('will ajax for items with /api/agileframeworks/search?searchwords=' + termsObj.getCurrentTerms())
	$.ajax({
		type: "GET",
		url: "/api/agileframeworks/search?searchwords=" + termsObj.getCurrentTerms(),
		dataType: "json",
		success: function(result) {
			populateItemsPanels(result.filteredItems);
			populateCurrentSearchTermsDiv();
		}
	});
}

function currentTermsObject() {
	this.currentTermsMap = new Map(),
	this.currentTermsString = "",
		
	this.getCurrentTermsHtml = function() {
		var termsHtml = "";
		for( let str of this.currentTermsMap.values() ) {
			//if(debug) console.log('in getcurrenttermshtml in obj add to string: ' + str);
			termsHtml += str;
		}
		return termsHtml;
	},
	this.getCurrentTerms = function() {
		var terms = "";
		for( let str of this.currentTermsMap.keys() ) {
			if(terms == "") {
				terms = str;
			} else {
				terms += ',' + str;
			}
		}
		return terms;
	},
	this.addTerm = function(t) {
		if(debug) console.log('adding |' + t + '|');
		this.currentTermsString = "<a class='activekeywords plain' href='javascript:void(0)' onclick='javascript:removeActiveSearchterm(this);'> <span class='glyphicon glyphicon-remove-circle'></span>" + "&nbsp;" + decodeURI(t) + "</a>"
		this.currentTermsMap.set(t, this.currentTermsString);
		//if(debug) console.log('map size: ' + this.currentTermsMap.size);
		for(let m of this.currentTermsMap.keys()) {
			//if(debug) console.log('map key: ' + m + ', map value: ' + this.currentTermsMap.get(m));
		}
	},
	this.removeTerm = function(t) {
		if(debug) console.log('removing |' + t + '|');
		this.currentTermsMap.delete(encodeURI(t));
		if(debug) console.log('map size: ' + this.currentTermsMap.size);
		for(let m of this.currentTermsMap.keys()) {
			if(debug) console.log('map key: ' + m + ', map value: ' + this.currentTermsMap.get(m));
		}
	},
	this.size = function(t) {
		return this.currentTermsMap.size;
	}
}

function populateCurrentSearchTermsDiv() {
	/*
	var curTermsArray = searchterms.split(',');
	var currentTermsString = '';
	curTermsArray.forEach( element => {
		if(debug) console.log('current el: |' + element + '|');
		currentTermsString += "<a class='activekeywords plain' href='javascript:void(0)' onclick='javascript:removeActiveSearchterm(this);'> <span class='glyphicon glyphicon-remove-circle'></span>" + "&nbsp;" + decodeURI(element) + "</a>"
	});
	*/
	/*if(current SearchTermsObject=="") { 
		if(debug) console.log('creating terms object');
		currentSearchTermsObject = createCurrent SearchTermsObject(searchterms);
	}*/
	//if(debug) console.log("updating remove links div with " + termsObj.getCurrentTermsHtml());
	document.getElementById('removetermlinks').innerHTML = termsObj.getCurrentTermsHtml();
	//if(debug) console.log("updating search terms div with " + termsObj.getCurrentTerms());
	document.getElementById('currentsearchterms').innerHTML = termsObj.getCurrentTerms();
	document.getElementById('suggestions').style.display = 'none';
	document.getElementById('searchtext').value = "";
}

async function replaceFrameworksPanel() {
	await $.ajax({
		type: "GET",
		url: "/api/agileframeworks/frameworks/",
		dataType: "json",
		success: function(result) {
			populateFrameworksPanel(result.AFs);
		}
	});
}

$(function() {
  var minlength = 3;

  $("#searchtext").keyup(function() {
    var oldThis = this,
    value = $(this).val();
    //if(debug) console.log("value is " + value);

     if (value.length >= minlength ) {
        if (searchRequest != null) { searchRequest.abort(); }
		//if(debug) console.log("about to ajax");
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
                  var curSearchField = document.getElementById('currentsearchterms');
                  var curSearchTerms = (curSearchField.innerHTML!=''?curSearchField.innerHTML + ",":"");
                  //if(debug) console.log("in success 1 with " + msg.result[0] );
                  //we need to check if the value is the same
                  if (value==$(oldThis).val()) {
					//if(debug) console.log("in success 2 in if with " + msg.result[0] );
					var jscriptcall = '';
					msg.result.forEach( element => {
						jscriptString = "javascript:addActiveSearchterm('" + encodeURI(element) + "')"
						//if(debug) console.log('adding jscript: |' + jscriptString + '|')
						resultList = resultList + "<li><a href='javascript:void(0);' onclick=" + jscriptString + ">" + element + "</a></li>";
					});
					resultList = resultList + '</ul>';
					suggElement.innerHTML = resultList;
					//if(debug) console.log("about to display block on suggestions");
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

function addActiveSearchterm(term) {
	if(debug) console.log('will add ' + term);
	termsObj.addTerm(term);
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	replaceFilteredItemsPanels();
}

function removeActiveSearchterm(element) {
	if(debug) console.log('will remove ' + element.text.trim());
	termsObj.removeTerm(element.text.trim());
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	if(debug) console.log("termsObj size: " + termsObj.size())
	if(termsObj.size()==0) {
		replaceItemsPanels('all');
	} else {
		replaceFilteredItemsPanels();
	}
}

function removeActiveSearchterm2(element) {
	//if(debug) console.log("removing |" + element.text + "|");
	var term = element.text.trim();
	var curSearchField = document.getElementById('currentsearchterms');
	var curTerms = curSearchField.innerHTML;
	//if(debug) console.log("curTerms: " + curTerms);
	var countarray = curTerms.split(',');
	var count = countarray.length-1;
	var subCurTerms = '';
	var result = '';
  /*
    do a search on a string and get index
    get substring from 0 to searchreturnedindex-1 ( if not 0 to remove the comma) then, if searchreturnedindex + term.length to full string length and concatenate
  */
  var matchIndex = curTerms.search( term );
  //if(debug) console.log("index is " + matchIndex);
  if(matchIndex>-1) { //value found
    if(matchIndex==0) { //found at first position
      if(term == curTerms.length ) { //this is the only term in current searchterms
        result = ''; //remove the whole thing
      } else { //word is the first of the string but there's more
        result = curTerms.substring(term.length+1,curTerms.length)
      }
    } else {  //it's a word in the middle of the string or at the end
      if( matchIndex+term.length==curTerms.length ) {  //if term is the last word of string
        //if(debug) console.log("term is last word of string");
        result = curTerms.substring(0,matchIndex-1);
      } else { //word in the middle of the string
        //if(debug) console.log("term is in the middle of string");
        var s1 = curTerms.substring(0,matchIndex-1);
        var s2 = curTerms.substring(matchIndex+term.length,curTerms.length)
        result = s1 + s2;
      }
    }
  }
  /*
    if(!curTerms) { curTerms = '' }
    //if(debug) console.log("terms is " + terms);
    curTerms = curTerms + terms;
    //if(debug) console.log("curTerms is " + curTerms);
  */
  //if(debug) console.log("result: " + result + " with count: " + count);
  var href = "/agileframeworks/";
  if(count==0) {
    href = href + "all";
    //curSearchField.innerHTML = "";
    document.getElementById('removetermlinks').innerHTML="";
  } else {
    href = href + "search?searchterms=" + result;
    curSearchField.innerHTML = result;
  }
}

/*
          - var terms = ""
          if searchtermsArray
            each term in searchtermsArray
              a.activekeywords.plain(href="javascript:void(0)" onclick="javascript:removeActiveSearchterm('" + term + "')") <span class="glyphicon glyphicon-remove-circle"></span>
                | &nbsp;#{term}
              - terms = terms + ',' + term;
            div#currentSearchterms #{terms.substring(1,terms.length)}
*/
			
