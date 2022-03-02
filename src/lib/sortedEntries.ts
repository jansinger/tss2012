import logbookEntries from './data/logbook.json';
import { sortEntries } from './utils/sortEntries';

export const sortedEntries = sortEntries(logbookEntries);
