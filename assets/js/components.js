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
			photo: "assets/faces/thomas_zervos.png",
			linkedin: "https://www.linkedin.com/in/thomas-zervos/?locale=en",
			body: "&ldquo;Margo demonstrated solid and practice-oriented expertise in UX/UI design, which she successfully applied at all times. She consistently familiarised herself quickly and confidently with new topics, projects, and tools.&rdquo;",
			link: "https://drive.google.com/drive/folders/1zTg0qa5IKfQn_GkyUb1XNJvitK6iyRKo?usp=drive_link",
		},
		{
			name: "Anny Xu",
			role: "Product Owner at &ldquo;Vectorial&rdquo;",
			photo: "assets/faces/anny_xu.png",
			linkedin: "https://www.linkedin.com/in/anny-xu/",
			body: "&ldquo;Working with Margo has always been exceptionally smooth. She is reliable, collaborative and someone the team can count on to deliver thoughtful, well-crafted work. Her designs strike a unique balance between&hellip;",
			link: "https://docs.google.com/document/d/1tlyAycTVUr5ZgQe669_AsAQAPQc7pXR0/edit?usp=drive_link&ouid=111050569657658335182&rtpof=true&sd=true",
		},
		{
			name: "Tom Janssens",
			role: "Creative Technologist and Experiential Designer",
			photo: "assets/faces/tom_janssens.png",
			linkedin: "https://www.linkedin.com/in/tmjns/?locale=en",
			body: "&ldquo;Working with Margo was a great experience. We worked together on a website rebranding where she took ownership of the direction and stands out not only for her UI design capabilities but also for her soft skills.&rdquo;",
			bodyLong:
				"&ldquo;Working with Margo was a great experience. We worked together on a website rebranding where she took ownership of the direction and stands out not only for her UI design capabilities but also for her soft skills. Margo is a good communicator and asks the right questions. She is a perfect fit for anyone looking for a designer who truly understands teamwork.&rdquo;",
		},
		{
			name: "Victoria Przybylska",
			role: "Startup Mentor",
			photo: "assets/faces/victoria_przybylska.png",
			linkedin: "https://www.linkedin.com/in/victoria-przybylska-startups/",
			body: "&ldquo;I worked with Margo on a mental health startup platform, where she handled UX/UI design. Margo was full of empathy, passion, talent, and she has great communication skills that made collaboration smooth and very enjoyable.&rdquo;",
			bodyLong:
				"&ldquo;I worked with Margo on a mental health startup platform, where she handled UX/UI design. Despite being early in her career, Margo was full of empathy, passion, talent, and she has great communication skills that made collaboration smooth and very enjoyable. She was also very self-confident and knew all the good UX/UI practices. She excels in user research and testing methodology, resulting in intuitive and user-friendly interfaces that meet the target audience&rsquo;s needs. Margo is an exceptional UX/UI designer with a passion for her work. I highly recommend Margo for any UX/UI design project, as she is dedicated to delivering top-notch work and excellent service to clients.&rdquo;",
		},
		{
			name: "Keri Byrne",
			role: "Product Marketer at &ldquo;Nmbrs&rdquo;",
			photo: "assets/faces/keri_byrne.png",
			linkedin: "https://www.linkedin.com/in/keribyrne/",
			body: "&ldquo;Margo helped build a website and logo design for my ceramic business. Margo was great to work with, she was very direct and communicative. She was also very adaptable and worked fast. She went above and beyond&hellip;",
			bodyLong:
				"&ldquo;Margo helped build a website and logo design for my ceramic business. Margo was great to work with, she was very direct and communicative. She was also very adaptable and worked fast. She went above and beyond to help me with branding and logo even though that wasn&rsquo;t part of the requirements. Highly recommend working with Margo.&rdquo;",
		},
		{
			name: "Veacheslav Grigorov",
			role: "QA at &rdquo;Native Instruments&rdquo;",
			photo: "assets/faces/veaceslav_grigorov.png",
			linkedin: "https://www.linkedin.com/in/grigorovveacheslav/",
			body: "I collaborated with Margo on the design and development of her personal portfolio website. I worked as the developer on the project &mdash; Margo designed everything in Figma, and I built it in code. It was one of the more&hellip;",
			link: "https://drive.google.com/file/d/1UCYSE1V0XN3zn31mvf9CNirxwr6ZcqfK/view?usp=drive_link",
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
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu nav-menu-2" aria-label="Toggle menu">
      <svg class="nav-toggle__icon nav-toggle__icon--open" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
      <svg class="nav-toggle__icon nav-toggle__icon--close" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
    <div class="nav-group" id="nav-menu">
      <a class="nav-link" href="${BASE}index.html#projects"${attr("projects")}>projects</a>
      <a class="nav-link" href="${BASE}about.html"${attr("about")}>about</a>
    </div>
    <a class="nav-logo" href="${BASE}index.html" aria-label="Margo home">
      <img src="${BASE}assets/common/logo.svg" alt="Margo logo" />
    </a>
    <div class="nav-group" id="nav-menu-2">
      <a class="nav-link" href="https://drive.google.com/drive/u/2/my-drive" target="_blank" rel="noopener">cv</a>
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
			// Inline arrow so fill:currentColor + CSS rotate work everywhere (no mask needed)
			const ARROW = `<svg class="testimonial-card__cta-arrow" viewBox="0 0 42 42" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M24.9191 11.3826C24.3967 10.8725 23.5495 10.8724 23.0271 11.3826C22.5151 11.8826 22.5053 12.6867 22.9966 13.1989L24.7537 15.1374C25.9495 16.4567 26.9812 17.455 27.8288 18.0614L30.0129 19.6237C30.6349 20.0686 31.1752 20.59 31.6368 21.1906L33.1513 23.1606C32.5721 23.1777 31.8872 23.2319 31.1054 23.3189L28.4297 23.6169C27.614 23.7077 26.7991 23.7296 25.9845 23.6825L23.3088 23.528C22.454 23.4787 21.5986 23.3946 20.7429 23.2756L18.0672 22.9033C17.0448 22.7611 16.0204 22.7671 14.9987 22.9212L12.323 23.3246C11.5776 23.437 10.359 23.4593 8.60223 23.3548L5.89344 23.1936H5.83785C5.099 23.1936 4.5 23.7786 4.5 24.5001C4.5 25.2071 5.07514 25.7825 5.79342 25.8054L8.43965 25.9629C10.2405 26.07 11.6927 26.0634 12.7312 25.9069L15.4069 25.5036C16.1689 25.3887 16.9284 25.3842 17.6897 25.4901L20.3654 25.8624C21.2934 25.9915 22.222 26.0828 23.1509 26.1364L25.8266 26.2909C26.7957 26.3469 27.7648 26.3207 28.7328 26.213L31.4085 25.915C32.1909 25.8278 32.8199 25.7817 33.3054 25.7705L31.4644 27.1201C30.6384 27.7255 29.9184 28.4371 29.3075 29.2516L27.7076 31.3845C27.262 31.9786 26.4165 32.8357 25.0987 33.9749L23.0664 35.7315L23.0271 35.77C22.5047 36.2802 22.5047 37.1073 23.0271 37.6175C23.539 38.1174 24.3624 38.1272 24.8869 37.6474L26.8721 35.9314C28.223 34.7636 29.2453 33.7562 29.8662 32.9284L31.4663 30.7956C31.9219 30.1882 32.4556 29.6606 33.0706 29.2097L35.2323 27.6253C35.6029 27.3537 35.9124 27.1157 36.1512 26.9158C36.3439 26.7544 36.6248 26.5106 36.8005 26.242L36.9635 25.9925L36.9656 25.9897L36.9673 25.9867L37.2396 25.5651C37.4753 25.2534 37.5509 24.8626 37.4667 24.5001C37.565 24.077 37.4458 23.6154 37.1084 23.2859L36.9923 23.1726L36.866 23.0947L36.3715 22.7902L36.1744 22.6671C36.142 22.6354 36.0905 22.5814 36.0172 22.498C35.8664 22.3263 35.6618 22.0744 35.3992 21.7328L33.7767 19.6218C33.1567 18.8153 32.4281 18.1123 31.5941 17.5157L29.41 15.9534C28.8016 15.5182 27.9238 14.6925 26.7572 13.4055L24.9585 11.4211L24.9191 11.3826Z"/></svg>`;
			const cards = TESTIMONIALS.map((t) => {
				const hasLong = typeof t.bodyLong === "string" && t.bodyLong.length > 0;
				const longBody = hasLong
					? `\n      <p class="testimonial-card__body testimonial-card__body--long" hidden>${t.bodyLong}</p>`
					: "";
				const cta = hasLong
					? `<button class="testimonial-card__cta" type="button" aria-expanded="false">
        <span class="testimonial-card__cta-label" data-more="read more" data-less="read less">read more</span>
        ${ARROW}
      </button>`
					: `<a class="testimonial-card__cta" href="${t.link || "#"}" target="_blank" rel="noopener">
        <span class="testimonial-card__cta-label">read more</span>
        ${ARROW}
      </a>`;
				return `
    <li class="testimonial-card">
      <div class="testimonial-card__head">
        <div class="testimonial-card__avatar">
          <img class="testimonial-card__photo" src="${BASE}${t.photo}" alt="${t.name}" />
        </div>
        <div class="testimonial-card__meta">
          <p class="testimonial-card__name">${t.name}</p>
          <p class="testimonial-card__role">${t.role}</p>
        </div>
        <a class="testimonial-card__li" href="${t.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="${BASE}assets/icons/linkedin-testimonial.svg" alt="" /></a>
      </div>
      <p class="testimonial-card__body testimonial-card__body--short">${t.body}</p>${longBody}
      ${cta}
    </li>`;
			}).join("");
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
  <div class="testimonials__live sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
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
      <p class="site-footer__contact"><a class="btn btn--text-me" href="mailto:mrg3.designs@gmail.com">text me</a></p>
    </div>
    <nav class="site-footer__meta" aria-label="Footer">
      <a class="site-footer__brand" href="https://www.mrg22.com/">mrg22.com</a>
      <a href="${BASE}index.html#projects">Projects</a>
      <a href="${BASE}about.html">About</a>
      <a href="https://drive.google.com/drive/u/2/my-drive" target="_blank" rel="noopener">CV</a>
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
