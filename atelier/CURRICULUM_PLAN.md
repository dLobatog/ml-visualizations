# Atelier Curriculum Plan

This file is the canonical content plan for the atelier.
The goal is not to accumulate topics. The goal is to build a sequence of chapters that feel deliberate, complete, and genuinely best-in-class.

## Quality Bar

- One chapter should teach one coherent slice of ML, not a random pile of adjacent ideas.
- Each section should answer:
  - what this is
  - why it matters
  - what changes when you move the control
  - what the formula means, if there is a formula
- Prefer fewer sections with deeper clarity over broader but thinner coverage.
- Only surface a chapter on the homepage when it feels calm, rigorous, and polished on desktop and mobile.

## Canonical Chapter Order

### 1. Probability, Loss, And Information

Purpose:
Build the language of uncertainty, evidence, surprise, and loss that the rest of ML depends on.

Core sections:
- Bayes
- Entropy
- Cross-entropy
- KL divergence
- Calibration intuition

Current status:
- Mostly covered in `foundations.html`

Notes:
- Keep this chapter tight. It is the best front door to the whole project.

### 2. Linear Algebra For ML

Purpose:
Make vector spaces, projections, eigenvectors, and low-rank structure feel intuitive instead of abstract.

Core sections:
- vectors and dot products
- matrix multiplication as composition
- eigenvalues and eigenvectors
- singular value decomposition
- low-rank approximation

Current status:
- Missing

Why it matters:
- This chapter will make embeddings, PCA intuition, attention, and matrix factorization much easier to understand later.

### 3. Classical Supervised Learning

Purpose:
Explain the simplest predictive models clearly before neural networks arrive.

Core sections:
- linear regression
- logistic regression
- decision boundaries
- bias versus variance
- regularization
- data splits and cross-validation

Current status:
- Partially covered in `classical-ml-stats.html`

Missing depth:
- logistic regression
- data splits
- clearer supervised learning framing

### 4. Neural Network Basics

Purpose:
Give a clean mental model for what a neuron is, what activations do, how outputs are interpreted, and how learning actually happens.

Core sections:
- what is a neuron
- activation functions
- output functions: sigmoid, softmax, linear outputs
- forward pass
- loss at the output layer
- chain rule
- backward pass
- how a neuron learns
- backpropagation

Current status:
- Partially covered across `deep-learning.html`, but the basics are not yet laid out from first principles.

Why this chapter matters:
- Right now the atelier has optimization and stability ideas, but it still needs a more beginner-legible neural net chapter.

### 5. Optimization And Training Stability

Purpose:
Separate “what a neural network is” from “why training works or fails.”

Core sections:
- gradient descent
- learning rate
- learning rate schedules
- optimizers
- weight initialization
- normalization
- residual connections
- gradient flow

Current status:
- Strong base already in `deep-learning.html`

Missing depth:
- gradient descent as its own concept
- optimizer comparison
- learning rate schedules

### 6. Architecture Primitives

Purpose:
Explain the major architecture motifs before the full transformer chapter.

Core sections:
- convolutions
- recurrence
- gating
- attention as a general routing primitive
- message passing as a graph primitive

Current status:
- Mostly missing in atelier

Notes:
- This chapter can unify CNNs, RNNs, gating, and the basic idea behind graph message passing.

### 7. Trees, Ensembles, And Tabular ML

Purpose:
Teach why trees are still dominant in practical ML and how ensemble methods differ.

Core sections:
- decision trees
- tree splits
- histogram-based splitting
- random forests
- GBDT
- feature importance

Current status:
- Partially covered in `gbdt-tabular.html`

Missing depth:
- random forests
- histogram-based splitting
- feature importance
- cleaner framing of how bagging and boosting differ

### 8. Retrieval, Recommendation, And Ranking

Purpose:
Treat retrieval, recommendation, and ranking as one connected family instead of isolated topics.

Core sections:
- nearest neighbors: exact and approximate
- KNN and ANN intuition
- matrix factorization
- two-tower retrieval
- learning to rank
- LambdaRank
- generative retrieval / ranking
- cold start

Current status:
- Split across `systems-retrieval.html` and `recommendation-depth.html`

Missing depth:
- KNN / ANN
- LambdaRank
- generative ranking and retrieval

### 9. Transformers And LLM Internals

Purpose:
Go beyond “attention exists” and explain what each transformer component is for.

Core sections:
- tokenization
- embeddings
- positional encoding
- attention
- transformer block architecture
- what each layer is trying to do
- KV cache
- mixture of experts

Current status:
- Good base in `transformers-rag.html`

Missing depth:
- transformer block architecture as a whole
- per-layer intuitions
- mixture of experts

### 10. Adaptation, Compression, And Efficient Serving

Purpose:
Explain how large models get adapted and deployed in the real world.

Core sections:
- pre-training versus fine-tuning
- parameter-efficient fine-tuning
- LoRA / DoRA
- knowledge distillation
- quantization
- multi-task learning

Current status:
- Mostly missing

Notes:
- This is a high-value interview chapter because it connects modeling choices to deployment constraints.

