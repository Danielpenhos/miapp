// Gridiron Central - script.js
document.addEventListener('DOMContentLoaded', function () {

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

  // ---------- Team data (32 franquicias) ----------
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
    { name: 'Commanders', abbr: 'WAS', div: 'NFC Este', color: '#5a1414' },
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
    return teams[0];
  }

  function badge(abbr) {
    var t = findTeam(abbr);
    return '<span class="team-badge" style="background:' + t.color + '">' + t.abbr + '</span>';
  }

  // ---------- Ticker ----------
  var tickerItems = [
    'Semana 15 en marcha en toda la NFL',
    'Los playoffs se acercan: cada juego cuenta',
    'MVP watch: candidatos que estan on fire',
    'Rookies que estan cambiando el juego',
    'Rivalidades historicas se reavivan este mes'
  ];
  var track = document.getElementById('tickerTrack');
  if (track) {
    var doubled = tickerItems.concat(tickerItems);
    track.innerHTML = doubled.map(function (t) { return '<span>&#9679; ' + t + '</span>'; }).join('');
  }

  // ---------- Games ----------
  var games = {
    live: [
      { home: 'KC', away: 'BUF', hs: 20, as: 17, meta: 'Q3 &middot; 08:41 &middot; Arrowhead Stadium' },
      { home: 'SF', away: 'DAL', hs: 14, as: 10, meta: 'Q2 &middot; 02:15 &middot; Levi Stadium' },
      { home: 'PHI', away: 'MIA', hs: 24, as: 21, meta: 'Q4 &middot; 05:02 &middot; Lincoln Financial Field' }
    ],
    upcoming: [
      { home: 'BAL', away: 'CIN', hs: null, as: null, meta: 'Domingo &middot; 1:00 PM &middot; M&amp;T Bank Stadium' },
      { home: 'GB', away: 'MIN', hs: null, as: null, meta: 'Domingo &middot; 4:25 PM &middot; Lambeau Field' },
      { home: 'DET', away: 'CHI', hs: null, as: null, meta: 'Jueves &middot; 8:15 PM &middot; Ford Field' }
    ],
    final: [
      { home: 'SEA', away: 'ARI', hs: 27, as: 20, meta: 'Final &middot; Lumen Field' },
      { home: 'NE', away: 'NYJ', hs: 16, as: 13, meta: 'Final &middot; Gillette Stadium' },
      { home: 'LAR', away: 'CAR', hs: 31, as: 12, meta: 'Final &middot; SoFi Stadium' }
    ]
  };

  function statusLabel(tab) {
    if (tab === 'live') return '<span class="dot"></span> En vivo';
    if (tab === 'upcoming') return '<span class="dot"></span> Proximo';
    return '<span class="dot"></span> Final';
  }

  function renderGames(tab) {
    var grid = document.getElementById('gamesGrid');
    var list = games[tab] || [];
    grid.innerHTML = list.map(function (g) {
      var homeT = findTeam(g.home), awayT = findTeam(g.away);
      var scoreHtml = (g.hs === null)
        ? '<span class="score">VS</span>'
        : '<span class="score">' + g.as + ' - ' + g.hs + '</span>';
      return (
        '<div class="game-card">' +
          '<span class="game-status ' + tab + '">' + statusLabel(tab) + '</span>' +
          '<div class="matchup">' +
            '<div class="team-row">' + badge(awayT.abbr) + '<span class="team-name">' + awayT.name + '</span></div>' +
            scoreHtml +
            '<div class="team-row">' + badge(homeT.abbr) + '<span class="team-name">' + homeT.name + '</span></div>' +
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
  renderGames('live');

  // ---------- Standings ----------
  var standings = {
    AFC: [
      { abbr: 'KC', rec: '11-3' },
      { abbr: 'BUF', rec: '10-4' },
      { abbr: 'BAL', rec: '9-5' },
      { abbr: 'HOU', rec: '9-5' },
      { abbr: 'PIT', rec: '8-6' }
    ],
    NFC: [
      { abbr: 'DET', rec: '12-2' },
      { abbr: 'PHI', rec: '10-4' },
      { abbr: 'SF', rec: '9-5' },
      { abbr: 'GB', rec: '9-5' },
      { abbr: 'TB', rec: '8-6' }
    ]
  };

  var standingsGrid = document.getElementById('standingsGrid');
  if (standingsGrid) {
    var confKeys = Object.keys(standings);
    standingsGrid.innerHTML = confKeys.map(function (conf) {
      var rows = standings[conf].map(function (row, idx) {
        var t = findTeam(row.abbr);
        return (
          '<div class="standings-row">' +
            '<div class="team-row"><span class="rank">' + (idx + 1) + '</span>' + badge(t.abbr) + '<span class="team-name">' + t.name + '</span></div>' +
            '<span class="record">' + row.rec + '</span>' +
          '</div>'
        );
      }).join('');
      return '<div class="standings-card"><h3>Conferencia ' + conf + '</h3><div class="standings-list">' + rows + '</div></div>';
    }).join('');
  }

  // ---------- Teams grid + filters ----------
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

  // ---------- News ----------
  var news = [
    { tag: 'Analisis', title: 'Las claves tacticas que estan definiendo la temporada', text: 'Un vistazo a los esquemas ofensivos y defensivos que dominan la liga esta campana.', meta: 'Redaccion &middot; hace 2 h' },
    { tag: 'Lesiones', title: 'Reporte de lesiones antes de la jornada dominical', text: 'Actualizacion sobre los jugadores clave que podrian perderse el proximo partido.', meta: 'Redaccion &middot; hace 5 h' },
    { tag: 'Playoffs', title: 'Como luce la carrera por la postemporada', text: 'Repasamos los escenarios posibles para los equipos que pelean por un lugar en playoffs.', meta: 'Redaccion &middot; hace 8 h' },
    { tag: 'Draft', title: 'Prospectos universitarios que ilusionan a los scouts', text: 'Los nombres que ya suenan de cara a la proxima clase de novatos.', meta: 'Redaccion &middot; hace 1 d' },
    { tag: 'Entrevista', title: 'La mentalidad detras de las remontadas de esta temporada', text: 'Jugadores y entrenadores comparten como se preparan para los momentos de presion.', meta: 'Redaccion &middot; hace 1 d' },
    { tag: 'Estadisticas', title: 'Los numeros que explican el nivel ofensivo actual', text: 'Un analisis de las tendencias estadisticas mas relevantes de la liga.', meta: 'Redaccion &middot; hace 2 d' }
  ];

  var newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = news.map(function (n) {
      return (
        '<div class="news-card">' +
          '<span class="news-tag">' + n.tag + '</span>' +
          '<h3>' + n.title + '</h3>' +
          '<p>' + n.text + '</p>' +
          '<div class="news-meta"><span>' + n.meta + '</span></div>' +
        '</div>'
      );
    }).join('');
  }

  // ---------- Countdown to Super Bowl ----------
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

});
