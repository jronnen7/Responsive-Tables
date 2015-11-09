

function ResponsiveTables() {

	var tables = document.getElementsByTagName("table");
	for(var i=0;i<tables.length;i++){
		new ResponsiveTable(tables[i]);
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
	/* TODO */
	return this.CountColumns()>3;
}

ResponsiveTable.prototype.ShouldExpand = function () {
	/* TODO */
	return false;
}


ResponsiveTable.prototype.GetNumberOfColumns = function () {
	var ret = 3;
	/* TODO */
	return ret;
}

ResponsiveTable.prototype.CountColumns = function (i) {
	return this.tableRows[0].getElementsByTagName('td').length;
}

ResponsiveTable.prototype.RemoveLeastImportantColumn = function () {
	/* TODO get table head // remove and store to variable */	
	for(var i=1;i<this.tableRows[i].length;i++) {
		if(!this.IsGeneratedRow()) {
			var column = this.GetLeastImportantColumn(i);
			this.RemoveFromDisplay(column, i);
			if(!this.IsGeneratedColumnNext(i)) {
				this.GenerateRow(i);
			} 
			this.InsertBelow(column, i);
		}
	}
}

ResponsiveTable.prototype.AddMostImportantColumn = function () {

}

ResponsiveTable.prototype.IsGeneratedRow = function (i) {
	return this.tableRows[i].className.indexOf('generatedRow') > -1;
}

ResponsiveTable.prototype.IsGeneratedColumnNext = function (i) {
	var ret = false;
	if(this.tableRows.length > i + 1) {
		ret = this.tableRows[i+1].className.indexOf('generatedRow') > -1;
	} 
	return ret;
}
ResponsiveTable.prototype.GetMostImportantColumn = function (i) {
	var ret = null; var priority = 0;
	return ret;
}

ResponsiveTable.prototype.GetLeastImportantColumn = function (i) {
	var ret = null; var priority = 0;
	var row = this.tableHead;
	var leastImpt = 0;
	for(var j=0;j<row.children.length;j++) {
		var temp = row.children[j].getAttribute("data-priority");
		if(temp!==undefined && temp!=null && temp > priority) {
			leastImpt = j;
		}
	} return this.tableRows[i].children[leastImpt];
}

ResponsiveTable.prototype.RemoveFromDisplay = function (column, i) {
	this.tableRows[i].removeChild(column);
}
ResponsiveTable.prototype.InsertBelow = function (column, i) {
	this.tableRows[i+1].innerHTML += column.innerHTML;
}
ResponsiveTable.prototype.GenerateRow = function (column, i) {
	var genTr = document.createElement('tr');
	genTr.innerHTML = column;
	genTr.style.display = "none";
	this.table.children[0].insertBefore(genTr, this.tableRows[i]);
}