### 11. Generative Models

Purpose:
Teach the big families of generative modeling and what problem each one solves.

Core sections:
- variational autoencoders
- GANs
- diffusion models
- U-Net
- stable diffusion
- energy-based models

Current status:
- Only a light base exists in `generative-and-rl.html` and `alignment-depth.html`

Missing depth:
- almost all of this deserves a proper chapter

### 12. Reinforcement Learning

Purpose:
Build RL from the ground up rather than jumping straight to alignment terms.

Core sections:
- Markov decision processes
- value functions
- temporal difference learning
- Q-learning
- DQN
- policy versus value intuition
- exploration versus exploitation

Current status:
- Dedicated atelier chapter now exists

Missing depth:
- policy gradients / actor-critic family
- PPO and modern alignment-side RL framing

### 13. Evaluation, Experimentation, And Production ML

Purpose:
Make evaluation feel like part of the modeling problem, not a separate appendix.

Core sections:
- precision / recall / F1
- ranking metrics
- calibration
- online versus offline
- A/B testing at scale
- training-serving skew
- drift
- feature pipelines and freshness

Current status:
- Split across `metrics-eval.html`, `production-systems.html`, and `data-features.html`

Missing depth:
- A/B testing at scale
- tighter integration of experimentation and production

### 14. Graph Machine Learning

Purpose:
Give graph ML its own chapter instead of burying it under architectures.

Core sections:
- graph message passing
- node classification
- link prediction
- graph classification
- graph attention networks

Current status:
- Missing in atelier

### 15. Interpretability And Mechanistic Understanding

Purpose:
Close the loop by asking how we inspect, debug, and explain what models learned.

Core sections:
- saliency and attribution
- feature importance revisited
- mechanistic interpretability
- circuits / heads / probes intuition

Current status:
- Missing in atelier

## Current Live Chapters Mapped To The Canonical Plan

- `foundations.html` -> Chapter 1
- `classical-ml-stats.html` -> partial Chapter 3
- `deep-learning.html` -> partial Chapters 4 and 5
- `gbdt-tabular.html` -> partial Chapter 7
- `systems-retrieval.html` -> partial Chapters 8 and 13
- `recommendation-depth.html` -> partial Chapter 8
- `transformers-rag.html` -> partial Chapter 9
- `generative-and-rl.html` -> partial Chapters 11 and 12
- `alignment-depth.html` -> bridge between Chapters 10, 11, and 12
- `metrics-eval.html` -> partial Chapter 13
- `production-systems.html` -> partial Chapter 13
- `data-features.html` -> partial Chapter 13

## Highest-Priority Missing Chapters

These are the gaps that most affect the usefulness of the atelier as an interview-prep and refresh resource.

1. Neural Network Basics
2. Adaptation, Compression, And Efficient Serving
3. Generative Models
4. Reinforcement Learning
5. Graph Machine Learning
6. Interpretability And Mechanistic Understanding

## Recommended Build Order

This is the order that makes the whole library feel coherent fastest.

1. Neural Network Basics
Reason:
- It fills the biggest conceptual gap between classical ML and the current deep-learning chapter.
- It covers many of the user’s highest-value requested topics in one place:
  - neuron
  - activation functions
  - output functions
  - forward and backward pass
  - chain rule
  - backpropagation
  - gradient descent

2. Linear Algebra For ML
Reason:
- It makes many other chapters clearer and more elegant, especially embeddings, matrix factorization, and attention.

3. Adaptation, Compression, And Efficient Serving
Reason:
- Very interview-relevant.
- Right now the LLM coverage stops too early without LoRA, quantization, distillation, and pre-train/fine-tune framing.

4. Generative Models
Reason:
- Big missing surface area with strong visual potential.

5. Reinforcement Learning
Reason:
- Should be rebuilt cleanly from MDP to DQN instead of feeling like a side note to alignment.

6. Trees, Ensembles, And Tabular ML expansion
Reason:
- High practical value and still missing random forests, histogram splitting, and feature importance depth.

7. Retrieval, Recommendation, And Ranking expansion
Reason:
- Add KNN / ANN, LambdaRank, and generative retrieval once the chapter spine is stronger.

8. Graph Machine Learning

9. Interpretability And Mechanistic Understanding

## Proposed Next Chapter

### Adaptation, Compression, And Efficient Serving

Why this should be next:
- It fills one of the biggest remaining interview-relevant gaps.
- The current transformer chapter stops before the practical post-training and deployment layer.
- It is the cleanest place to cover:
  - pre-training vs fine-tuning
  - LoRA / DoRA and parameter-efficient tuning
  - quantization
  - knowledge distillation
  - serving tradeoffs for modern LLMs

Proposed section order:
1. Pre-training versus fine-tuning
2. Full fine-tuning versus PEFT
3. LoRA intuition
4. Quantization: memory versus fidelity
5. Knowledge distillation
6. Serving tradeoffs: latency, memory, throughput

Notes:
- Keep this chapter concrete and systems-aware rather than purely architectural.
- Tie every section back to the cost-quality tradeoff that shows up in real deployments.
