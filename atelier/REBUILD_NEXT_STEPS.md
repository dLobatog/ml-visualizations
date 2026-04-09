# Atelier Next Steps

This file tracks the current quality bar for the atelier:
clear, elegant, rigorous, and genuinely useful for interview prep, review, and teaching.

## Priority 1: Study Primitives

- Add proper math rendering.
  - Use real typeset formulas rather than styled plain text.
  - Prefer a local/offline-friendly setup long term.
- Improve opened drawer states.
  - Formula, code, geometric view, and quick check should feel calm and editorial when expanded.
- Upgrade code presentation.
  - Better syntax coloring, spacing, and code-surface design.
- Upgrade quiz presentation.
  - Keep it lightweight, but make feedback feel intentional and easy to scan.
- Add geometric / intuitive diagrams where they are the best teaching move.
  - Bayes is the first example.

## Priority 2: Core Coverage

- Rebuild classical ML + statistics.
  - Bias vs variance
  - Regularization
  - MLE vs MAP
  - Calibration
  - Metrics
- Rebuild transformer / LLM concepts.
  - Tokenization
  - Positional encoding
  - Self-attention
  - KV cache
  - RAG / vector retrieval
- Rebuild deeper recommendation / search material.
  - Collaborative filtering
  - Two-tower retrieval
  - Ranking objectives
  - Cold start
  - Bandits
- Rebuild systems and scale.
  - Feature stores
  - Training-serving skew
  - Freshness vs latency
  - Online vs offline evaluation
- Rebuild modern generative / alignment depth.
  - Diffusion
  - Decoding controls
  - Preference optimization / RLHF
  - Reward hacking / safety

## Priority 3: Curriculum Layer

- Add recommended study paths.
  - Interview core
  - LLM systems
  - Recommender systems
  - Foundations from scratch
- Add prerequisites and progression cues.
- Make clear what to read first versus what is reference depth.

## Priority 4: Reference / Academic Layer

- Add citations and further reading.
- Add glossary / cross-links between recurring ideas.
- Add compact “common confusion” notes where especially useful.

## Priority 5: Quality Bar

- Every section should have:
  - one visible intuition
  - one interactive causal moment
  - one takeaway
  - optional deeper layers for math / code / checks
- No section should feel like a notebook dump.
- Every new chapter should be visually reviewed on desktop and mobile.
- Only keep a chapter in the featured surface when it clearly meets the readability and polish bar.

## Completed In This Pass

1. Math rendering is now local to the atelier.
   - KaTeX assets are vendored into `atelier/vendor/katex`.
   - Chapter pages no longer depend on the KaTeX CDN.
2. Opened drawer states are materially more polished.
   - Formula, code, geometry, and quiz drawers now have calmer expanded surfaces and clearer affordances.
3. The deep-learning chapter is no longer thin.
   - Added initialization, normalization, residual connections, and Flash Attention.
4. The curriculum layer is now real.
   - The homepage includes explicit study paths.
   - The homepage links to the current `from-scratch` track as a companion path.
5. The reference layer is now integrated into the chapter experience.
   - Stable chapters have `Further reading` resources.
   - Formula drawers explain symbols with a `What each part means` legend.
6. Public reference links are attached inside the atelier where they genuinely help.
   - Foundations, deep learning, transformers, recommendation, metrics, and production chapters now surface curated public material.
7. The whole atelier has been re-validated.
   - Runtime pass across every atelier page: no page errors.
   - Fresh rendered screenshot checks after the final pass.

## Next Frontier

1. Add glossary / cross-links between recurring ideas.
2. Build atelier-native from-scratch chapters instead of linking out to the current companion track.
3. Deepen the chapters that are still lighter than the strongest ones.
   - systems / retrieval
   - generative / RL
   - GBDTs / tabular
4. Add a more deliberate academic layer.
   - citations where paper provenance matters
   - short further-reading notes
   - compact “common confusion” callouts where useful
5. Keep tightening the visual language of the canvases themselves, not just the shell around them.
