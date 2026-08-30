# Motorbike template — storefront content audit

Inventory of every visible text and image on the **motorbike-template** home page (plus shared Header/Footer) and the **Contact** page. This pass is for editor coverage planning. No template or schema code was changed.

**Sources (preview storefront):**

- Home: `apps/web/src/app/store/motorbike-template/page.tsx`
- Header / Footer: `apps/web/src/app/store/motorbike-template/layout.tsx`
- Accessory cards: `apps/web/src/components/store/motorbike-template/product-card.tsx` + `demo-catalog.ts` (`RIDE_DEMO_ACCESSORIES`)
- Contact: `apps/web/src/components/store/motorbike-template/contact-page.tsx` + `contact-form.tsx`

**Out of scope (separate pass):** search, product detail, cart, blog post pages.

**How to read `Editor`:**

| Flag | Meaning |
| --- | --- |
| **yes** | Seller would realistically customize this per business. Include in the content editor. |
| **maybe** | Optional: useful for tone/language, but many sellers will leave the demo copy. Prefer later, not v1. |
| **no** | UI chrome, a11y strings, or derived labels. Keep in code, not the editor. |
| **catalog** | Comes from product listings / seller profile, not from `storeContent`. Do not duplicate in the content schema. |

**Types:** `short text` · `long text` · `image` · `url` · `repeatable list` (item shape listed under the array).

Prices below are what `formatCedis` renders (`GHS` + `en-GH` grouping), e.g. `18900` → `GHS 18,900`.

Brand name in Header/Footer is currently `DEFAULT_STORE_NAME` (`"Store"`). Contact already prefers `seller.businessName`. Treat store name as **seller profile**, not a new content field, unless Header/Footer stay on the demo constant.

---

## Recommended editor groups (future tabs)

These groupings match page sections top-to-bottom and are the suggested editor tabs:

1. Header
2. Hero
3. Trust Strip
4. Shop Categories
5. Promo Banner (Apex R9)
6. Features Strip
7. Accessories (section chrome only; products from catalog)
8. Value Props (three columns under accessories)
9. Dark Feature Banner (E-Bike)
10. Blog (wired in markup; currently empty so the section does not render)
11. Footer
12. Contact

---

## Header

Shared chrome on every page. Mobile menu reuses the same `navLinks` labels.

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `storeName` | `Store` (`DEFAULT_STORE_NAME`) | short text | **catalog** — seller `businessName`. Header/footer should consume that; do not add a parallel content field. |
| `logoMark` | Inline SVG bike silhouette (`BikeMark`) | image (or keep as template mark) | **maybe** — sellers will want a real logo. Prefer one `logoUrl` (already in template-a schema) over editing the SVG. If no logo, keep the bike mark as fallback chrome. |
| `navLinks` | See array below | **repeatable list** | **maybe** — destinations are structural (`/search`, `/contact`). Labels might be localized; v1 can keep hardcoded. |

**`navLinks[]` item shape**

| Item key | Demo items | Type | Editor |
| --- | --- | --- | --- |
| `label` | `Shop` · `Contact Us` | short text | **maybe** |
| `href` | `/search` · `/contact` (prefixed with `/store/motorbike-template`) | url | **no** — routes, not copy |

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `searchAriaLabel` | `Search` | short text | **no** |
| `cartAriaLabel` | `Cart` / `Cart, N item(s)` | short text | **no** |
| `mobileNavOpenAriaLabel` | `Open menu` | short text | **no** |
| `mobileNavCloseAriaLabel` | `Close menu` | short text | **no** |

Icons (search, bag, hamburger) are Lucide, not images — **no**.

---

## Hero

Full-bleed dark section at the top of home. Same `hero.png` is used as a right-side background on desktop and a stacked image on mobile (one field, two placements).

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `heroHeadline` | `Ride Better.` / `Ride Together.` (two lines, hard line break) | short text | **yes** |
| `heroSubtext` | `Motorbikes, bicycles, mopeds, and scooters, chosen for the ride and backed by people who know the machines.` | long text | **yes** |
| `heroImage` | `/store/motorbike-template/hero.png` (alt currently empty) | image | **yes** |
| `heroCtaPrimaryLabel` | `Shop Now` | short text | **maybe** |
| `heroCtaPrimaryHref` | `{base}/search` | url | **no** |
| `heroCtaSecondaryLabel` | `Contact Us` | short text | **maybe** |
| `heroCtaSecondaryHref` | `{base}/contact` | url | **no** |

