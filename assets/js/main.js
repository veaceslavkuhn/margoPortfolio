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
			const setOpen = (open) => {
				nav.classList.toggle("is-open", open);
				document.body.classList.toggle("nav-open", open);
				toggle.setAttribute("aria-expanded", String(open));
			};
			toggle.addEventListener("click", () => {
				setOpen(!nav.classList.contains("is-open"));
			});
			nav.querySelectorAll(".nav-link").forEach((link) => {
				link.addEventListener("click", () => setOpen(false));
			});
			// Close drawer if viewport grows past the mobile breakpoint
			const mq = matchMedia("(max-width: 860px)");
			const onMq = (e) => {
				if (!e.matches) setOpen(false);
			};
			mq.addEventListener
				? mq.addEventListener("change", onMq)
				: mq.addListener(onMq);
			// Close on Escape
			document.addEventListener("keydown", (e) => {
				if (e.key === "Escape" && nav.classList.contains("is-open"))
					setOpen(false);
			});
		}
	}

	/* ------------------------------
	 * 3. Testimonials carousel — infinite, one card at a time
	 *    Includes touch-swipe, reduced-motion, aria-live and animated expand.
	 * ---------------------------- */
	document.querySelectorAll(".testimonial-track").forEach((track) => {
		const section = track.closest(".testimonials") || track.parentElement;
		const list = track.querySelector(".testimonial-list");
		const prev = section.querySelector(".testimonial-nav .prev");
		const next = section.querySelector(".testimonial-nav .next");
		const live = section.querySelector(".testimonials__live");
		if (!list || list.children.length === 0) return;

		const GAP = 24;
		const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
		const duration = () => (reduceMotion.matches ? 0 : 400);
		let animating = false;

		const step = () => {
			const first = list.firstElementChild;
			return first ? first.getBoundingClientRect().width + GAP : 0;
		};

		const announce = () => {
			if (!live) return;
			const first = list.firstElementChild;
			const name = first
				?.querySelector(".testimonial-card__name")
				?.textContent.trim();
			if (name) live.textContent = `Showing testimonial from ${name}`;
		};

		const goNext = () => {
			if (animating) return;
			const first = list.firstElementChild;
			if (!first) return;
			animating = true;
			const d = duration();
			list.style.transition = d ? `transform ${d}ms ease` : "none";
			list.style.transform = `translateX(${-step()}px)`;
			const finish = () => {
				list.style.transition = "none";
				list.style.transform = "translateX(0)";
				list.appendChild(first);
				void list.offsetWidth;
				animating = false;
				announce();
			};
			if (d === 0) {
				finish();
			} else {
				const onEnd = () => {
					list.removeEventListener("transitionend", onEnd);
					finish();
				};
				list.addEventListener("transitionend", onEnd);
			}
		};

		const goPrev = () => {
			if (animating) return;
			const last = list.lastElementChild;
			if (!last) return;
			animating = true;
			const d = duration();
			list.style.transition = "none";
			list.insertBefore(last, list.firstElementChild);
			list.style.transform = `translateX(${-step()}px)`;
			void list.offsetWidth;
			list.style.transition = d ? `transform ${d}ms ease` : "none";
			list.style.transform = "translateX(0)";
			const finish = () => {
				animating = false;
				announce();
			};
			if (d === 0) {
				finish();
			} else {
				const onEnd = () => {
					list.removeEventListener("transitionend", onEnd);
					finish();
				};
				list.addEventListener("transitionend", onEnd);
			}
		};

		prev?.addEventListener("click", goPrev);
		next?.addEventListener("click", goNext);

		window.addEventListener("resize", () => {
			list.style.transition = "none";
			list.style.transform = "translateX(0)";
		});

		// Touch swipe (pointer-based for cross-device, ignores mouse drag)
		let startX = null;
		let startY = null;
		track.addEventListener(
			"touchstart",
			(e) => {
				if (e.touches.length !== 1) return;
				startX = e.touches[0].clientX;
				startY = e.touches[0].clientY;
			},
			{ passive: true },
		);
		track.addEventListener(
			"touchend",
			(e) => {
				if (startX === null) return;
				const t = e.changedTouches[0];
				const dx = t.clientX - startX;
				const dy = t.clientY - startY;
				startX = startY = null;
				// only treat as swipe when horizontal delta clearly dominates
				if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
				if (dx < 0) goNext();
				else goPrev();
			},
			{ passive: true },
		);

		// Read more / read less toggle with smooth height animation
		const animateExpand = (card, expand) => {
			const short = card.querySelector(".testimonial-card__body--short");
			const long = card.querySelector(".testimonial-card__body--long");
			const btn = card.querySelector("button.testimonial-card__cta");
			const label = btn?.querySelector(".testimonial-card__cta-label");
			const d = duration();
			const from = card.getBoundingClientRect().height;
			// Toggle state / content
			card.classList.toggle("is-expanded", expand);
			btn?.setAttribute("aria-expanded", String(expand));
			if (expand) {
				short?.setAttribute("hidden", "");
				long?.removeAttribute("hidden");
				if (label?.dataset.less) label.textContent = label.dataset.less;
			} else {
				long?.setAttribute("hidden", "");
				short?.removeAttribute("hidden");
				if (label?.dataset.more) label.textContent = label.dataset.more;
			}
			if (d === 0) return;
			// Measure new height, then animate from → to
			const to = card.getBoundingClientRect().height;
			if (from === to) return;
			card.style.height = `${from}px`;
			card.style.overflow = "hidden";
			void card.offsetWidth;
			card.style.transition = `height ${d}ms ease`;
			card.style.height = `${to}px`;
			const cleanup = () => {
				card.removeEventListener("transitionend", cleanup);
				card.style.transition = "";
				card.style.height = "";
				card.style.overflow = "";
			};
			card.addEventListener("transitionend", cleanup);
		};

		list.addEventListener("click", (e) => {
			const btn = e.target.closest(".testimonial-card__cta");
			if (!btn || btn.tagName !== "BUTTON") return;
			const card = btn.closest(".testimonial-card");
			if (!card) return;
			animateExpand(card, !card.classList.contains("is-expanded"));
		});
	});

	/* ------------------------------
	 * 4. DKP project — password gate (index page)
	 *    Correct password (2203) sets localStorage flag and redirects to detail.
	 * ---------------------------- */
	const dkpCard = document.querySelector(".project-card--dkp");
	if (dkpCard) {
		const DKP_URL = "projects/dkp.html";
		const isUnlocked = () => localStorage.getItem("dkp-unlocked") === "true";

		const applyState = () => {
			const unlocked = isUnlocked();
			dkpCard.dataset.state = unlocked ? "unlocked" : "locked";
			if (unlocked) {
				dkpCard.setAttribute("role", "link");
				dkpCard.setAttribute("tabindex", "0");
			} else {
				dkpCard.removeAttribute("role");
				dkpCard.removeAttribute("tabindex");
			}
		};
		applyState();

		const navigate = () => {
			window.location.href = DKP_URL;
		};

		dkpCard.addEventListener("click", (e) => {
			if (dkpCard.dataset.state !== "unlocked") return;
			if (e.target.closest(".project-card__lock")) return;
			navigate();
		});
		dkpCard.addEventListener("keydown", (e) => {
			if (dkpCard.dataset.state !== "unlocked") return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				navigate();
			}
		});

		const lockedCta = dkpCard.querySelector(".project-card__cta--locked");
		const form = dkpCard.querySelector(".project-card__lock");
		const input = form?.querySelector(".project-card__lock-input");

		const openForm = () => {
			if (dkpCard.dataset.state !== "locked") return;
			dkpCard.dataset.formOpen = "true";
			requestAnimationFrame(() => input?.focus());
		};
		const closeForm = () => {
			dkpCard.dataset.formOpen = "false";
			if (input) input.value = "";
			if (form) form.dataset.error = "false";
		};

		lockedCta?.addEventListener("click", (e) => {
			// stop bubbling so the document click-outside handler doesn't immediately reclose
			e.stopPropagation();
			openForm();
		});

		form?.addEventListener("submit", (e) => {
			e.preventDefault();
			if (input.value === "2203") {
				localStorage.setItem("dkp-unlocked", "true");
				navigate();
			} else {
				form.dataset.error = "true";
			}
		});
		input?.addEventListener("input", () => {
			if (form.dataset.error === "true") form.dataset.error = "false";
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && dkpCard.dataset.formOpen === "true") {
				closeForm();
			}
		});
		document.addEventListener("click", (e) => {
			if (dkpCard.dataset.formOpen !== "true") return;
			if (form?.contains(e.target)) return;
			if (lockedCta?.contains(e.target)) return;
			closeForm();
		});
	}
})();
