
setup();
async function setup() {
	await replaceFrameworksPanel('all');
	replaceItemsPanels('all');
	
}
/*
calling these functions in the replace frameworks panel ajax call
as an exercise later can try to figure out how to make this work with async await
	isSmallViewport.addListener(setMenuCollapsed);
	setMenuCollapsed(isSmallViewport);
*/

var isSmallViewport = window.matchMedia("(max-width: 1000px)");

/*
var selF = document.getElementById('selectedFramework').innerHTML;
setSelected(selF);
*/

var searchRequest = null;
var suggElement = document.getElementById('suggestions');
var frameworksArray = new Array();

async function populateItemsPanels( objs ) {
	const debug = false;
	var itemTitle = "";
	var obj = new Object();
	var itemsHtml = "";
	var itemHtml = "";
	//if(debug) console.log('in populateItemsPanels with obj size: ' + objs.length)
	try {
		if(objs.length==0) {
			itemHtml = "<div class='panel panel-primary'>";
			itemTitle = "<h3 class='panel-title'>No items match in this framework.</h3>"
			itemHtml += "<div class='panel-heading'>" + itemTitle + "</div>";
			itemHtml += "<div class='panel-body'></div>";
			itemHtml += "</div>";
			itemsHtml += itemHtml;
		} else {
			objs.forEach( obj => {
				itemHtml = "<div class='panel panel-primary " + obj.type + "'>";
				itemTitle = "<h3 class='panel-title'>" + obj.frameworkdisplay + " " + obj.type + " " + obj.id + "</h3>"
				itemHtml += "<div class='panel-heading'>" + itemTitle + "</div>";
				itemHtml += "<div class='panel-body'>" + obj.text + "</div>";
				itemHtml += "</div>";
				itemsHtml += itemHtml;
			});
		}
	} catch(err) {
		console.log('error in populateItemsPanels with ' + err);
	}
	
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
	itemsHtml += "<a id='sidepanelheader' href='#sidepanel' data-toggle='collapse'><h3 class='panel-title'>Choose Framework " + (isSmallViewport.matches?$('#selectedFramework').text:"") + "</h3>";
	itemsHtml += "</div>"; //close div panel heading
	itemsHtml += "<div class='panel-collapse collapse' id='sidepanel'>"
	itemsHtml += "<ul class='list-group'>";
	objs.forEach( obj => {
		frameworksArray.push(obj.framework);
		itemsHtml += "<li class='list-group-item'>";
		jscriptString = "onclick=\'javascript:replaceItemsPanels(\"" + obj.framework + "\")\'";
		itemsHtml += "<a class=\'menu\' href=\'javascript:void(0)\' " + jscriptString + "> <span id=\'" + obj.framework + "\'>" + obj.frameworkdisplay + "</span>";
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
	const debug = false;
	if(debug) console.log('calling set Menu Collapsed');
	if( isSmallViewport.matches ) {
		//document.getElementById("sidepanel").classList.remove('show');
		//document.getElementById("sidepanel").classList.remove('in');
		$(".collapse").collapse('hide');
		//console.log("in largeviewport side pane classlist: " + document.getElementById("sidepanel").classList)
	} else {
		//document.getElementById("sidepanel").classList.add('show');
		//document.getElementById("sidepanel").classList.add('in');
		$(".collapse").collapse('show');
		//console.log("in smallviewport match side pane classlist: " + document.getElementById("sidepanel").classList)
	}
}

function setSelected(selectedFramework) {
	const debug = false;
	if(debug) console.log('set selected fra: selF: ' + selectedFramework);
//	if(selectedFramework != "" && selectedFramework != "all") {
	var frameElement;
	frameworksArray.forEach( f => {
		if(debug) console.log("in set selected fr: in array loop removing selected on " + f + " div");
		frameElement = document.getElementById(f);
		if(frameElement) {
			if(debug) console.log( 'if frameElement true' )
			if( f == selectedFramework ) {
				if(debug) console.log('f is selected. f:' + f + ", selected: " + selectedFramework)
				if(frameElement.classList.contains('selected')) {
					if(debug) console.log( 'classList contains selected')
					frameElement.classList.remove('selected');
					frameElement.parentElement.setAttribute("onclick", "replaceItemsPanels(\'" + f + "\')");
				} else {
					if(debug) console.log( 'classList does not already contain selected')
					frameElement.classList.add('selected');
					frameElement.parentElement.setAttribute("onclick", "replaceItemsPanels('all')");
				}
			} else { //this is not the currently selected framework
				if(debug) console.log('f is NOT selected. f:' + f + ", selected: " + selectedFramework)
				if(frameElement.classList.contains('selected')) {
					if(debug) console.log( 'classList already contains selected -- removing')
					frameElement.classList.remove('selected');
					frameElement.parentElement.setAttribute("onclick", "replaceItemsPanels(\'" + f + "\')");
				}
			}
		}
	});
	if(debug) console.log("in set selected fr: setting selected to " + selectedFramework + " div");
	var currFramElement = document.getElementById('selectedFramework')
	if(currFramElement) {
		currFramElement.innerHTML = selectedFramework;
	}
//	} else {
	/*
	var currFramElement = document.getElementById('selectedFramework')
	if(currFramElement) {
		currFramElement.innerHTML = "";
	}
	*/
//	}
}

function replaceItemsPanels(framework) {
	const debug = false;
	if(debug) console.log('in replaceItemsPanels with ' + framework );
	let url;
	if(termsObj.size() > 0) {
		if(debug) console.log('in replaceitemspanels, termsObj size should be >0 and is ' + termsObj.size() );
		url = "/api/agileframeworks/search?framework=" + framework + "&searchwords=" + termsObj.getCurrentTerms();
	} else {
		if(debug) console.log('in replaceitemspanels, termsObj size should be 0 and is ' + termsObj.size() );
		url = "/api/agileframeworks/" + framework;
	}
	/*
	 if($(el).length) {
		 $(el).setAttribute("onclick", "replaceItemsPanels('all', this)")
	 }
	*/
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(result) {
			if(debug) console.log("result.items count: " + result.items.length)
			populateItemsPanels(result.items);
			setSelected(framework);
			setMenuCollapsed(isSmallViewport);
		}
	});
}

