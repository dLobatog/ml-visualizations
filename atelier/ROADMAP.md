# ML Visualizations Atelier Roadmap

This roadmap tracks the teaching, design, and coverage goals for the atelier.
The canonical chapter expansion plan now lives in `CURRICULUM_PLAN.md`.

## Non-negotiables

- One concept per section.
- One visible explanation before the interaction.
- One visible takeaway after the interaction.
- Reference material stays available, but does not dominate the first read.
- Visual language should inherit the same typography, pacing, and restraint as `daniellobato.me`.

## Planned chapter order

1. Foundations: Bayes, entropy, optimization intuition
2. Linear algebra for ML
3. Classical ML and stats
4. Neural network basics
5. Deep learning: optimization, initialization, normalization, residuals
6. Transformers and RAG
7. Metrics and calibration
8. Retrieval and recommendation
9. Production ML systems
10. GBDTs, data, and applied tabular ML
11. Generative models and alignment

## Rebuilt chapter surface now live

- Foundations
- Linear algebra for ML
- Neural network basics
- Deep learning
- Adaptation, compression, and serving
- Retrieval and systems
- Generation and decision-making
- Transformers and RAG
- Metrics and calibration
- Recommendation depth
- Classical ML and statistics
- Production ML systems
- GBDTs and tabular ML
- Data and features
- Reinforcement learning
- Alignment depth

## Remaining emphasis areas

- Production systems depth:
  - freshness vs latency tradeoffs
  - feature stores and shared feature definitions
  - memory/throughput tradeoffs at scale
- GBDT/data depth:
  - framework differences (XGBoost / LightGBM / CatBoost)
  - imbalance and scarce labels
  - better split strategy / temporal evaluation guidance
- Teaching layer:
  - citations and further reading
  - cross-links and glossary
  - recommended study paths
  - curated public video links, attached only where they genuinely help
- Atelier-native from-scratch path:
  - backprop / autograd
  - transformer build-up
  - alignment / distillation

## Design rules

- Prefer prose over stacked pedagogy boxes.
- Use mono text for labels and scaffolding, serif for meaning.
- Keep each visible section within roughly one desktop screen when possible.
- Use controls only when they reveal a causal change.
- Explanations should answer:
  - what the concept is
  - why it matters
  - what to notice when the control changes

## Build plan

1. Build strong templates in this new project.
2. Re-author the most important chapters into the new system.
3. Keep only chapters that meet the clarity and quality bar.
