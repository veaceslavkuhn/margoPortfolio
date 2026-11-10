/* margo-web — global behaviour
 * - Splash intro (dismissable via sessionStorage)
 * - Nav scroll compression + mobile toggle
 * - Testimonials horizontal carousel with prev/next controls
 */

(() => {
	/* ------------------------------
	 * 0. Theme (Classic default ⇄ Funky)
	 *    <html data-theme> is set before first paint by the inline <head> script;
	 *    here we only sync the switch(es) and handle clicks.
	 * ---------------------------- */
	const root = document.documentElement;
	const toggles = document.querySelectorAll(".theme-toggle");
	const syncToggles = () => {
		const funky = root.dataset.theme === "funky";
		toggles.forEach((t) => t.setAttribute("aria-checked", String(funky)));
	};
	syncToggles();
	toggles.forEach((t) =>
		t.addEventListener("click", () => {
			const next = root.dataset.theme === "funky" ? "classic" : "funky";
			root.dataset.theme = next;
			try {
				localStorage.setItem("theme", next);
			} catch (_) {}
			syncToggles();
			// Layout widths change between themes — let width-dependent code (carousel) reset.
			window.dispatchEvent(new Event("resize"));
			document.dispatchEvent(new CustomEvent("themechange"));
		}),
	);

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
		// Hysteresis prevents the class from flapping around the threshold.
		let scrolled = false;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const y = window.scrollY;
				if (!scrolled && y > 80) {
					scrolled = true;
					nav.classList.add("is-scrolled");
				} else if (scrolled && y < 40) {
					scrolled = false;
					nav.classList.remove("is-scrolled");
				}
				ticking = false;
			});
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

		// Classic (designer round 2): no "read more" button — the whole card is the control.
		// Hover turns the quote red (classic.css); click unfolds the long quote in place,
		// or opens the full letter when the testimonial only has an external link.
		const isClassic = () => document.documentElement.dataset.theme !== "funky";
		const canExpand = (card) =>
			!!card.querySelector(".testimonial-card__body--long");
		const syncCards = () => {
			list.querySelectorAll(".testimonial-card").forEach((card) => {
				if (isClassic()) {
					card.setAttribute("role", "button");
					card.setAttribute("tabindex", "0");
					if (canExpand(card))
						card.setAttribute(
							"aria-expanded",
							String(card.classList.contains("is-expanded")),
						);
				} else {
					card.removeAttribute("role");
					card.removeAttribute("tabindex");
					card.removeAttribute("aria-expanded");
				}
			});
		};
		const activateCard = (card) => {
			if (canExpand(card)) {
				animateExpand(card, !card.classList.contains("is-expanded"));
				syncCards();
			} else {
				const link = card.querySelector("a.testimonial-card__cta");
				if (link) window.open(link.href, "_blank", "noopener");
			}
		};
		syncCards();
		document.addEventListener("themechange", syncCards);

		list.addEventListener("click", (e) => {
			const btn = e.target.closest(".testimonial-card__cta");
			if (btn && btn.tagName === "BUTTON") {
				const card = btn.closest(".testimonial-card");
				if (card) animateExpand(card, !card.classList.contains("is-expanded"));
				return;
			}
			if (!isClassic()) return;
			if (e.target.closest("a")) return; // LinkedIn icon keeps its own link
			const card = e.target.closest(".testimonial-card");
			if (card) activateCard(card);
		});
		list.addEventListener("keydown", (e) => {
			if (!isClassic()) return;
			const card = e.target.closest(".testimonial-card");
			if (!card || e.target !== card) return;
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				activateCard(card);
			}
		});
	});

	/* ------------------------------
	 * 4. DKP project — password gate (index page)
	 *    Correct password (2203) sets a one-shot sessionStorage flag; the detail
	 *    page consumes and clears it, so every visit re-prompts.
	 * ---------------------------- */
	// One DKP card per theme (Funky portrait card + Classic landscape card) share one gate.
	const DKP_URL = "projects/dkp.html";
	const dkpCards = document.querySelectorAll(".project-card--dkp");
	if (dkpCards.length) {
		// Clear legacy persistent flag from earlier versions.
		try {
			localStorage.removeItem("dkp-unlocked");
		} catch (_) {}
	}
	const isUnlocked = () => sessionStorage.getItem("dkp-unlocked") === "true";
	dkpCards.forEach((dkpCard) => {
		// Classic card has no "password required" button: the locked card itself opens the field.
		const cardOpensForm = !dkpCard.querySelector(".project-card__cta--locked");
		const applyState = () => {
			const unlocked = isUnlocked();
			dkpCard.dataset.state = unlocked ? "unlocked" : "locked";
			if (unlocked) {
				dkpCard.setAttribute("role", "link");
				dkpCard.setAttribute("tabindex", "0");
				dkpCard.removeAttribute("aria-label");
			} else if (cardOpensForm) {
				dkpCard.setAttribute("role", "button");
				dkpCard.setAttribute("tabindex", "0");
				dkpCard.setAttribute("aria-label", "DKP — password required");
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
			if (e.target.closest(".project-card__lock")) return;
			if (dkpCard.dataset.state === "unlocked") return navigate();
			if (cardOpensForm) {
				// stop bubbling so the document click-outside handler doesn't immediately reclose
				e.stopPropagation();
				openForm();
			}
		});
		dkpCard.addEventListener("keydown", (e) => {
			if (e.target !== dkpCard) return; // ignore keys typed in the password field
			if (e.key !== "Enter" && e.key !== " ") return;
			if (dkpCard.dataset.state === "unlocked") {
				e.preventDefault();
				navigate();
			} else if (cardOpensForm) {
				e.preventDefault();
				openForm();
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
				sessionStorage.setItem("dkp-unlocked", "true");
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
	});

	/* ------------------------------
	 * 4b. Facts carousel (Classic mobile) — arrow advances one card, wraps at the end.
	 *     Swiping is native (CSS scroll-snap); the button is hidden where it isn't a carousel.
	 * ---------------------------- */
	document.querySelectorAll(".facts__next").forEach((btn) => {
		const track = btn.parentElement.querySelector(".facts__grid");
		if (!track) return;
		btn.addEventListener("click", () => {
			const atEnd =
				track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
			track.scrollTo({
				left: atEnd ? 0 : track.scrollLeft + track.clientWidth,
				behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
					? "auto"
					: "smooth",
			});
		});
	});

	/* ------------------------------
	 * 5. Case pages — hide the sticky prev/next bar once testimonials/footer scroll into view
	 * ---------------------------- */
	const caseNav = document.querySelector(".case-nav");
	if (caseNav && "IntersectionObserver" in window) {
		// Both footers are observed — the hidden-theme one never intersects.
		const stopTargets = [
			...document.querySelectorAll(".testimonials, .site-footer"),
		];
		if (stopTargets.length) {
			// Callbacks only report targets whose state changed, so remember all of them.
			const visible = new Set();
			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((e) =>
						e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
					);
					// Use a class so the CSS transition drives the animation
					caseNav.classList.toggle("is-hidden", visible.size > 0);
				},
				{ root: null, threshold: 0 },
			);
			stopTargets.forEach((el) => io.observe(el));
		}
	}
})();
