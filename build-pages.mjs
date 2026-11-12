import fs from 'node:fs/promises';
const read = file => fs.readFile(file, 'utf8');
let home = await read('index.html');
const text = Object.fromEntries(JSON.parse(await read('page-content.json')).map(x => [x.id, x.text]));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const cta = (label = 'Связаться с нами', href = '', light = false, attrs = '') => `<${href ? 'a' : 'button'} class="cta${light ? ' light-cta' : ''}" ${href ? `href="${href}"` : 'data-contact'} ${attrs}><span>${label}</span><i><img src="assets/${light ? 'd053d' : '8245d'}.svg" alt=""></i></${href ? 'a' : 'button'}>`;
const projectData = [
 ['belaz','Водородный карьерный самосвал БЕЛАЗ','bef84.png','Водородный карьерный самосвал и заправочная инфраструктура — ключевой проект Н2 Инжиниринг для горнодобывающей отрасли.'],
 ['mobile','Мобильная водородная заправочная станция','070a6.png','Мобильная инфраструктура для заправки транспорта водородом.'],
 ['infrastructure','Н2 — инфраструктура','7e12e.png','Водородная инфраструктура для коммерческих транспортных парков.'],
 ['rusak','Русак К-10 — первый российский водородный вездеход','98a57.png','Первый российский вездеход на водородных топливных элементах для Арктики и бездорожья.'],
 ['testing','Полигон разработки и испытаний Н2-оборудования и систем','3f5d7.png','Полигон разработки и испытаний водородного оборудования и систем.'],
 ['sakhalin','Полигон водородных пилотных проектов на Сахалине','20cad.png','Полигон водородных пилотных проектов на Сахалине.'],
 ['snowflake','Международная арктическая станция «Снежинка»','82f83.png','Международная арктическая станция «Снежинка».']
];
const newsData = [
 ['bus','Водородная заправка для автобусов','8b2ef.png','15.10.2026','Новости энергетики','media'],
 ['belaz','Водород для карьерных самосвалов','c1914.png','02.10.2026','Горная промышленность','media'],
 ['electrolyzer','Новый электролизёр прошёл тесты','5946c.png','24.09.2026','Деловой вестник','company'],
 ['fuel-cells','Топливные элементы — в серию','e733d.png','11.09.2026','Индустрия+','company'],
 ['arctic','Водородный комплекс для Арктики','83cc5.png','28.08.2026','Технологии Арктики','media'],
 ['truck','Тягач на водороде: 1000 км пути','d9078.png','14.08.2026','Транспортный курьер','media']
];
const jobs = [
 ['engineer','Инженер-конструктор','Москва','полная занятость','Конструкторский отдел'],
 ['test-engineer','Инженер по испытаниям','Зеленоград','полная занятость','Испытательная лаборатория'],
 ['project-manager','Руководитель проектов','Москва','полная занятость','Проектный офис'],
 ['certification','Специалист по сертификации','Москва','гибрид','Отдел сертификации'],
 ['sales','Менеджер по продажам','Москва','полная занятость','Отдел продаж'],
 ['intern','Стажёр-инженер','Зеленоград','стажировка','Конструкторский отдел']
];
function linkButtons(html) {
 return html.replace(/<button([^>]*?)\sdata-(info|project|news|job)="([^"]+)"([^>]*)>([\s\S]*?)<\/button>/g, (all, before, type, key, after, body) => {
   let href;
   if (type === 'info') href = {about:'about.html',press:'press.html',careers:'careers.html'}[key];
   if (type === 'project') href = `project-${key}.html`;
   if (type === 'news') href = `article-${newsData[Number(key)]?.[0]}.html`;
   if (type === 'job') href = `vacancy-${jobs.find(j => j[1] === key)?.[0]}.html`;
   return href ? `<a${before} href="${href}"${after}>${body}</a>` : all;
 }).replaceAll('href="#about"', 'href="about.html"').replaceAll('href="#press"', 'href="press.html"').replaceAll('href="#careers"', 'href="careers.html"');
}
home = linkButtons(home).replace('class="skip" href="about.html"', 'class="skip" href="#about"');
home = home.replace(/<div class="case-link">[\s\S]*?<\/div>/, block => block.replace('href="#projects"', 'href="projects.html"'));
await fs.writeFile('index.html', home);
const header = home.match(/<header[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer>[\s\S]*?<\/footer>/)[0];
const dialogs = home.slice(home.indexOf('<dialog id="contact-dialog"'), home.indexOf('</body>'));
function innerLinks(html) {
 return html.replaceAll('href="#home"','href="index.html"').replaceAll('href="#projects"','href="index.html#projects"').replaceAll('href="#partners"','href="index.html#partners"').replaceAll('href="#contacts"','href="index.html#contacts"');
}
function crumbs(items) {
 return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a>${items.map(([label,href]) => `<span aria-hidden="true">/</span>${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`).join('')}</nav>`;
}
function panel(title, description, hr = false) {
 return `<aside class="page-cta"><div><h3>${title}</h3><p>${description}</p></div>${cta('Связаться с нами','',false,hr ? 'data-contact-subject="Хочу присоединиться к команде" data-recipient="hr@h2team.tech"' : '')}</aside>`;
}
const pagination = '<nav class="page-pagination" aria-label="Страницы списка"><span aria-live="polite">[1] / [1]</span><button class="round light" disabled aria-label="Предыдущая страница"><img src="assets/25b2a.svg" alt=""></button><button class="round light" disabled aria-label="Следующая страница"><img src="assets/d053d.svg" alt=""></button></nav>';
async function page(file,title,body,active='',kind='') {
 let nav = innerLinks(header).replace('class="active"', '').replace(`href="${active}"`, `class="active" aria-current="page" href="${active}"`);
 const head = home.slice(0,home.indexOf('<body>')).replace(/<title>.*?<\/title>/, `<title>${esc(title)} — Н2 Инжиниринг</title>`).replace('<script src="app.js" defer></script>', '<link rel="stylesheet" href="pages.css"><script src="app.js" defer></script><script src="pages.js" defer></script>');
 await fs.writeFile(file, `${head}<body class="inner-page ${kind}"><a class="skip" href="#content">Перейти к содержимому</a><div class="page-header">${nav}</div><main id="content" class="page-main wrap">${body}</main>${innerLinks(footer)}${dialogs}</body></html>`);
}
const stats = home.match(/<div class="stats">[\s\S]*?<\/sup><\/strong><p>специалистов[\s\S]*?<\/div><\/div>/)[0];
const aboutCopy = home.match(/<div class="about-copy">[\s\S]*?<\/div>/)[0];
await page('about.html','О компании',`${crumbs([['О компании']])}<h1>О <em>компании</em></h1><div class="page-about-copy">${aboutCopy}</div>${stats}<section class="directions"><div class="heading-badge"><h2>Направления <em>деятельности</em></h2><span class="badge">3 ключевых направления</span></div><div class="direction-grid">${[
 ['b6be8.svg','Энергоустановки<br>на водороде','для транспорта и промышленности'],
 ['4092a.svg','Водородные<br>заправочные станции','(стационарные и мобильные)'],
 ['a9eb5.svg','Генераторы водорода','малой производительности'],
 ['2cd66.svg','Инжиниринг','и сервис «под ключ»']
].map(([icon,title,desc])=>`<article><div class="direction-icon"><img src="assets/${icon}" alt=""></div><h3>${title}</h3><p>${desc}</p></article>`).join('')}</div></section><section class="who"><h2>Кто <em>мы</em></h2><div class="who-grid"><div class="who-copy"><p>Н2 Инжиниринг (ООО Инжиниринговый центр «Автономная энергетика») — российская компания, специализирующаяся на разработке и внедрении практических решений в сфере водородной энергетики.</p><p><strong>Образована в 2019 г. как спин-офф ведущего технического вуза страны – МФТИ.</strong><br>Основное направление деятельности — создание автономных генерирующих систем на базе возобновляемых источников энергии с интеграцией водородных технологий.</p></div><aside><h3>Компания предоставляет полный комплекс услуг:</h3><p>от первоначальной концепции до пусконаладочных работ и ввода объектов в эксплуатацию.</p></aside></div></section>${panel('Хотите сотрудничать?','Свяжитесь с нами — обсудим задачу и предложим решение.')}`,'about.html','about-page');
function projectCard(item, i=0) {
 const [id,projectTitle,image] = item;
 const title = id === 'rusak' ? 'Н2 – вездеход и полигон ходовых испытаний Н2-транспорта' : projectTitle;
 const images = {rusak:'fed5b.png'};
 return `<article><a class="portfolio-photo crop-${id}" href="project-${id}.html" aria-label="${esc(title)}"><span class="portfolio-image"><img src="assets/${images[id]||image}" alt="${esc(title)}" loading="lazy"></span><span class="project-arrow"><img src="assets/ac126.svg" alt=""></span></a><h3><a href="project-${id}.html">${title}</a></h3></article>`;
}
await page('projects.html','Наши проекты',`${crumbs([['Проекты']])}<h1>Наши <em>проекты</em></h1><a class="portfolio-feature" href="project-belaz.html"><img src="assets/438a2.png" alt="Водородный карьерный самосвал БЕЛАЗ"><h2>Н2 – карьерный самосвал<br>и заправочная инфраструктура</h2></a><div class="portfolio-grid">${projectData.slice(1).map(projectCard).join('')}</div>${pagination}`,'index.html#projects','portfolio-page');
function newsCards() {
 return `<div class="publication-grid">${newsData.map(([id,title,img,date,source,category])=>`<article data-category="${category}"><a href="article-${id}.html" aria-label="${title}"><img src="assets/${img}" alt="${title}" loading="lazy"></a><div><p class="publication-meta"><time datetime="${date.split('.').reverse().join('-')}">${date}</time><span>${source}</span></p><h3><a href="article-${id}.html">${title}</a></h3><a class="text-link" href="article-${id}.html">Читать →</a></div></article>`).join('')}</div><p class="publication-empty" hidden>В этом разделе пока нет публикаций.</p>${pagination}`;
}
const pressHeading = `<div class="heading-badge"><h1>Пресса <em>о нас</em></h1><span class="badge">Новости, интервью и аналитика</span></div>`;
const filters = `<div class="publication-filters" aria-label="Категории публикаций">${[['all','Все'],['media','СМИ'],['company','Новости компании'],['video','Видео']].map(([key,label],i)=>`<button data-filter="${key}" aria-pressed="${!i}">${label}</button>`).join('')}</div><p class="sr-only" data-filter-status aria-live="polite"></p>`;
await page('press.html','Пресса о нас',`${crumbs([['Пресса о нас']])}${pressHeading}${filters}${newsCards()}`,'press.html','press-page');
await page('careers.html','Карьера в компании',`${crumbs([['Карьера']])}<div class="heading-badge"><h1>Карьера <em>в компании</em></h1><span class="badge">6 открытых вакансий</span></div><p class="career-lead">Мы — команда инженеров, которая делает водородную энергетику доступной для промышленности. Реальные проекты, сильная команда, гибкий график и ДМС.</p><section class="vacancies"><h2>Открытые <em>вакансии</em></h2><div class="vacancy-list">${jobs.map(([id,title,city,type,department])=>`<article><div><h3><a href="vacancy-${id}.html">${title}</a></h3><p>${city} · ${type} · ${department}</p></div>${cta('Откликнуться',`vacancy-${id}.html`,true)}</article>`).join('')}</div></section>${panel('Не нашли подходящую вакансию?','Отправьте резюме на <a href="mailto:hr@h2team.tech">hr@h2team.tech</a> — мы свяжемся с вами, когда появится подходящая позиция.',true)}`,'careers.html','careers-page');
function listText(id) { return `<ul>${text[id].replace('от [X] лет, ', '').replace(' — указать нужное', '').replace('[Опционально: английский', 'Английский').replace('командировкам.]', 'командировкам.').replace(/\u2028/g,'\n').split(/\n+/).filter(x=>x.trim()).map(x=>`<li>${esc(x.trim())}</li>`).join('')}</ul>`; }
for (const [id,title,city,type,department] of jobs) {
 const body = id === 'engineer' ? `<section class="vacancy-section"><h2>Обязанности</h2>${listText('4012:1934')}</section><section class="vacancy-section"><h2>Что мы <em>ожидаем</em></h2>${listText('4012:1935')}</section><section class="vacancy-section"><h2>Что мы <em>предлагаем:</em></h2>${listText('4012:1936')}</section>` : `<section class="vacancy-section vacancy-summary"><h2>О <em>вакансии</em></h2><p>Команда Н2 Инжиниринг ищет специалиста на позицию «${title}». Подразделение: ${department.toLowerCase()}. Место работы: ${city}.</p><p>Чтобы обсудить задачи и условия работы, отправьте резюме на <a class="text-link" href="mailto:hr@h2team.tech">hr@h2team.tech</a>.</p></section>`;
 await page(`vacancy-${id}.html`, title, `${crumbs([['Карьера','careers.html'],[title]])}<section class="vacancy-intro"><div><h1>${title}</h1><div class="vacancy-tags"><span class="badge">${city}</span><span class="badge">${type}</span><span class="badge">${department.toLowerCase()}</span></div><p>${id === 'engineer' ? esc(text['4012:1933']) : `Присоединяйтесь к команде Н2 Инжиниринг.`}</p></div>${cta('Откликнуться','',false,`data-contact-subject="Отклик на вакансию «${title}»" data-recipient="hr@h2team.tech"`)}</section>${body}${cta('Откликнуться','',false,`data-contact-subject="Отклик на вакансию «${title}»" data-recipient="hr@h2team.tech"`)}`, 'careers.html','vacancy-page');
}
for (const [id,title,img,date] of newsData) {
 const paragraphs = id === 'bus' ? text['4012:2013'].split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('') : `<p>${title} — публикация из раздела «Пресса о нас».</p><p>Запросить полный материал и дополнительную информацию о проекте можно у команды Н2 Инжиниринг.</p>${cta('Запросить публикацию','',false,`data-contact-subject="Запрос публикации «${title}»"`)}`;
 await page(`article-${id}.html`, title, `${crumbs([['Пресса о нас','press.html'],[title]])}<article class="article-content"><img class="article-hero" src="assets/${img}" alt="${title}"><time>${id==='bus'?'13.10.2026':date}</time><h1>${title}</h1><div class="article-body">${paragraphs}</div></article><section class="related-publications"><div class="heading-badge"><h2>Пресса <em>о нас</em></h2><span class="badge">Новости, интервью и аналитика</span></div>${filters}${newsCards()}</section>`, 'press.html','article-page');
}
for (const [id,title,img,desc] of projectData) {
 const isBelaz = id === 'belaz', isRusak = id === 'rusak';
 const metrics = isBelaz ? [['64','км/ч','максимальная скорость'],['55','т','грузоподъёмность'],['75','кВт','мощность установки'],['500','км','запас хода без дозаправки']] : isRusak ? [['60','км/ч','максимальная скорость'],['2,5','тонн','максимальная грузоподъёмность'],['8','','пассажиров'],['500','км','без дозаправки']] : [];
 const details = isBelaz ? [['О проекте','Мобильная водородная заправка для карьерных самосвалов БЕЛАЗ.'],['Задача','Сократить простои самосвалов и перейти на водород без перестройки карьера.'],['Решение','Мобильный заправочный модуль и энергокомплекс на топливных элементах.'],['Результат','Меньше расходов на топливо и выбросов, больше часов работы техники.']] : [['О проекте',desc]];
 const gallery = isBelaz ? ['65595.png','bef84.png','3cc65.png'] : [img];
 const related = projectData.filter(x=>x[0]!==id).filter(x=>isBelaz ? ['rusak','mobile'].includes(x[0]) : ['belaz','mobile'].includes(x[0])).slice(0,2);
 await page(`project-${id}.html`,title,`${crumbs([['Проекты','projects.html'],[isBelaz?'БЕЛАЗ':title]])}<section class="project-intro"><h1>${isBelaz?'Водородный карьерный<br>самосвал БЕЛАЗ':title}</h1><p>${desc}</p>${cta()}</section>${metrics.length ? `<div class="project-specs">${metrics.map(([n,unit,label])=>`<div><strong>[${n}] ${unit}</strong><p>${label}</p></div>`).join('')}</div><span class="badge specs-caption">Технические характеристики проекта</span>` : ''}<div class="project-details">${details.map(([heading,copy])=>`<section><h2>${heading}</h2><p>${copy}</p></section>`).join('')}</div><section class="project-gallery"><h2>Галерея <em>проекта</em></h2><div class="gallery-grid">${gallery.map((image,i)=>`<button data-gallery="assets/${image}" aria-label="Открыть фото ${i+1} проекта"><img src="assets/${image}" alt="${title}, фото ${i+1}" loading="lazy"></button>`).join('')}</div></section>${panel('Обсудим ваш проект?','Свяжитесь с нами — подготовим предложение под вашу задачу.')}<section class="related-projects"><h2>Другие <em>проекты</em></h2><div class="related-grid">${related.map(([key,label,image])=>`<a href="project-${key}.html"><img src="assets/${key==='mobile'?'c5d07.png':image}" alt="${label}" loading="lazy"><h3>${label}</h3></a>`).join('')}</div><a class="text-link" href="projects.html">Все проекты →</a></section>`, 'index.html#projects',`project-page project-${id}`);
 const filename=`project-${id}.html`;
 let html=await read(filename);
 html=html.replace('<main id="content"',`<div class="project-page-scene" aria-hidden="true"><img src="assets/${img}" alt=""></div><main id="content"`);
 html=html.replace('</body>', '<dialog class="gallery-dialog dialog" id="gallery-dialog"><button class="close light" aria-label="Закрыть фото">×</button><img src="" alt="" id="gallery-image"></dialog></body>');
 await fs.writeFile(filename,html);
}
console.log('Generated 23 internal pages and updated homepage links.');
