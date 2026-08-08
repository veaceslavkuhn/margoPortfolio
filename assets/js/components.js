/* margo-web — reusable web components
 * Light-DOM custom elements. Keeps existing CSS classes and main.js selectors intact.
 * Path prefix (BASE) is auto-detected so the same tags work from / and /projects/.
 */

(() => {
	// Detect subfolder pages so assets/links resolve from any depth.
	const BASE = window.location.pathname.includes("/projects/") ? "../" : "";

	const TESTIMONIALS = [
		{
			name: "Thomas Zervos",
			role: "CEO at &ldquo;Vectorial&rdquo;",
			photo: "assets/home/testimonial-thomas.png",
			linkedin: "https://www.linkedin.com/in/thomas-zervos/?locale=en",
			body: "&ldquo;Margo demonstrated solid and practice-oriented expertise in UX/UI design, which she successfully applied at all times. She consistently familiarised herself quickly and confidently with new topics, projects, and tools.&rdquo;",
		},
		{
			name: "Anny Xu",
			role: "Product Owner at &ldquo;Vectorial&rdquo;",
			photo: "assets/home/testimonial-anny.png",
			linkedin: "https://www.linkedin.com/in/anny-xu/",
			body: "&ldquo;Working with Margo has always been exceptionally smooth. She is reliable, collaborative and someone the team can count on to deliver thoughtful, well-crafted work. Her designs strike a unique balance between&hellip;&rdquo;",
		},
		{
			name: "Tom Janssens",
			role: "Creative Technologist and Experiential Designer",
			photo: "assets/home/testimonial-tom.png",
			linkedin: "https://www.linkedin.com/in/tmjns/?locale=en",
			body: "&ldquo;Working with Margo was a great experience. We worked together on a website rebranding where she took ownership of the direction and stands out not only for her UI design capabilities but also for her soft skills.&rdquo;",
		},
		{
			name: "Keri Byrne",
			role: "Product Marketer at &ldquo;Nmbrs&rdquo;",
			photo: "assets/home/testimonial-keri.png",
			linkedin: "https://www.linkedin.com/in/keribyrne/",
			body: "&ldquo;Margo helped build a website and logo design for my ceramic business. Margo was great to work with, she was very direct and communicative. She was also very adaptable and worked fast. She went above and beyond&hellip;&rdquo;",
		},
		{
			name: "Victoria Przybylska",
			role: "Startup Mentor",
			photo: "assets/home/testimonial-victoria.png",
			linkedin: "https://www.linkedin.com/in/victoria-przybylska-startups/",
			body: "&ldquo;I worked with Margo on a mental health startup platform, where she handled UX/UI design. Margo was full of empathy, passion, talent, and she has great communication skills that made collaboration smooth and very enjoyable.&rdquo;",
		},
		{
			name: "Daniel N\u00fcrrenbach",
			role: "Founder of &ldquo;mpct.media&rdquo;",
			photo: "assets/home/testimonial-daniel.png",
			linkedin: "https://www.linkedin.com/in/daniel-n%C3%BCrrenbach-25487520b/",
			body: "lorem ipsum",
		},
	];

	// Cyclic project order per repo memory: my-portfolio → dkp → evolution → kttw → my-portfolio
	const CASE_ORDER = [
		{ slug: "my-portfolio", label: "My Portfolio", file: "my-portfolio.html" },
		{ slug: "dkp", label: "DKP", file: "dkp.html" },
		{ slug: "evolution", label: "Evolution", file: "evolution.html" },
		{ slug: "kttw", label: "KTTW", file: "kttw.html" },
	];

	const SOCIAL_LINKS = [
		{
			href: "mailto:mrg3.designs@gmail.com",
			label: "Email",
			icon: "assets/icons/social-mail.svg",
			external: false,
		},
		{
			href: "https://www.linkedin.com/in/margarita-liutova-ux-ui-designer/",
			label: "LinkedIn",
			icon: "assets/icons/social-linkedin.svg",
			external: true,
		},
		{
			href: "https://www.instagram.com/",
			label: "Instagram",
			icon: "assets/icons/social-instagram.svg",
			external: true,
		},
		{
			href: "https://medium.com/",
			label: "Medium",
			icon: "assets/icons/social-medium.svg",
			external: true,
		},
	];

	class MargoNav extends HTMLElement {
		connectedCallback() {
			const current = this.getAttribute("current") || "";
			const attr = (name) => (current === name ? ' aria-current="page"' : "");
			this.innerHTML = `
<header class="site-nav" role="banner">
  <div class="site-nav__inner">
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu">&#9776;</button>
    <div class="nav-group" id="nav-menu">
      <a class="nav-link" href="${BASE}index.html#projects"${attr("projects")}>projects</a>
      <a class="nav-link" href="${BASE}about.html"${attr("about")}>about</a>
    </div>
    <a class="nav-logo" href="${BASE}index.html" aria-label="Margo home">
      <img src="${BASE}assets/common/logo.svg" alt="Margo logo" />
    </a>
    <div class="nav-group">
      <a class="nav-link" href="#" aria-disabled="true">cv</a>
      <a class="nav-link" href="mailto:mrg3.designs@gmail.com">contact</a>
    </div>
  </div>
</header>`;
		}
	}

	class MargoSmStrip extends HTMLElement {
		connectedCallback() {
			const items = SOCIAL_LINKS.map(
				(i) =>
					`<a class="sm-strip__item" href="${i.href}"${i.external ? ' target="_blank" rel="noopener"' : ""} aria-label="${i.label}"><img src="${BASE}${i.icon}" alt="" /></a>`,
			).join("\n      ");
			this.innerHTML = `
<nav class="sm-strip" aria-label="Social">
      ${items}
</nav>`;
		}
	}

	class MargoTestimonials extends HTMLElement {
		connectedCallback() {
			const cards = TESTIMONIALS.map(
				(t) => `
    <li class="testimonial-card">
      <div class="testimonial-card__head">
        <div class="testimonial-card__avatar">
          <span class="testimonial-card__avatar-bg" aria-hidden="true"></span>
          <img class="testimonial-card__photo" src="${BASE}${t.photo}" alt="${t.name}" />
        </div>
        <div class="testimonial-card__meta">
          <p class="testimonial-card__name">${t.name}</p>
          <p class="testimonial-card__role">${t.role}</p>
        </div>
        <a class="testimonial-card__li" href="${t.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="${BASE}assets/icons/linkedin-testimonial.svg" alt="" /></a>
      </div>
      <p class="testimonial-card__body">${t.body}</p>
    </li>`,
			).join("");
			this.innerHTML = `
<section class="testimonials" aria-labelledby="testimonials-title">
  <header class="section-head">
    <h2 class="section-head__title" id="testimonials-title">Testimonials</h2>
  </header>
  <div class="testimonial-track">
    <ul class="testimonial-list">${cards}
    </ul>
  </div>
  <div class="testimonial-nav" role="group" aria-label="Testimonial navigation">
    <button class="prev" type="button" aria-label="Previous testimonial"><img src="${BASE}assets/icons/carousel-arrow.svg" alt="" /></button>
    <button class="next" type="button" aria-label="Next testimonial"><img src="${BASE}assets/icons/carousel-arrow.svg" alt="" /></button>
  </div>
</section>`;
		}
	}

	class MargoFooter extends HTMLElement {
		connectedCallback() {
			this.innerHTML = `
<footer class="site-footer">
  <div class="site-footer__paper">
    <div class="site-footer__cta">
      <p class="site-footer__love">I create things with <span class="accent manic">LOVE</span></p>
      <p class="site-footer__contact"><a class="btn" href="mailto:mrg3.designs@gmail.com">text me</a></p>
    </div>
    <nav class="site-footer__meta" aria-label="Footer">
      <span class="site-footer__brand">margowebsite.com</span>
      <a href="${BASE}index.html#projects">Projects</a>
      <a href="${BASE}about.html">About</a>
      <a href="#">CV</a>
      <a href="mailto:mrg3.designs@gmail.com">Contact</a>
    </nav>
  </div>
  <div class="site-footer__hearts" aria-hidden="true"></div>
</footer>`;
		}
	}

	class MargoCaseNav extends HTMLElement {
		connectedCallback() {
			const current = this.getAttribute("current") || "";
			const idx = CASE_ORDER.findIndex((c) => c.slug === current);
			if (idx === -1) {
				this.innerHTML = "";
				return;
			}
			const prev =
				CASE_ORDER[(idx - 1 + CASE_ORDER.length) % CASE_ORDER.length];
			const next = CASE_ORDER[(idx + 1) % CASE_ORDER.length];
			this.innerHTML = `
<nav class="case-nav" aria-label="Between projects">
  <a class="prev" href="${prev.file}">${prev.label}</a>
  <a class="next" href="${next.file}">${next.label}</a>
</nav>`;
		}
	}

	customElements.define("margo-nav", MargoNav);
	customElements.define("margo-sm-strip", MargoSmStrip);
	customElements.define("margo-testimonials", MargoTestimonials);
	customElements.define("margo-footer", MargoFooter);
	customElements.define("margo-case-nav", MargoCaseNav);
})();
