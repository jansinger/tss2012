import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import LogbookEntry from './LogbookEntry.svelte'; // Replace with your actual component path
import { goto } from '$app/navigation';
import type { LogEntry } from '$lib/types';

// Mock the goto function
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));
vi.mock('$app/environment', () => ({
	browser: vi.fn()
}));

const entry: LogEntry = {
	_id: '9681f8b4-eb47-44c4-ad11-0941704c0163',
	_rev: '10-1c9a4adb31840e33a697b0362ca0a082',
	datetime: '2012-04-03T10:03:00.000Z',
	category: 'blog',
	data: { cog: '', sog: '', coordinates: [12.096666666667, 54.181666666667] },
	pictureFolder: '201204031203',
	title: 'Test',
	section: 'Kiel - Stralsund',
	abstract:
		'Am 1.4. haben wir abgelegt - das ist kein Aprilscherz - und sind unterwegs Richtung Osten.<br>',
	text: '<p>Wie geplant haben wir am 1.4.2012 die Leinen losgeschmissen. Nach einem letzten Frühstück direkt in Schilksee mit der Familie ging es gegen 10 Uhr zum Steg 5. Dort lag Fritsjen bereits startklar. Wir verabschieden uns von Familie und Freunden und legen ab. Auch Hafenmeister Volker verabschiedet uns mit Megaphon. Tschüß Kiel! Es ist schon ein wenig komisch zu wissen, dass man nicht in zwei, drei oder vier Wochen hier wieder einlaufen wird, sondern erst wieder im Oktober.</p><p>Wir haben abgelegt und sind glücklich. Aller organisatorischer Stress ist vergessen, alles ist irgendwie geschafft. Allerdings müssen wir feststellen, dass wir Rasmus und Neptun scheinbar nur unzureichend bei unseren Vorbereitungen beachtet haben. War doch noch wenige Tage vor unserer Abfahrt herrlichstes Frühlingswetter, verkünden nun die Wetterberichte kaltes und stürmisches Wetter. Auch das bekommen wir direkt am ersten Tag zu spüren. Winde aus westlichen Richtung zwischen 20 und 30 Knoten sind vorhergesagt. Da uns noch ein wenig die Seebeine fehlen, beschließen wir zunächst nur unter Fock Richtung Fehmarn zu rauschen. Der Wind kommt von achtern und die Geschwindigkeit ist für uns auch mit nur einem Segel akzeptabel. Bei einem Wellenritt zeigt das Display 10,5 kn an. Gegen späten Nachmittag, so langsam wird uns kalt und wir werden müde - nach der recht kurzen Nacht auch kein Wunder - frischt der Wind mehr und mehr auf. Mittlerweile sind es 30 bis 34 kn. So hatten wir uns den ersten Tag nicht vorgestellt. Wir wollen in den Hafen, ins Warme. Wir laufen Burgtiefe ein - ein Fehler wie sich später herausstellen sollte. Erschöpft aber glücklich den ersten Schlag gemacht zu haben, machen wir uns einen leckeren Salat mit Grillfleisch von gestern und begießen den ersten Tag mit einem Schluck Champagner, den uns Tina und Emilia zur Party mitgebracht haben. Lieben Dank euch beiden (und natürlich auch Julius und Felix) - hat gut geschmeckt;-) Der Wind gibt weiterhin Gas. Wir müssen feststellen, dass der Hafen alles andere als ruhig ist. Der Wind erreicht mittlerweile bis zu 40 Knoten, es zieht und reißt an den Leinen, wir fühlen uns wie in einem Schonwaschgang in einer Waschmaschine, alles klappert und es pfeifft. Entsprechend ist die Nacht - unruhig und mit wenig Schlaf. Leicht gebeutelt müssen wir am nächsten Morgen feststellen: es ist eisig kalt und der Wind ist immer noch so stark. Wir wollen einfach nur weg aus Burgtiefe, finden wir den Hafen doch wenig attraktiv und das ruckartige Geschaukel in der Box geht uns so langsam auf die Nerven. </p><p>Gegen 14 Uhr haben wir die Nase gestrichen voll. Es bläst nach wie vor sehr kräftig, aber wir wollen weiter. Warnemünde wartet auf uns. Hier wollen wir entspannen und die Saunalandschaft in dem Hotel Hohe Düne austesten. Nach Fehmarn nehmen wir direkt Kurs auf Warnemünde. Die Sicht ist sehr gut, so können wir Warnemünde schon von Weitem her sehen. Wir rauschen durch die Ostsee, anfangs sogar von Sonnenstrahlen begleitet. Es ist deutlich kälter als am ersten Tag - es kommt noch eine weitere Schicht zum Anziehen dazu und die dicksten Handschuhe die wir haben. Dazu gibt es warmen Tee und schon lässt sich alles gut aushalten. Wir sind schnell vor Warnemünde, freuen uns beim Queren des Fahrwassers über unser AIS und liegen gegen 21 Uhr in der Box. Wir genießen den ruhigen Liegeplatz. Nette Liegeplatznachbarn geben uns den Chip für die Toiletten, wir haben Strom und können es unter Deck warm machen. Wir sind glücklich! Jetzt wird erst einmal ausgeschlafen, Warnemünde unsicher gemacht und wenn der angekündigte Schnee kommt, gehen wir in die Sauna. Besuch werden wir auch noch bekommen, Jans Schwester hat sich mit Benni und Fiene angekündigt. Und natürlich haben wir ein Auge auf dem Wetter: wir warten auf eine passende Windperiode mit der wir gut zu unserem nächsten Ziel - nach Barhöft - kommen.<br></p><p>An dieser Stelle möchten wir uns noch einmal bei allen Partygästen für die Buffetspende bedanken. Es war eine tolle Auftaktparty mit einem leckeren und bunten Buffet - alle Gäste waren ganz begeistert und wir genießen nun die Reste an Bord! So werden wir sicher nicht verhungern! Dank auch an Familie Singer und Uschi für die Kuchen! So können wir es uns verdammt gut gehen lassen.<br class="aloha-end-br"></p>',
	pictures: [
		{
			filename: '1-P1010492_gr.jpg',
			title: 'Abschied',
			text: 'Silja verabschiedet sich von Lena.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '2-P1010499_gr.jpg',
			title: 'Abschied',
			text: 'Wir lassen Freunde und Familie am Steg zurück.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '3-P1010502_gr.jpg',
			title: 'Erster Tag<br>',
			text: 'Jan und Schnaufi freuen sich - wir sind unterwegs.',
			sizebig: { height: 800, width: 600 },
			sizesmall: { width: 150, height: 200 }
		},
		{
			filename: '4-P1010513_gr.jpg',
			title: 'Erster Tag',
			text: 'Auch Silja freut sich.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '5-P1010523_gr.jpg',
			title: 'Erster Tag',
			text: 'Warmer Tee ist immer mit dabei.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '6-P1010525_gr.jpg',
			title: 'Erster Tag',
			text: 'Gut eingepackt sind die kühlen Temperaturen kaum zu spüren.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '7-P1010533_gr.jpg',
			title: 'Erster Tag',
			text: 'Zwischendurch kommt auch noch mal die Sonne vorbei.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '8-P1010535_gr.jpg',
			title: 'Erster Tag',
			text: 'Leider ist ihr Besuch nur von kurzer Dauer.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '9-P1010542_gr.jpg',
			title: 'Erster Tag',
			text: 'Wir sind in Burgtiefe.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '10-P1010543_gr.jpg',
			title: 'Erster Tag',
			text: 'Jan ist k.o. aber glücklich.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '11-P1010544_gr.jpg',
			title: 'Erster Tag',
			text: 'Bei Silja sieht es genauso aus.',
			sizebig: { height: 800, width: 600 },
			sizesmall: { width: 150, height: 200 }
		},
		{
			filename: '12-P1010547_gr.jpg',
			title: 'Erster Tag',
			text: 'Ein leckeres Abendessen mit Champagner wartet.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '13-P1010559_gr.jpg',
			title: 'Warnemünde',
			text: 'Tschüß Fehmarn!',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '14-P1010561_gr.jpg',
			title: 'Warnemünde',
			text: 'Wir lassen die Fehmarnsundbrücke hinter uns.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '15-P1010566_gr.jpg',
			title: 'Spende für Ramus und Co.',
			text: 'Den Fehler machen wir nur einmal, natürlich werden Rasmus und Neptun fortan vorrangig bei unseren Planungen berücksichtigt.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '16-P1010570_gr.jpg',
			title: 'Handwärmer',
			text: 'Silja hat die dicksten Handschuhe ausgepackt...da fällt das Stück Kuchen gar nicht mehr auf....',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '17-P1010573_gr.jpg',
			title: 'Warnemünde',
			text: 'Erstmals auf unserer Tour begegnen wir auch größeren Schiffen.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		},
		{
			filename: '18-P1010575_gr.jpg',
			title: 'Warmeünde',
			text: 'Abendstimmung an Bord vor Warnemünde.',
			sizebig: { height: 600, width: 800 },
			sizesmall: { width: 200, height: 150 }
		}
	],
	visible: true,
	localeDatetime: 'Dienstag, 3. April 2012'
};

describe('LogbookEntry', () => {
	afterEach(() => cleanup());

	it('renders correctly with given entry', () => {
		const { getByText } = render(LogbookEntry, { entry });

		// Add assertions to check if key elements are rendered
		expect(getByText(entry.title)).toBeInTheDocument();
		// Add more assertions as needed
	});

	it('navigates correctly on wheel event', async () => {
		const { container } = render(LogbookEntry, { entry });

		const nav = container.querySelector('.sub-navigation');
		await fireEvent.wheel(nav, { deltaX: 100 });

		// Check if goto is called correctly
		expect(goto).toHaveBeenCalledWith('/log/undefined');
	});

	// Add more tests as needed
});
