

function ResponsiveTables() {

	var tables = document.getElementsByTagName("table");
	for(var i=0;i<tables.length;i++){
		new ResponsiveTable(tables[i]).Respond();
	}
}

function ResponsiveTable(table) {

	this.table = table;
	
	this.tableRows = table.getElementsByTagName("tr");
	this.tableHead = this.tableRows[0];
	this.InitTableRows();
	
	var instance = this;
	
	window.addEventListener("resize", function() { instance.Respond() });

}

ResponsiveTable.prototype.InitTableRows = function () {
	/* every table row and table row column needs to remember its position */
	for(var i=0; i<this.tableRows.length;i++) {
		for(var j=0; j<this.tableRows[i].children.length;j++) {
			this.tableRows[i].children[j].tablePos= j
		}
	}
}

ResponsiveTable.prototype.Respond = function () {
	while(true) {
		if(this.ShouldShrink()) {
			this.RemoveLeastImportantColumn();
		} else if (this.ShouldExpand()) {
			this.AddMostImportantColumn(i);
		} else { 
			break; 
		}
	}
}

ResponsiveTable.prototype.ShouldShrink = function () {

	return window.innerWidth < this.table.clientWidth;
}

ResponsiveTable.prototype.ShouldExpand = function () {
	return window.innerWidth > this.table.clientWidth;
}



ResponsiveTable.prototype.CountColumns = function () {
	return this.tableRows[0].getElementsByTagName('th').length;
}

ResponsiveTable.prototype.RemoveLeastImportantColumn = function () {
	/* TODO get table head // remove and store to variable */	
	

	var columnNum = this.GetLeastImportantColumn();
	var removed = this.RemoveFromDisplay(columnNum);
	this.InsertBelow(removed);


}

ResponsiveTable.prototype.AddMostImportantColumn = function () {

}

ResponsiveTable.prototype.IsGeneratedRow = function (i) {
	return this.tableRows[i].className.indexOf('generatedRow') > -1;
}

ResponsiveTable.prototype.IsGeneratedRowNext = function (i) {
	var ret = false;
	if(this.tableRows.length > i + 1) {
		ret = this.tableRows[i+1].className.indexOf('generatedRow') > -1;
	} 
	return ret;
}
ResponsiveTable.prototype.GetMostImportantColumn = function () {
	var ret = null; var priority = 0;
	return ret;
}

ResponsiveTable.prototype.GetLeastImportantColumn = function () {
	var ret = null; var priority = 0;
	var row = this.tableRows[0];
	var leastImpt = 0;
	for(var j=0;j<row.children.length;j++) {
		var temp = Number(row.children[j].getAttribute("data-priority"));
		if(temp!==undefined && temp!=null && temp > priority) {
			priority = temp;
			leastImpt = j;
		}
	} return leastImpt;
}

ResponsiveTable.prototype.RemoveFromDisplay = function (columnNumber) {
	this.columnHeader = this.tableRows[0].children[columnNumber].innerHTML;
	this.currentPriority = this.tableRows[0].children[columnNumber].getAttribute("data-priority");
	var ret = new Array(); var j=0;
	for(var i=0;i<this.tableRows.length;i++) {
		if(!this.IsGeneratedRow(i)) {
			ret[j] = this.tableRows[i].removeChild(this.tableRows[i].children[columnNumber]);
			j++;
		}
	} return ret;
}
ResponsiveTable.prototype.InsertBelow = function (removed) {
	// Skip first row (head)
	var j=1;	
	for(var i=1;i<this.tableRows.length;i++) {
		if(!this.IsGeneratedRow(i)) {
			if(!this.IsGeneratedRowNext(i)) {
				this.GenerateRow(i);	
			}
			var elmToAdd = document.createElement('p');
			elmToAdd.setAttribute("data-priority", this.currentPriority);
			elmToAdd.innerHTML = "<span class='title' >" + removed[0].innerHTML + "</span>" +':'+ removed[j].innerHTML + "<br/>";
			this.tableRows[i+1].children[0].appendChild(elmToAdd);
			this.tableRows[i+1].children[0].colSpan = this.CountColumns();
			j++;
		}
	}
}
ResponsiveTable.prototype.GenerateRow = function (i) {
	var genTd = document.createElement('td');
	var genTr = document.createElement('tr');
	genTr.style.display = "none";
	genTr.className = "generatedRow";
	genTr.appendChild(genTd);
	if(this.tableRows.length == i) {
		this.table.children[0].append(genTr);	
	} else {
		this.table.children[0].insertBefore(genTr, this.tableRows[i+1]);
	}
}



