import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";

export const seamap = new TileLayer({
  source: new XYZ({
    url: "http://t1.openseamap.org/seamark/{z}/{x}/{y}.png",
  }),
});
