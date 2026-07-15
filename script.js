// Gridiron Central - script.js
// Conectado a la API publica de ESPN para datos reales de la NFL
document.addEventListener('DOMContentLoaded', function () {

var API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
var API_CORE = 'https://site.api.espn.com/apis/v2/sports/football/nfl';

// Footer year
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
var burger = document.getElementById('burgerBtn');
var nav = document.querySelector('.main-nav');
if (burger && nav) {
burger.addEventListener('click', function () {
nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(function (link) {
link.addEventListener('click', function () { nav.classList.remove('open'); });
});
}

// Scroll to top button
var scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', function () {
if (window.scrollY > 500) scrollBtn.classList.add('visible');
else scrollBtn.classList.remove('visible');
});
scrollBtn.addEventListener('click', function () {
window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Team data (32 franquicias, para colores y divisiones) ----------
var teams = [
{ name: 'Bills', abbr: 'BUF', div: 'AFC Este', color: '#00338d' },
{ name: 'Dolphins', abbr: 'MIA', div: 'AFC Este', color: '#008e97' },
{ name: 'Patriots', abbr: 'NE', div: 'AFC Este', color: '#0b2265' },
{ name: 'Jets', abbr: 'NYJ', div: 'AFC Este', color: '#125740' },
{ name: 'Ravens', abbr: 'BAL', div: 'AFC Norte', color: '#241773' },
{ name: 'Bengals', abbr: 'CIN', div: 'AFC Norte', color: '#fb4f14' },
{ name: 'Browns', abbr: 'CLE', div: 'AFC Norte', color: '#5b3a29' },
{ name: 'Steelers', abbr: 'PIT', div: 'AFC Norte', color: '#101820' },
{ name: 'Texans', abbr: 'HOU', div: 'AFC Sur', color: '#03202f' },
{ name: 'Colts', abbr: 'IND', div: 'AFC Sur', color: '#002c5f' },
{ name: 'Jaguars', abbr: 'JAX', div: 'AFC Sur', color: '#006778' },
{ name: 'Titans', abbr: 'TEN', div: 'AFC Sur', color: '#4b92db' },
{ name: 'Broncos', abbr: 'DEN', div: 'AFC Oeste', color: '#fb4f14' },
{ name: 'Chiefs', abbr: 'KC', div: 'AFC Oeste', color: '#e31837' },
{ name: 'Raiders', abbr: 'LV', div: 'AFC Oeste', color: '#2b2a29' },
{ name: 'Chargers', abbr: 'LAC', div: 'AFC Oeste', color: '#0080c6' },
{ name: 'Cowboys', abbr: 'DAL', div: 'NFC Este', color: '#041e42' },
{ name: 'Giants', abbr: 'NYG', div: 'NFC Este', color: '#0b2265' },
{ name: 'Eagles', abbr: 'PHI', div: 'NFC Este', color: '#004c54' },
{ name: 'Commanders', abbr: 'WSH', div: 'NFC Este', color: '#5a1414' },
{ name: 'Bears', abbr: 'CHI', div: 'NFC Norte', color: '#0b162a' },
{ name: 'Lions', abbr: 'DET', div: 'NFC Norte', color: '#0076b6' },
{ name: 'Packers', abbr: 'GB', div: 'NFC Norte', color: '#203731' },
{ name: 'Vikings', abbr: 'MIN', div: 'NFC Norte', color: '#4f2683' },
{ name: 'Falcons', abbr: 'ATL', div: 'NFC Sur', color: '#a71930' },
{ name: 'Panthers', abbr: 'CAR', div: 'NFC Sur', color: '#0085ca' },
{ name: 'Saints', abbr: 'NO', div: 'NFC Sur', color: '#9f8458' },
{ name: 'Buccaneers', abbr: 'TB', div: 'NFC Sur', color: '#d50a0a' },
{ name: 'Cardinals', abbr: 'ARI', div: 'NFC Oeste', color: '#97233f' },
{ name: 'Rams', abbr: 'LAR', div: 'NFC Oeste', color: '#003594' },
{ name: '49ers', abbr: 'SF', div: 'NFC Oeste', color: '#aa0000' },
{ name: 'Seahawks', abbr: 'SEA', div: 'NFC Oeste', color: '#002244' }
];

function findTeam(abbr) {
for (var i = 0; i < teams.length; i++) if (teams[i].abbr === abbr) return teams[i];
return null;
}

function badge(abbr, fallbackColor, fallbackName) {
var t = findTeam(abbr);
var color = t ? t.color : (fallbackColor || '#334');
var label = t ? t.abbr : (abbr || '?');
return '<span class="team-badge" style="background:' + color + '">' + label + '</span>';
}

function teamLabel(abbr, fallbackName) {
var t = findTeam(abbr);
return t ? t.name : (fallbackName || abbr);
}

// ---------- Fallback data (por si la API no responde) ----------
var fallbackGames = {
live: [
{ home: 'KC', away: 'BUF', hs: 20, as: 17, meta: 'Q3 &middot; 08:41 &middot; Arrowhead Stadium' }
],
upcoming: [
{ home: 'BAL', away: 'CIN', hs: null, as: null, meta: 'Domingo &middot; 1:00 PM &middot; M&amp;T Bank Stadium' }
],
final: [
{ home: 'SEA', away: 'ARI', hs: 27, as: 20, meta: 'Final &middot; Lumen Field' }
]
};

var fallbackNews = [
{ tag: 'Analisis', title: 'Las claves tacticas que estan definiendo la temporada', text: 'Un vistazo a los esquemas ofensivos y defensivos que dominan la liga esta campana.', meta: 'Redaccion', link: 'https://www.google.com/search?q=' + encodeURIComponent('NFL analisis tacticas temporada ESPN') }
];

var games = { live: [], upcoming: [], final: [] };
var currentTab = 'live';

function statusLabel(tab) {
if (tab === 'live') return '<span class="dot"></span> En vivo';
if (tab === 'upcoming') return '<span class="dot"></span> Proximo';
return '<span class="dot"></span> Final';
}

function renderGames(tab) {
currentTab = tab;
var grid = document.getElementById('gamesGrid');
var list = games[tab] || [];
if (!list.length) {
grid.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">No hay juegos en esta categoria por ahora.</p>';
return;
}
grid.innerHTML = list.map(function (g) {
var scoreHtml = (g.hs === null || g.hs === undefined)
? '<span class="score">VS</span>'
: '<span class="score">' + g.as + ' - ' + g.hs + '</span>';
return (
'<div class="game-card">' +
'<span class="game-status ' + tab + '">' + statusLabel(tab) + '</span>' +
'<div class="matchup">' +
'<div class="team-row">' + badge(g.away, g.awayColor, g.awayName) + '<span class="team-name">' + teamLabel(g.away, g.awayName) + '</span></div>' +
scoreHtml +
'<div class="team-row">' + badge(g.home, g.homeColor, g.homeName) + '<span class="team-name">' + teamLabel(g.home, g.homeName) + '</span></div>' +
'</div>' +
'<div class="game-meta">' + g.meta + '</div>' +
'</div>'
);
}).join('');
}

var tabs = document.querySelectorAll('#scoreTabs .tab');
tabs.forEach(function (btn) {
btn.addEventListener('click', function () {
tabs.forEach(function (b) { b.classList.remove('active'); });
btn.classList.add('active');
renderGames(btn.getAttribute('data-tab'));
});
});

// ---------- Cargar marcadores reales desde la API de ESPN ----------
function loadGames() {
var grid = document.getElementById('gamesGrid');
grid.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">Cargando marcadores en vivo...</p>';
fetch(API_BASE + '/scoreboard')
.then(function (r) { return r.json(); })
.then(function (data) {
var live = [], upcoming = [], final = [];
(data.events || []).forEach(function (ev) {
var comp = ev.competitions[0];
var state = comp.status.type.state;
var home = comp.competitors.find(function (c) { return c.homeAway === 'home'; });
var away = comp.competitors.find(function (c) { return c.homeAway === 'away'; });
var meta = comp.status.type.shortDetail + (comp.venue ? ' &middot; ' + comp.venue.fullName : '');
var item = {
home: home.team.abbreviation, away: away.team.abbreviation,
homeColor: '#' + (home.team.color || '334'), awayColor: '#' + (away.team.color || '334'),
homeName: home.team.displayName, awayName: away.team.displayName,
hs: state === 'pre' ? null : home.score, as: state === 'pre' ? null : away.score,
meta: meta
};
if (state === 'in') live.push(item);
else if (state === 'post') final.push(item);
else upcoming.push(item);
});
games.live = live.length ? live : fallbackGames.live;
games.upcoming = upcoming.length ? upcoming : fallbackGames.upcoming;
games.final = final.length ? final : fallbackGames.final;
renderGames(currentTab);
})
.catch(function () {
games = fallbackGames;
renderGames(currentTab);
});
}

// ---------- Ticker ----------
var tickerFallback = [
'Semana en marcha en toda la NFL',
'Los playoffs se acercan: cada juego cuenta',
'MVP watch: candidatos que estan on fire',
'Rookies que estan cambiando el juego'
];
function renderTicker(items) {
var track = document.getElementById('tickerTrack');
if (!track) return;
var doubled = items.concat(items);
track.innerHTML = doubled.map(function (t) { return '<span>&#9679; ' + t + '</span>'; }).join('');
}
renderTicker(tickerFallback);

// ---------- Standings reales ----------
function statVal(entry, name) {
var s = entry.stats.find(function (x) { return x.name === name; });
return s ? s.displayValue : '-';
}

function loadStandings() {
var grid = document.getElementById('standingsGrid');
grid.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">Cargando standings...</p>';
fetch(API_CORE + '/standings')
.then(function (r) { return r.json(); })
.then(function (data) {
var confs = data.children.map(function (conf) {
var entries = conf.standings.entries.slice();
entries.sort(function (a, b) {
var wa = a.stats.find(function (s) { return s.name === 'wins'; });
var wb = b.stats.find(function (s) { return s.name === 'wins'; });
return (wb ? wb.value : 0) - (wa ? wa.value : 0);
});
return { name: conf.abbreviation || conf.name, entries: entries.slice(0, 5) };
});
grid.innerHTML = confs.map(function (conf) {
var rows = conf.entries.map(function (e, idx) {
var abbr = e.team.abbreviation;
var wins = statVal(e, 'wins');
var losses = statVal(e, 'losses');
return (
'<div class="standings-row">' +
'<div class="team-row"><span class="rank">' + (idx + 1) + '</span>' + badge(abbr) + '<span class="team-name">' + teamLabel(abbr, e.team.displayName) + '</span></div>' +
'<span class="record">' + wins + '-' + losses + '</span>' +
'</div>'
);
}).join('');
return '<div class="standings-card"><h3>Conferencia ' + conf.name + '</h3><div class="standings-list">' + rows + '</div></div>';
}).join('');
})
.catch(function () {
grid.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">No se pudieron cargar los standings en este momento.</p>';
});
}

// ---------- Teams grid + filters (datos locales) ----------
var divisions = ['Todas'].concat(Array.from(new Set(teams.map(function (t) { return t.div; }))));
var filtersEl = document.getElementById('teamFilters');
var teamsGrid = document.getElementById('teamsGrid');

function renderTeams(filter) {
var list = filter === 'Todas' ? teams : teams.filter(function (t) { return t.div === filter; });
teamsGrid.innerHTML = list.map(function (t) {
return (
'<div class="team-card">' +
'<span class="team-badge" style="background:' + t.color + '; width:54px; height:54px; margin:0 auto 12px; font-size:18px;">' + t.abbr + '</span>' +
'<span class="team-name">' + t.name + '</span>' +
'<span class="team-div">' + t.div + '</span>' +
'</div>'
);
}).join('');
}

if (filtersEl) {
filtersEl.innerHTML = divisions.map(function (d, i) {
return '<button class="filter-btn' + (i === 0 ? ' active' : '') + '" data-div="' + d + '">' + d + '</button>';
}).join('');
filtersEl.querySelectorAll('.filter-btn').forEach(function (btn) {
btn.addEventListener('click', function () {
filtersEl.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
btn.classList.add('active');
renderTeams(btn.getAttribute('data-div'));
});
});
}
renderTeams('Todas');

// ---------- Noticias reales desde la API de ESPN ----------
function timeAgo(dateStr) {
var diffMs = Date.now() - new Date(dateStr).getTime();
var hours = Math.floor(diffMs / (1000 * 60 * 60));
if (hours < 1) return 'hace instantes';
if (hours < 24) return 'hace ' + hours + ' h';
var days = Math.floor(hours / 24);
return 'hace ' + days + ' d';
}

function newsCardHtml(tag, title, text, meta, link) {
var openTag = link ? ('<a class="news-card" href="' + link + '" target="_blank" rel="noopener noreferrer">') : '<div class="news-card">';
var closeTag = link ? '</a>' : '</div>';
return (
openTag +
'<span class="news-tag">' + tag + '</span>' +
'<h3>' + title + '</h3>' +
'<p>' + text + '</p>' +
'<div class="news-meta"><span>' + meta + '</span><span class="news-link-hint">' + (link ? 'Ver noticia completa &rarr;' : '') + '</span></div>' +
closeTag
);
}

function loadNews() {
var grid = document.getElementById('newsGrid');
grid.innerHTML = '<p style="text-align:center; color:var(--muted); grid-column:1/-1;">Cargando noticias...</p>';
fetch(API_BASE + '/news')
.then(function (r) { return r.json(); })
.then(function (data) {
var articles = (data.articles || []).slice(0, 6);
if (!articles.length) { throw new Error('sin articulos'); }
grid.innerHTML = articles.map(function (a) {
var tag = (a.categories && a.categories[0] && a.categories[0].description) || 'NFL';
var link = (a.links && a.links.web && a.links.web.href) ? a.links.web.href : 'https://www.espn.com/nfl/';
 return newsCardHtml(tag, a.headline, a.description || '', 'ESPN &middot; ' + timeAgo(a.published), link);
}).join('');
})
.catch(function () {
grid.innerHTML = fallbackNews.map(function (n) {
return newsCardHtml(n.tag, n.title, n.text, n.meta, n.link);
}).join('');
});
}

// ---------- Countdown al Super Bowl ----------
var targetDate = new Date('2027-02-07T23:30:00');
function updateCountdown() {
var now = new Date();
var diff = targetDate - now;
if (diff < 0) diff = 0;
var days = Math.floor(diff / (1000 * 60 * 60 * 24));
var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
var minutes = Math.floor((diff / (1000 * 60)) % 60);
var seconds = Math.floor((diff / 1000) % 60);
var d = document.getElementById('cdDays');
var h = document.getElementById('cdHours');
var m = document.getElementById('cdMinutes');
var s = document.getElementById('cdSeconds');
if (d) d.textContent = String(days).padStart(2, '0');
if (h) h.textContent = String(hours).padStart(2, '0');
if (m) m.textContent = String(minutes).padStart(2, '0');
if (s) s.textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Inicializar llamadas a la API ----------
loadGames();
loadStandings();
loadNews();
setInterval(loadGames, 60000);

});
