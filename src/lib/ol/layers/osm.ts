import TileLayer from 'ol/layer/WebGLTile';
import XYZ from 'ol/source/XYZ';

const key = 'Gk3JylWsX7yLBIWEqn42';
const attributions =
	'<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">&copy; MapTiler</a> ' +
	'<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">&copy; OpenStreetMap contributors</a>';

const url = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${key}`;

export const osm = () =>
	new TileLayer({
		source: new XYZ({
			attributions,
			url,
			tileSize: 512
		})
	});
