
setup();
async function setup() {
	await replaceFrameworksPanel('all');
	replaceItemsPanels('all');
}


var isSmallViewport = window.matchMedia("(max-width: 1000px)");
var searchRequest = null;
//var suggElement = document.getElementById('suggestions');
var frameworkObjArray = new Array ();


let termsObj = new currentTermsObject();

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


async function populateItemsPanels( objs ) {
	$(function() {
		if(true) {
			populateItemsPanels2( objs );
		} else {
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

			//document.getElementById('itemsPanels').innerHTML = itemsHtml;
			$('#itemsPanels').html(itemsHtml);
		}
	});
}

async function populateItemsPanels2( objs ) {
	$(function() {
		var itemTitle = "";
		var panel = $('#itemsPanels');
		try {
			if(objs.length==0) {
				panel.append("<div class='panel panel-primary'>");
				itemTitle = "<h3 class='panel-title'>No items match in this framework.</h3>";
				panel.append("<div class='panel-heading'>" + itemTitle + "</div>");
				panel.append("<div class='panel-body'></div>");
				panel.append("</div>")
			} else {
				objs.forEach( obj => {
					panel.append("<div class='panel panel-primary " + obj.type + "'>");
					itemTitle = "<h3 class='panel-title'>" + obj.frameworkdisplay + " " + obj.type + " " + obj.id + "</h3>"
					panel.append("<div class='panel-heading'>" + itemTitle + "</div>");
					panel.append("<div class='panel-body'>" + obj.text + "</div>");
					panel.append("</div>");
				});
			}
		} catch(err) {
			console.log('error in populateItemsPanels2 with ' + err);
		}
	});
}

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