Decorative radial gradients behind the hero are styling, not content — **no**.

---

## Trust Strip

Four columns on the dark bar at the bottom of the hero (`trustBadges`). Icons are Lucide (`Tag`, `User`, `Shield`, `Calendar`) — do not expose an icon picker in v1.

**`trustBadges[]` — repeatable list, 4 items**

| Item key | Type | Editor |
| --- | --- | --- |
| `label` | short text | **yes** |
| `icon` | Lucide component | **no** |

| Demo index | `label` |
| --- | --- |
| 0 | `Affordable Prices` |
| 1 | `Knowledgeable Staff` |
| 2 | `Warranty` |
| 3 | `Installment plans` |

---

## Shop Categories

White section. Heading plus a 2×2 grid of category cards.

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `shopHeading` | `Shop` | short text | **yes** |

**`shopCategories[]` — repeatable list, 4 near-identical cards**

Do **not** split into `categoryCardMotorbikesImage` etc. as one-off keys. Item shape:

| Item key | Type | Editor |
| --- | --- | --- |
| `slug` | short text (query param) | **no** for v1 — tied to catalog filters (`motorbikes`, `bicycles`, `mopeds`, `scooters`) |
| `label` | short text | **yes** — if the seller’s mix is not these four vehicle types |
| `image` | image | **yes** |
| `ctaLabel` | derived `View {label}` | **no** — keep derived from `label` so it cannot drift |

| Demo index | `slug` | `label` | `image` | CTA (derived) |
| --- | --- | --- | --- | --- |
| 0 | `motorbikes` | `Motorbikes` | `/store/motorbike-template/motorbike.png` | `View Motorbikes` |
| 1 | `bicycles` | `Bicycles` | `/store/motorbike-template/ebike.png` | `View Bicycles` |
| 2 | `mopeds` | `Mopeds` | `/store/motorbike-template/moped.png` | `View Mopeds` |
| 3 | `scooters` | `Scooters` | `/store/motorbike-template/classic.png` | `View Scooters` |

Category card images currently have empty `alt` — when making them editable, generate alt from `label`.

---

## Promo Banner (featured motorbike)

Dark rounded banner (`#featured`). Copy is hardcoded and also matches demo product `demo-motorbike-1` (Apex R9). Long term this should be “pick a featured listing” from catalog; until then it is marketing content.

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `promoHeadline` | `Apex R9` | short text | **yes** (or **catalog** if bound to a product) |
| `promoKicker` | `Street Motorbike` | short text | **yes** |
| `promoPrice` | `GHS 18,900` (hardcoded `18900`) | short text | **catalog** if product-bound; otherwise **yes** |
| `promoBody` | `Street-ready motorbike with a punchy engine, upright seating, and the range to cover town and the open road.` | long text | **yes** |
| `promoImage` | `/store/motorbike-template/motorbike.png` | image | **yes** / **catalog** |
| `promoImageAlt` | `Apex R9 street motorbike` | short text | **maybe** — can derive from headline |
| `promoCtaPrimaryLabel` | `More Info` | short text | **maybe** |
| `promoCtaPrimaryHref` | product path `demo-motorbike-1` | url | **catalog** |
| `promoCtaSecondaryLabel` | `View Collections` | short text | **maybe** |
| `promoCtaSecondaryHref` | `{base}/search?category=motorbikes` | url | **no** |

---

## Features Strip

Four equal cards (`trustFeatures`) between the promo banner and accessories. Icons: `Award`, `Wrench`, `Users`, `Handshake` — **no** for editor.

**`featureStrip[]` — repeatable list, 4 items**

| Item key | Type | Editor |
| --- | --- | --- |
| `label` | short text | **yes** |
| `body` | long text | **yes** |
| `icon` | Lucide | **no** |

| Demo index | `label` | `body` |
| --- | --- | --- |
| 0 | `Trusted Brands` | `Machines and parts from names riders already know, stocked because they last.` |
| 1 | `Certified Repair Specialists` | `Workshop techs trained on motorbikes, mopeds, scooters, and bicycles.` |
| 2 | `Community Support` | `Fit advice, group rides, and a shop floor that talks riding, not just SKUs.` |
| 3 | `Tailored Service` | `Setup, servicing, and gear recommendations sized to how you actually ride.` |

