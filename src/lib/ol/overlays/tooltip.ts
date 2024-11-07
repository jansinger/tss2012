import { Overlay } from 'ol';
import type { Feature, Map, MapBrowserEvent } from 'ol';
import type BaseEvent from 'ol/events/Event';
import type Geometry from 'ol/geom/Geometry';
import type RenderFeature from 'ol/render/Feature';
import { createTooltipHTML } from './createTooltipHTML';
import { getFeatureAtEventPixel } from './getFeatureAtEventPixel';

const CLICK_LOGBOOK_EVENT = 'clickLogbook';

export interface LogbookFeature {
  title: string;
  datetime: string;
  localeDatetime: string;
  section: string;
  picture: string;
  pictureTitle: string;
}

/**
 * Creates a tooltip overlay for a map and sets up event handlers for interactions.
 *
 * @param element - The HTML element to use as the container for the tooltip.
 * @param map - The OpenLayers Map instance to which the tooltip overlay will be added.
 * @returns An OpenLayers Overlay instance representing the tooltip.
 */
export const createTooltipOverlay = (element: HTMLElement, map: Map): Overlay => {
  const overlay = new Overlay({
    element,
    offset: [5, 0],
    positioning: 'bottom-left',
    autoPan: { animation: { duration: 250 } }
  });

  let currentFeature: Feature<Geometry> | RenderFeature | null = null;

  const hideTooltip = () => {
    map.getTargetElement().style.cursor = '';
    overlay.setPosition(undefined);
    currentFeature = null;
  };

  const showTooltip = (feature: Feature<Geometry> | RenderFeature, coordinate: number[]) => {
    const features = feature.get('features');
    if (features && features.length === 1) {
      map.getTargetElement().style.cursor = 'pointer';
      currentFeature = feature;
      element.innerHTML = createTooltipHTML(features[0].getProperties() as LogbookFeature);
      overlay.setPosition(coordinate);
    }
  };

  const handleFeatureInteraction = (evt: MapBrowserEvent<UIEvent>, isClick: boolean) => {
    const newFeature = getFeatureAtEventPixel(evt, map);

	if (isClick && newFeature) {
		hideTooltip();
		map.dispatchEvent({ type: CLICK_LOGBOOK_EVENT, feature: newFeature } as unknown as BaseEvent);
	} else if (newFeature && (!currentFeature || currentFeature !== newFeature)) {
      showTooltip(newFeature, evt.coordinate);
    } else if (!newFeature) {
      hideTooltip();
    } else if (currentFeature) {
      overlay.setPosition(evt.coordinate);
    }
  };

  const handleClick = (evt: MapBrowserEvent<UIEvent>) => handleFeatureInteraction(evt, true);
  const handlePointerMove = (evt: MapBrowserEvent<UIEvent>) => handleFeatureInteraction(evt, false);

  map.addOverlay(overlay);
  map.on('click', handleClick);
  map.on('pointermove', handlePointerMove);

  return overlay;
};