# Aanchal — image prompts for ChatGPT

How to use:
1. Open one ChatGPT chat for all images so the look stays consistent.
2. Paste the **Style guide** block first, then send one prompt at a time.
3. When an image looks right, say "Use this image as the reference for lighting, background and camera for every following image."
4. Choose the size listed with each prompt (ChatGPT offers square, portrait 2:3 and landscape 3:2).
5. Save files with the names given, then share the folder. Claude will crop them and wire them into the site.

---

## Style guide (paste first)

```
You are creating product and campaign images for "Aanchal", a luxury handwoven Indian saree brand. Every image in this chat must share one consistent look:

- Photorealistic, high-end editorial product photography, like a luxury fashion house campaign. Looks like a real photograph or a hyper-realistic 3D render (Octane / Redshift quality), never illustration or cartoon.
- Mood: dark, warm and intimate. Deep wine-maroon to near-black background (#160910 to #0d0608), soft warm key light from the upper left, gentle golden rim light, subtle film grain.
- Gold zari (metallic gold thread) must read as real metal: fine glints and highlights, not flat yellow.
- Silk should show its natural sheen and soft folds. Fabric texture and weave detail must be crisp.
- No text, no logos, no watermarks, no price tags, no props unless asked. No extra hands or distorted fingers.
- Indian textile details must be authentic to the named weave (Banarasi, Kanjeevaram, Paithani, Chanderi, Jamdani, Ikat, etc.).
Reply "Ready" and wait for my first prompt.
```

---

## 1. Hero — weaver at the handloom (landscape 3:2) — done: `public/images/hero/weaver.png`

```
A master weaver in his sixties, seated on a low wooden bench at a traditional Indian pit handloom in a dim workshop in Varanasi, weaving a Banarasi silk saree. He wears a simple off-white kurta, his face calm and focused, shown in three-quarter profile. His hands are on the beater, mid-motion. The warp threads are deep wine-red silk; the woven saree in front of him shows gold zari butas glinting. A single warm brass lamp hangs above, casting a soft cone of light with floating dust in the beam. Dark wooden loom frame, heddles and shuttle visible. The weaver and loom sit in the RIGHT half of the frame; the LEFT 45% is dark, empty wine-black space for website text. Cinematic, photorealistic, shallow depth of field, 35mm lens.
```

Alternative without a face (safer for consistency): replace the first two sentences with
"Close-up of a weaver's hands throwing a wooden shuttle with a spool of gold thread through silk warp threads on a traditional Indian handloom."

---

## 2. Product images — two per saree (portrait 2:3)

Template (fill the brackets from the table below):

**Drape shot** → `public/images/products/[slug]-[colour]-drape.png` (e.g. `noor-kadhwa-banarasi-royal-wine-drape.png`)
```
A [NAME] saree, [WEAVE] in [FABRIC]. Colour: [BODY COLOUR] body with a [BORDER COLOUR] border. [DETAILS]. The saree is elegantly draped on a headless matte-black dress form in the traditional Nivi style, the pallu falling over the left shoulder and showing its rich pattern, pleats neat at the front. Full length, centred, on the Aanchal dark wine background with soft warm studio lighting and a subtle floor shadow. Portrait format.
```

**Pallu close-up** → `public/images/products/[slug]-[colour]-pallu.png`
```
Macro close-up of the pallu (decorative end) of the same [NAME] saree: [BODY COLOUR] silk with [BORDER COLOUR] and gold zari, [DETAILS]. The fabric is gently folded in soft waves so light catches the zari, filling the frame. Shallow depth of field, crisp weave texture, Aanchal dark lighting. Portrait format.
```

Tip: For a model look instead of a dress form, replace "on a headless matte-black dress form" with "worn by an elegant Indian woman in her late twenties, face turned slightly away, minimal gold jewellery". Expect more variation between images.

