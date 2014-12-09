F2013.loadGraph = function() {
	if (F2013.graphLoaded) return;
	var div = $("#wbc-graph"); 
	var datasets = {};
	var lineChartData = {labels: [], datasets : []};
	var numberOfPlayers = 0;
	var partOfGraph = localStorage.partOfGraph !== undefined ? JSON.parse(localStorage.partOfGraph) : {};
	var lineChart;
	$.mobile.loading("show", {text: "Henter graf...", textVisible: true, textonly: false, theme: "a"});
	$.ajax({url: F2013.gameHost+'ws/wbc?graph', dataType: 'json'}).done(function(data, textStatus, jqXHR) {		var colors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"]
		var fieldset = $("#wbc-checkboxes");
		var playerColorIndex = 0;
		$.each(data, function(index) {
			lineChartData.labels.push(this.race.name);
			$.each(this.positions, function() {
				if (datasets[this.player.playername] === undefined) {
					numberOfPlayers++;
					var color = colors[playerColorIndex++]; 
					datasets[this.player.playername] = {
							strokeColor: color,
							data: []
					}
					var checkbox = $("<input>").prop("type", "checkbox").prop("id", this.player.playername).prop("name", this.player.playername);
					if (partOfGraph[this.player.playername] === undefined) partOfGraph[this.player.playername] = true;
					checkbox.prop("checked", partOfGraph[this.player.playername]);
					var label = $("<label>").prop("for", this.player.playername).text(this.player.name).css("color", color);
					fieldset.append(checkbox).append(label);
				}
				datasets[this.player.playername].data[index] = this.position;
			});
	
		});
		$("#wbc-graph").trigger("create");
		createGraph();
		handleCollapseAndExpand();
		F2013.graphLoaded = true;
		$.mobile.loading("hide");
	}).fail(function(jqxhr, textStatus, error) {
		gotoErrorPage(error);
	});
	
	var createGraph = function() {
		lineChartData.datasets = [];
		$.each(datasets, function(playername, dataset) {
			if (partOfGraph[playername] == true) lineChartData.datasets.push(dataset);
		});
		$("#graph").height($("#wbc-graph-slider").height() - $("#wbc-graph").outerHeight());
		var canvas = $("#canvas")[0]; 
		canvas.width= $("#graph").width();
		canvas.height = $("#graph").height();
		lineChart = lineChart || new Chart(canvas.getContext("2d"));
		lineChart.Line(lineChartData, {
			scaleOverride : true,
			scaleSteps : numberOfPlayers,
			scaleStepWidth : -1,
			scaleShowLabels : false, 
			scaleStartValue: numberOfPlayers+1,
			animation : false, 
			datasetFill : false, 
			datasetStrokeWidth : 4, 
			pointDot : false, 
			bezierCurve : false});
	}

	var handleCollapseAndExpand = function() {
		
		var collapsedSize = $("#wbc-graph").height();
		$("#wbc-graph").on("expand", function(event, ui) {
			if ($("#wbc-graph-slider").height() < $("#wbc-graph").height()) {
				F2013.graphSize = $("#home").height()+($("#wbc-graph").height()-collapsedSize);
				$("#home").height(F2013.graphSize);
			}
		});
		$("#wbc-graph").on("collapse", function(event, ui) {
			$("#home").height(F2013.graphSize = F2013.homeSize);
			$(":checkbox").each(function() {
				partOfGraph[this.id] = this.checked;
			});
			localStorage.partOfGraph = JSON.stringify(partOfGraph);
			createGraph();
		});	
	}
}