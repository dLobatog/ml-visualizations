# Content Redesign Roadmap

Created: 2026-04-08

## Goal

Make the site easier to study with by turning the visible layer into:

1. `What it is`
2. `Try`
3. optional deeper reference material

The principle is simple: the first thing a reader sees should explain the concept, not explain how to operate the widget.

## What Is Already Done

1. Desktop layout is wider and less cramped.
2. Heavy reference material in insight boxes is collapsible instead of always open.
3. `Framework Example` toggles work as real disclosures.
4. The shared subtitle layer in [theme.js](/Users/dlobatog/Desktop/ml-visualizations/theme.js) now restructures visible section intros into a clearer study format across the site.
5. The shared subtitle styling in [theme.css](/Users/dlobatog/Desktop/ml-visualizations/theme.css) gives those intros stronger hierarchy and optional collapsed study prompts.

## Current Rewrite Strategy

For every section:

1. Keep one plain-English concept sentence visible.
2. Keep one short study prompt visible or collapsible.
3. Push comparison grids, interview notes, examples, and implementation detail lower.
4. Prefer contrast over completeness.
5. Prefer bold labels and short chunks over long undifferentiated paragraphs.

## Site-Wide Work Remaining

### Phase 1: Validate The Shared Pass

1. Render representative pages from the main track and from-scratch track.
2. Confirm the new subtitle structure looks intentional on desktop and mobile.
3. Fix any pages where the shared rewrite produces awkward copy or disclosure behavior.

### Phase 2: Bespoke Concept Rewrites

Pages that still need hand-written, section-by-section copy improvement even after the shared pass:

1. [05-ml-system-design.html](/Users/dlobatog/Desktop/ml-visualizations/05-ml-system-design.html)
2. [07-metrics-evaluation.html](/Users/dlobatog/Desktop/ml-visualizations/07-metrics-evaluation.html)
3. [12-gradient-boosted-trees.html](/Users/dlobatog/Desktop/ml-visualizations/12-gradient-boosted-trees.html)
4. [from-scratch/01-backprop-autograd.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/01-backprop-autograd.html)
5. [from-scratch/04-attention-sequences.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/04-attention-sequences.html)
6. [from-scratch/10-rlhf-alignment.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/10-rlhf-alignment.html)

These are the main pages where the visible layer still risks reading like lecture notes or widget instructions.

### Phase 3: Visible-Layer Pruning

For all chapter pages:

1. Shorten the visible subtitle if it still exceeds the ideal first-read length.
2. Remove repeated phrasing that says the same thing in the subtitle and insight box.
3. Keep only one key takeaway visible above the fold for each section.
4. Move secondary “watch this / click this / compare this” copy into collapsible study prompts when needed.

### Phase 4: Better Explanations, Not More Explanations

For the most important sections:

1. Add a real plain-English definition if the concept is still assumed rather than explained.
2. Add one practical contrast:
   - retrieval vs ranking
   - entropy vs cross-entropy
   - pointwise vs pairwise vs listwise
   - BatchNorm vs LayerNorm
   - bi-encoder vs cross-encoder
3. Add one failure mode or interview trap.

### Phase 5: Canvas / Annotation Cleanup

1. Reduce sentence-length text drawn directly inside canvases.
2. Keep the canvas focused on the phenomenon, not on lecture prose.
3. Move explanation into nearby structured text when possible.

## Page Inventory

Main-track pages with section subtitles:

1. [01-ml-fundamentals.html](/Users/dlobatog/Desktop/ml-visualizations/01-ml-fundamentals.html) — 18 sections
2. [02-deep-learning-foundations.html](/Users/dlobatog/Desktop/ml-visualizations/02-deep-learning-foundations.html) — 11 sections
3. [03-llms-transformers.html](/Users/dlobatog/Desktop/ml-visualizations/03-llms-transformers.html) — 12 sections
4. [04-recommendation-systems.html](/Users/dlobatog/Desktop/ml-visualizations/04-recommendation-systems.html) — 15 sections
5. [05-ml-system-design.html](/Users/dlobatog/Desktop/ml-visualizations/05-ml-system-design.html) — 5 sections
6. [07-metrics-evaluation.html](/Users/dlobatog/Desktop/ml-visualizations/07-metrics-evaluation.html) — 5 sections
7. [12-gradient-boosted-trees.html](/Users/dlobatog/Desktop/ml-visualizations/12-gradient-boosted-trees.html) — 10 sections

From-scratch pages with section subtitles:

1. [from-scratch/01-backprop-autograd.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/01-backprop-autograd.html) — 8 sections
2. [from-scratch/02-makemore.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/02-makemore.html) — 8 sections
3. [from-scratch/03-mlps-optimization.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/03-mlps-optimization.html) — 7 sections
4. [from-scratch/04-attention-sequences.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/04-attention-sequences.html) — 9 sections
5. [from-scratch/05-gnns.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/05-gnns.html) — 8 sections
6. [from-scratch/05-rnns-sequences.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/05-rnns-sequences.html) — 6 sections
7. [from-scratch/06-transformer.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/06-transformer.html) — 8 sections
8. [from-scratch/07-distillation-compression.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/07-distillation-compression.html) — 9 sections
9. [from-scratch/08-gbdt-from-scratch.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/08-gbdt-from-scratch.html) — 8 sections
10. [from-scratch/09-cnns-from-scratch.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/09-cnns-from-scratch.html) — 8 sections
11. [from-scratch/10-rlhf-alignment.html](/Users/dlobatog/Desktop/ml-visualizations/from-scratch/10-rlhf-alignment.html) — 8 sections

Total subtitled sections currently covered by the shared pass: `163`

## Definition Of Done

The pass is done when:

1. Every subtitled section opens with a concept-first explanation.
2. No subtitle feels like a wall of widget instructions.
3. The desktop view feels airy and editorial rather than mobile-stacked.
4. The visible layer can be skimmed quickly before diving deeper.
5. The remaining detail is still available, but not forced on the reader immediately.
