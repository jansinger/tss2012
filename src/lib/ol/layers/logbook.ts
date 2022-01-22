import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';

const attributions =
	'<a href="https://www.vecteezy.com/free-vector/web" target="_blank">&copy; Web Vectors by Vecteezy</a>';

const markerStyle = new Style({
	image: new Icon({
		color: 'rgba(255, 0, 0, .5)',
		crossOrigin: 'anonymous',
		// For Internet Explorer 11
		src: 'pics/sailing.png',
		scale: 0.2
	})
});

export const logbook = new VectorLayer({
	source: new VectorSource({
		url: 'data/logbook_geo.json',
		format: new GeoJSON(),
		attributions: attributions
	}),
	style: markerStyle,
	properties: {
		name: 'logbook'
	}
});
