export interface LogEntryShort {
	id: string;
	title: string;
	section: string;
	abstract: string;
	picture: string;
	pictureTitle: string;
	datetime: string;
	localeDatetime: string;
}

export interface LogEntry {
	_id: string;
	_rev: string;
	datetime: string;
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
export interface Data {
	cog: string;
	sog: string;
	coordinates?: number[] | null;
}
export interface PicturesEntity {
	filename: string;
	title: string;
	text: string;
}
