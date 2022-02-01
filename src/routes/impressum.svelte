<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<nav class="main-navigation">
	<div class="tss-navigation ol-unselectable ol-control" style="pointer-events: auto;">
		<button
			type="button"
			aria-expanded="false"
			title="Zeitleiste"
			on:click={() => goto('/timeline')}
		>
			<i class="fas fa-calendar-alt" />
		</button>
		<button type="button" aria-expanded="false" title="Karte" on:click={() => goto('/')}>
			<i class="fas fa-map-marked-alt" />
		</button>
	</div>
</nav>
<div class="container-article">
	<content class="container">
		<img src="/pics/crew.jpg" title="Crew" alt="Silja & Jan" class="crew" />
		<h1>Impressum</h1>
		<h2>Angaben gemäß § 5 TMG</h2>
		<p>
			Jan Singer <br />
			Bäderstr. 65<br />
			24229 Schwedeneck <br />
		</p>
		<h3>Vertreten durch:</h3>
		<p>
			Jan Singer<br />
			Silja Schröder<br />
		</p>
		<h3>Kontakt:</h3>
		<p>
			Telefon: 04308-7399640<br />
			E-Mail: <a href="mailto:crew@fritsjen.de">crew@fritsjen.de</a>
		</p>
		<h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
		<p>
			Jan Singer <br />
			Bäderstr. 65<br />
			24229 Schwedeneck <br />
		</p>
		<h2>Haftungsausschluss</h2>
		<h3>Haftung für Links</h3>
		<p>
			Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
			Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für
			die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
			verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
			Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
			erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
			konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
			Rechtsverletzungen werden wir derartige Links umgehend entfernen.
		</p>
		<h3>Urheberrecht</h3>
		<p>
			Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
			deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
			Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
			jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
			privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht
			vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
			Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
			Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei
			Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
		</p>
		<h3>Datenschutz</h3>
		<p>
			Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich.
			Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder
			eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
			Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br />
			Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail)
			Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte
			ist nicht möglich. <br />
			Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur
			Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit
			ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte
			im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.<br />
		</p>
		<p class="links">
			Impressum vom <a href="https://www.impressum-generator.de" rel="noopener" target="_blank"
				>Impressum Generator</a
			>
			der
			<a
				href="https://www.kanzlei-hasselbach.de/standorte/frankfurt/"
				rel="nofollow"
				target="_blank">Kanzlei Hasselbach, Frankfurt</a
			>
		</p>
	</content>
</div>

<style lang="scss">
	@import '../lib/scss/article.scss';

	.container-article {
		max-width: 800px;
	}

	content.container {
		border-radius: 8px;
		padding: 5px 15px;
	}

	img.crew {
		float: right;
		margin-top: 15px;
	}

	p.links {
		font-size: 0.7rem;
		text-align: right;
		margin-top: 20px;
	}

	@media screen and (max-width: 1140px) {
		content.container {
			margin-top: 60px;
		}
	}
</style>
