import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

const url = 'https://t1.openseamap.org/seamark/{z}/{x}/{y}.png';

/**
 * Creates a seamap layer.
 * @returns {TileLayer} The seamap layer.
 */
export const seamap = () =>
	new TileLayer({
		source: new XYZ({
			url
		})
	});
