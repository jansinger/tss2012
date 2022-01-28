import { Feature, Overlay } from 'ol';
import type { Map, MapBrowserEvent } from 'ol';
import type Layer from 'ol/layer/Layer';
import type Source from 'ol/source/Source';
import type BaseEvent from 'ol/events/Event';
import type Geometry from 'ol/geom/Geometry';
import type RenderFeature from 'ol/render/Feature';

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
			map.dispatchEvent({ type: 'clickLogbook', feature } as unknown as BaseEvent);
		}
	};
};

export const createTooltipOverlay = (element: HTMLElement, map: Map): Overlay => {
	const showEntryPreview = (feature: Feature<Geometry>, tooltip: Overlay) => {
		const title = feature.get('title');
		const datetime = feature.get('datetime');
		const time = feature.get('localeDatetime');
		const address = feature.get('section');
		const picture = feature.get('picture');
		const pictureTitle = feature.get('pictureTitle');
		element.innerHTML = `<div class="right">
		<img src="https://pics.fritsjen.de/blog/${picture}" title="${pictureTitle}" />
		<div class="text-content">
			<time datetime="${datetime}">${time}</time>
			<address>${address}</address>
			<h3>${title}</h3>
		</div>
		<i></i>
		</div>`;
	};

	let feature: Feature<Geometry> | RenderFeature = null;
	const pointermoveHandler = (map: Map, tooltip: Overlay) => {
		return (evt: MapBrowserEvent<UIEvent>) => {
			const newfeature = getFeatureAtEventPixel(evt, map);
			if (feature === newfeature) {
				// only set new position if feature has not changed
				feature && tooltip.setPosition(evt.coordinate);
				return;
			}
			if (newfeature) {
				map.getTargetElement().style.cursor = 'pointer';
				const features = newfeature.get('features');
				if (features.length === 1) {
					feature = newfeature;
					showEntryPreview(features[0], tooltip);
					element.style.display = '';
					tooltip.setPosition(evt.coordinate);
				}
			} else {
				map.getTargetElement().style.cursor = '';
				// element.style.display = 'none';
				overlay.setPosition(undefined);
			}
		};
	};

	var overlay = new Overlay({
		element: element,
		offset: [5, 0],
		positioning: 'bottom-left',
		autoPan: {
			animation: {
				duration: 250
			}
		}
	});
	map.addOverlay(overlay);

	// display popup on click
	map.on('click', clickHandler(map));

	// change mouse cursor when over marker
	map.on('pointermove', pointermoveHandler(map, overlay));

	return overlay;
};
