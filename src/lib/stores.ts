import type { Map } from 'ol';
import { writable, type Writable } from 'svelte/store';

export const map: Writable<Map> = writable();
