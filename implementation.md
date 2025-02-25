# Far Filament - Documentation d'Implémentation

## Table des Matières

1. [SEO](#seo)
2. [Accessibilité](#accessibilité)
3. [Améliorations Futures](#améliorations-futures)

## SEO

### 1. Structure des Pages

#### Blog (`src/pages/blog/[tag]/[page].astro`)

```typescript
// Pagination et routage dynamique
export async function getStaticPaths({ paginate }) {
	const allPosts = await getCollection("blog");
	// Tri par date
	const sortedPosts = allPosts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);
	// 9 articles par page
	return paginate(sortedPosts, {
		pageSize: 9,
		props: { category: "all", allCategories },
	});
}
```

#### Services (`src/layouts/Services.astro`)

- Structure hiérarchique avec sections distinctes
- Descriptions détaillées et structurées des services
- Modales de service avec informations complètes
- CTAs stratégiquement placés

### 2. Optimisation des Médias

```typescript
// Utilisation du composant Image d'Astro
import { Image } from "astro:assets";
<Image
    src={logo}
    alt="logo"
    class="logo-img"
/>
```

### 3. Structure Sémantique

#### Navigation

```typescript
<header>
    <nav id="main-nav">
        <a href="#about">À propos</a>
        <a href="#services">Services</a>
        // ...
    </nav>
</header>
```

#### FAQ

```typescript
<details>
    <summary>Comment fonctionne la PNL ?</summary>
    <div class="faq-answer">
        // Contenu structuré
    </div>
</details>
```

## Accessibilité

### 1. Navigation Mobile

#### Menu Hamburger (`src/layouts/Header.astro`)

```typescript
<button
    class="mobile-menu-toggle"
    aria-label="Menu"
    aria-expanded="false"
    aria-controls="main-nav"
>
    <span class="hamburger"></span>
</button>

// Gestion des états
mobileMenuToggle?.addEventListener("click", () => {
    const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
    mobileMenuToggle.setAttribute("aria-expanded", !isExpanded ? "true" : "false");
    nav?.classList.toggle("active");
});
```

### 2. Modales de Service

```typescript
<div
    class="modal"
    id={modalId}
    aria-hidden="true"
>
    <div
        class="modal-container"
        role="dialog"
        aria-labelledby={`${modalId}-title`}
    >
        <h2 id={`${modalId}-title`}>{title}</h2>
        // ...
    </div>
</div>
```

### 3. Design Responsive

#### CSS Adaptatif

```scss
// En-tête
header {
	padding: clamp(10px, 2vw, 15px) clamp(15px, 3vw, 30px);
	height: clamp(60px, 10vh, 80px);
}

// Texte
nav a {
	font-size: clamp(0.9rem, 2vw, 1rem);
}

// FAQ
.faq-answer {
	padding: clamp(15px, 3vw, 20px) clamp(20px, 4vw, 25px);
	font-size: clamp(0.9em, 2.5vw, 1em);
}
```

### 4. Gestion des Interactions

#### Fermeture Multiple des Modales

```typescript
// Fermeture via Escape
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && modal.classList.contains("active")) {
		modal.classList.remove("active");
	}
});

// Fermeture au clic extérieur
document.addEventListener("click", (e) => {
	if (!target.closest("header") && nav?.classList.contains("active")) {
		nav.classList.remove("active");
	}
});
```

#### États Visuels

```scss
.cta-btn {
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: $shadow-md;
		background-color: darken($secondary-color, 5%);
	}
}

nav a {
	&:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	&:not(.cta-btn):hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
}
```

## Améliorations Futures

### SEO

1. Implémentation des meta tags
   ```html
   <meta name="description" content="..." />
   <meta property="og:title" content="..." />
   <meta property="og:description" content="..." />
   ```
2. Génération de sitemap XML
3. Schema.org markup pour services et FAQ
4. Optimisation des meta descriptions par page

### Accessibilité

1. Skip links pour navigation clavier
   ```html
   <a href="#main-content" class="skip-link"> Aller au contenu principal </a>
   ```
2. Focus trap dans les modales
3. Messages d'erreur ARIA
4. Tests de contraste des couleurs
5. Support de navigation par clavier amélioré
