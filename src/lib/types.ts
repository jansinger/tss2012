import type { Feature } from 'ol';
import type OLMap from 'ol/Map';

export interface SortableEntry {
	datetime: string;
}

/**
 * Custom event type for logbook click events dispatched by OpenLayers Map.
 * Used when a user clicks on a logbook marker on the map.
 */
export interface LogbookClickEvent {
	feature: Feature;
}

/**
 * Type-safe constant for the custom logbook click event name.
 */
export const CLICK_LOGBOOK_EVENT = 'clickLogbook' as const;

/**
 * Type-safe wrapper for adding custom event listeners to OpenLayers Map.
 * This avoids @ts-ignore by using the generic Observable.on method.
 */
export function onLogbookClick(
	map: OLMap,
	handler: (evt: LogbookClickEvent) => void
): () => void {
	const listener = (evt: unknown) => handler(evt as LogbookClickEvent);
	map.on(CLICK_LOGBOOK_EVENT as 'click', listener);
	return () => map.un(CLICK_LOGBOOK_EVENT as 'click', listener);
}

export interface LogEntryShort extends SortableEntry {
	id: string;
	title: string;
	section: string;
	abstract: string;
	picture: string;
	pictureTitle: string;
	localeDatetime: string;
}

export interface LogEntry extends SortableEntry {
	_id: string;
	_rev: string;
	_next?: string;
	_prev?: string;
	category: string;
	data: Data;
	pictureFolder: string;
	title: string;
	section: string;
	abstract: string;
	text: string;
	pictures?: PicturesEntity[] | null;
	visible: boolean;
	localeDatetime: string;
}

export type Coordinates = [number, number];
export interface Data {
	cog: string;
	sog: string;
	coordinates?: Coordinates | null;
}

export interface SizeParams {
	width: number;
	height: number;
}
export interface PicturesEntity {
	filename: string;
	title: string;
	text: string;
	sizebig?: SizeParams;
	sizesmall?: SizeParams;
}