let termsObj = new currentTermsObject();

function replaceFilteredItemsPanels(framework) {
	const debug = false;
	if(debug) console.log('will ajax for items with /api/agileframeworks/search?searchwords=' + termsObj.getCurrentTerms())
	
	$.ajax({
		type: "GET",
		url: url = "/api/agileframeworks/search?framework=" + framework + "&searchwords=" + termsObj.getCurrentTerms(),
		dataType: "json",
		success: function(result) {
			if(debug) console.log("result size: " + result.items.length)
			populateItemsPanels(result.items);
			populateCurrentSearchTermsDiv();
		}
	});
}

function currentTermsObject() {
	const debug = false;
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
		this.currentTermsString = "<a class='activekeywords plain' href='javascript:void(0)' onclick='javascript:removeActiveSearchterm(this);'> <span class='glyphicon glyphicon-remove-circle'></span>" + "&nbsp;" + decodeURI(t).replace(/\+/g, ' ') + "</a>"
		this.currentTermsMap.set(t, this.currentTermsString);
		//if(debug) console.log('map size: ' + this.currentTermsMap.size);
		for(let m of this.currentTermsMap.keys()) {
			//if(debug) console.log('map key: ' + m + ', map value: ' + this.currentTermsMap.get(m));
		}
	},
	this.removeTerm = function(t) {
		const debug = false;
		if(debug) console.log('removing |' + t + '|');
		this.currentTermsMap.delete(t.replace(/\s/g, '+'));
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

async function replaceFrameworksPanel(framework) {
	await $.ajax({
		type: "GET",
		url: "/api/agileframeworks/frameworks/",
		dataType: "json",
		success: function(result) {
			populateFrameworksPanel(result.AFs);
			setSelected(framework);
			isSmallViewport.addListener(setMenuCollapsed);
			//console.log('listener added to ismallviewport')
			setMenuCollapsed(isSmallViewport);
		}
	});
}

$(function() {
  var minlength = 3;
	const debug = false;

  $("#searchtext").keyup(function() {
    var oldThis = this,
    value = $(this).val();
	var currFramElement = document.getElementById('selectedFramework')
	if(currFramElement) {
		framework = currFramElement.innerHTML;
	}
	if(framework=='') {
		framework = 'all';
	}
    //if(debug) console.log("value is " + value);

     if (value.length >= minlength ) {
        if (searchRequest != null) { searchRequest.abort(); }
		//if(debug) console.log("about to ajax");
        searchRequest = $.ajax({
            type: "GET",
            url: "/api/agileframeworks/suggestions?",
            data: {
				'framework': framework,
                'searchtext' : value
            },
            dataType: "json",
            success: function(msg){
                if(msg.searchWords[0]) {
                  var resultList = '<ul style="list-style-type: none"><li><b>Suggestions</b></li>';
                  var curSearchField = document.getElementById('currentsearchterms');
                  var curSearchTerms = (curSearchField.innerHTML!=''?curSearchField.innerHTML + ",":"");
                  //if(debug) console.log("in success 1 with " + msg.result[0] );
                  //we need to check if the value is the same
                  if (value==$(oldThis).val()) {
					//if(debug) console.log("in success 2 in if with " + msg.result[0] );
					var jscriptcall = '';
					msg.searchWords.forEach( element => {
						jscriptString = "javascript:addActiveSearchterm('" + element.replace(/\s/g, '+') + "')"
						//if(debug) console.log('adding jscript: |' + jscriptString + '|')
						resultList = resultList + "<li><a href='javascript:void(0);' onclick=" + jscriptString + ">" + element + "</a></li>";
					});
					resultList = resultList + '</ul>';
					suggElement.innerHTML = resultList;
					//if(debug) console.log("about to display block on suggestions");
					suggElement.style.display = 'block';
                  }
                } else {
				  suggElement.innerHTML = '';
				  suggElement.style.display = 'none';
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
	const debug = false;
	if(debug) console.log('will add ' + term);
	var framework = '';
	termsObj.addTerm(term);
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	var currFramElement = document.getElementById('selectedFramework')
	if(currFramElement) {
		framework = currFramElement.innerHTML;
	}
	if(framework=='') {
		framework = 'all';
	}
	replaceFilteredItemsPanels(framework);
}

function removeActiveSearchterm(element) {
	const debug = false;
	if(debug) console.log('will remove ' + element.text.trim());
	var framework = '';
	termsObj.removeTerm(element.text.trim().replace(/\s/g, '+'));
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	if(debug) console.log("termsObj size: " + termsObj.size())
	var currFramElement = document.getElementById('selectedFramework')
	if(currFramElement) {
		framework = currFramElement.innerHTML;
	}
	if(framework=='') {
		framework = 'all';
	}
	if(termsObj.size()==0) {
		replaceItemsPanels('all');
	} else {
		replaceFilteredItemsPanels(framework);
	}
}

$("form").on("submit", function (e) {
	var dataString = $(this).serialize();
	var searchtext = dataString.substring(dataString.indexOf('=')+1, dataString.length);
	//console.log('in form submit jquery with ' + dataString + ' and searchtext: ' + searchtext);
	$.ajax({
		type: "GET",
		url: "/api/agileframeworks/suggestions?" + dataString,
		dataType: "json",
		success: function(result) {
			//console.log('result: ' + result.searchWords[0])
			const found = result.searchWords.find( s => s.toUpperCase().replace(/\s/g, '+') === searchtext.toUpperCase() );
			//console.log('found: ' + found);
			if(found) {
				addActiveSearchterm(searchtext.replace(/\+/g, '+'));
			} else {
				alert('Select one of the suggestions from the list');
			}
		}
	});
	e.preventDefault();
});

/*
          - var terms = ""
          if searchtermsArray
            each term in searchtermsArray
              a.activekeywords.plain(href="javascript:void(0)" onclick="javascript:removeActiveSearchterm('" + term + "')") <span class="glyphicon glyphicon-remove-circle"></span>
                | &nbsp;#{term}
              - terms = terms + ',' + term;
            div#currentSearchterms #{terms.substring(1,terms.length)}
*/
			
