import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const key = 'Gk3JylWsX7yLBIWEqn42';
const attributions =
	'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
	'<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const source = new XYZ({
	attributions: attributions,
	url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
	tileSize: 512
});

export const osm = () =>
	new TileLayer({
		source
	});
