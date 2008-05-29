/* file common tags interfaces and functions
 * @author fahrenheit (alka.setzer@gmail.com)
 * version 1.0 (27.05.2008) - Initial Version
 */

var tags = new Array();
var lastSearch = "";
var searchString = "";
var inactiveSearch = true;
var override = false;
var inputBox = null;
var radioBox = null;
var radioBox2 = null;
var resultsDiv = null;

/* Function that fetches data */
function fetchData(searchString) {
	var req = xhttpRequest();
	if (''+window.location.hostname == '') xhttpRequestFetch(req, 'xml/tagsearch.xml', parseData);
	else xhttpRequestFetch(req, 'animedb.pl?show=xml&t=tagsearch&search='+escape(searchString), parseData);
}

/* XMLHTTP RESPONSE parser
 * @param xmldoc Response document
 */
function parseData(xmldoc) {
	var root = xmldoc.getElementsByTagName('root').item(0);
	if (!root) { if (seeDebug) alert('Error: Could not get root node'); return; }
	var tagNodes = root.getElementsByTagName('tag');
	tags = new Array();
	for (var t = 0; t < tagNodes.length; t++)
		tags.push(new CTag(tagNodes[t]));
	showResults();
}

function showResults() {
	resultsDiv = document.getElementById('resultsDiv');
	if (resultsDiv) resultsDiv.parentNode.removeChild(resultsDiv);
	var div = document.createElement('div');
	div.id = 'resultsDiv';
	div.className = 'quickResults';
	for (var i = 0; i < tags.length; i++) {
		var tag = tags[i];
		var b = document.createElement('b');
		var span = document.createElement('span');
		var si = tag.name.toLowerCase().indexOf(searchString);
		if (si >= 0) {
			var firstBlock = document.createTextNode(tag.name.substring(0,si-1));
			var middleBlock = document.createTextNode(tag.name.substring(si,searchString.length));
			var lastBlock = document.createTextNode(tag.name.substring(si+searchString.length,tag.name.length));
			span.appendChild(firstBlock);
			b.appendChild(middleBlock);
			span.appendChild(b);
			span.appendChild(lastBlock);
		} else continue;
		span.id = 'tag_'+i;
		span.onmouseout = function onmouseout(event) { this.style.backgroundColor = 'transparent'; }
		span.onmouseover = function onmouseover(event) { this.style.backgroundColor = '#FFCC99'; }
		span.onclick = function onclick(event) {
			var id = Number(this.id.substr(4,this.id.length));
			var tag = tags[id];
			inputBox.value = tag.name;
			radioBox.checked = tag.is_spoiler;
			radioBox2.checked = !tag.is_spoiler;
			resultsDiv.style.display = 'none';
		}
		div.appendChild(span);
		div.appendChild(document.createElement('br'));
	}
	//div.onmouseout = function onmouseout(event) { this.style.display = 'none'; }
	inputBox.parentNode.appendChild(div);
	resultsDiv = div;
}

function checkSearchString() {
	if (this.value.length < 4 && !override) return;
	var ll = lastSearch.length;
	var cl = this.value.length;
	var c1 = lastSearch.substr(0,Math.min(ll,cl));
	var c2 = this.value.substr(0,Math.min(ll,cl));
	//alert('lastSearch: '+lastSearch+'\nsearch: '+this.value+'\nc1: '+c1+'\nc2: '+c2);
	var doSearch = false;
	if (c1.toLowerCase() == c2.toLowerCase() && ll && cl) doSearch = false;
	else doSearch = true;
	lastSearch = this.value;
	searchString = this.value;
	if (doSearch) fetchData(this.value);
	else showResults();
}

/* Tag Node Parser */
function CTag(node) {
	this.id = Number(node.getAttribute('id'));
	this.is_spoiler = Number(node.getAttribute('is_spoiler'));
	this.name = node.getAttribute('name');
}

/* Function that prepares the page */
function prepPage() {
	var divs = document.getElementsByTagName('div');
	var divAddtag = getElementsByClassName(divs, 'animetag_add', true)[0];
	if (divAddtag) {
		var inputs = divAddtag.getElementsByTagName('input');
		inputBox = getElementsByName(inputs, 'addtag.name', true)[0];
		radioBox = getElementsByName(inputs, 'addtag.spoiler', true)[0];
		radioBox2 = getElementsByName(inputs, 'addtag.spoiler', true)[1];
		inputBox.onkeyup = checkSearchString;
	}
}

// hook up the window onload event
addLoadEvent(prepPage);
