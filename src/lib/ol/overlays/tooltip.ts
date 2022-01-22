import { Overlay } from 'ol';
import type { Map, MapBrowserEvent } from 'ol';
import type Layer from 'ol/layer/Layer';
import type Source from 'ol/source/Source';
import type BaseEvent from 'ol/events/Event';

const getFeatureAtEventPixel = (event: MapBrowserEvent<UIEvent>, map: Map) => {
	const layerFilter = (candidate: Layer<Source, any>) => {
		return candidate.get('name') === 'logbook';
	};
	const pixel = map.getEventPixel(event.originalEvent);
	return map.forEachFeatureAtPixel(
		pixel,
		function (feature) {
			return feature;
		},
		{ layerFilter }
	);
};

const clickHandler = (map: Map) => {
	return function (evt: MapBrowserEvent<UIEvent>) {
		const feature = getFeatureAtEventPixel(evt, map);
		if (feature) {
			console.log(feature);
			map.dispatchEvent({ type: 'clickLogbook', feature } as unknown as BaseEvent);
		}
	};
};

const pointermoveHandler = (map: Map, tooltip: Overlay) => {
	return (evt: MapBrowserEvent<UIEvent>) => {
		const feature = getFeatureAtEventPixel(evt, map);
		if (feature) {
			map.getTargetElement().style.cursor = 'pointer';
			tooltip.setPosition(evt.coordinate);
			tooltip.getElement().innerHTML = feature.get('title');
			tooltip.getElement().style.display = '';
		} else {
			map.getTargetElement().style.cursor = '';
			tooltip.getElement().style.display = 'none';
		}
	};
};

export const createTooltipOverlay = (element: HTMLElement, map: Map): Overlay => {
	var overlay = new Overlay({
		element: element,
		offset: [10, 0],
		positioning: 'bottom-left'
	});
	map.addOverlay(overlay);

	// display popup on click
	map.on('click', clickHandler(map));

	// change mouse cursor when over marker
	map.on('pointermove', pointermoveHandler(map, overlay));

	return overlay;
};
