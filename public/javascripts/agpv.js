let keywords = new Keywords();

$(document).ready(setup);

function setup() {
  //console.log('calling replaceFrameworksPanel from setup()')
  replaceFrameworksPanel('all');
  replaceItemsPanels('all');
  inflateKeywordLookupMap();
  $('#matchtype').hide();
}

var isSmallViewport = window.matchMedia("(max-width: 1000px)");
var searchRequest = null;
var frameworkObjArray = new Array ();

let termsObj = new CurrentTermsObject();

function CurrentTermsObject() {
  const debug = false;
  this.currentTermsMap = new Map(),
  this.currentTermsString = "",
  this.match = 'any',
  this.getCurrentTermsHtml = function() {
    var termsHtml = "";
    for( let str of this.currentTermsMap.values() ) {
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
    for(let m of this.currentTermsMap.keys()) {
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

function selectReplaceItemsPanels(event) {
  const wasSelected = event.data.wasSelected;
  const framework = event.data.framework;
  var adjustedFramework = (wasSelected?'all':framework);
  setSelected(adjustedFramework);
  replaceItemsPanels(adjustedFramework);
}

function replaceItemsPanels(framework) {
  const debug = false;
  let url;
  if(debug) console.log('in replaceItemsPanels with ' + framework);
  if(termsObj.size() > 0) {
    if(debug) console.log('in replaceitemspanels, termsObj size should be >0 and is ' + termsObj.size() );
    url = "/api/agileframeworks/search?framework=" + framework + "&searchwords=" + termsObj.getCurrentTerms() + '&match=' + termsObj.match;
  } else {
    if(debug) console.log('in replaceitemspanels, termsObj size should be 0 and is ' + termsObj.size() );
    url = "/api/agileframeworks/" + framework;
  }
  if(debug) console.log('url: ' + url);
  $.ajax({
    type: "GET",
    url: url,
    dataType: "json",
    success: function(result) {
      if(debug) console.log("result.items count: " + result.items.length)
      populateItemsPanels(result.items);
      setMenuCollapsed(isSmallViewport);
    }
  });
}

function populateItemsPanels( objs ) {
  var panel = $('#itemsPanels');
  panel.html('');
  try {
    if(objs.length==0) {
      var paneldiv = $(document.createElement('div'));
      paneldiv.addClass('panel panel-primary');
      var panelheadingdiv = $(document.createElement('div'));
      panelheadingdiv.addClass('panel-heading');
      var itemTitle = $(document.createElement('h3'));
      itemTitle.addClass('panel-title');
      itemTitle.html('No items match in this framework');
      var panelbodydiv = $(document.createElement('div'));
      panelbodydiv.addClass('panel-body');
      panel.append(paneldiv.append(panelheadingdiv.html(itemTitle)).append(panelbodydiv));
    } else {
      objs.forEach( obj => {
        var paneldiv = $(document.createElement('div'));
        paneldiv.addClass('panel panel-primary ' + obj.type );
        var panelheadingdiv = $(document.createElement('div'));
        panelheadingdiv.addClass('panel-heading');
        var itemTitle = $(document.createElement('h3'));
        itemTitle.addClass('panel-title');
        itemTitle.html( obj.frameworkdisplay + " " + obj.type + " " + obj.id );
        var panelbodydiv = $(document.createElement('div'));
        panelbodydiv.addClass('panel-body');
        panelbodydiv.html(obj.text);
        panel.append(paneldiv.append(panelheadingdiv.html(itemTitle)).append(panelbodydiv));
      });
    }
  } catch(err) {
    console.log('error in populateItemsPanels2 with ' + err);
  }
}

function replaceFilteredItemsPanels(framework) {
	const debug = false;
	if(debug) console.log("will ajax for items with /api/agileframeworks/search?framework=" + framework + '&searchwords=' + termsObj.getCurrentTerms() + '&match=' + termsObj.match);
	
	$.ajax({
		type: "GET",
		url: url = "/api/agileframeworks/search?framework=" + framework + '&searchwords=' + termsObj.getCurrentTerms() + '&match=' + termsObj.match,
		dataType: "json",
		success: function(result) {
			if(debug) console.log("result size: " + result.items.length)
			populateItemsPanels(result.items);
			populateCurrentSearchTermsDiv();
		}
	});
}

function populateFrameworksPanel( objs ) {
	const debug = false;
	var framework = "";
	var obj = new Object();
	var itemsHtml = "";
	var jscriptString = "";
	frameworkObjArray = objs;
	var panel = $('#frameworksMenuPanel');
	if(debug) console.log('setting up frameworks panel html')
	var litag = "";
	var atag = "";
	var lis = "";
	
	var paneldiv = $("<div class='panel panel-primary'>");
	var headingdiv = $("<div class='panel-heading'>");
	var asidepanel = "<a id='sidepanelheader' href='#sidepanel' data-toggle='collapse'><h3 class='panel-title'><div id='fmenu-panel-title-div'>Frameworks</div><div id='displaySelectedFramework'></div></h3></a>";
	var panelcollapse = $("<div class='panel-collapse collapse' id='sidepanel'>");
	var ullist = $("<ul class='list-group'>");
	objs.forEach( obj => {
		//if(debug) console.log('in forEach with ' + obj.framework)
		litag = "<li class='list-group-item'>";
		//jscriptString = "onclick=\'javascript:replaceItemsPanels(\"" + obj.framework + "\")\'";
		atag = "<a class=\'menu\' href=\'javascript:void(0)\' onclick=''" + jscriptString + "> <span id=\'" + obj.framework + "\'>" + obj.frameworkdisplay + "</span></a>";
		lis += litag + atag + "</li>"
	});
	ullist.html(lis);
	panel.append(paneldiv.html(headingdiv.html(asidepanel)).append(panelcollapse.html(ullist)))

	//if(debug) console.log('setsidepanel');
	//if(debug) console.log('about to populate frameworksMenuPanel with ' + itemsHtml);
	//document.getElementById('frameworksMenuPanel').innerHTML = itemsHtml;
	//$('#frameworksMenuPanel').html(itemsHtml);
	frameworkObjArray.push({framework:'all', frameworkdisplay:'All'})
}

function setMenuCollapsed(isSmallViewport) {
	const debug = false;
	if(debug) console.log('calling set Menu Collapsed');
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
}

function setSelected(selectedFramework) {
  const debug = false;
  var wasSelected = false;
  if(debug) console.log('set selected fra: selF: ' + selectedFramework);
  var frameElement;
  frameworkObjArray.forEach( fObj => {
    if(debug) console.log("in set selected fr: in array loop removing selected on " + fObj.framework + " div");
    frameElement = $('#' + fObj.framework);
    if(frameElement && fObj.framework != 'all') {
      if(debug) console.log( 'frameElement: ' + frameElement.attr('id') )
      if( fObj.framework == selectedFramework ) {
          if(debug) console.log('f is selected. f:' + fObj.framework + ", selected: " + selectedFramework + ", wasSelected: " + wasSelected)
          if(frameElement.hasClass('selected')) {
          wasSelected = false;
          if(debug) console.log( 'classList contains selected')
          frameElement.removeClass('selected');
        } else {
          wasSelected = true;
          if(debug) console.log( 'classList does not already contain selected')
          frameElement.addClass('selected');
          if(debug) console.log('has selected? ' + frameElement.hasClass('selected'))
        }
      } else { //this is not the currently selected framework
        wasSelected = false;
        if(debug) console.log('f is NOT selected. f:' + fObj.framework + ", selected: " + selectedFramework)
        if(debug) console.log('adding click replace items panels with ' + fObj.framework);
        if(frameElement.hasClass('selected')) {
          if(debug) console.log( 'classList already contains selected -- removing')
          frameElement.removeClass('selected');
        }
      }
      if(debug) console.log('in set selected calling on click for ' + fObj.framework + ", " + wasSelected);
      frameElement.parent().parent().off().on('click', function() { alert("didn't work"); } );
      frameElement.parent().parent().off().on('click', { framework: fObj.framework, wasSelected: wasSelected }, selectReplaceItemsPanels );
      if(debug) console.log('parent:' + frameElement.parent().parent().html() + ', click:' + frameElement.parent().parent().attr('click'))
      if(debug) console.log('html: ' + frameElement.html())
    }

    if(debug) console.log("in set selected fr: setting selected to " + selectedFramework + " div");
    $('#selectedFramework').text(selectedFramework);
    var sfObj = frameworkObjArray.find( ({ framework }) => framework === selectedFramework )
    if(debug) console.log("in set selected--setting display selected field using " + selectedFramework + " to " + sfObj.frameworkdisplay);
    $('#displaySelectedFramework').text('Selected framework: ' + sfObj.frameworkdisplay);
  });
}

function populateCurrentSearchTermsDiv() {
  $('#removetermlinks').html(termsObj.getCurrentTermsHtml());
  $('#currentsearchterms').html(termsObj.getCurrentTerms());
  $("#suggestion-panel").collapse('hide');
  $('#searchtext').val('');
}

function replaceFrameworksPanel(framework) {
  $.ajax({
    type: "GET",
    url: "/api/agileframeworks/frameworks/",
    dataType: "json",
    success: function(result) {
      populateFrameworksPanel(result.AFs);
      setSelected(framework);
      isSmallViewport.addListener(setMenuCollapsed);
      setMenuCollapsed(isSmallViewport);
    }
  });
}

function getCurrentFramework() {
	var debug = false; 
	var result = '';
	result = $('#selectedFramework').html();
	if(debug) console.log('in getcurrentframework got ' + result + 'from #selectedFramework')
	if(result=='') {
		result = 'all';
	}
	if(debug) console.log('now result is ' + result)
	return result;
}

function addActiveSearchterm(term) {
  const debug = false;
  if(debug) console.log('will add ' + term);
  var framework = getCurrentFramework();
  termsObj.addTerm(term);
  if(termsObj.size()>1) {
    $('#matchtype').show();
  } else {
    $('#matchtype').hide();
  }
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
  if(termsObj.size()>0) {
    if(termsObj.size()>1) {
      $('#matchtype').show();
    } else {
      $('#matchtype').hide();
    }
    replaceFilteredItemsPanels(framework);
  } else {
    replaceItemsPanels(framework);
  }
}

$(function() {
  const debug = false;
  var minlength = 3;
  $("#searchtext").keyup(function() {
    var oldThis = this,
    value = $(this).val();
    if (value.length >= minlength ) {
      var framework = getCurrentFramework();
      let searchWordsArray = keywords.getKeywordMatches(framework, value);
      if(searchWordsArray[0]) {
        if(debug) console.log("in keyup length:" + searchWordsArray.length );
        $('#suggestion-title').html('Suggestions');
        $('#suggestions').html(getSuggestionPanelHTML(searchWordsArray));
        if(debug) console.log("about to display block on suggestions");
        $("#suggestion-panel").collapse('show');
      } else {
        $('#suggestions').html('');
        $("#suggestion-panel").collapse('hide');
      }
    } else {
      $('#suggestions').html('');
      $("#suggestion-panel").collapse('hide');
    }
  });
});

$("form").on("submit", function (e) {
  const debug = false;
  if(debug) console.log('in form on submit')
  var dataString = $(this).serialize();
  var framework = getCurrentFramework();
  var searchtext = dataString.substring(dataString.indexOf('=')+1, dataString.length);
  if(debug) console.log('in form submit jquery with ' + dataString + ' and searchtext: ' + searchtext);
  let searchWordsArray = keywords.getKeywordMatches(framework, searchtext);
  if( searchWordsArray.length > 0 ) {
    addActiveSearchterm(searchtext.replace(/\+/g, '+'));
  } else {
    alert('Select one of the suggestions from the list')
  }
  e.preventDefault();
});

$('#matchtype').on('click', function(e) {
  const debug = false;
  termsObj.match = (termsObj.match.toLowerCase()=='all'?'any':'all');
  //if(debug) console.log('clicked it with ' + termsObj.match.toUpperCase());
  $('#matchtype').text(termsObj.match.toUpperCase());
  const framework = getCurrentFramework();
  if(termsObj.size()>0) {
    if(debug) console.log('in match type calling replace fil items penal with ' + framework);
    replaceFilteredItemsPanels(framework);
  } else {
    if(debug) console.log('in match type calling repl items with ' + framework + ', ' + false);
    // always false because this is not being called by clicking the frameworks menu item so should not deselect
    replaceItemsPanels(framework);
  }
});

function getSuggestionPanelHTML(searchWordsArray) {
  var debug = false;
  var resultList = '<ul class="suggestions">';
  var jscriptcall = '';
  searchWordsArray.forEach( element => {
    jscriptString = "javascript:addActiveSearchterm('" + element.replace(/\s/g, '+') + "')"
    if(debug) console.log('adding jscript: |' + jscriptString + '|')
    resultList = resultList + "<li><a href='javascript:void(0);' onclick=" + jscriptString + ">" + element + "</a></li>";
  });
  resultList = resultList + '</ul>';

  return resultList;
}

function inflateKeywordLookupMap() {
  const debug = false;
  if(debug) console.log('calling inflate...')
  $.ajax({
    type: "GET",
    url: "/api/agileframeworks/getkeywordsmap",
    dataType: "json",
    success: function(msg){
      const keywordLookupArray = msg.array;
      if(debug) console.log('keywordLookupArray size:' + keywordLookupArray.length)
      let count = 0;
      keywordLookupArray.forEach( el => {
        keywords.addKeyword(el.keyword, el.itemFinders );
        if(debug) if(++count%100==0) console.log(count + ':added:' + el.keyword)
      });
      if(debug) console.log("k size:" + keywords.size())
    }
  });
}

function Keywords() {
  this.refresh = false;
  this.keywordLookupMap = new Map();
  this.addKeyword = function(k,v) {
    this.keywordLookupMap.set(k,v);
  }
  this.size = function() {
    return this.keywordLookupMap.size;
  }
  this.getKeywordMatches = function(framework, searchtext) {
    const debug = false;
    let str = '';
    let result = new Array();
    let rightframework = false;
    function compareValues(value, key, map) {
      if(debug) console.log('on:' + key)
      str = key.substring(0, searchtext.length);
      if(debug) console.log('on ' + key + ' with ' + searchtext)
      rightframework = false;
      if(framework=='all') {
        rightframework = true;
      } else {
        for( const i of value ) {
          if(i.framework === framework) rightframework = true;
        }
      }
      if( rightframework && str.toUpperCase() === searchtext.toUpperCase() ) {
        result.push(key);
      }
    }
    this.keywordLookupMap.forEach( compareValues );
    return result;
  }
  this.refresh = function(bool) {
    this.refresh = bool;
  }
}

function Item(framework, type, ordinal) {
	this.framework = framework;
	this.type = type;
	this.ordinal = ordinal;
	this.toString = function() {
		return this.framework + "|" + this.type + "|" + this.ordinal;
	}
}

function Items() {
	this.itemMap = new Map();
	this.addItem = function(item) {
		this.itemMap.set(item.toString(), item);
	}
}
