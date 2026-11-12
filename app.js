const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const menu = $('#navigation');
const menuToggle = $('.menu-toggle');
function closeMenu() { menu.classList.remove('is-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Открыть меню'); }
menuToggle.addEventListener('click', () => { const open = menu.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
$$('a[href^="#"]').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const benefitTrack = $('.benefit-track');
if (benefitTrack) {
let benefitScrollTarget = null;
const resetBenefitScrollTarget = () => { benefitScrollTarget = null; };
['pointerdown', 'wheel', 'keydown', 'scrollend'].forEach(type => {
  benefitTrack.addEventListener(type, resetBenefitScrollTarget, { passive: true });
});
window.addEventListener('resize', resetBenefitScrollTarget, { passive: true });
$$('[data-benefit]').forEach(button => button.addEventListener('click', () => {
  const distance = $('.benefit').getBoundingClientRect().width + parseFloat(getComputedStyle(benefitTrack).gap);
  const currentTarget = benefitScrollTarget ?? benefitTrack.scrollLeft;
  benefitScrollTarget = Math.max(0, Math.min(benefitTrack.scrollWidth - benefitTrack.clientWidth,
    currentTarget + distance * Number(button.dataset.benefit)));
  benefitTrack.scrollTo({ left: benefitScrollTarget, behavior: motion.matches ? 'instant' : 'smooth' });
}));
}

const cases = [
  { id: 'belaz', title: 'Водородный<br>карьерный<br>самосвал БЕЛАЗ', description: 'Водородный карьерный самосвал и заправочная инфраструктура — ключевой проект Н2 Инжиниринг для горнодобывающей отрасли.', caption: 'Карьерный самосвал и<br>заправочная<br>инфраструктура', stats: [['350', 'атм.', 'более 250 кг<br>за 15-20 мин'], ['4', 'тонн', 'заправочных узла<br>– до 20 кг/мин'], ['2', '', 'мотор-колеса –<br>до 2000 кВт']] },
  { id: 'rusak', title: 'Первый российский<br>водородный вездеход', description: 'Первый российский вездеход на водородных топливных элементах для Арктики и бездорожья', caption: 'Вездеход повышенной<br>проходимости', stats: [['60', 'км/ч', 'максимальная<br>скорость'], ['2,5', 'тонн', 'максимальная<br>грузоподъёмность'], ['8', '', 'пассажиров'], ['500', 'км', 'без дозаправки']] }
];
let currentCase = 0;
const caseSection = $('.case-section');
let caseGesture = null;
if (caseSection) {
caseSection.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button, a, input, textarea')) return;
  caseGesture = { x: event.clientX, y: event.clientY, time: performance.now() };
});
caseSection.addEventListener('pointercancel', () => { caseGesture = null; });
caseSection.addEventListener('pointerup', event => {
  if (!caseGesture) return;
  const dx = event.clientX - caseGesture.x;
  const dy = event.clientY - caseGesture.y;
  const elapsed = performance.now() - caseGesture.time;
  caseGesture = null;
  if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && elapsed < 1000) {
    $(`[data-case="${dx < 0 ? 1 : -1}"]`, caseSection).click();
  }
});
$$('[data-case]').forEach(button => button.addEventListener('click', () => {
  currentCase = (currentCase + Number(button.dataset.case) + cases.length) % cases.length;
  const item = cases[currentCase];
  $('.case-section').classList.toggle('is-rusak', currentCase === 1);
  $('#case-title').innerHTML = item.title;
  $('#case-description').textContent = item.description;
  $('#case-caption').innerHTML = item.caption;
  $('#case-count').textContent = `[0${currentCase + 1}] / [02]`;
  $('.case-top .cta').href = `project-${item.id}.html`;
  $('#case-stats').innerHTML = item.stats.map(([value, unit, label]) => `<div><strong>[${value}]<small>${unit}</small></strong><p>${label}</p></div>`).join('');
}));
}

const contactDialog = $('#contact-dialog');
const detailsDialog = $('#details-dialog');
function openContact(subject = '', recipient = 'info@h2team.tech') {
  detailsDialog.close();
  $('#contact-form textarea').value = subject;
  $('#contact-form').dataset.recipient = recipient;
  contactDialog.showModal();
}
function openDetails(content) { $('#details-content').innerHTML = content; detailsDialog.showModal(); }
$$('dialog').forEach(dialog => {
  $('.close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
});
const contactButton = (label = 'Обсудить проект') => `<button class="cta" data-contact><span>${label}</span><i><img src="assets/8245d.svg" alt=""></i></button>`;
const info = {
  privacy: '<h2>Обработка <em>данных</em></h2><p>Форма на этом сайте подготавливает письмо в вашей почтовой программе. Сайт не отправляет и не хранит введённые данные на сервере. Отправка обращения выполняется вами через выбранный почтовый сервис.</p><p>По вопросам обработки обращения свяжитесь с компанией: <a href="mailto:info@h2team.tech">Info@h2team.tech</a>.</p>',
  terms: '<h2>Информация <em>о сайте</em></h2><p>Сайт представляет инженерные решения компании в области водородной энергетики и транспорта. Для уточнения технических характеристик и условий сотрудничества обратитесь к команде.</p>' + contactButton()
};
document.addEventListener('click', event => {
  const contact = event.target.closest('[data-contact]');
  if (contact) { openContact(contact.dataset.contactSubject || '', contact.dataset.recipient); return; }
  const information = event.target.closest('[data-info]');
  if (information) { openDetails(info[information.dataset.info]); return; }

});
$('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const body = `Имя: ${data.get('name')}\nEmail: ${data.get('email')}\nТелефон: ${data.get('phone')}\n\n${data.get('message')}`;
  const recipient = event.currentTarget.dataset.recipient || 'info@h2team.tech';
  location.href = `mailto:${recipient}?subject=${encodeURIComponent('Обращение с сайта Н2 Инжиниринг')}&body=${encodeURIComponent(body)}`;
});
const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting && !document.body.classList.contains('inner-page')) { $$('#navigation a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)); } }); }, { rootMargin: '-10% 0px -60% 0px' });
$$('section[id]').forEach(section => observer.observe(section));
