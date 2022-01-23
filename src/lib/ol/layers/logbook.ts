import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Icon } from 'ol/style';

const attributions =
	'<a href="https://www.vecteezy.com/free-vector/web" target="_blank">&copy; Web Vectors by Vecteezy</a>';

const markerStyle = new Style({
	image: new Icon({
		crossOrigin: 'anonymous',
		// For Internet Explorer 11
		imgSize: [100, 100],
		src: 'pics/marker-tss.svg',
		scale: 0.4,
		opacity: 1,
		anchor: [0.5, 50],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels'
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
