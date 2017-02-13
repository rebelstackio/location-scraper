var httpHelper = {
	SRV : 780,

	url : "http://www.geonames.org/servlet/geonames?&srv=__SRV__&geonameId=__ID__&type=json",

	status: function _status(response) {
		if (response.status >= 200 && response.status < 300) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(new Error(response.statusText));
		}
	},

	json: function _json(response) {
		return response.json();
	},

	getPolygon : function _getPolygon( id ){
		var url = this.url.replace('__SRV__', this.SRV).replace('__ID__', id);
		fetch(url)
		.then(httpHelper.status)
		.then(httpHelper.json)
		.then( function(data) {
			console.log('Geoname Response', data);
			if ( data.shapes && data.shapes.length ) {
				var geoJson = data.shapes[0].geoJson;
				if ( geoJson ) {
					var coordinates = geoJson.coordinates;
					if ( coordinates && coordinates.length ) {
						var polygon = coordinates[0];
						console.log('=========>', polygon);
						return polygon;
						// var polygonLength = polygon.length;
						//
						// for (var i = 0; i < polygonLength ; i++) {
						// 	var latitude  = polygon[i][0];
						// 	var longitude = polygon[i][1];
						// }
					} else {
						console.log('Geoname Response - No coordinate for shapes');
					}
				} else {
					console.log('Geoname Response - No geoJson object');
				}
			} else {
				console.log('Geoname Response - No shapes');
			}
		}).catch(function(error) {
			console.log('Geoname Request - failed to connect', error);
		});
	}
}


/**
 *	Main class, build and handle form
 */
var scraperPop={};

/**
 * buildMainContainer - Build the main container's extension
 *
 * @return {array}	[mainDiv, main, grid]
 */
scraperPop.buildMainContainer = function () {

	// Create main div
	var mainDiv = document.createElement('div');
	mainDiv.setAttribute('class', 'mdl-layout__container');

	// Create main tag
	var main = document.createElement('main');
	main.setAttribute('class', 'mdl-layout__content');

	// Create grid div
	var grid = document.createElement('div');
	grid.setAttribute('class', 'mdl-grid');

	return [mainDiv, main, grid];
}

/**
	* _buildHeaderTable - Build the header page's extension
	*
	* @param	{boolean} skipTitle Flag to skip the title on right corner
	* @return {header}						Extension's header
	*/
scraperPop.buildHeaderTable = function _buildHeaderTable( skipTitle ) {
	var mainDiv = document.createElement('div');
	mainDiv.setAttribute( 'class', 'mdl-cell mdl-cell--12-col no-left-right-margin');

	//logo
	var logo = document.createElement("img");
	var path = chrome.extension.getURL('../icons/icon-48.png')
	logo.setAttribute('src', path);
	logo.setAttribute('alt', "Q'chevere Logo");
	logo.setAttribute('title', "Q'chevere");
	logo.setAttribute('border', '0');

	//Title
	var strongTitle = document.createElement("strong");
	strongTitle.setAttribute('style', "font-size:18px; color:white;");
	var textnode = document.createTextNode("Q'chevere");
	strongTitle.appendChild(textnode);

	mainDiv.appendChild(logo);
	mainDiv.appendChild(strongTitle);

	//Action Title
	if ( !skipTitle ) {
		var strongActionTitle = document.createElement("strong");
		strongActionTitle.setAttribute('style', "margin-top:15px;font-size:14px; color:white; float:right");
		var textnode = document.createTextNode("Nueva Ubicación");
		var eventImage = document.createElement('img');
		eventImage.setAttribute('src', '../icons/ic_explore_white_24px.svg');
		strongActionTitle.appendChild(eventImage);
		strongActionTitle.appendChild(textnode);
		mainDiv.appendChild(strongActionTitle);
	}

	return mainDiv;
}

/**
 * scraperPop - Build the success page
 *
 * @param	{type} scraper		 Scrapper results
 */
scraperPop.buildSccrapperPageForm = function _buildSccrapperPageForm( scraper ) {
	if ( scraper && scraper.status == 'OK') {
		// Create containers
		var arrContainers = this.buildMainContainer();
		var mainDiv = arrContainers[0];
		var main = arrContainers[1];
		var grid = arrContainers[2];

		//Create Header
		var header = this.buildHeaderTable();

		//ASYNC
		var data = httpHelper.getPolygon(scraper.locationID);

		console.log(data);

		grid.appendChild(header);
		main.appendChild(grid);
		mainDiv.appendChild(main);
		componentHandler.upgradeElement(mainDiv);
		document.body.appendChild(mainDiv);
	} else {

	}
}

/**
	* window|addEventListener - Event when the DOM	is ready for manipulation
	*/
window.addEventListener('DOMContentLoaded', function() {
	//Init firebase configuration
	// scraperPop.initFBConfig();
	//Get scrapper info
	chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
		chrome.tabs.sendMessage( tabs[0].id, true, function(res){
				if (res && res.status == 'OK') {
					scraperPop.buildSccrapperPageForm(res);
				} else {

				}
		});
	});
});
