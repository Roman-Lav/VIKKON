// Слайдшоу баннеров: каждые 4 секунды следующая картинка плавно (3 с)
// проявляется поверх текущей. Повторяет поведение старого jQuery-скрипта,
// но без jQuery: анимация делается CSS-переходом opacity.
(() => {
	const container = document.getElementById('img_top_content');
	if (!container) return;

	const slides = Array.from(container.querySelectorAll('img'));
	if (slides.length < 2) return;

	// Пользователям, которые отключили анимацию в системе, слайды не крутим.
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const INTERVAL = 4000;
	const FADE = 3000;

	function next() {
		const active = container.querySelector('img.active') || slides[slides.length - 1];
		const nextSlide = slides[(slides.indexOf(active) + 1) % slides.length];

		active.classList.add('last-active');
		nextSlide.classList.add('active');

		setTimeout(() => active.classList.remove('active', 'last-active'), FADE);
	}

	let timer = setInterval(next, INTERVAL);

	// Не тратим ресурсы, пока вкладка скрыта.
	document.addEventListener('visibilitychange', () => {
		clearInterval(timer);
		if (!document.hidden) timer = setInterval(next, INTERVAL);
	});
})();