No section heading on this block.

---

## Accessories

Section heading + grid of six `RideProductCard`s from `listRideAccessories()` (demo: `RIDE_DEMO_ACCESSORIES`) + a section CTA.

### Section chrome

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `accessoriesHeading` | `Gear & Accessories` | short text | **yes** |
| `accessoriesViewAllLabel` | `View All Accessories` | short text | **maybe** |
| `accessoriesViewAllHref` | `{base}/search?category=accessories` | url | **no** |

### Product cards — `accessoryProducts[]` — repeatable list, 6 items

**Do not put these in the storefront content editor.** They are catalog rows. Inventory only so coverage is complete.

Per card (from catalog / card component):

| Item key | Type | Editor |
| --- | --- | --- |
| `name` | short text | **catalog** |
| `image` | image | **catalog** |
| `priceCedis` | price | **catalog** |
| `colors` | swatches (hex), not copy | **catalog** |
| `rating` | number (stars) | **catalog** |
| `addToCartAriaLabel` | `Add {name} to cart` | **no** |
| `buyButtonLabel` | `Buy` | **no** |

| Demo index | `name` | `price` | `image` | `rating` |
| --- | --- | --- | --- | --- |
| 0 | `Motorbike Helmet` | `GHS 450` | `/store/motorbike-template/helmet.png` | 5 |
| 1 | `Motorbike Jacket` | `GHS 890` | `/store/motorbike-template/jacket.png` | 5 |
| 2 | `Motorbike Gloves` | `GHS 95` | `/store/motorbike-template/gloves.png` | 4 |
| 3 | `Go Pro Camera` | `GHS 720` | `/store/motorbike-template/gopro.png` | 5 |
| 4 | `Motorbike Trousers` | `GHS 640` | `/store/motorbike-template/trousers.png` | 4 |
| 5 | `Motorbike Boots` | `GHS 380` | `/store/motorbike-template/boots.png` | 4 |

Empty-image fallback is the `MotorbikePlaceholder` SVG — chrome, **no**.

---

## Value Props

Three centered columns (`valueFeatures`) after accessories. Shared CTA label `Learn More` on every column.

**`valueProps[]` — repeatable list, 3 items**

| Item key | Type | Editor |
| --- | --- | --- |
| `label` | short text | **yes** |
| `body` | long text | **yes** |
| `href` | url / hash | **maybe** — demo mixes `#featured` and `/contact` |
| `icon` | Lucide (`Bike`, `CreditCard`, `Truck`) | **no** |
| `ctaLabel` | `Learn More` (shared, not per-item) | **maybe** as one section field `valuePropsCtaLabel` |

| Demo index | `label` | `body` | `href` |
| --- | --- | --- | --- |
| 0 | `Special Offers` | `Seasonal drops, bundle pricing, and trade-in credit on machines you already ride.` | `#featured` |
| 1 | `Instalment Plans` | `Pay a deposit and spread the rest over 2-3 months. Get in touch to arrange terms.` | `/contact` |
| 2 | `Delivery Across Accra` | `We arrange delivery anywhere in Accra once payment is confirmed.` | `/contact` |

Accra-specific delivery copy is a strong **yes** for per-business editing.

---

## Dark Feature Banner (E-Bike)

Second dark product banner. Copy matches demo product `demo-bicycle-1` (`City E-Bike`). Same catalog-vs-content note as the Apex promo.

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `darkBannerHeadline` | `E-Bike` | short text | **yes** / **catalog** |
| `darkBannerPricePrefix` | `From` | short text | **maybe** |
| `darkBannerPrice` | `GHS 9,450` (hardcoded `9450`) | short text | **catalog** if product-bound |
| `darkBannerBody` | `Quiet power for city hops and weekend loops. A removable battery, disc brakes, and a ride that stays composed in traffic.` | long text | **yes** |
| `darkBannerImage` | `/store/motorbike-template/ebike.png` | image | **yes** / **catalog** |
| `darkBannerImageAlt` | `E-Bike` | short text | **maybe** |
| `darkBannerCtaLabel` | `Buy Now` | short text | **maybe** |
| `darkBannerCtaHref` | product path `demo-bicycle-1` | url | **catalog** |

