

function ResponsiveTables() {

	var tables = document.getElementsByTagName("table");
	for(var i=0;i<tables.length;i++){
		new ResponsiveTable(tables[i]);
	}
}

function ResponsiveTable(table) {

	this.table = table;
	
	this.UpdateRows();
	this.tableHead = this.tableRows[0];
	
	var instance = this;
	var calls = 0; // limit the respond call to timer interval
	window.addEventListener("resize", 
		function() { 
			calls++;
			if(calls == 1) {
				setTimeout(function () { instance.Respond() },350);
				calls = 0;
			} 
	});



	this.Respond(); //initialize

}

ResponsiveTable.prototype.UpdateRows = function () {
	this.tableRows = this.table.getElementsByTagName("tr");
}

ResponsiveTable.prototype.Respond = function () {
	while(true) {
		if(this.ShouldShrink()) {
			this.RemoveLeastImportantColumn();
		} else if (this.ShouldExpand()) {
			this.AddMostImportantColumn();
		} else { 
			break; 
		}
	}
}

ResponsiveTable.prototype.AreGeneratedRowsPresent = function () {
	return this.table.getElementsByClassName('generatedRow').length > 0;
}

ResponsiveTable.prototype.WidthOfNextColumn = function () {
	var ret=0; var genRows = this.table.getElementsByClassName('generatedRow');
	if(genRows.length > 0) {
		ret = genRows[0].children[0].lastChild.getAttribute("data-width");
	}
	return Number(ret);
	
}

ResponsiveTable.prototype.ShouldShrink = function () {
	return window.innerWidth < this.table.clientWidth;
}

ResponsiveTable.prototype.ShouldExpand = function () {
	var ret=false;	
	if(this.AreGeneratedRowsPresent()){
		if(window.innerWidth > (this.table.clientWidth + this.WidthOfNextColumn())) {
			ret = true;
		}
	} return ret;
}



ResponsiveTable.prototype.CountColumns = function () {
	return this.tableRows[0].getElementsByTagName('th').length;
}

ResponsiveTable.prototype.RemoveLeastImportantColumn = function () {
	var columnNum = this.GetLeastImportantColumn();
	if(columnNum > -1) {
		this.currentPosistion = columnNum;
		var removed = this.RemoveFromDisplay(columnNum);
		this.InsertBelow(removed);
	}
}

ResponsiveTable.prototype.RemovePTagAndGenerateRow = function (i) {
	var ret;
	var pTag = this.tableRows[i].children[0].removeChild(this.tableRows[i].children[0].lastChild);
	ret = document.createElement('td');
	ret.innerHTML = pTag.children[1].innerHTML;
	return ret;
	
}
ResponsiveTable.prototype.GenerateHeadColumn = function (i) {
	var ret;
	var pTag = this.table.getElementsByClassName('generatedRow')[0].children[0].lastChild;
	ret = document.createElement('th');
	ret.innerHTML = pTag.children[0].innerHTML;
	ret.setAttribute("data-priority", pTag.getAttribute("data-priority"));	
	this.currentPosistion = Number(pTag.getAttribute("data-position"));
	return ret;
	
}
ResponsiveTable.prototype.GetColumnsToAdd = function () {
	var ret = new Array(); var j=1;
	ret[0] = this.GenerateHeadColumn();
	for(var i=1;i<this.tableRows.length;i++){
		if(this.IsGeneratedRow(i)) {
			ret[j]=this.RemovePTagAndGenerateRow(i);
			j++;
		}	
	} return ret;
}

ResponsiveTable.prototype.AddMostImportantColumn = function () {
	var columns = this.GetColumnsToAdd();
	if(columns.length > 0) {
		this.AddToDisplay(columns);
	} this.TryCleaningUpGeneratedDivs();
}

ResponsiveTable.prototype.IsGeneratedRow = function (i) {
	return this.tableRows[i].className.indexOf('generatedRow') > -1;
}

ResponsiveTable.prototype.TryCleaningUpGeneratedDivs = function () {
	var genRows = this.table.getElementsByClassName('generatedRow');
	var length = genRows.length;
	if(genRows.length > 0 && genRows[0].children[0].children.length == 0) {
		for(var i=0;i<length;i++){
			this.table.children[0].removeChild(genRows[0]);
		} this.UpdateRows();	
	}
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
	var leastImpt = -1;
	for(var j=0;j<row.children.length;j++) {
		var temp = Number(row.children[j].getAttribute("data-priority"));
		if(temp!==undefined && temp!=null && temp > priority) {
			priority = temp;
			leastImpt = j;
		}
	} return leastImpt;
}

ResponsiveTable.prototype.AddToDisplay = function (columns) {
	var j=0;
	for(var i=0;i<this.tableRows.length;i++) {
		if(!this.IsGeneratedRow(i)) {
			if(this.tableRows[i].children.length == this.currentPosistion) {
				this.tableRows[i].append(columns[j]);
				//this.table.children[0].append(genTr);	
			} else {
				this.tableRows[i].insertBefore(columns[j], this.tableRows[i].children[this.currentPosistion]);
				//this.table.children[0].insertBefore(genTr, this.tableRows[i+1]);
			} j++;	
		}
	}
}

ResponsiveTable.prototype.RemoveFromDisplay = function (columnNumber) {
	this.columnHeader = this.tableRows[0].children[columnNumber].innerHTML;
	this.currentPriority = this.tableRows[0].children[columnNumber].getAttribute("data-priority");
	this.currentWidth = this.tableRows[0].children[columnNumber].clientWidth;

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
			elmToAdd.setAttribute("data-position", this.currentPosistion);
			elmToAdd.setAttribute("data-width", this.currentWidth);
			elmToAdd.innerHTML = "<span class='title' >" + removed[0].innerHTML + "</span>" +':'+ "<span class='desc' >" + removed[j].innerHTML  + "</span>" + "<br/>";
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
	this.UpdateRows();
}



