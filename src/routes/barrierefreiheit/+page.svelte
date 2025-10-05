<script lang="ts">
	import { goto } from '$app/navigation';
	import Overlay from '$lib/components/Overlay.svelte';
</script>

<svelte:head>
	<title>Barrierefreiheit - Ein tierischer Segelsommer</title>
	<link rel="canonical" href="https://www.ein-tierischer-segelsommer.de/barrierefreiheit"/>
</svelte:head>

<Overlay isOpen={true} on:close={() => goto('/')}>
	<div class="container-article glass">
		<content class="container">
			<nav class="close-navigation" role="navigation" aria-label="Navigation schließen">
				<a href="/" title="Zur Karte" aria-label="Zur Karte">
					<i class="bi bi-x-circle"></i>
				</a>
			</nav>

			<h1>Erklärung zur Barrierefreiheit</h1>

			<p><strong>Stand: Januar 2025</strong></p>

			<h2>Bemühungen um Barrierefreiheit</h2>
			<p>
				Jan Singer und Silja Schröder sind bestrebt, die Website
				<strong>www.ein-tierischer-segelsommer.de</strong> im Einklang mit den
				nationalen Rechtsvorschriften zur Umsetzung der Richtlinie (EU) 2016/2102
				des Europäischen Parlaments barrierefrei zugänglich zu machen.
			</p>

			<h2>Stand der Vereinbarkeit mit den Anforderungen</h2>
			<p>
				Diese Website ist mit der <strong>Barrierefreie-Informationstechnik-Verordnung
				(BITV 2.0)</strong> und den <strong>Web Content Accessibility Guidelines (WCAG) 2.1
				Level AA</strong> weitgehend vereinbar.
			</p>

			<h3>Umgesetzte Maßnahmen</h3>
			<ul>
				<li>✅ Vollständige Tastaturnavigation für alle interaktiven Elemente</li>
				<li>✅ Sichtbare Fokus-Indikatoren für Tastaturnutzer</li>
				<li>✅ Semantisches HTML mit ARIA-Landmarks</li>
				<li>✅ Beschreibende Alternativtexte für alle Bilder</li>
				<li>✅ Ausreichende Farbkontraste (WCAG AA 4.5:1)</li>
				<li>✅ Sprunglink zum Hauptinhalt</li>
				<li>✅ Konsistente Navigationsstruktur</li>
				<li>✅ Responsive Design für verschiedene Bildschirmgrößen</li>
			</ul>

			<h2>Barrierefreie Alternativen</h2>
			<p>
				Für Nutzer, die die interaktive Karte nicht verwenden können oder möchten,
				bieten wir folgende alternative Ansichten:
			</p>
			<ul>
				<li><a href="/timeline">Chronologische Zeitleiste</a> - Alle Einträge in zeitlicher Reihenfolge</li>
				<li><a href="/log">Logbuch-Liste</a> - Textbasierte Übersicht aller Einträge</li>
			</ul>

			<h2>Bekannte Einschränkungen</h2>
			<p>
				Trotz unserer Bemühungen können einige Inhalte noch nicht vollständig barrierefrei sein:
			</p>
			<ul>
				<li>Die interaktive OpenLayers-Karte ist für Screenreader-Nutzer eingeschränkt nutzbar.
					Nutzen Sie bitte die oben genannten Alternativen.</li>
				<li>Einige historische Bilder aus 2012 haben möglicherweise unvollständige Beschreibungen.</li>
			</ul>

			<h2>Feedback und Kontakt</h2>
			<p>
				Wir freuen uns über Ihre Rückmeldung zur Barrierefreiheit dieser Website.
				Falls Sie auf Barrieren stoßen oder Verbesserungsvorschläge haben, kontaktieren Sie uns bitte:
			</p>
			<p>
				<strong>E-Mail:</strong> <a href="mailto:crew@fritsjen.de">crew@fritsjen.de</a><br>
				<strong>Betreff:</strong> Barrierefreiheit ein-tierischer-segelsommer.de
			</p>
			<p>
				Wir bemühen uns, auf Ihr Feedback innerhalb von 14 Tagen zu antworten und
				gemeldete Probleme zeitnah zu beheben.
			</p>

			<h2>Durchsetzungsverfahren</h2>
			<p>
				Bei nicht zufriedenstellenden Antworten auf Ihre Anfrage können Sie sich an die
				Schlichtungsstelle nach § 16 BGG wenden:
			</p>
			<p>
				<strong>Schlichtungsstelle BGG</strong><br>
				Mauerstraße 53<br>
				10117 Berlin<br>
				<strong>Telefon:</strong> 030 18 527-2805<br>
				<strong>E-Mail:</strong> <a href="mailto:info@schlichtungsstelle-bgg.de">info@schlichtungsstelle-bgg.de</a><br>
				<strong>Website:</strong> <a href="https://www.schlichtungsstelle-bgg.de" target="_blank" rel="noopener noreferrer">www.schlichtungsstelle-bgg.de</a>
			</p>

			<h2>Technische Spezifikationen</h2>
			<p>
				Die Barrierefreiheit dieser Website basiert auf den folgenden Technologien:
			</p>
			<ul>
				<li>HTML5</li>
				<li>CSS3 (SCSS)</li>
				<li>JavaScript (SvelteKit Framework)</li>
				<li>ARIA 1.2 (Accessible Rich Internet Applications)</li>
			</ul>

			<h2>Bewertungsmethoden</h2>
			<p>
				Die Barrierefreiheit wurde durch folgende Methoden bewertet:
			</p>
			<ul>
				<li>Selbstbewertung anhand WCAG 2.1 Kriterien</li>
				<li>Automatisierte Tests</li>
				<li>Manuelle Tastaturnavigation-Tests</li>
				<li>Screen-Reader-Tests (NVDA, VoiceOver)</li>
			</ul>

			<h2>Erstellung und Aktualisierung dieser Erklärung</h2>
			<p>
				<strong>Erstellung:</strong> Januar 2025<br>
				<strong>Letzte Überprüfung:</strong> Januar 2025<br>
				<strong>Methode:</strong> Selbstbewertung
			</p>

			<p class="back-link">
				<a href="/">← Zurück zur Karte</a>
			</p>
		</content>
	</div>
</Overlay>

<style lang="scss">
	@import '../../lib/scss/article.css';

	.container-article {
		max-width: 900px;
	}

	content.container {
		border-radius: 8px;
		padding: 15px 20px;
	}

	ul {
		line-height: 1.8;
		margin-bottom: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	h2 {
		margin-top: 2rem;
		color: #ffd700;
	}

	h3 {
		margin-top: 1.5rem;
		color: #ffc107;
	}

	a {
		color: #ffd700;
		text-decoration: underline;

		&:hover {
			color: #ffed4e;
		}
	}

	.back-link {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		text-align: center;
		font-size: 1.1rem;
	}

	@media screen and (max-width: 1140px) {
		content.container {
			margin-top: 60px;
		}
	}

	.close-navigation {
		right: -5px;
	}
</style>
