const { init } = require('../handler.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["data/logbook_geo.json","data/segelsommer2012.geojson","data/segelsommer2012.kml","favicon.png","pics/sailing.png"]),
	_: {
		mime: {".json":"application/json",".geojson":"application/geo+json",".kml":"application/vnd.google-earth.kml+xml",".png":"image/png"},
		entry: {"file":"start-247eafe7.js","js":["start-247eafe7.js","chunks/vendor-293183b8.js","chunks/preload-helper-ec9aa979.js"],"css":["assets/vendor-a2c515ad.css"]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js'))
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/logentry\/([^/]+?)\.json$/,
				params: (m) => ({ id: m[1]}),
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/logentry/_id_.json.ts.js'))
			}
		]
	}
});
