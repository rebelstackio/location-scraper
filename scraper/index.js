/**
 *	scraper - Allows to check the web page location an get ID and coordinatesw
 *  from a region
 *	@author jegj
 */

var scraper = { };


/**
 * _init - Constructor
 *
 */
scraper.init = function _init(){
	if (window == top) {
		console.log('Scraper|init');
		scraper.validPage = this.isGeoNamePage();
		if ( scraper.validPage ) {
			console.log('Scraper|Valid Page');
			var tokens = location.pathname.split('/');
			if ( tokens.length >= 3){
				scraper.locationID = tokens[1];
				scraper.refer = tokens[2];
				scraper.status = 'OK';
			} else {
				scraper.status = 'FAIL';
				scraper.msg = 'Cannot get the ID and refer from URL';
				console.log(scraper.msg, location.href);
			}
		} else {
			scraper.status = 'FAIL';
			scraper.msg = 'The current page is not allowed by the scraper';
			console.log(scraper.msg, location.href);
		}
	}
}

scraper.isGeoNamePage = function _isGeoNamePage(){
	var rxPath = /\/(\d+)\/(\w+)/
	var rxHost = /geonames.org/
	var pathname = window.location.pathname;
	var host = window.location.host;
	if ( host.match(rxHost) ) {
		if (pathname.match(rxPath)) {
			return true;
		}
	}
	return false;
}

scraper.init();

chrome.runtime.onMessage.addListener( function ( DOMContentLoaded, sender, response ) {
	var responseObject = {};

	if ( !!DOMContentLoaded ) {
		responseObject = scraper;
	}
	response(responseObject);
});
