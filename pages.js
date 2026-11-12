document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const section = button.closest('.related-publications') || document.querySelector('.page-main');
    section.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    section.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    section.querySelector('.publication-empty').hidden = count !== 0;
    section.querySelector('[data-filter-status]').textContent = `Публикаций: ${count}`;
  });
});
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.querySelector('#gallery-dialog');
    const image = document.querySelector('#gallery-image');
    image.src = button.dataset.gallery;
    image.alt = button.querySelector('img').alt;
    dialog.showModal();
  });
});
