import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import KML from 'ol/format/KML';
import { Fill, Stroke, Style } from 'ol/style';

const fill = new Fill({
	color: 'rgba(255,255,255,0.4)'
});

const stroke = new Stroke({
	color: 'red',
	width: 1.0
});

const style = new Style({
	fill: fill,
	stroke: stroke
});

const source = new VectorSource({
	url: '/data/segelsommer2012.kml',
	format: new KML({
		extractStyles: false
	})
});

export const track = () =>
	new VectorLayer({
		source,
		style
	});
