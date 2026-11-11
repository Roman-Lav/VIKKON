// Мобильное меню, шапка и паттерн при прокрутке, просмотр картинок на весь экран, кнопка «Вгору».
(() => {
	const toggle = document.querySelector('.nav-toggle');
	const nav = document.getElementById('site-nav');

	if (toggle && nav) {
		const setOpen = (open) => {
			toggle.setAttribute('aria-expanded', String(open));
			nav.classList.toggle('open', open);
			const header = toggle.closest('.site-header');
			if (header) header.classList.toggle('menu-open', open);
		};
		toggle.addEventListener('click', () => {
			setOpen(toggle.getAttribute('aria-expanded') !== 'true');
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') setOpen(false);
		});
		// Пункт меню ведёт к блоку на этой же странице — после клика меню закрываем.
		nav.addEventListener('click', (e) => {
			if (e.target.closest('a')) setOpen(false);
		});
	}

	// Картинки .zoom: клик открывает на весь экран, повторный клик (или Esc) закрывает.
	const zooms = document.querySelectorAll('.zoom');
	if (zooms.length) {
		const box = document.createElement('button');
		box.type = 'button';
		box.className = 'lightbox';
		box.hidden = true;
		box.setAttribute('aria-label', 'Закрити');
		const big = document.createElement('img');
		big.alt = '';
		box.appendChild(big);
		document.body.appendChild(box);

		let opener = null;
		const close = () => {
			if (box.hidden) return;
			box.hidden = true;
			document.documentElement.style.overflow = '';
			if (opener) opener.focus();
		};
		zooms.forEach((z) => {
			z.addEventListener('click', () => {
				const small = z.querySelector('img');
				big.src = z.dataset.full || small.src;
				big.alt = small.alt;
				opener = z;
				box.hidden = false;
				document.documentElement.style.overflow = 'hidden';
				box.focus();
			});
		});
		box.addEventListener('click', close);
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') close();
		});
	}

	// --scroll: 0 вверху страницы → 1 после ~360px прокрутки.
	// По нему шапка заливается фоном страницы.
	const top = document.querySelector('.to-top');
	const root = document.documentElement;
	const headerEl = document.querySelector('.site-header .nav');
	const headerHeight = () => (headerEl ? headerEl.offsetHeight : 0);
	const spy = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'))
		.map((link) => ({ link, target: document.getElementById(link.getAttribute('href').slice(1)) }))
		.filter((item) => item.target);
	let ticking = false;
	const update = () => {
		ticking = false;
		const y = window.scrollY;
		root.style.setProperty('--scroll', Math.min(1, y / 360).toFixed(3));
		if (top) top.classList.toggle('show', y > 600);

		// Подсветка пункта меню для раздела, который сейчас на экране.
		const line = y + headerHeight() + 40;
		let current = spy.length ? spy[0] : null;
		for (const item of spy) {
			if (item.target.getBoundingClientRect().top + y <= line) current = item;
		}
		for (const item of spy) item.link.classList.toggle('is-active', item === current);
	};
	window.addEventListener('scroll', () => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	}, { passive: true });
	update();
})();