async function populateFrameworksPanel( objs ) {
	$(function() {
		const debug = false;
		var framework = "";
		var obj = new Object();
		var itemsHtml = "";
		var jscriptString = "";
		frameworkObjArray = objs;
		if(debug) console.log('setting up frameworks panel html')

		itemsHtml  = "<div class='panel panel-primary'>";
		itemsHtml += "<div class='panel-heading'>";
		itemsHtml += "<a id='sidepanelheader' href='#sidepanel' data-toggle='collapse'><h3 class='panel-title'><div id='fmenu-panel-title-div'>Frameworks</div><div id='displaySelectedFramework'></div></h3></a>";
		itemsHtml += "</div>"; //close div panel heading
		itemsHtml += "<div class='panel-collapse collapse' id='sidepanel'>"
		itemsHtml += "<ul class='list-group'>";
		objs.forEach( obj => {
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
		//document.getElementById('frameworksMenuPanel').innerHTML = itemsHtml;
		$('#frameworksMenuPanel').html(itemsHtml);
		frameworkObjArray.push({framework:'all', frameworkdisplay:'All'})
	});
}

function setMenuCollapsed(isSmallViewport) {
	const debug = false;
	if(debug) console.log('calling set Menu Collapsed');
	$(function() {
		if( isSmallViewport.matches ) {
			//document.getElementById("sidepanel").classList.remove('show');
			//document.getElementById("sidepanel").classList.remove('in');
			$("#sidepanel").collapse('hide');
			$('#displaySelectedFramework').addClass('show');
			$('#displaySelectedFramework').removeClass('hide');
			$('#fmenu-panel-title-div').addClass('hide');
			$('#fmenu-panel-title-div').removeClass('show');
			//console.log("in largeviewport side pane classlist: " + document.getElementById("sidepanel").classList)
		} else {
			//document.getElementById("sidepanel").classList.add('show');
			//document.getElementById("sidepanel").classList.add('in');
			$("#sidepanel").collapse('show');
			$('#displaySelectedFramework').addClass('hide');
			$('#displaySelectedFramework').removeClass('show');
			$('#fmenu-panel-title-div').addClass('show');
			$('#fmenu-panel-title-div').removeClass('hide');
			//console.log("in smallviewport match side pane classlist: " + document.getElementById("sidepanel").classList)
		}
	});
}

function setSelected(selectedFramework) {
	const debug = false;
	if(debug) console.log('set selected fra: selF: ' + selectedFramework);
	var frameElement;
	$(function() {
		frameworkObjArray.forEach( fObj => {
			if(debug) console.log("in set selected fr: in array loop removing selected on " + fObj.framework + " div");
			//frameElement = document.getElementById(fObj.framework);
			frameElement = $('#' + fObj.framework);
			if(frameElement) {
				if(debug) console.log( 'if frameElement true' )
				if( fObj.framework == selectedFramework ) {
					if(debug) console.log('f is selected. f:' + fObj.framework + ", selected: " + selectedFramework)
					//if(frameElement.classList.contains('selected')) {
					if(frameElement.hasClass('selected')) {
						if(debug) console.log( 'classList contains selected')
						//frameElement.classList.remove('selected');
						frameElement.removeClass('selected');
						//frameElement.parentElement.setAttribute("onclick", "replaceItemsPanels(\'" + fObj.framework + "\')");
						frameElement.offsetParent().click( function() { replaceItemsPanels(fObj.framework); } );
					} else {
						if(debug) console.log( 'classList does not already contain selected')
						//frameElement.classList.add('selected');
						frameElement.addClass('selected');
						//frameElement.parentElement.setAttribute("onclick", "replaceItemsPanels('all')");
						frameElement.offsetParent().click( function() { replaceItemsPanels('all'); } );
					}
				} else { //this is not the currently selected framework
					if(debug) console.log('f is NOT selected. f:' + fObj.framework + ", selected: " + selectedFramework)
					if(frameElement.hasClass('selected')) {
						if(debug) console.log( 'classList already contains selected -- removing')
						frameElement.removeClass('selected');
						frameElement.offsetParent().click( function() { replaceItemsPanels(fObj.framework) } );
					}
				}
			}
		});
		
		if(debug) console.log("in set selected fr: setting selected to " + selectedFramework + " div");
		$('#selectedFramework').text(selectedFramework);
		var sfObj = frameworkObjArray.find( ({ framework }) => framework === selectedFramework )
		$('#displaySelectedFramework').text('Selected framework: ' + sfObj.frameworkdisplay)
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
	$(function() {
		//if(debug) console.log("updating remove links div with " + termsObj.getCurrentTermsHtml());
		//document.getElementById('removetermlinks').innerHTML = termsObj.getCurrentTermsHtml();
		$('#removetermlinks').html(termsObj.getCurrentTermsHtml());
		//if(debug) console.log("updating search terms div with " + termsObj.getCurrentTerms());
		//document.getElementById('currentsearchterms').innerHTML = termsObj.getCurrentTerms();
		$('#currentsearchterms').html(termsObj.getCurrentTerms());
		$("#suggestion-panel").collapse('hide');
		//***document.getElementById('suggestions').style.display = 'none';
		//document.getElementById('searchtext').value = "";
		$('#searchtext').val('');
	});
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

function getCurrentFramework() {
	$(function() {
		var result = '';
		result = $('#selectedFramework').text();
		if(result=='') {
			result = 'all';
		}
		return result;
	});
}

function addActiveSearchterm(term) {
	const debug = false;
	if(debug) console.log('will add ' + term);
	var framework = getCurrentFramework();
	termsObj.addTerm(term);
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	replaceFilteredItemsPanels(framework);
}

function removeActiveSearchterm(element) {
	const debug = false;
	if(debug) console.log('will remove ' + element.text.trim());
	termsObj.removeTerm(element.text.trim().replace(/\s/g, '+'));
	populateCurrentSearchTermsDiv(termsObj.getCurrentTerms());
	if(debug) console.log("termsObj size: " + termsObj.size())
	var framework = getCurrentFramework();
	if(termsObj.size()==0) {
		replaceItemsPanels('all');
	} else {
		replaceFilteredItemsPanels(framework);
	}
}

$(function() {
  var minlength = 3;
	const debug = false;

$("#searchtext").keyup(function() {
	var oldThis = this,
	value = $(this).val();
	var framework = getCurrentFramework();
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
					//var curSearchField = document.getElementById('currentsearchterms');
					//var curSearchTerms = (curSearchField.innerHTML!=''?curSearchField.innerHTML + ",":"");
					if(debug) console.log("in success 1 with " + msg.result[0] );
					//we need to check if the value is the same
					if (value==$(oldThis).val()) {
						if(debug) console.log("in success 2 in if with " + msg.result[0] );
						$('#suggestion-title').html('Suggestions');
						$('#suggestions').html(getSuggestionPanelHTML(msg.searchWords));
						if(debug) console.log("about to display block on suggestions");
						$("#suggestion-panel").collapse('show');
					}
				} else {
					$('#suggestions').html('');
					//suggElement.innerHTML = '';
					$("#suggestion-panel").collapse('hide');
				}
			}
		});
	 } else {
		$('#suggestions').html('');
		//suggElement.innerHTML = '';
		$("#suggestion-panel").collapse('hide');
	 }
  });
});

$("form").on("submit", function (e) {
	const debug = true;
	var dataString = $(this).serialize();
	var frameworkString = 'framework=' + getCurrentFramework();
	var searchtext = dataString.substring(dataString.indexOf('=')+1, dataString.length);
	if(debug) console.log('in form submit jquery with ' + dataString + ' and searchtext: ' + searchtext);
	$.ajax({
		type: "GET",
		url: "/api/agileframeworks/suggestions?" + frameworkString + '&' + dataString,
		dataType: "json",
		success: function(result) {
			if(debug) console.log('result: ' + result.searchWords[0])
			const found = result.searchWords.find( s => s.toUpperCase().replace(/\s/g, '+') === searchtext.toUpperCase() );
			if(debug) console.log('found: ' + found);
			if(found) {
				addActiveSearchterm(searchtext.replace(/\+/g, '+'));
			} else {
				alert('Select one of the suggestions from the list')
			}
		}
	});
	e.preventDefault();
});

function getSuggestionPanelHTML(searchWordsArray) {
	
	var resultList = '<ul class="suggestions">';
	var jscriptcall = '';
	searchWordsArray.forEach( element => {
	jscriptString = "javascript:addActiveSearchterm('" + element.replace(/\s/g, '+') + "')"
		//if(debug) console.log('adding jscript: |' + jscriptString + '|')
		resultList = resultList + "<li><a href='javascript:void(0);' onclick=" + jscriptString + ">" + element + "</a></li>";
	});
	resultList = resultList + '</ul>';
	
	return resultList;
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
			
/*
var selF = document.getElementById('selectedFramework').innerHTML;
setSelected(selF);
*/
