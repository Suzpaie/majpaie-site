(function () {
  var bascule = document.querySelector('.bascule');
  var menu = document.getElementById('menu');
  if (bascule && menu) {
    bascule.addEventListener('click', function () {
      var ouvert = menu.classList.toggle('ouvert');
      bascule.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
  }

  // Sous-menu « Portails » : s'ouvre au clic, se ferme au clic ailleurs ou avec Échap.
  var sousMenus = document.querySelectorAll('.sous-menu');
  function fermerSousMenus(sauf) {
    for (var k = 0; k < sousMenus.length; k++) {
      if (sousMenus[k] !== sauf) { sousMenus[k].querySelector('.sous-menu-bouton').setAttribute('aria-expanded', 'false'); }
    }
  }
  for (var k = 0; k < sousMenus.length; k++) {
    (function (sm) {
      var bouton = sm.querySelector('.sous-menu-bouton');
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        fermerSousMenus(sm);
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      });
      sm.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { bouton.setAttribute('aria-expanded', 'false'); bouton.focus(); }
      });
    })(sousMenus[k]);
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.sous-menu')) { fermerSousMenus(null); }
  });

  // Formulaire de contact : pas encore relié à un service d'envoi.
  var formulaire = document.getElementById('formulaire-contact');
  if (formulaire) {
    formulaire.addEventListener('submit', function (e) {
      e.preventDefault();
      var avis = document.getElementById('avis-formulaire');
      avis.hidden = false;
      avis.focus();
    });
  }

  // Aperçu en un seul fichier : chaque page est une vue affichée selon l'ancre de l'adresse.
  var vues = document.querySelectorAll('.vue');
  if (!vues.length) { return; }
  var ancre = null;

  function montrer() {
    var nom = (location.hash || '#accueil').slice(1);
    var cible = document.getElementById(nom);
    if (!cible || !cible.classList.contains('vue')) { nom = 'accueil'; }
    for (var i = 0; i < vues.length; i++) { vues[i].hidden = vues[i].id !== nom; }
    var liens = document.querySelectorAll('.menu a');
    for (var j = 0; j < liens.length; j++) {
      if (liens[j].getAttribute('href') === '#' + nom) { liens[j].setAttribute('aria-current', 'page'); }
      else { liens[j].removeAttribute('aria-current'); }
    }
    for (var m = 0; m < sousMenus.length; m++) {
      if (sousMenus[m].querySelector('a[aria-current]')) { sousMenus[m].classList.add('actif'); } else { sousMenus[m].classList.remove('actif'); }
    }
    fermerSousMenus(null);
    if (menu) { menu.classList.remove('ouvert'); }
    if (bascule) { bascule.setAttribute('aria-expanded', 'false'); }
    if (ancre) {
      var el = document.getElementById(ancre);
      ancre = null;
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-ancre]') : null;
    if (!a) { return; }
    ancre = a.getAttribute('data-ancre');
    if (location.hash === a.getAttribute('href')) { e.preventDefault(); montrer(); }
  });
  window.addEventListener('hashchange', montrer);
  montrer();
  // À l'ouverture sur une adresse avec ancre, le navigateur fait défiler vers la vue : on revient en haut.
  window.addEventListener('load', function () { window.scrollTo(0, 0); });
})();
