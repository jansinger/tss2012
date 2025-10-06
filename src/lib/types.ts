export interface SortableEntry {
	datetime: string;
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