**Callout overlay** (left of the bike image) is marketing copy, not catalog:

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `darkBannerCalloutTitle` | `Super Powerful Battery` | short text | **yes** |
| `darkBannerCalloutBody` | `The best range ever seen for a bike like this.` | long text | **yes** |

The connecting line/dot is decoration — **no**.

---

## Blog

Markup exists (`Recent Blog Posts` + 3-column card grid) but `blogPosts` is hardcoded to `[]`, so **the section does not render** on the preview home page. Motorbike is the only template with blog (`STOREFRONT_TEMPLATES_WITH_BLOG`). Include this group so the editor can cover it when posts are wired.

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `blogHeading` | `Recent Blog Posts` | short text | **yes** |
| `blogReadMoreLabel` | `Read More` | short text | **no** / **maybe** |

**`blogPosts[]` — repeatable list (designed for 3 cards)**

Not storefront-content fields: posts should come from a blog data model. Item shape on the card:

| Item key | Current | Type | Editor |
| --- | --- | --- | --- |
| `title` | *(none — empty array)* | short text | **catalog** (blog CMS) |
| `excerpt` | *(none)* | long text | **catalog** |
| `imageUrl` | *(none; placeholder SVG if missing)* | image | **catalog** |
| `publishedAt` | formatted `en-GB` e.g. `30 Aug 2026` | short text (derived) | **catalog** |

Placeholder vehicle SVG when `imageUrl` is empty — **no**.

---

## Footer

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `footerStoreName` | same as header (`Store`) | short text | **catalog** — `businessName` |
| `footerLogoMark` | same `BikeMark` SVG | image | same as header `logoUrl` |
| `footerTagline` | `Motorbikes, bicycles, mopeds, and scooters, sold, fitted, and serviced by people who ride.` | long text | **yes** |
| `footerNewsletterHeading` | `Signup for latest information` | short text | **yes** |
| `footerNewsletterEmailPlaceholder` | `Your email` | short text | **maybe** |
| `footerNewsletterEmailAriaLabel` | `Email address` | short text | **no** |
| `footerNewsletterSubmitAriaLabel` | `Subscribe` | short text | **no** |

**`footerShopLinks[]` — repeatable list, 5 items** under heading `Shop`

| Item key | Type | Editor |
| --- | --- | --- |
| `groupHeading` | `Shop` | short text | **maybe** |
| `label` | see demo | short text | **maybe** — should stay aligned with shop categories + accessories |
| `href` | search query URLs | url | **no** |

| Demo index | `label` | `href` |
| --- | --- | --- |
| 0 | `Motorbikes` | `/search?category=motorbikes` |
| 1 | `Bicycles` | `/search?category=bicycles` |
| 2 | `Mopeds` | `/search?category=mopeds` |
| 3 | `Scooters` | `/search?category=scooters` |
| 4 | `Accessories` | `/search?category=accessories` |

**`footerSocialLinks[]` — repeatable list, 4 items** (icons only; all `href="#"`)

| Item key | Type | Editor |
| --- | --- | --- |
| `network` | Facebook / Instagram / Twitter / LinkedIn | **no** as copy |
| `url` | `#` | **yes** — sellers need real profile URLs; hide icon if empty |
| `ariaLabel` | `Facebook` etc. | **no** |

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `footerCopyright` | `© 2026 Store. All rights reserved.` (`2026` hardcoded + store name) | short text | **no** for year (derive); store name from profile. Optional legal extra line later. |
| `footerPrivacyLabel` | `Privacy Policy` | short text | **maybe** |
| `footerPrivacyHref` | `#` | url | **yes** if they have a page; otherwise hide |
| `footerTermsLabel` | `Terms of Service` | short text | **maybe** |
| `footerTermsHref` | `#` | url | **yes** / hide if empty |

Newsletter form is currently `action="#newsletter"` (no backend) — not a content field.

---

## Contact page

Hero band + two-column body (form | WhatsApp card). Phone number is **seller profile** (`seller.phone`), fallback `+233 55 000 0000`. WhatsApp greeting is shared (`CONTACT_WHATSAPP_GREETING`), not template-specific.

### Contact hero

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `contactKicker` | `Get in touch` | short text | **yes** |
| `contactHeadline` | `Contact Us` | short text | **yes** |
| `contactSubtext` | `Send a message, ping us on WhatsApp, or call {brandName} directly.` | long text | **yes** — `{brandName}` should stay interpolated from profile |

