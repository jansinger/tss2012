import { Overlay } from 'ol';
import type { Feature, Map, MapBrowserEvent } from 'ol';
import type BaseEvent from 'ol/events/Event';
import type Geometry from 'ol/geom/Geometry';
import type RenderFeature from 'ol/render/Feature';
import type { AtPixelOptions } from 'ol/PluggableMap';

const getFeatureAtEventPixel = (event: MapBrowserEvent<UIEvent>, map: Map) => {
	const layerFilter = (candidate: Parameters<AtPixelOptions['layerFilter']>[0]) => {
		return candidate.get('name') === 'logbook';
	};
	const pixel = map.getEventPixel(event.originalEvent);
	return map.getFeaturesAtPixel(pixel, { layerFilter })[0];
};

export const createTooltipOverlay = (element: HTMLElement, map: Map): Overlay => {
	const overlay = new Overlay({
		element: element,
		offset: [5, 0],
		positioning: 'bottom-left',
		autoPan: {
			animation: {
				duration: 250
			}
		}
	});

	const hideTooltip = () => {
		map.getTargetElement().style.cursor = '';
		overlay.setPosition(undefined);
	};

	const clickHandler = () => {
		return function (evt: MapBrowserEvent<UIEvent>) {
			const feat = getFeatureAtEventPixel(evt, map);
			if (feat) {
				hideTooltip();
				map.dispatchEvent({ type: 'clickLogbook', feature: feat } as unknown as BaseEvent);
			}
		};
	};

	const showEntryPreview = (feat: Feature<Geometry>) => {
		const title = feat.get('title');
		const datetime = feat.get('datetime');
		const time = feat.get('localeDatetime');
		const address = feat.get('section');
		const picture = feat.get('picture');
		const pictureTitle = feat.get('pictureTitle');
		element.innerHTML = `<div class="right glass">
		<img src="/images/${picture}" title="${pictureTitle}" />
		<div class="text-content">
			<time datetime="${datetime}">${time}</time>
			<address>${address}</address>
			<h3>${title}</h3>
		</div>
		<i></i>
		</div>`;
	};

	let feature: Feature<Geometry> | RenderFeature = null;
	const pointermoveHandler = () => {
		return (evt: MapBrowserEvent<UIEvent>) => {
			const newfeature = getFeatureAtEventPixel(evt, map);
			if (feature === newfeature) {
				// only set new position if feature has not changed
				feature && overlay.setPosition(evt.coordinate);
				return;
			}
			if (newfeature) {
				map.getTargetElement().style.cursor = 'pointer';
				const features = newfeature.get('features');
				if (features.length === 1) {
					feature = newfeature;
					showEntryPreview(features[0]);
					overlay.setPosition(evt.coordinate);
				}
			} else {
				hideTooltip();
			}
		};
	};

	map.addOverlay(overlay);

	// display popup on click
	map.on('click', clickHandler());

	// change mouse cursor when over marker
	map.on('pointermove', pointermoveHandler());

	return overlay;
};
