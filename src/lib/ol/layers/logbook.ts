import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Cluster } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style';

export const markerStyle = new Style({
	image: new Icon({
		crossOrigin: 'anonymous',
		// For Internet Explorer 11
		imgSize: [100, 100],
		src: '/pics/marker-tss.svg',
		scale: 0.4,
		opacity: 1,
		anchor: [0.5, 100],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels'
	})
});

const source = new VectorSource({
	url: '/data/logbook_geo.json',
	format: new GeoJSON()
});

const clusterSource = new Cluster({
	distance: 40,
	minDistance: 20,
	source: source
});

const styleCache = {};
export const logbook = new VectorLayer({
	source: clusterSource,
	style: function (feature) {
		const size = feature.get('features').length;
		let style = styleCache[size];
		if (!style) {
			if (size === 1) {
				style = markerStyle;
			} else {
				style = new Style({
					image: new CircleStyle({
						radius: 15,
						stroke: new Stroke({
							color: '#fff'
						}),
						fill: new Fill({
							color: '#2e6287'
						})
					}),
					text: new Text({
						text: size.toString(),
						fill: new Fill({
							color: '#fff'
						})
					})
				});
			}
			styleCache[size] = style;
		}
		return style;
	},
	properties: {
		name: 'logbook'
	}
});