### Message column

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `contactFormHeading` | `Send a message` | short text | **yes** |
| `contactFormIntro` | `Tell us what you're looking for and we'll come back to you.` | long text | **yes** |
| `contactFormNameLabel` | `Name` | short text | **no** |
| `contactFormEmailLabel` | `Email` | short text | **no** |
| `contactFormMessageLabel` | `Message` | short text | **no** |
| `contactFormSubmitLabel` | `Send message` | short text | **maybe** |
| `contactFormSubmittingLabel` | `Sending…` | short text | **no** |
| `contactFormSuccessHeading` | `Message sent` | short text | **maybe** |
| `contactFormSuccessBody` | `Thanks. We'll get back to you as soon as we can.` | long text | **maybe** |
| `contactFormSendAnotherLabel` | `Send another` | short text | **no** |
| `contactFormErrors` | `Please enter your name.` / `Please enter a valid email address.` / `Please enter a message.` / `This store isn't accepting messages yet.` / `Could not send your message. Please try again.` | short text | **no** |

### WhatsApp / call card

| Key | Current value | Type | Editor |
| --- | --- | --- | --- |
| `contactWhatsappHeading` | `Call or WhatsApp` | short text | **yes** |
| `contactWhatsappBody` | `Prefer to talk? Reach {brandName} on WhatsApp at the number below.` | long text | **yes** |
| `contactPhone` | seller phone or `+233 55 000 0000` | short text | **catalog** — seller `phone` |
| `contactWhatsappCtaLabel` | `WhatsApp us` | short text | **maybe** |
| `contactWhatsappGreeting` | `Hello, I'd like to get in touch about your store.` | long text | **maybe** — prefilled chat text; one shared default is enough |

WhatsApp icon is Lucide — **no**.

---

## Suggested v1 editor field set (content only)

Include these in `STOREFRONT_CONTENT_SCHEMA` for `motorbike-template` later. Arrays should be first-class, not four duplicate keys.

**Header:** `logoUrl` (shared with footer)

**Hero:** `heroHeadline`, `heroSubtext`, `heroImage`

**Trust Strip:** `trustBadges[]` → `label`

**Shop:** `shopHeading`, `shopCategories[]` → `label`, `image` (keep `slug` in code)

**Promo:** `promoHeadline`, `promoKicker`, `promoBody`, `promoImage` (price/href from featured product when wired)

**Features Strip:** `featureStrip[]` → `label`, `body`

**Accessories:** `accessoriesHeading` only

**Value Props:** `valueProps[]` → `label`, `body`

**Dark banner:** `darkBannerHeadline`, `darkBannerBody`, `darkBannerImage`, `darkBannerCalloutTitle`, `darkBannerCalloutBody`

**Blog:** `blogHeading` only (posts from blog data)

**Footer:** `footerTagline`, `footerNewsletterHeading`, `footerSocialLinks[]` → `url` per network

**Contact:** `contactKicker`, `contactHeadline`, `contactSubtext`, `contactFormHeading`, `contactFormIntro`, `contactWhatsappHeading`, `contactWhatsappBody`

Leave out: CTA chrome (`Shop Now`, `Buy`, `Learn More`, form labels, errors), catalog products, phone, store name, nav routes, Lucide icons.

---

## Notes for the next pass (editor implementation)

1. Current shared schema (`packages/shared/src/storefront-content-schema.ts`) is `Record<string, string>` with types `text | textarea | image`. Repeatable lists (`trustBadges`, `shopCategories`, `featureStrip`, `valueProps`, social URLs) need a schema/editor change — they cannot be honest as four one-off keys.
2. Promo + E-Bike banners duplicate demo product copy. Prefer “featured product IDs” over free-text name/price/image once the editor exists.
3. Header still uses `DEFAULT_STORE_NAME` while Contact uses `businessName` — fix that wiring when content is connected, rather than adding `storeName` to content.
4. Blog home cards are UI-ready but data is empty; do not invent three demo posts in the content schema.
5. Images live under `apps/web/public/store/motorbike-template/` (`hero.png`, `motorbike.png`, `moped.png`, `classic.png`, `ebike.png`, plus accessory PNGs used by catalog).
)
