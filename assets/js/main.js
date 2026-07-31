/* margo-web — global behaviour
 * - Splash intro (dismissable via sessionStorage)
 * - Nav scroll compression + mobile toggle
 * - Testimonials horizontal carousel with prev/next controls
 */

(() => {
	/* ------------------------------
	 * 1. Splash
	 * ---------------------------- */
	const splash = document.querySelector(".splash");
	if (splash) {
		// Auto-hide after CSS animation completes
		splash.addEventListener("animationend", (e) => {
			if (e.animationName === "splashOut") {
				splash.remove();
			}
		});
		// Fail-safe removal in case animation is blocked
		setTimeout(() => splash && splash.parentNode && splash.remove(), 4000);
	}

	/* ------------------------------
	 * 2. Nav
	 * ---------------------------- */
	const nav = document.querySelector(".site-nav");
	if (nav) {
		const onScroll = () => {
			if (window.scrollY > 60) nav.classList.add("is-scrolled");
			else nav.classList.remove("is-scrolled");
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();

		const toggle = nav.querySelector(".nav-toggle");
		if (toggle) {
			toggle.addEventListener("click", () => {
				const open = nav.classList.toggle("is-open");
				toggle.setAttribute("aria-expanded", String(open));
			});
			nav.querySelectorAll(".nav-link").forEach((link) => {
				link.addEventListener("click", () => nav.classList.remove("is-open"));
			});
		}
	}

	/* ------------------------------
	 * 3. Testimonials carousel
	 * ---------------------------- */
	document.querySelectorAll(".testimonial-track").forEach((track) => {
		const list = track.querySelector(".testimonial-list");
		const prev = track.parentElement.querySelector(".testimonial-nav .prev");
		const next = track.parentElement.querySelector(".testimonial-nav .next");
		if (!list) return;
		const step = () => {
			const card = list.querySelector(".testimonial-card");
			return card ? card.getBoundingClientRect().width + 24 : 320;
		};
		prev &&
			prev.addEventListener("click", () =>
				list.scrollBy({ left: -step(), behavior: "smooth" }),
			);
		next &&
			next.addEventListener("click", () =>
				list.scrollBy({ left: step(), behavior: "smooth" }),
			);
	});
})();