| Slug | Name | Weave & fabric | Body / border colour | Details to include |
|---|---|---|---|---|
| noor-kadhwa-banarasi | Noor Kadhwa Banarasi | Kadhwa, katan silk | royal wine-maroon (#6b1530) / antique gold (#c09a4c) | hand-knotted gold zari butas all over, heavy floral pallu |
| mehtab-jaal-banarasi | Mehtab Jaal Banarasi | Jangla, silk | vermilion red (#b8222e) / deep emerald (#0f4a3c) | all-over gold zari jaal of climbing vines, bridal weight |
| chandni-tissue-banarasi | Chandni Tissue Banarasi | Tissue silk | ivory gold (#efe4cf) / gold | shimmering tissue with fine silver and gold stripes |
| raat-rani-banarasi | Raat Rani Banarasi | Cutwork, khaddi georgette | kohl black (#121012) / gold | scattered small gold cutwork butas, fluid drape |
| meenakshi-temple-kanjeevaram | Meenakshi Temple Kanjeevaram | Korvai, mulberry silk | emerald green (#0f4a3c) / gold | wide temple (gopuram) border, rich gold zari pallu |
| kamakshi-checks-kanjeevaram | Kamakshi Checks Kanjeevaram | Kattam, silk | mustard yellow (#c99a22) / deep maroon (#5a1830) | classic kattam checks, contrast maroon border |
| vaira-oosi-kanjeevaram | Vaira Oosi Kanjeevaram | Vaira oosi, silk | peacock blue (#0e5468) / rani pink (#c2186b) | tiny needle-point diamond motifs, slim gold border |
| soft-silk-thazhampoo | Thazhampoo Soft Silk | Soft silk | lilac (#9a86b8) / gold | light, minimal zari, fine stripes |
| sikka-buti-chanderi | Sikka Buti Chanderi | Buti, sheer silk-cotton | blush pink (#e9c9c0) / gold | tiny gold coin butis, translucent, airy |
| nalferma-chanderi | Nalferma Chanderi | Nalferma, cotton | mustard (#c99a22) / maroon | traditional nalferma stripes, gold edge |
| gulnaar-chanderi | Gulnaar Chanderi | Meenakari, silk | rani pink (#b3175f) / gold | meenakari paisleys in pink and gold on sheer silk |
| safed-chanderi | Safed Chanderi | Plain, cotton | ivory (#efe4cf) / thin gold edge | minimal, crisp, elegant |
| mor-pankh-paithani | Mor Pankh Paithani | Tapestry, shot silk | peacock blue-green (#0e5468) / rani pink (#c2186b) | tapestry-woven peacock pallu, lotus vines |
| asavali-paithani | Asavali Paithani | Asavali, silk | glowing marigold (#d4851c) / wine (#7d2140) | flowering asavali vines climbing the border |
| semi-paithani-kamal | Kamal Semi Paithani | Semi Paithani, silk | lilac (#9a86b8) / gold | lotus butis, classic Paithani border |
| kadiyal-paithani | Kadiyal Paithani | Kadiyal, silk | vermilion (#b8222e) / emerald (#0f4a3c) | interlocked contrast border and pallu |
| shabnam-organza | Shabnam Organza | Hand-embroidered organza | champagne (#d8c3a0) / antique gold | dewdrop sequins, embroidered floral vines, sheer |
| gulabi-organza | Gulabi Organza | Printed organza | blush pink (#e9c9c0) / gold | watercolour florals, scalloped zari edge |
| sitara-organza | Sitara Organza | Sequin organza | kohl black (#121012) / gold | hand-placed sequin stars, sheer |
| tussar-organza-kantha | Kantha Tussar Organza | Kantha, raw tussar | mustard (#c99a22) / maroon | kantha running-stitch stripes, sheer organza pallu |
| dhakai-jamdani | Dhakai Jamdani | Jamdani, fine cotton | ivory (#efe4cf) / gold | hand-woven jamdani floral motifs, soft and matte |
| neel-khadi-stripes | Neel Khadi Stripes | Khadi, hand-spun cotton | indigo (#24305e) / marigold orange (#e39a2d) | indigo stripes, slubby hand-spun texture |
| maheshwari-linen | Maheshwari Linen | Maheshwari, linen-cotton | mint green (#a8cdb8) / gold | reversible Maheshwari border, light summer fabric |
| ikat-pochampally | Pochampally Ikat | Ikat, cotton | vermilion (#b8222e) / emerald (#0f4a3c) | geometric ikat diamonds with soft blurred edges |

---

## 3. Collection images (portrait 2:3, `collection-[slug].jpg`)

```
An editorial still life for the [COLLECTION] collection: three [COLLECTION] sarees in [COLOURS] folded and stacked on a dark carved wooden surface, the top one partly unfolded so its [SIGNATURE DETAIL] is visible, gold zari catching warm light. Aanchal dark wine background, portrait format.
```

| Slug | Collection | Colours | Signature detail |
|---|---|---|---|
| banarasi | Banarasi | wine, vermilion, ivory gold | gold kadhwa butas and floral pallu |
| kanjeevaram | Kanjeevaram | emerald, mustard, peacock | temple border with korvai contrast |
| chanderi | Chanderi | blush, mint, ivory | sheer fabric with gold coin butis |
| paithani | Paithani | peacock, marigold, rani pink | peacock tapestry pallu |
| organza | Organza | champagne, blush, black | sheer organza with sequins and embroidery |
| handloom-cotton | Handloom Cotton | indigo, ivory, vermilion | jamdani motifs and ikat pattern |

---

## 4. Section images (landscape 3:2)

**Craft story — `craft-zari.jpg`**
```
Extreme macro of gold zari thread being woven into wine-red silk on a handloom: individual metallic gold threads, warp threads in sharp focus, a wooden reed edge visible, warm lamp light, shallow depth of field.
```

**Video consultation banner — `consultation.jpg`**
```
A softly lit saree boutique at night: a stylist's hands unfolding a peacock-blue Paithani saree on a dark wooden counter, a smartphone on a small stand facing it as if on a video call, warm brass lamps, wine-dark walls. Subject on the right, empty dark space on the left for text.
```

**"Draped by you" gallery — `ugc-1.jpg` … `ugc-6.jpg` (square)**
```
Candid lifestyle photo of an Indian woman wearing a [SAREE NAME] saree in [COLOUR] at a [festive dinner / wedding mehendi / temple courtyard / rooftop at golden hour], natural pose, phone-camera feel but well lit, warm tones. Square format.
```
