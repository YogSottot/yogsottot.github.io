/* file group page support scripts
 * @author fahrenheit (alka.setzer@gmail.com)
 * version 1.0 (22.11.2007) - Initial Release
 * version 1.1 (17.04.2008) - Re-added and fixed stuff
 */
 
// GLOBALS
var uriObj = new Array();      // Object that holds the URI
var seeDebug = false;
var gTable = null;
var released_div = null;
var ep_table = null;

/* Converts qualitys to a rate system
 * @param qual Quality
 * @return Quality className
 */
function mapQuality(qualClassName) {
  switch (qualClassName) {
		case 'veryhigh': return (8);
		case 'high': return (7);
		case 'med': return (6);
		case 'low': return (5);
		case 'verylow': return (4);
		case 'corrupted': return (3);
		case 'eyecancer': return (2);
		case 'unknown': return (1);
  }
  return (1);
}

/* Updates the release list rows to allow more sorting options */
function updateReleaseListRows() {
	var table = gTable;
	if (!table) {
		var div = released_div;
		if (!div) return;
		var table = div.getElementsByTagName('table')[0];
	}
	if (!table) return;
	var tbody = table.tBodies[0];
	for (var i = 1; i < tbody.rows.length; i++) { // update each row
		var row = tbody.rows[i];
		var test = row.cells[2];		// Title Cell
		if (test) {
			test.className = test.className.replace('name','title');
			var label = test.getElementsByTagName('label')[0];
			if (label && label.childNodes.length) {
				var a = label.getElementsByTagName('a')[0];
				if (a) {
					var title = a.firstChild.nodeValue;
					test.setAttribute('anidb:sort',title.toLowerCase());
				} else test.setAttribute('anidb:sort','-');
			} else test.setAttribute('anidb:sort','-');
		}
		test = row.cells[5];		// Done Cell
		if (test) {
			var cnt = test.firstChild.nodeValue;
			var neps = cnt.split('+')[0];
			var seps = cnt.split('+')[1];
			cnt = neps+seps;
			test.setAttribute('anidb:sort',cnt);
		}
		test = row.cells[7];		// State Cell
		if (test) {
			a = test.getElementsByTagName('a')[0];
			if (a) {
				var state = a.firstChild.nodeValue;
				test.setAttribute('anidb:sort',state);
			}
		}
		test = row.cells[8];	// Rating Cell
		if (test) {
			var rating = test.firstChild.nodeValue;
			test.setAttribute('anidb:sort',((rating == 'N/A ') ? "0" : rating));
		}
	}
}

/* Updates the release list table with sorting */
function updateReleaseList() {
	var div = released_div;
	if (!div) return;
	gTable = div.getElementsByTagName('table')[0];
	if (!gTable) return;
	var headingList = gTable.getElementsByTagName('th');
	// I know the headings i need so..
	headingList[0].className += ' c_set';			// First
	headingList[1].className += ' c_set';			// Last
	headingList[2].className += ' c_setlatin';		// Title
	headingList[3].className += ' c_number';		// EPS
	headingList[4].className += ' c_number';		// Last
	headingList[5].className += ' c_set';			// Done
	headingList[6].className += ' c_number';		// Undumped
	headingList[7].className += ' c_setlatin';		// State
	headingList[8].className += ' c_set';			// Rating
	headingList[9].className += ' c_number';		// C
	init_sorting(gTable.tBodies[0].rows[0],'title','down');
}

/* Updates the episode list rows to allow more sorting options */
function updateEpTableRows() {
	var table = ep_table;
	if (!table) return;
	var tbody = table.tBodies[0];
	for (var i = 1; i < tbody.rows.length; i++) { // update each row
		var row = tbody.rows[i];
		var test = row.cells[2];	// ID cell
		if (test) {
			var a = test.getElementsByTagName('a')[0];
			if (a) {
				var cnt = a.firstChild.nodeValue;
				test.setAttribute('anidb:sort',cnt);
			}
		}
		test = row.cells[3];		// EP cell
		if (test) {
			var a = test.getElementsByTagName('a')[0];
			if (a) {
				var cnt = a.firstChild.nodeValue;
				test.setAttribute('anidb:sort',cnt);
			}
		}
		test = row.cells[5];		// Size cell
		if (test) {
			// convert to bytes without dots
			var fsize = test.firstChild.nodeValue;
			while(fsize.indexOf('.') > -1) fsize = fsize.replace('.','');
			test.setAttribute('anidb:sort',fsize);
		}
		test = row.cells[6];		// CRC Cell
		if (test) {
			if (!test.childNodes.length) test.setAttribute('anidb:sort','-');
			else test.setAttribute('anidb:sort',test.firstChild.nodeValue);
		}
		test = row.cells[7];		// Quality Cell
		if (test) {
			var span = test.getElementsByTagName('span')[0];
			if (span) {
				var className = span.className.substr(span.className.indexOf('i_rate_')+7,span.className.length);
				test.setAttribute('anidb:sort',mapQuality(className));
			}
		}
		test = row.cells[10];	// Users Cell
		if (test) {
			var a = test.getElementsByTagName('a')[0];
			if (a) {
				var cnt = a.firstChild.nodeValue;
				test.setAttribute('anidb:sort',cnt);
			}
		}
		test = row.cells[12];	// Username
		if (test) {
			var a =  getElementsByClassName(test.getElementsByTagName('a'), 'name', false)[0];
			if (a) {
				var username = a.firstChild.nodeValue;
				test.setAttribute('anidb:sort',username);
			}
		}
	}
}

/* Updates the filelist table with sorting */
function updateEpTable() {
	var table = ep_table;
	if (!table) return;
	var headingList = table.getElementsByTagName('th');
	var updateRows = false;
	// I know the headings i need so..
	headingList[0].className += ' c_none';			// X
	headingList[1].className += ' c_set';			// Date
	headingList[2].className += ' c_set';			// ID
	headingList[3].className += ' c_set';			// EP
	headingList[4].className += ' c_none';			// Group
	headingList[5].className += ' c_set';			// Size
	headingList[6].className += ' c_setlatin';		// CRC
	headingList[7].className += ' c_setlatin';		// Quality
	headingList[8].className += ' c_latin';		// Source
	headingList[9].className += ' c_set';			// Resolution
	headingList[10].className += ' c_set';			// User count
	if (headingList[12]) {
		headingList[12].className += ' c_setlatin';// Username
		updateRows = true;
	}
	if (updateRows) {
		var tbody = table.tBodies[0];
		var thead = document.createElement('thead');
		thead.appendChild(tbody.rows[0]);
		table.insertBefore(thead,tbody);
		var rows = tbody.getElementsByTagName('tr');
		for (var i = 0; i < rows.length; i++)
			rows[i].cells[12].className = 'added_by '+ rows[i].cells[12].className;
	}
	init_sorting(table,'epno','down');
}

function prepPage() {
	uriObj = parseURI(); // update the uriObj
	if (!uriObj['show'] || uriObj['show'] != 'group') return; // badPage
	released_div = getElementsByClassName(document.getElementsByTagName('div'), 'group_released', true)[0];
	ep_table = getElementsByClassName(document.getElementsByTagName('table'), 'filelist', true)[0];
	if (released_div) { // releases
		updateReleaseListRows();
		updateReleaseList();
	}
	if (ep_table) {
		updateEpTableRows();
		updateEpTable();
	}
}

//window.onload = prepPage;
addLoadEvent(prepPage);