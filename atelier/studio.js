const chapters = {
  foundations: {
    navMeta: 'chapter 01 / uncertainty and loss',
    eyebrow: 'Foundations',
    title: 'Probability concepts that should feel obvious after ten minutes.',
    lede:
      'The point of this chapter is not to memorize formulas. It is to make a few reusable ideas feel intuitive enough that the equations start reading like summaries, not like mysteries.',
    bestFor: 'Interview refresh / first pass review',
    studyMove: 'Read the first paragraph, then touch the controls',
    sections: [
      {
        id: 'bayes',
        nav: 'Bayes',
        label: 'Concept 01',
        title: 'Bayes: evidence updates a prior belief',
        summary:
          'Bayes is the rule for answering a simple question: after seeing new evidence, how much should I change what I believed before?',
        what:
          'You start with a <strong>prior</strong>, which is your belief before the evidence. Then you ask how consistent the evidence is with the event versus without it. The posterior is the updated belief after combining both pieces.',
        why:
          'This is the cleanest way to understand why a strong test can still produce a surprisingly modest probability when the event itself is rare.',
        interview:
          'The high-value interview sentence is: <em>a positive signal is not the same as a high posterior when the base rate is tiny.</em>',
        details: [
          'In classification, the same logic shows up whenever model scores need calibration rather than just ranking.',
          'The same mental model helps with spam filters, anomaly detection, medical screening, and alerting systems.',
        ],
        math: {
          title: 'Posterior formula',
          formula: 'P(H \\mid E) = \\frac{P(E \\mid H)\\,P(H)}{P(E)}',
          note: 'Read it as: posterior equals likelihood times prior, divided by the total probability of the evidence.',
        },
        geometry: {
          title: 'Geometric view',
          type: 'bayes-area',
          body:
            'Following the 3Blue1Brown picture, imagine the whole space of possibilities as a <strong>unit square</strong>. The hypothesis <strong>H</strong> fills one slice of that square with area <strong>P(H)</strong>. The evidence <strong>E</strong> carves out another region. The overlap between them has area <strong>P(H ∩ E)</strong>. Once you condition on the evidence, you are restricting attention to the evidence region only, so the posterior becomes: <em>what fraction of the evidence area lies inside the overlap?</em>',
          formula: 'P(H \\mid E) = \\frac{\\operatorname{area}(H \\cap E)}{\\operatorname{area}(E)}',
          note:
            'This is the useful visual mantra from the lesson: seeing evidence means cropping the square down to the evidence region, then asking what fraction of that cropped space still belongs to the hypothesis.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'prior = 0.05\nsensitivity = 0.95\nspecificity = 0.92\n\ntrue_positive = prior * sensitivity\nfalse_positive = (1 - prior) * (1 - specificity)\nposterior = true_positive / (true_positive + false_positive)',
        },
        quiz: {
          prompt: 'Why can a positive test still imply only modest posterior probability?',
          options: [
            {
              text: 'Because a rare event means the healthy population is still large enough to contribute many false positives',
              correct: true,
              explanation: 'Exactly. Base rate matters because false positives are counted over the much larger non-event population.',
            },
            {
              text: 'Because posterior probability ignores the prior and depends only on test accuracy',
              correct: false,
              explanation: 'Not quite. Bayes is precisely about combining test behavior with the prior.',
            },
            {
              text: 'Because sensitivity and specificity cancel each other out in Bayes’ rule',
              correct: false,
              explanation: 'They do not cancel. They contribute differently to true-positive and false-positive mass.',
            },
          ],
        },
        viz: 'bayes',
        controls: [
          { key: 'prior', label: 'Prior', min: 0.01, max: 0.8, step: 0.01, value: 0.05, format: 'percent' },
          { key: 'sensitivity', label: 'Sensitivity', min: 0.5, max: 0.99, step: 0.01, value: 0.95, format: 'percent' },
          { key: 'specificity', label: 'Specificity', min: 0.5, max: 0.99, step: 0.01, value: 0.92, format: 'percent' },
        ],
        presets: [
          { label: 'Rare event', values: { prior: 0.01, sensitivity: 0.99, specificity: 0.99 } },
          { label: 'More common', values: { prior: 0.35, sensitivity: 0.92, specificity: 0.92 } },
          { label: 'Weak test', values: { prior: 0.12, sensitivity: 0.75, specificity: 0.78 } },
        ],
      },
      {
        id: 'entropy',
        nav: 'Entropy',
        label: 'Concept 02',
        title: 'Entropy and cross-entropy: uncertainty plus model mismatch',
        summary:
          'Entropy tells you how uncertain the true outcome already is. Cross-entropy tells you how expensive it is when your model bets on the wrong distribution.',
        what:
          'Think of <strong>entropy</strong> as the <strong>average surprise</strong> of the true distribution. If outcomes are predictable, surprise is low and entropy is low. If outcomes are hard to guess, surprise is high and entropy is high. Then think of <strong>cross-entropy</strong> as that built-in surprise plus the extra penalty you pay because your model distribution <code>q</code> does not match the true distribution <code>p</code>.',
        why:
          'This turns the classification loss into something intuitive: some of the loss is unavoidable, and the rest is your model being off.',
        interview:
          'The reusable equation is: <em>cross-entropy = entropy + KL divergence.</em> The extra term is purely mismatch.',
        details: [
          'When the true labels are one-hot, entropy can be low while cross-entropy still spikes if the model puts probability mass on the wrong class.',
          'In language modeling, the same idea becomes next-token prediction over a much larger distribution.',
        ],
        math: {
          title: 'Loss decomposition',
          formula: [
            'H(p, q) = H(p) + KL(p \\parallel q)',
            '\\mathcal{L}_{CE} = -\\sum_x p(x) \\log q(x)',
          ],
          note: 'The first line gives the conceptual decomposition. The second line is the actual loss you optimize in classification and language modeling.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'import math\n\ndef cross_entropy(p, q):\n    return -(p * math.log2(q) + (1 - p) * math.log2(1 - q))\n\ndef entropy(p):\n    return -(p * math.log2(p) + (1 - p) * math.log2(1 - p))\n\nkl = cross_entropy(p, q) - entropy(p)',
        },
        quiz: {
          prompt: 'If q moves away from p while p stays fixed, what must happen?',
          options: [
            {
              text: 'Cross-entropy rises because mismatch grows',
              correct: true,
              explanation: 'Right. Entropy belongs to the task, while the extra rise comes from model mismatch.',
            },
            {
              text: 'Entropy rises because the task itself became more uncertain',
              correct: false,
              explanation: 'Not here. Entropy depends only on p, and p did not change.',
            },
            {
              text: 'KL goes to zero because the model is more confident',
              correct: false,
              explanation: 'Confidence alone is not enough. KL shrinks only when q matches p better.',
            },
          ],
        },
        viz: 'entropy',
        controls: [
          { key: 'p', label: 'True distribution p', min: 0.05, max: 0.95, step: 0.01, value: 0.35, format: 'percent' },
          { key: 'q', label: 'Model distribution q', min: 0.05, max: 0.95, step: 0.01, value: 0.55, format: 'percent' },
        ],
        presets: [
          { label: 'Matched model', values: { p: 0.5, q: 0.5 } },
          { label: 'Overconfident wrong', values: { p: 0.35, q: 0.85 } },
          { label: 'Mostly aligned', values: { p: 0.7, q: 0.62 } },
        ],
      },
    ],
  },
  'neural-basics': {
    navMeta: 'chapter 03 / neural network basics',
    eyebrow: 'Neural Network Basics',
    title: 'Neural networks stop feeling magical once each piece has a small job.',
    lede:
      'This chapter is the missing bridge between classical ML and the current deep-learning chapter. The goal is to make neurons, activations, outputs, backpropagation, and optimization feel like one connected story instead of a bag of vocabulary words.',
    bestFor: 'First pass through neural networks / interview refresh',
    studyMove: 'Read each section as a tiny causal story: signal goes forward, blame comes backward, weights update.',
    sections: [
      {
        id: 'neuron',
        nav: 'Neuron',
        label: 'Concept 01',
        title: 'What is a neuron? A weighted sum followed by a gate',
        summary:
          'A neuron takes inputs, weights how much each one matters, adds a bias, and then passes the result through an activation function.',
        what:
          'The most useful mental model is that a neuron is a <strong>small score-maker</strong>. Inputs that line up with positive weights push the score up. Inputs paired with negative weights push it down. The bias shifts the whole decision before the activation function decides how much signal survives.',
        why:
          'This is the atomic building block of a neural network. If this feels simple, the rest of the architecture starts reading as “many little score-makers composed together.”',
        interview:
          'The clean sentence is: <em>a neuron computes a weighted sum plus bias, then applies a nonlinear activation.</em>',
        details: [
          'Weights say how strongly each input matters and in what direction.',
          'Bias is like a built-in preference or threshold before any input arrives.',
        ],
        math: {
          title: 'Neuron computation',
          formula: [
            'z = w_1 x_1 + w_2 x_2 + b',
            'a = \\phi(z)',
          ],
          note: 'First make one score z. Then let the activation decide how much of that score becomes the output a.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'z = w1 * x1 + w2 * x2 + b\na = relu(z)  # or sigmoid/tanh/etc.',
        },
        quiz: {
          prompt: 'What changes if a weight becomes negative?',
          options: [
            {
              text: 'That input now pushes the neuron output down instead of up',
              correct: true,
              explanation: 'Exactly. The sign of the weight determines whether the input is evidence for or against the neuron firing.',
            },
            {
              text: 'The input stops mattering entirely',
              correct: false,
              explanation: 'Not quite. A negative weight still matters; it just pushes the score in the opposite direction.',
            },
            {
              text: 'The bias is no longer used',
              correct: false,
              explanation: 'The bias still shifts the pre-activation score either way.',
            },
          ],
        },
        viz: 'neuron',
        controls: [
          { key: 'x1', label: 'Input x1', min: -1.0, max: 1.0, step: 0.05, value: 0.8, format: 'decimal2' },
          { key: 'x2', label: 'Input x2', min: -1.0, max: 1.0, step: 0.05, value: 0.35, format: 'decimal2' },
          { key: 'w1', label: 'Weight w1', min: -1.5, max: 1.5, step: 0.05, value: 1.0, format: 'decimal2' },
          { key: 'w2', label: 'Weight w2', min: -1.5, max: 1.5, step: 0.05, value: 0.7, format: 'decimal2' },
          { key: 'bias', label: 'Bias b', min: -1.5, max: 1.5, step: 0.05, value: -0.2, format: 'decimal2' },
        ],
        presets: [
          { label: 'Both inputs support', values: { x1: 0.8, x2: 0.35, w1: 1.0, w2: 0.7, bias: -0.2 } },
          { label: 'Inputs conflict', values: { x1: 0.8, x2: 0.8, w1: 1.1, w2: -1.1, bias: 0.0 } },
          { label: 'Bias dominates', values: { x1: 0.15, x2: 0.1, w1: 0.4, w2: 0.3, bias: 1.0 } },
        ],
      },
      {
        id: 'activation-basics',
        nav: 'Activations',
        label: 'Concept 02',
        title: 'Activation functions decide how much signal survives',
        summary:
          'Without activations, many stacked layers collapse into one big linear map. Activations are what let neural networks bend, gate, and reshape the signal.',
        what:
          'A neuron first builds a score <strong>z</strong>. The activation function then decides what to do with it. <strong>Sigmoid</strong> squeezes everything into 0 to 1, <strong>tanh</strong> into -1 to 1, and <strong>ReLU</strong> keeps positive signal while zeroing the negative side.',
        why:
          'Activation choice affects both what the model can represent and how easy it is to train. Some saturate, some die on the negative side, and some preserve gradients better.',
        interview:
          'The simple sentence is: <em>activations add nonlinearity and control how signal and gradient move through the network.</em>',
        details: [
          'Sigmoid and tanh can saturate for large positive or negative inputs, which makes gradients small.',
          'ReLU is simple and practical, but permanently negative units can go quiet if they never activate again.',
        ],
        math: {
          title: 'Common activations',
          formula: [
            '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
            '\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}',
            '\\operatorname{ReLU}(z) = \\max(0, z)',
          ],
          note: 'Each function keeps or suppresses signal in a different way, which is why the curves matter.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'sigmoid = 1 / (1 + exp(-z))\ntanh_val = tanh(z)\nrelu = max(0.0, z)',
        },
        quiz: {
          prompt: 'Why do neural networks need activation functions at all?',
          options: [
            {
              text: 'Because activations add nonlinearity; without them, many layers act like one linear transformation',
              correct: true,
              explanation: 'Exactly. Nonlinearity is what lets depth buy expressive power instead of just repeating linear algebra.',
            },
            {
              text: 'Because activations choose the loss function',
              correct: false,
              explanation: 'The loss is separate. Activations shape the hidden representation and the output behavior.',
            },
            {
              text: 'Because activations eliminate the need for weights',
              correct: false,
              explanation: 'No. They work on top of the weighted sum rather than replacing it.',
            },
          ],
        },
        viz: 'activation-basics',
        controls: [
          { key: 'z', label: 'Pre-activation z', min: -3.0, max: 3.0, step: 0.05, value: 0.8, format: 'decimal2' },
          { key: 'slope', label: 'Input scale', min: 0.5, max: 2.0, step: 0.05, value: 1.0, format: 'decimal2' },
        ],
        presets: [
          { label: 'Negative side', values: { z: -1.4, slope: 1.0 } },
          { label: 'Near the hinge', values: { z: 0.15, slope: 1.0 } },
          { label: 'Saturated positive', values: { z: 2.4, slope: 1.0 } },
        ],
      },
      {
        id: 'output-functions',
        nav: 'Outputs',
        label: 'Concept 03',
        title: 'Output functions turn raw scores into probabilities you can read',
        summary:
          'A hidden layer can use many activations, but the output layer should match the job: sigmoid for a binary probability, softmax for a distribution over classes.',
        what:
          'The model usually ends with raw scores called <strong>logits</strong>. A <strong>sigmoid</strong> turns one logit into a binary probability. A <strong>softmax</strong> turns several logits into a probability distribution that sums to one.',
        why:
          'This is the bridge between model internals and the numbers you actually read at the end. If the output function is wrong for the task, the prediction surface is wrong too.',
        interview:
          'The useful sentence is: <em>sigmoid is for one yes/no logit; softmax is for competing classes.</em>',
        details: [
          'Softmax is relative: raising one class logit lowers the others even if they did not change.',
          'A big positive binary logit does not just mean “positive”; it means the model is confident on an exponential scale before the sigmoid squashes it.',
        ],
        math: {
          title: 'Binary and multiclass outputs',
          formula: [
            '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
            '\\operatorname{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_j e^{z_j}}',
          ],
          note: 'Sigmoid makes one probability. Softmax turns several competing scores into one shared distribution.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'binary_prob = sigmoid(binary_logit)\nclass_probs = softmax(class_logits, dim=-1)',
        },
        quiz: {
          prompt: 'Why is softmax not the same thing as applying sigmoid to each class independently?',
          options: [
            {
              text: 'Because softmax makes the classes compete and forces the probabilities to sum to one',
              correct: true,
              explanation: 'Exactly. Softmax is a shared distribution, not a set of independent yes/no probabilities.',
            },
            {
              text: 'Because softmax removes the logits entirely',
              correct: false,
              explanation: 'The logits are still there; softmax just converts them into normalized probabilities.',
            },
            {
              text: 'Because sigmoid works only for regression',
              correct: false,
              explanation: 'Sigmoid is widely used for binary classification.',
            },
          ],
        },
        viz: 'output-functions',
        controls: [
          { key: 'binary', label: 'Binary logit', min: -4.0, max: 4.0, step: 0.05, value: 1.2, format: 'decimal2' },
          { key: 'classA', label: 'Class A logit', min: -2.0, max: 4.0, step: 0.05, value: 2.0, format: 'decimal2' },
          { key: 'classB', label: 'Class B logit', min: -2.0, max: 4.0, step: 0.05, value: 0.8, format: 'decimal2' },
        ],
        presets: [
          { label: 'Binary uncertain', values: { binary: 0.0, classA: 0.8, classB: 0.7 } },
          { label: 'Confident class A', values: { binary: 2.2, classA: 2.5, classB: 0.2 } },
          { label: 'Classes tied', values: { binary: -0.8, classA: 1.1, classB: 1.0 } },
        ],
      },
      {
        id: 'forward-pass',
        nav: 'Forward pass',
        label: 'Concept 04',
        title: 'Forward pass: every layer transforms the signal into a prediction',
        summary:
          'A forward pass is just a sequence of small computations. Inputs become hidden activations, hidden activations become an output score, and the output score becomes a prediction.',
        what:
          'The important intuition is that a neural network does not “think” in one jump. It <strong>builds intermediate features</strong>. Early neurons respond to simple patterns, later neurons combine those patterns into a final score.',
        why:
          'This makes depth much easier to reason about. A forward pass is not mysterious; it is just repeated feature construction.',
        interview:
          'The clean sentence is: <em>the forward pass computes the prediction by composing layer outputs from input to output.</em>',
        details: [
          'You can think of each hidden unit as a small feature detector that passes its score to the next stage.',
          'The output layer only sees the hidden activations, not the raw inputs directly.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'h1 = relu(W1 @ x + b1)\ny_hat = sigmoid(W2 @ h1 + b2)',
        },
        quiz: {
          prompt: 'What is the best way to think about a forward pass?',
          options: [
            {
              text: 'As a sequence of feature transformations that ends in a prediction',
              correct: true,
              explanation: 'Exactly. The network is repeatedly transforming the representation until the output layer can read it.',
            },
            {
              text: 'As a direct lookup table from input to label',
              correct: false,
              explanation: 'No. The useful intuition is intermediate representation building, not memorized lookup.',
            },
            {
              text: 'As the step that updates the weights',
              correct: false,
              explanation: 'Weight updates happen later. The forward pass only computes the prediction and loss inputs.',
            },
          ],
        },
        viz: 'forward-pass',
        controls: [
          { key: 'x1', label: 'Feature x1', min: 0.0, max: 1.0, step: 0.01, value: 0.72, format: 'percent' },
          { key: 'x2', label: 'Feature x2', min: 0.0, max: 1.0, step: 0.01, value: 0.34, format: 'percent' },
        ],
        presets: [
          { label: 'Strong first feature', values: { x1: 0.82, x2: 0.24 } },
          { label: 'Balanced input', values: { x1: 0.58, x2: 0.56 } },
          { label: 'Second feature dominates', values: { x1: 0.18, x2: 0.88 } },
        ],
      },
      {
        id: 'chain-rule',
        nav: 'Chain rule',
        label: 'Concept 05',
        title: 'Chain rule: blame is a product of local sensitivities',
        summary:
          'The chain rule is what lets a network assign credit and blame. Each step asks: how much did this local piece amplify or shrink the error signal?',
        what:
          'Instead of trying to explain the whole network at once, the chain rule breaks the derivative into small factors. Each factor says how sensitive one stage is to the previous stage. Multiply them together and you know how much one weight affected the loss.',
        why:
          'This is the core mathematical idea behind backpropagation. If this clicks, backprop stops feeling like a magic algorithm.',
        interview:
          'The one-liner is: <em>the gradient of a weight is the product of the local derivatives along the path from that weight to the loss.</em>',
        details: [
          'If any one factor is tiny, the final gradient shrinks. That is one reason deep nets can suffer from vanishing gradients.',
          'The chain rule is not unique to neural networks; backprop is just a very efficient way to apply it to layered computation graphs.',
        ],
        math: {
          title: 'A tiny path from weight to loss',
          formula: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}',
          note: 'Read this right to left: weight changes z, z changes prediction, prediction changes loss.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'dL_dw = dL_dyhat * dyhat_dz * dz_dw',
        },
        quiz: {
          prompt: 'If one local derivative in the chain is near zero, what happens to the final gradient?',
          options: [
            {
              text: 'It becomes small too, because the local factors multiply together',
              correct: true,
              explanation: 'Exactly. One tiny factor can suppress the whole product.',
            },
            {
              text: 'It becomes larger, because the network compensates automatically',
              correct: false,
              explanation: 'No. The chain rule multiplies; it does not auto-correct a tiny local derivative.',
            },
            {
              text: 'It only affects the loss, not the gradient',
              correct: false,
              explanation: 'The chain rule is literally about how the gradient is constructed.',
            },
          ],
        },
        viz: 'chain-rule',
        controls: [
          { key: 'error', label: 'Output error term', min: -1.0, max: 1.0, step: 0.05, value: 0.7, format: 'decimal2' },
          { key: 'slope', label: 'Activation slope', min: 0.0, max: 1.0, step: 0.01, value: 0.62, format: 'percent' },
          { key: 'input', label: 'Input contribution', min: 0.0, max: 1.0, step: 0.01, value: 0.78, format: 'percent' },
        ],
        presets: [
          { label: 'Healthy gradient', values: { error: 0.7, slope: 0.62, input: 0.78 } },
          { label: 'Saturated unit', values: { error: 0.7, slope: 0.08, input: 0.78 } },
          { label: 'Tiny input path', values: { error: 0.7, slope: 0.62, input: 0.12 } },
        ],
      },
      {
        id: 'backprop',
        nav: 'Backprop',
        label: 'Concept 06',
        title: 'Backpropagation: each weight learns how much it helped cause the error',
        summary:
          'Backpropagation is just the chain rule applied efficiently across every weight in the network.',
        what:
          'After the forward pass creates a prediction, backprop sends an <strong>upstream error signal</strong> backward. Each weight receives a gradient that depends on two things: the input that flowed through that weight and the error signal arriving from later layers.',
        why:
          'This is the answer to “how does a neuron learn?” The neuron learns because its weights get gradients telling them which direction would have reduced the loss.',
        interview:
          'The clean answer is: <em>backprop computes each weight’s gradient by combining the upstream error with the local input and derivative.</em>',
        details: [
          'A large input through a large error path creates a large weight update signal.',
          'The sign of the gradient matters: it tells you whether increasing the weight would raise or lower the loss.',
        ],
        math: {
          title: 'Local error and weight gradients',
          formula: [
            '\\delta = (\\hat{y} - y)\\,\\phi\\!\\,\\prime(z)',
            '\\frac{\\partial L}{\\partial w_i} = x_i \\delta',
          ],
          note: 'The local error δ carries the blame signal for that neuron, and each weight scales it by the input that passed through it.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'delta = (y_hat - y) * activation_grad(z)\ndw1 = x1 * delta\ndw2 = x2 * delta\ndb = delta',
        },
        quiz: {
          prompt: 'Why does a weight connected to a larger input often get a larger gradient?',
          options: [
            {
              text: 'Because that input multiplies the local error term in the gradient',
              correct: true,
              explanation: 'Exactly. Bigger input along the same error path means the weight influenced the output more strongly.',
            },
            {
              text: 'Because backprop always prefers the first weight',
              correct: false,
              explanation: 'No. The gradient comes from the actual path contribution, not the position of the weight.',
            },
            {
              text: 'Because biases are ignored during learning',
              correct: false,
              explanation: 'Biases also get gradients. They are just not multiplied by an input feature.',
            },
          ],
        },
        viz: 'backprop',
        controls: [
          { key: 'x1', label: 'Input x1', min: 0.0, max: 1.0, step: 0.01, value: 0.82, format: 'percent' },
          { key: 'x2', label: 'Input x2', min: 0.0, max: 1.0, step: 0.01, value: 0.34, format: 'percent' },
          { key: 'error', label: 'Prediction error', min: -1.0, max: 1.0, step: 0.05, value: 0.6, format: 'decimal2' },
        ],
        presets: [
          { label: 'Wrong and confident', values: { x1: 0.82, x2: 0.34, error: 0.8 } },
          { label: 'Almost right', values: { x1: 0.62, x2: 0.58, error: 0.15 } },
          { label: 'Wrong in the other direction', values: { x1: 0.3, x2: 0.88, error: -0.7 } },
        ],
      },
      {
        id: 'gradient-descent',
        nav: 'Gradient descent',
        label: 'Concept 07',
        title: 'Gradient descent: move a little downhill, then repeat',
        summary:
          'Once you have gradients, gradient descent is the basic rule that turns them into learning: step in the direction that lowers the loss.',
        what:
          'A gradient points uphill, toward increasing loss. So the optimizer takes a step in the opposite direction. Small careful steps usually converge slowly; oversized steps can overshoot the valley.',
        why:
          'This is the simplest update rule in optimization and the backbone that more advanced optimizers still build on.',
        interview:
          'The compact sentence is: <em>gradient descent updates parameters by stepping opposite the loss gradient.</em>',
        details: [
          'You can think of the gradient as a local “slope report” for the current parameters.',
          'The learning rate controls how aggressively you trust that local slope report.',
        ],
        math: {
          title: 'Basic update rule',
          formula: '\\theta_{t+1} = \\theta_t - \\eta \\, \\nabla L(\\theta_t)',
          note: 'Subtract the gradient because the gradient points uphill and you want to move downhill.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'theta = theta - lr * grad',
        },
        quiz: {
          prompt: 'Why does gradient descent subtract the gradient instead of adding it?',
          options: [
            {
              text: 'Because the gradient points in the direction of increasing loss',
              correct: true,
              explanation: 'Exactly. To lower the loss, you move against that direction.',
            },
            {
              text: 'Because subtraction makes the model more nonlinear',
              correct: false,
              explanation: 'No. The sign comes from the optimization direction, not from expressiveness.',
            },
            {
              text: 'Because adding the gradient would keep the parameters unchanged',
              correct: false,
              explanation: 'Adding the gradient would usually push you uphill instead.',
            },
          ],
        },
        viz: 'gradient-descent',
        controls: [
          { key: 'position', label: 'Starting position', min: -3.0, max: 3.0, step: 0.05, value: 2.1, format: 'decimal2' },
          { key: 'lr', label: 'Step size', min: 0.05, max: 1.1, step: 0.01, value: 0.28, format: 'decimal2' },
          { key: 'curvature', label: 'Curvature', min: 0.6, max: 1.5, step: 0.01, value: 1.0, format: 'decimal2' },
        ],
        presets: [
          { label: 'Tiny steps', values: { position: 2.1, lr: 0.08, curvature: 1.0 } },
          { label: 'Healthy step', values: { position: 2.1, lr: 0.28, curvature: 1.0 } },
          { label: 'Too aggressive', values: { position: 2.1, lr: 0.84, curvature: 1.2 } },
        ],
      },
      {
        id: 'optimizers',
        nav: 'Optimizers',
        label: 'Concept 08',
        title: 'Optimizers: SGD, momentum, and Adam remember the path differently',
        summary:
          'All optimizers use gradients, but they differ in how much history they remember and how they scale the next update.',
        what:
          '<strong>SGD</strong> reacts only to the current gradient. <strong>Momentum</strong> smooths recent gradients into a velocity. <strong>Adam</strong> keeps both a running mean and a running scale estimate so noisy coordinates do not dominate the update.',
        why:
          'This is why training behavior changes even when the model and data stay fixed. The optimizer is part of the learning dynamics, not a trivial implementation detail.',
        interview:
          'The clean line is: <em>SGD uses the current slope, momentum smooths the path, and Adam also rescales by recent gradient magnitude.</em>',
        details: [
          'Momentum helps when gradients bounce around but still point in roughly the same direction.',
          'Adam often converges quickly early on, but its generalization behavior can differ from SGD in practice.',
        ],
        math: {
          title: 'Two common update styles',
          formula: [
            'v_t = \\beta v_{t-1} + (1-\\beta) g_t, \\qquad \\theta_{t+1} = \\theta_t - \\eta v_t',
            'm_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2',
          ],
          note: 'Momentum remembers direction. Adam remembers both direction and scale.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'velocity = beta * velocity + (1 - beta) * grad\nparams -= lr * velocity\n# Adam also keeps a running second-moment estimate',
        },
        quiz: {
          prompt: 'What is the main intuition behind momentum?',
          options: [
            {
              text: 'It smooths noisy gradients into a more consistent direction of travel',
              correct: true,
              explanation: 'Exactly. Momentum accumulates direction so the optimizer does not overreact to every tiny zig-zag.',
            },
            {
              text: 'It removes the need for a learning rate',
              correct: false,
              explanation: 'No. You still need a step size; momentum only changes how the gradient history is used.',
            },
            {
              text: 'It guarantees lower loss than every other optimizer',
              correct: false,
              explanation: 'No optimizer wins universally. The useful difference is how they use gradient history.',
            },
          ],
        },
        viz: 'optimizers',
        controls: [
          { key: 'noise', label: 'Gradient noise', min: 0.05, max: 0.9, step: 0.01, value: 0.34, format: 'percent' },
          { key: 'lr', label: 'Base step size', min: 0.05, max: 0.6, step: 0.01, value: 0.22, format: 'decimal2' },
        ],
        presets: [
          { label: 'Low-noise valley', values: { noise: 0.12, lr: 0.18 } },
          { label: 'Typical minibatches', values: { noise: 0.34, lr: 0.22 } },
          { label: 'Very noisy updates', values: { noise: 0.72, lr: 0.28 } },
        ],
      },
      {
        id: 'lr-schedule',
        nav: 'LR schedules',
        label: 'Concept 09',
        title: 'Learning-rate schedules: move fast early, refine carefully later',
        summary:
          'A learning-rate schedule changes the step size over time so the optimizer can explore early and settle later.',
        what:
          'The basic idea is simple: big steps are useful when you are far away from a good solution, but smaller steps help once you are near a good basin and want to refine instead of bounce.',
        why:
          'This is one of the most practical training tricks in modern deep learning. Good schedules often matter more than people expect.',
        interview:
          'The reusable sentence is: <em>learning-rate schedules trade early speed for late-stage stability.</em>',
        details: [
          'Constant learning rates are easy to reason about, but they often keep too much energy late in training.',
          'Step decay and cosine schedules are two common ways to cool the optimization process over time.',
        ],
        math: {
          title: 'Two common schedules',
          formula: [
            '\\eta_t = \\eta_0 \\gamma^{\\lfloor t / s \\rfloor}',
            '\\eta_t = \\eta_{min} + \\tfrac{1}{2}(\\eta_0 - \\eta_{min})(1 + \\cos(\\pi t / T))',
          ],
          note: 'Step decay drops the learning rate in jumps. Cosine cools it more smoothly over training.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'lr = base_lr * gamma ** (epoch // step_size)\n# or\nlr = min_lr + 0.5 * (base_lr - min_lr) * (1 + cos(pi * epoch / total_epochs))',
        },
        quiz: {
          prompt: 'Why can a learning-rate schedule help even when the optimizer is already working?',
          options: [
            {
              text: 'Because the right step size early in training is often too large once the model gets near a good minimum',
              correct: true,
              explanation: 'Exactly. Schedules cool the optimization process instead of keeping the same energy forever.',
            },
            {
              text: 'Because schedules replace gradients with rules',
              correct: false,
              explanation: 'No. The gradients stay the same; only the step size changes over time.',
            },
            {
              text: 'Because cosine schedules guarantee the global optimum',
              correct: false,
              explanation: 'No schedule can promise that. The point is practical training behavior, not a guarantee.',
            },
          ],
        },
        viz: 'lr-schedule',
        controls: [
          { key: 'initial', label: 'Initial learning rate', min: 0.1, max: 1.0, step: 0.01, value: 0.62, format: 'decimal2' },
          { key: 'decay', label: 'Decay strength', min: 0.1, max: 1.0, step: 0.01, value: 0.54, format: 'percent' },
        ],
        presets: [
          { label: 'Almost constant', values: { initial: 0.42, decay: 0.12 } },
          { label: 'Balanced cooling', values: { initial: 0.62, decay: 0.54 } },
          { label: 'Aggressive decay', values: { initial: 0.84, decay: 0.88 } },
        ],
      },
    ],
  },
  'deep-learning': {
    navMeta: 'chapter 04 / optimization and gradient flow',
    eyebrow: 'Deep Learning',
    title: 'The mechanics that make neural networks train or break.',
    lede:
      'Deep learning becomes easier once you stop treating training as magic. This chapter now walks through the main stability levers in the order they actually matter: update size, initialization, gradient flow, normalization, skip paths, and attention efficiency.',
    bestFor: 'Core interview preparation / quick optimization refresh',
    studyMove: 'Use the presets first, then drag one control at a time',
    sections: [
      {
        id: 'learning-rate',
        nav: 'Learning rate',
        label: 'Concept 01',
        title: 'Learning rate: too small wastes time, too large destroys stability',
        summary:
          'Gradient descent is just repeated correction. The learning rate decides whether each correction is thoughtful, timid, or reckless.',
        what:
          'On every training step, the optimizer looks at the slope of the loss surface and moves downhill. The <strong>learning rate</strong> is the size of that move. Small values make progress painfully slow. Large values can overshoot the valley and bounce around.',
        why:
          'A lot of training failures are not architecture problems. They are update-size problems wearing a more complicated costume.',
        interview:
          'The clean answer is: <em>the learning rate controls stability versus speed.</em> Bad settings either crawl or diverge.',
        details: [
          'This is why schedulers matter: the right step size early in training is often too aggressive later on.',
          'Adaptive optimizers still live inside the same tradeoff. They just rescale the step per parameter.',
        ],
        math: {
          title: 'Update rule',
          formula: '\\theta_{t+1} = \\theta_t - \\eta \\, \\nabla L(\\theta_t)',
          note: 'The learning rate η is literally the multiplier on the gradient step.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'params = params - lr * grads\n\n# too small: tiny progress\n# too large: overshoot and oscillate',
        },
        quiz: {
          prompt: 'What is the most common symptom of a learning rate that is too large?',
          options: [
            {
              text: 'Loss oscillates or diverges instead of settling',
              correct: true,
              explanation: 'Yes. The updates jump past the good region and destabilize training.',
            },
            {
              text: 'Training becomes stable but very slow',
              correct: false,
              explanation: 'That is usually the too-small regime, not the too-large one.',
            },
            {
              text: 'The model instantly reaches the global optimum',
              correct: false,
              explanation: 'Unfortunately not. Large steps tend to destroy control, not create it.',
            },
          ],
        },
        viz: 'learning-rate',
        controls: [
          { key: 'lr', label: 'Learning rate', min: 0.03, max: 1.1, step: 0.01, value: 0.24, format: 'decimal2' },
          { key: 'curvature', label: 'Curvature', min: 0.5, max: 1.6, step: 0.01, value: 1.0, format: 'decimal2' },
        ],
        presets: [
          { label: 'Too cautious', values: { lr: 0.06, curvature: 1.0 } },
          { label: 'Balanced', values: { lr: 0.24, curvature: 1.0 } },
          { label: 'Too aggressive', values: { lr: 0.82, curvature: 1.15 } },
        ],
      },
      {
        id: 'initialization',
        nav: 'Initialization',
        label: 'Concept 02',
        title: 'Initialization: training starts healthier when signal scale survives depth',
        summary:
          'Before the optimizer does anything, the network already has a signal-propagation problem. Initialization chooses the starting weight scale so activations and gradients do not collapse or explode.',
        what:
          'Every layer multiplies the incoming signal by weights. If those weights are too small, activations and gradients shrink toward zero. If they are too large, both blow up. <strong>Xavier</strong> and <strong>He</strong> initialization are variance rules designed to keep those scales roughly steady across many layers.',
        why:
          'A surprising amount of “deep nets are hard to train” pain begins before the first optimizer step. Good initialization gives optimization a sane starting geometry.',
        interview:
          'The clean sentence is: <em>initialization keeps activation and gradient scale in a healthy range as depth grows.</em>',
        details: [
          'He/Kaiming initialization uses a larger variance than Xavier because ReLU drops roughly half the signal.',
          'Initialization is not about finding the right features in advance; it is about preventing the network from becoming numerically hostile before learning begins.',
        ],
        math: {
          title: 'Variance rules',
          formula: [
            '\\operatorname{Var}(W) \\approx \\frac{2}{fan_{in}} \\quad \\text{(He / ReLU)}',
            '\\operatorname{Var}(W) \\approx \\frac{2}{fan_{in} + fan_{out}} \\quad \\text{(Xavier)}',
          ],
          note: 'Both rules are trying to keep signal scale roughly constant across layers. He is more aggressive because ReLU zeroes part of the activation mass.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'fan_in = layer.weight.shape[1]\nstd = (2.0 / fan_in) ** 0.5  # He init for ReLU\nlayer.weight = randn_like(layer.weight) * std\n\n# goal: keep activations from shrinking or exploding',
        },
        quiz: {
          prompt: 'Why is He initialization usually preferred over Xavier for ReLU networks?',
          options: [
            {
              text: 'Because ReLU discards part of the signal, so weights need a slightly larger variance to keep scale stable',
              correct: true,
              explanation: 'Exactly. ReLU zeros out negative activations, so a stronger variance rule helps preserve scale.',
            },
            {
              text: 'Because He initialization makes every gradient equal to 1',
              correct: false,
              explanation: 'It helps with scale, but it does not force perfect gradients.',
            },
            {
              text: 'Because Xavier only works for convolutional networks',
              correct: false,
              explanation: 'Xavier is a general rule; it is just better matched to activations like tanh than to ReLU.',
            },
          ],
        },
        viz: 'initialization',
        controls: [
          { key: 'depth', label: 'Network depth', min: 4, max: 28, step: 1, value: 12, format: 'integer' },
          { key: 'scale', label: 'Weight scale factor', min: 0.55, max: 1.6, step: 0.01, value: 1.0, format: 'decimal2' },
        ],
        presets: [
          { label: 'Too small', values: { depth: 14, scale: 0.72 } },
          { label: 'Balanced He', values: { depth: 12, scale: 1.0 } },
          { label: 'Too large', values: { depth: 12, scale: 1.34 } },
        ],
      },
      {
        id: 'gradient-flow',
        nav: 'Gradient flow',
        label: 'Concept 03',
        title: 'Gradient flow: repeated multiplication can make signals vanish or explode',
        summary:
          'Backpropagation multiplies derivatives layer after layer. If those factors are consistently below one, gradients collapse. If they are above one, gradients blow up.',
        what:
          'Every layer passes a gradient backward. The size of that gradient gets multiplied over and over. That means even a modest repeated factor can become tiny or enormous by the time it reaches earlier layers.',
        why:
          'This is why activation choice, initialization, normalization, and residual paths matter. They are all attempts to keep learning signals in a sane range.',
        interview:
          'The memorable sentence is: <em>deep networks are hard to train when gradient magnitudes are repeatedly shrunk or amplified across many layers.</em>',
        details: [
          'Residual connections help because they create easier routes for gradients to travel.',
          'Normalization reduces internal scale drift, which makes gradient flow less fragile.',
        ],
        math: {
          title: 'Repeated derivative chain',
          formula: '\\frac{\\partial L}{\\partial x_0} = \\left(\\prod_l \\frac{\\partial x_l}{\\partial x_{l-1}}\\right) \\frac{\\partial L}{\\partial x_L}',
          note: 'If those repeated factors stay below 1, gradients vanish. If they stay above 1, they explode.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'grad = 1.0\nfor _ in range(depth):\n    grad *= typical_derivative\n\n# grad -> 0  : vanishing\n# grad -> inf: exploding',
        },
        quiz: {
          prompt: 'Why do residual connections help gradient flow?',
          options: [
            {
              text: 'They create shorter, easier routes for gradients to travel backward',
              correct: true,
              explanation: 'Exactly. Skip paths reduce the chance that all signal must pass through a long fragile chain.',
            },
            {
              text: 'They remove the need for backpropagation entirely',
              correct: false,
              explanation: 'No. Backprop still happens; the path is just easier to optimize.',
            },
            {
              text: 'They guarantee gradients are always exactly 1',
              correct: false,
              explanation: 'They help stability, but they do not force a perfect gradient magnitude.',
            },
          ],
        },
        viz: 'gradient-flow',
        controls: [
          { key: 'depth', label: 'Network depth', min: 4, max: 24, step: 1, value: 12, format: 'integer' },
          { key: 'derivative', label: 'Typical derivative', min: 0.45, max: 1.55, step: 0.01, value: 0.88, format: 'decimal2' },
        ],
        presets: [
          { label: 'Vanishing', values: { depth: 16, derivative: 0.72 } },
          { label: 'Healthy range', values: { depth: 12, derivative: 0.98 } },
          { label: 'Exploding', values: { depth: 12, derivative: 1.24 } },
        ],
      },
      {
        id: 'normalization',
        nav: 'Normalization',
        label: 'Concept 04',
        title: 'Normalization: keep internal scale drift from turning every layer into a moving target',
        summary:
          'Normalization keeps activations in a saner numeric range so later layers do not have to relearn around unstable scale and offset changes.',
        what:
          'As activations move through the network, their mean and scale can drift. <strong>BatchNorm</strong> uses batch statistics, <strong>LayerNorm</strong> normalizes each example across features, and <strong>RMSNorm</strong> mostly fixes scale without subtracting the mean. They are different answers to the same question: how do we keep the network numerically well-behaved?',
        why:
          'Normalization often makes optimization faster, lets you use larger learning rates, and reduces fragility when the network gets deep.',
        interview:
          'The sharp answer is: <em>normalization reduces internal scale drift, which makes optimization more stable and gradients easier to manage.</em>',
        details: [
          'BatchNorm depends on the batch, so it shines in CNN-style settings with decent batch sizes but becomes awkward in autoregressive sequence models.',
          'LayerNorm and RMSNorm are popular in transformers because they work sample-by-sample and do not depend on batch statistics.',
        ],
        math: {
          title: 'Normalization family',
          formula: [
            'y = \\gamma \\cdot \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta',
            '\\operatorname{RMSNorm}(x) = g \\cdot \\frac{x}{\\operatorname{RMS}(x)}',
          ],
          note: 'The first line is the standard centering-and-scaling template. RMSNorm keeps the rescaling idea but usually skips mean subtraction.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'mean = x.mean(dim=-1, keepdim=True)\nvar = x.var(dim=-1, keepdim=True, unbiased=False)\nx_hat = (x - mean) / (var + eps).sqrt()\ny = gamma * x_hat + beta',
        },
        quiz: {
          prompt: 'Why did LayerNorm largely replace BatchNorm inside transformers?',
          options: [
            {
              text: 'Because it works per example and does not depend on large, stable batches',
              correct: true,
              explanation: 'Exactly. Sequence models often need normalization that is independent of batch size and token packing.',
            },
            {
              text: 'Because it removes the need for residual connections',
              correct: false,
              explanation: 'Residuals and normalization solve different problems. They complement each other.',
            },
            {
              text: 'Because BatchNorm cannot normalize activations at all',
              correct: false,
              explanation: 'BatchNorm definitely can; it is just less convenient for many transformer settings.',
            },
          ],
        },
        viz: 'normalization',
        controls: [
          { key: 'batchCoupling', label: 'Batch coupling', min: 0.05, max: 0.95, step: 0.01, value: 0.12, format: 'percent' },
          { key: 'centering', label: 'Mean correction', min: 0.05, max: 0.95, step: 0.01, value: 0.88, format: 'percent' },
        ],
        presets: [
          { label: 'BatchNorm', values: { batchCoupling: 0.86, centering: 0.9 } },
          { label: 'LayerNorm', values: { batchCoupling: 0.12, centering: 0.88 } },
          { label: 'RMSNorm', values: { batchCoupling: 0.12, centering: 0.18 } },
        ],
      },
      {
        id: 'residuals',
        nav: 'Residuals',
        label: 'Concept 05',
        title: 'Residual connections: each block learns a correction instead of rebuilding the whole signal',
        summary:
          'Residual blocks keep an identity route open, so the network can preserve useful information while only learning the correction it needs.',
        what:
          'A residual block outputs <strong>x + F(x)</strong>, not just <strong>F(x)</strong>. That means the default behavior can stay close to identity while the learned branch adds a refinement. Backward gradients also inherit that easy route through the skip connection.',
        why:
          'This is one of the main reasons very deep ResNets and transformers are trainable in practice while plain deep stacks often are not.',
        interview:
          'The sentence worth remembering is: <em>residuals turn a hard “learn everything” problem into an easier “learn the correction” problem.</em>',
        details: [
          'If a block is not useful yet, the network can lean on the skip path instead of forcing every layer to be perfect immediately.',
          'Residuals do not magically remove all optimization issues, but they make deep networks far less brittle.',
        ],
        math: {
          title: 'Skip-path rule',
          formula: [
            'y = x + F(x)',
            '\\frac{\\partial y}{\\partial x} = I + \\frac{\\partial F}{\\partial x}',
          ],
          note: 'That identity term is the practical gift. Even if the learned branch is awkward, gradients still have a direct path.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'residual = x\nx = block(x)\nx = x + residual\n\n# learn a correction, not a full replacement',
        },
        quiz: {
          prompt: 'What is the most useful optimization effect of a residual connection?',
          options: [
            {
              text: 'It preserves an identity path so signals and gradients do not have to pass entirely through the learned branch',
              correct: true,
              explanation: 'Yes. The skip path makes deep stacks much easier to optimize.',
            },
            {
              text: 'It forces every layer to have exactly the same output variance',
              correct: false,
              explanation: 'Residuals help stability, but they do not by themselves normalize variance.',
            },
            {
              text: 'It eliminates the need for nonlinear activations',
              correct: false,
              explanation: 'No. The learned branch still relies on nonlinear computation to model useful corrections.',
            },
          ],
        },
        viz: 'residuals',
        controls: [
          { key: 'depth', label: 'Network depth', min: 4, max: 32, step: 1, value: 18, format: 'integer' },
          { key: 'derivative', label: 'Branch derivative', min: 0.55, max: 1.32, step: 0.01, value: 0.82, format: 'decimal2' },
        ],
        presets: [
          { label: 'Fragile plain stack', values: { depth: 20, derivative: 0.74 } },
          { label: 'Healthy residual stack', values: { depth: 18, derivative: 0.9 } },
          { label: 'Too explosive', values: { depth: 12, derivative: 1.2 } },
        ],
      },
      {
        id: 'flash-attention',
        nav: 'Flash Attention',
        label: 'Concept 06',
        title: 'Flash Attention: same attention, much less memory traffic',
        summary:
          'Flash Attention does not approximate attention. It changes the computation order so the huge score matrix is never fully materialized in slow memory.',
        what:
          'Standard attention builds the full <strong>n × n</strong> score matrix, which becomes painfully memory-hungry at long context lengths. <strong>Flash Attention</strong> tiles the computation so query, key, and value blocks fit in fast SRAM and computes the softmax incrementally. The result is exact attention with much better IO behavior.',
        why:
          'This is one of the biggest practical reasons modern transformer stacks can handle longer sequences without memory blowing up first.',
        interview:
          'The line to use is: <em>Flash Attention is exact attention with tiled IO; it avoids materializing the full attention matrix in HBM.</em>',
        details: [
          'The key win is memory traffic, not a new modeling trick. It changes what sequence lengths are feasible on real hardware.',
          'Flash Attention 2 improves parallelism and reduces non-matmul overhead further, but the core intuition is still IO-aware tiling.',
        ],
        math: {
          title: 'Exact objective, better memory',
          formula: [
            '\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\!\\left(\\frac{QK^T}{\\sqrt{d}}\\right)V',
            '\\text{memory}_{std} = \\mathcal{O}(n^2), \\qquad \\text{memory}_{flash} = \\mathcal{O}(nd)',
          ],
          note: 'The first line is unchanged. Flash Attention keeps the same attention result, but avoids storing the quadratic score matrix explicitly.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'for q_block in blocks(Q):\n    running_max, running_sum = init_online_softmax()\n    for k_block, v_block in zip(blocks(K), blocks(V)):\n        update_online_softmax(q_block, k_block, v_block)\n\n# exact output, better IO locality',
        },
        quiz: {
          prompt: 'What makes Flash Attention faster in practice?',
          options: [
            {
              text: 'It avoids materializing the full attention matrix in slow memory and reuses fast on-chip tiles',
              correct: true,
              explanation: 'Exactly. The big win is IO efficiency, not changing the mathematical answer.',
            },
            {
              text: 'It replaces attention with a linear approximation',
              correct: false,
              explanation: 'Not in the original Flash Attention story. The result is exact attention.',
            },
            {
              text: 'It works by removing the softmax entirely',
              correct: false,
              explanation: 'Softmax is still there; it is just computed incrementally.',
            },
          ],
        },
        viz: 'flash-attention',
        controls: [
          { key: 'seqLen', label: 'Sequence length', min: 256, max: 4096, step: 64, value: 1536, format: 'integer' },
          { key: 'headDim', label: 'Head dimension', min: 32, max: 128, step: 4, value: 64, format: 'integer' },
        ],
        presets: [
          { label: 'Short context', values: { seqLen: 512, headDim: 64 } },
          { label: 'Long context', values: { seqLen: 2048, headDim: 64 } },
          { label: 'Very wide heads', values: { seqLen: 3072, headDim: 128 } },
        ],
      },
    ],
  },
  'transformers-rag': {
    navMeta: 'chapter 05 / transformers and retrieval',
    eyebrow: 'Transformers And RAG',
    title: 'Representation, context, and grounding are different jobs.',
    lede:
      'This chapter walks from raw text to grounded answers: how text becomes pieces, how pieces become vectors, how order gets injected, how context gets selected, how generation is sped up, and how retrieval adds external evidence.',
    bestFor: 'LLM interviews / modern systems refresh',
    studyMove: 'Treat each control as a tradeoff, not a magic quality knob',
    sections: [
      {
        id: 'tokenization',
        nav: 'Tokenization',
        label: 'Concept 01',
        title: 'Tokenization: subwords are a compromise between sequence length and vocabulary size',
        summary:
          'Tokenization is not just text splitting. It is a representation choice that trades off sequence length, vocabulary size, and flexibility on rare words.',
        what:
          'Character-level tokens keep the vocabulary tiny but make sequences long. Whole-word tokens shorten sequences but explode the vocabulary. <strong>Subword tokenization</strong> sits in the middle: it gives common patterns short codes while still composing rare words from smaller parts.',
        why:
          'This is why BPE and related tokenizers are so widely used in language models. They are practical compression schemes for text.',
        interview:
          'The compact line is: <em>subword tokenization is a compromise between vocabulary growth and sequence length.</em>',
        details: [
          'Frequent strings get merged into shorter tokens because they save sequence length the most often.',
          'Rare words remain representable because they can still be decomposed into smaller pieces.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'tokens = list(text)\nfor _ in range(num_merges):\n    pair = most_common_adjacent_pair(tokens)\n    tokens = merge_pair(tokens, pair)',
        },
        quiz: {
          prompt: 'Why are subwords usually preferred over pure word-level tokenization?',
          options: [
            {
              text: 'They shorten common words without requiring every rare word to be in the vocabulary',
              correct: true,
              explanation: 'Exactly. Subwords keep the vocabulary manageable while still compressing frequent patterns.',
            },
            {
              text: 'They always make sequences shorter than any alternative',
              correct: false,
              explanation: 'Not always. They are a compromise, not a guaranteed optimum in every case.',
            },
            {
              text: 'They eliminate the need for a vocabulary entirely',
              correct: false,
              explanation: 'No. They still rely on a learned vocabulary of subword pieces.',
            },
          ],
        },
        viz: 'tokenization',
        controls: [
          { key: 'merge', label: 'Subword merge level', min: 0.1, max: 0.95, step: 0.01, value: 0.58, format: 'percent' },
          { key: 'rarity', label: 'Rare-word pressure', min: 0.1, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
        ],
        presets: [
          { label: 'Character-heavy', values: { merge: 0.18, rarity: 0.52 } },
          { label: 'Balanced subwords', values: { merge: 0.58, rarity: 0.42 } },
          { label: 'Very coarse vocab', values: { merge: 0.86, rarity: 0.22 } },
        ],
      },
      {
        id: 'embeddings',
        nav: 'Embeddings',
        label: 'Concept 02',
        title: 'Embeddings: similar meaning becomes geometric closeness',
        summary:
          'Embeddings turn discrete tokens or chunks into vectors. Once you are in vector space, “similar” starts meaning “nearby.”',
        what:
          'The useful intuition is that an embedding is a <strong>coordinate in a semantic space</strong>. Nearby vectors should correspond to similar meaning, which is why similarity search, clustering, and retrieval all become possible after embedding.',
        why:
          'This idea powers semantic search, RAG retrieval, nearest-neighbor recommendation, and a lot of the intuition behind transformer internals.',
        interview:
          'The interview sentence is: <em>embeddings make meaning geometric, so retrieval can be done with distance rather than exact string match.</em>',
        details: [
          'Cosine similarity is popular because it cares about direction more than raw magnitude.',
          'Embedding systems still need good chunking and indexing; a beautiful vector is not enough if the retrieval unit is wrong.',
        ],
        math: {
          title: 'Similarity',
          formula: '\\operatorname{sim}(q, d) = \\frac{q \\cdot d}{\\lVert q \\rVert \\, \\lVert d \\rVert}',
          note: 'Cosine similarity asks whether two vectors point in a similar direction, which is often a decent proxy for semantic relatedness.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'query_vec = encoder(query)\ndoc_vecs = encoder(docs)\nscores = cosine_similarity(query_vec, doc_vecs)\nranked = sort_by_score(docs, scores)',
        },
        quiz: {
          prompt: 'Why do embeddings matter for semantic retrieval?',
          options: [
            {
              text: 'They let the system retrieve by meaning proximity instead of only exact keyword overlap',
              correct: true,
              explanation: 'Exactly. Embeddings turn retrieval into a geometric nearest-neighbor problem.',
            },
            {
              text: 'They guarantee exact factual correctness once two texts are close',
              correct: false,
              explanation: 'No. Similar vectors help retrieval, but correctness still depends on chunk content and model use of the retrieved text.',
            },
            {
              text: 'They remove the need for indexing or approximate search',
              correct: false,
              explanation: 'Large embedding stores still need indexing structures to stay fast.',
            },
          ],
        },
        viz: 'embeddings',
        controls: [
          { key: 'semantic', label: 'Semantic alignment', min: 0.15, max: 0.95, step: 0.01, value: 0.74, format: 'percent' },
          { key: 'noise', label: 'Lexical distraction', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
        ],
        presets: [
          { label: 'Noisy keywords', values: { semantic: 0.42, noise: 0.76 } },
          { label: 'Balanced retrieval', values: { semantic: 0.74, noise: 0.36 } },
          { label: 'Strong meaning match', values: { semantic: 0.9, noise: 0.14 } },
        ],
      },
      {
        id: 'positional',
        nav: 'Position',
        label: 'Concept 03',
        title: 'Positional encoding: attention needs order injected from outside',
        summary:
          'Attention compares tokens, but by itself it has no native notion of “before” or “after.” Position information is what turns a bag of tokens into an ordered sequence.',
        what:
          'Without position signals, the model sees the same tokens but not their arrangement. <strong>Positional encoding breaks that symmetry</strong> by giving each position a distinct signature, so order-sensitive meaning becomes recoverable.',
        why:
          'This is why “dog bites man” and “man bites dog” can lead to different internal states even though the token set is the same.',
        interview:
          'The compact answer is: <em>self-attention is permutation-invariant until positional information is added.</em>',
        details: [
          'Absolute position schemes tell the model where a token is. Relative schemes help the model reason about how far apart two tokens are.',
          'Long-context performance depends a lot on whether the chosen positional scheme extrapolates gracefully beyond the lengths seen in training.',
        ],
        math: {
          title: 'Injecting order',
          formula: [
            'x_i^{\\prime} = x_i + p_i',
            '\\text{RoPE instead rotates } q_i, k_i \\text{ by position-dependent angles}',
          ],
          note: 'The exact mechanism varies, but the shared goal is the same: the model must be able to tell where a token sits in the sequence.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'token_states = token_embeddings + positional_embeddings\n# or for RoPE: rotate q and k by position before attention',
        },
        quiz: {
          prompt: 'Why do transformers need positional information at all?',
          options: [
            {
              text: 'Because attention alone does not know token order',
              correct: true,
              explanation: 'Exactly. Position information is what lets the model distinguish different orderings of the same tokens.',
            },
            {
              text: 'Because token embeddings cannot represent word identity',
              correct: false,
              explanation: 'Token embeddings represent identity; the missing ingredient is order.',
            },
            {
              text: 'Because positional encodings replace attention on long sequences',
              correct: false,
              explanation: 'No. They complement attention rather than replacing it.',
            },
          ],
        },
        viz: 'positional',
        controls: [
          { key: 'distance', label: 'Token distance', min: 0.1, max: 0.95, step: 0.01, value: 0.44, format: 'percent' },
          { key: 'context', label: 'Long-context pressure', min: 0.1, max: 0.95, step: 0.01, value: 0.52, format: 'percent' },
        ],
        presets: [
          { label: 'Short local relation', values: { distance: 0.22, context: 0.24 } },
          { label: 'Balanced sequence', values: { distance: 0.44, context: 0.52 } },
          { label: 'Long-context stretch', values: { distance: 0.82, context: 0.88 } },
        ],
      },
      {
        id: 'attention',
        nav: 'Attention',
        label: 'Concept 04',
        title: 'Attention: the model decides which earlier tokens deserve context weight right now',
        summary:
          'Self-attention is a relevance mechanism. For the current token, it scores earlier tokens, normalizes those scores, and mixes information according to the resulting weights.',
        what:
          'The clean mental model is: <strong>attention is soft lookup</strong>. Instead of picking one previous token, the model gives a distribution of weights across many tokens and then forms a weighted combination of their information.',
        why:
          'This is what makes transformer context feel flexible. Different tokens can pull information from different places without passing through a fixed recurrent state.',
        interview:
          'The short line is: <em>attention turns similarity scores into a probability distribution over context.</em>',
        details: [
          'Queries ask what the current token needs. Keys describe what each earlier token offers. Values are the information that gets mixed once the weights are chosen.',
          'Softmax matters because it converts arbitrary scores into nonnegative weights that sum to one.',
        ],
        math: {
          title: 'Scaled dot-product attention',
          formula: '\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\!\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
          note: 'First score similarity, then normalize into weights, then mix the value vectors with those weights.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'scores = q @ K.T / math.sqrt(d_k)\nweights = softmax(scores)\ncontext = weights @ V',
        },
        quiz: {
          prompt: 'What does softmax contribute inside attention?',
          options: [
            {
              text: 'It turns raw relevance scores into weights that can be interpreted as a distribution over context',
              correct: true,
              explanation: 'Exactly. Softmax makes the weights comparable, nonnegative, and summing to one.',
            },
            {
              text: 'It forces the model to use only one previous token at a time',
              correct: false,
              explanation: 'No. Attention stays soft unless you deliberately make it extremely sharp.',
            },
            {
              text: 'It removes the need for queries and keys',
              correct: false,
              explanation: 'Queries and keys are what produce the scores that softmax then normalizes.',
            },
          ],
        },
        viz: 'attention',
        controls: [
          { key: 'match', label: 'Query-key match', min: 0.15, max: 0.95, step: 0.01, value: 0.72, format: 'percent' },
          { key: 'sharpness', label: 'Attention sharpness', min: 0.2, max: 1.6, step: 0.01, value: 0.86, format: 'decimal2' },
        ],
        presets: [
          { label: 'Diffuse context', values: { match: 0.42, sharpness: 0.44 } },
          { label: 'Balanced focus', values: { match: 0.72, sharpness: 0.86 } },
          { label: 'Single-token snap', values: { match: 0.88, sharpness: 1.42 } },
        ],
      },
      {
        id: 'kv-cache',
        nav: 'KV cache',
        label: 'Concept 05',
        title: 'KV cache: decoding gets faster by reusing past attention state',
        summary:
          'Autoregressive generation would be painfully wasteful if the model recomputed every previous key and value on every step. The KV cache exists to reuse what was already computed.',
        what:
          'During generation, the new token changes, but the old tokens do not. So the model stores their previously computed <strong>keys and values</strong> and reuses them. That turns repeated full recomputation into incremental extension.',
        why:
          'This is one of the most important practical ideas for inference. Without it, long generations become far more expensive than they need to be.',
        interview:
          'The concise line is: <em>KV cache trades memory for speed by storing past attention state so each new token only adds one new slice.</em>',
        details: [
          'The speed benefit grows with sequence length because recomputation becomes more and more redundant.',
          'The downside is memory pressure: long contexts and many layers create a large cache that must be kept around during decoding.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'k_t, v_t = project(new_token)\ncache_k.append(k_t)\ncache_v.append(v_t)\ncontext = attention(q_t, cache_k, cache_v)',
        },
        quiz: {
          prompt: 'What is the main purpose of the KV cache during generation?',
          options: [
            {
              text: 'Store previously computed keys and values so past tokens do not need to be recomputed every step',
              correct: true,
              explanation: 'Exactly. That is the main speed win during autoregressive decoding.',
            },
            {
              text: 'Reduce vocabulary size during inference',
              correct: false,
              explanation: 'No. The cache is about attention state reuse, not tokenization.',
            },
            {
              text: 'Eliminate the need for masking in decoder attention',
              correct: false,
              explanation: 'Masking is still needed to preserve causality.',
            },
          ],
        },
        viz: 'kv-cache',
        controls: [
          { key: 'tokens', label: 'Generated context', min: 0.1, max: 0.98, step: 0.01, value: 0.58, format: 'percent' },
          { key: 'layers', label: 'Model depth proxy', min: 0.1, max: 0.98, step: 0.01, value: 0.64, format: 'percent' },
        ],
        presets: [
          { label: 'Short reply', values: { tokens: 0.18, layers: 0.42 } },
          { label: 'Typical decode', values: { tokens: 0.58, layers: 0.64 } },
          { label: 'Long generation', values: { tokens: 0.9, layers: 0.82 } },
        ],
      },
      {
        id: 'rag',
        nav: 'RAG',
        label: 'Concept 06',
        title: 'RAG: retrieval gives generation a place to stand',
        summary:
          'A base model answers from its parameters. RAG adds a retrieval step so generation can lean on external evidence instead of guessing from memory alone.',
        what:
          'Retrieval-augmented generation has two stages: first retrieve relevant documents, then generate with that context in the prompt. The key idea is that <strong>grounding quality depends on retrieval quality</strong>; the generator cannot cite evidence it never received.',
        why:
          'This distinction matters in real systems because many “LLM failures” are actually retrieval failures, chunking failures, or context-selection failures.',
        interview:
          'The clean answer is: <em>RAG separates knowledge access from generation, so the model can ground answers on retrieved context instead of parameters alone.</em>',
        details: [
          'Strong generation with weak retrieval still hallucinates because the context is poor or missing.',
          'Good retrieval with a weak prompt or poor chunking can still underuse the evidence.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'docs = retriever.search(query)\nprompt = build_prompt(query, docs)\nanswer = llm.generate(prompt)',
        },
        quiz: {
          prompt: 'If RAG is failing, what is the most important first debugging split?',
          options: [
            {
              text: 'Ask whether retrieval is weak or whether generation is underusing good context',
              correct: true,
              explanation: 'Yes. That split prevents you from blaming the LLM for a retrieval pipeline problem.',
            },
            {
              text: 'Assume the base model needs immediate fine-tuning',
              correct: false,
              explanation: 'Fine-tuning may help later, but the first split is retrieval quality versus context usage.',
            },
            {
              text: 'Ignore chunking and embeddings because generation dominates quality',
              correct: false,
              explanation: 'Chunking and retrieval quality are often the main bottlenecks.',
            },
          ],
        },
        viz: 'rag',
        controls: [
          { key: 'retrieval', label: 'Retrieval quality', min: 0.1, max: 0.98, step: 0.01, value: 0.68, format: 'percent' },
          { key: 'contextUse', label: 'Context usage by generator', min: 0.1, max: 0.98, step: 0.01, value: 0.72, format: 'percent' },
        ],
        presets: [
          { label: 'Weak retrieval', values: { retrieval: 0.32, contextUse: 0.84 } },
          { label: 'Balanced pipeline', values: { retrieval: 0.68, contextUse: 0.72 } },
          { label: 'Context ignored', values: { retrieval: 0.86, contextUse: 0.34 } },
        ],
      },
    ],
  },
  metrics: {
    navMeta: 'chapter 06 / metrics and calibration',
    eyebrow: 'Metrics And Calibration',
    title: 'A model score is only useful if you know how to read it.',
    lede:
      'This chapter is about evaluation choices that people casually name-drop but often explain badly: threshold metrics, calibration, and ranking quality. The goal is to make metric selection feel tied to the product question, not to a memorized acronym.',
    bestFor: 'Interview prep / evaluation refresh',
    studyMove: 'Ask what decision the metric is supposed to support',
    sections: [
      {
        id: 'thresholds',
        nav: 'Thresholds',
        label: 'Concept 01',
        title: 'Precision, recall, and F1: moving the threshold changes what kind of mistake you tolerate',
        summary:
          'Most binary classifiers output a score, not a yes/no decision. Precision and recall depend on where you cut that score into positive versus negative.',
        what:
          'Lowering the threshold catches more true positives, which raises <strong>recall</strong>, but it also admits more false positives, which can hurt <strong>precision</strong>. Raising the threshold does the opposite. The metric question is really a decision question: which mistake is more expensive here?',
        why:
          'This is one of the fastest ways to sound grounded in interviews. Good answers tie the metric to the application rather than treating F1 as a universal default.',
        interview:
          'The concise line is: <em>precision and recall are threshold-dependent, so the right threshold depends on the cost of false positives versus false negatives.</em>',
        details: [
          'Class prevalence matters a lot. The same score distribution can feel very different in a rare-event setting because false positives arrive from a much larger negative population.',
          'F1 is useful when precision and recall both matter, but it still hides the underlying tradeoff.',
        ],
        math: {
          title: 'Threshold metrics',
          formula: [
            '\\operatorname{Precision} = \\frac{TP}{TP + FP}',
            '\\operatorname{Recall} = \\frac{TP}{TP + FN}',
            'F_1 = 2\\frac{\\operatorname{Precision}\\cdot\\operatorname{Recall}}{\\operatorname{Precision}+\\operatorname{Recall}}',
          ],
          note: 'These are not inherent properties of the model alone. They change when the decision threshold changes.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'pred = scores >= threshold\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nf1 = 2 * precision * recall / (precision + recall)',
        },
        quiz: {
          prompt: 'What usually happens when you lower a classification threshold?',
          options: [
            {
              text: 'Recall tends to rise because more cases are labeled positive',
              correct: true,
              explanation: 'Exactly. Lower thresholds are more permissive, so they catch more positives at the cost of extra false positives.',
            },
            {
              text: 'Precision must rise because the model is more confident',
              correct: false,
              explanation: 'No. Lowering the threshold usually reduces precision because more negatives get swept in.',
            },
            {
              text: 'Threshold changes do not affect metrics if the ranking is fixed',
              correct: false,
              explanation: 'Ranking may stay fixed, but threshold metrics still change because the yes/no cutoff moves.',
            },
          ],
        },
        viz: 'threshold-metrics',
        controls: [
          { key: 'threshold', label: 'Decision threshold', min: 0.1, max: 0.95, step: 0.01, value: 0.58, format: 'percent' },
          { key: 'prevalence', label: 'Positive prevalence', min: 0.02, max: 0.6, step: 0.01, value: 0.16, format: 'percent' },
        ],
        presets: [
          { label: 'Screening / high recall', values: { threshold: 0.32, prevalence: 0.08 } },
          { label: 'Balanced cutoff', values: { threshold: 0.58, prevalence: 0.16 } },
          { label: 'Strict precision', values: { threshold: 0.82, prevalence: 0.22 } },
        ],
      },
      {
        id: 'calibration',
        nav: 'Calibration',
        label: 'Concept 02',
        title: 'Calibration: a 70% score should mean something like 70% in the real world',
        summary:
          'Ranking tells you who looks more risky. Calibration tells you whether the number itself can be trusted as a probability.',
        what:
          'A calibrated model does not just sort examples well. It also makes confidence estimates that match reality. If the model says 70% on many cases, then roughly 70% of those cases should actually be positive.',
        why:
          'This matters whenever scores drive thresholds, triage, pricing, policy, or anything else where the numeric probability itself is consumed by a downstream decision.',
        interview:
          'The reusable sentence is: <em>a model can rank well and still be badly calibrated.</em>',
        details: [
          'Calibration matters a lot in medicine, fraud, ads, and any system where the score is treated as a probability rather than only an ordering.',
          'Platt scaling, isotonic regression, and temperature scaling are common post-hoc fixes when the raw model is overconfident or underconfident.',
        ],
        math: {
          title: 'Calibration error',
          formula: [
            '\\operatorname{ECE} = \\sum_{b=1}^{B} \\frac{n_b}{n} \\left|\\operatorname{acc}(b) - \\operatorname{conf}(b)\\right|',
          ],
          note: 'Expected calibration error compares predicted confidence with realized accuracy across confidence bins.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'for bucket in confidence_bins:\n    acc = bucket.correct.mean()\n    conf = bucket.confidence.mean()\n    ece += len(bucket) / n * abs(acc - conf)',
        },
        quiz: {
          prompt: 'What is the clearest sign of an overconfident model?',
          options: [
            {
              text: 'Its predicted confidence is systematically higher than the observed accuracy',
              correct: true,
              explanation: 'Exactly. Overconfidence means the model talks bigger than it performs.',
            },
            {
              text: 'Its ROC-AUC is below random chance',
              correct: false,
              explanation: 'That would indicate a ranking problem, not specifically calibration.',
            },
            {
              text: 'It always predicts the positive class',
              correct: false,
              explanation: 'That would be a degenerate classifier, but calibration is about confidence versus reality.',
            },
          ],
        },
        viz: 'calibration',
        controls: [
          { key: 'drift', label: 'Confidence drift', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
          { key: 'sharpness', label: 'Score sharpness', min: 0.1, max: 0.95, step: 0.01, value: 0.62, format: 'percent' },
        ],
        presets: [
          { label: 'Underconfident', values: { drift: 0.18, sharpness: 0.44 } },
          { label: 'Mostly calibrated', values: { drift: 0.36, sharpness: 0.62 } },
          { label: 'Overconfident', values: { drift: 0.82, sharpness: 0.84 } },
        ],
      },
      {
        id: 'ranking-metrics',
        nav: 'Ranking',
        label: 'Concept 03',
        title: 'Ranking metrics: the order of the top results matters more than the tail',
        summary:
          'Search and recommendation often care less about perfect labels everywhere and more about whether the most relevant items rise to the top positions users actually see.',
        what:
          'A ranking metric rewards useful ordering. Putting the best item in position 1 is more valuable than hiding it at position 10, and pushing irrelevant items down is often more important than classifying every item globally.',
        why:
          'This is why search, feeds, and recommenders use metrics like NDCG or MRR instead of pretending the task is just standard binary classification.',
        interview:
          'The crisp line is: <em>ranking metrics care about where relevant items land, not just whether they were predicted as positive somewhere.</em>',
        details: [
          'NDCG discounts lower positions, so it reflects the reality that users care more about the top of the list.',
          'MRR is especially natural when one highly relevant answer should appear as early as possible, such as QA or retrieval.',
        ],
        math: {
          title: 'Position-aware quality',
          formula: [
            'DCG@k = \\sum_{i=1}^{k} \\frac{2^{rel_i}-1}{\\log_2(i+1)}',
            'NDCG@k = \\frac{DCG@k}{IDCG@k}',
          ],
          note: 'The gain is discounted by position, so the same relevant item is worth less when it appears lower in the ranking.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'dcg = sum((2**rel - 1) / math.log2(i + 2) for i, rel in enumerate(ranked[:k]))\nndcg = dcg / ideal_dcg',
        },
        quiz: {
          prompt: 'Why is NDCG often better than plain accuracy for ranking systems?',
          options: [
            {
              text: 'Because it rewards putting highly relevant items near the top where users actually look',
              correct: true,
              explanation: 'Right. Ranking metrics are position-aware, which is what many product surfaces need.',
            },
            {
              text: 'Because it eliminates the need for relevance labels',
              correct: false,
              explanation: 'No. You still need relevance judgments to compute NDCG.',
            },
            {
              text: 'Because it is always easier to optimize than classification loss',
              correct: false,
              explanation: 'Not necessarily. It is useful because it matches the task better, not because it is simpler.',
            },
          ],
        },
        viz: 'ranking-metrics',
        controls: [
          { key: 'topQuality', label: 'Top-rank quality', min: 0.1, max: 0.95, step: 0.01, value: 0.68, format: 'percent' },
          { key: 'tailNoise', label: 'Tail noise', min: 0.05, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
        ],
        presets: [
          { label: 'Good top, noisy tail', values: { topQuality: 0.82, tailNoise: 0.74 } },
          { label: 'Balanced ranking', values: { topQuality: 0.68, tailNoise: 0.42 } },
          { label: 'Misses the top', values: { topQuality: 0.28, tailNoise: 0.38 } },
        ],
      },
    ],
  },
  systems: {
    navMeta: 'chapter 08 / retrieval and systems',
    eyebrow: 'Retrieval And Systems',
    title: 'Recommendation and search become simpler once you separate stages.',
    lede:
      'A lot of system-design confusion disappears once you stop asking one model to do every job. Retrieval and serving pipelines work because each stage has a narrower task and a different objective.',
    bestFor: 'Recommendation interviews / ML system design refresh',
    studyMove: 'Look at the funnel first, then ask which stage can still recover from the mistake',
    sections: [
      {
        id: 'retrieval-funnel',
        nav: 'Retrieval funnel',
        label: 'Concept 01',
        title: 'Retrieval versus ranking: if recall is bad early, later stages cannot save you',
        summary:
          'Recommendation pipelines are funnels. Retrieval finds a manageable candidate set, and ranking spends more compute choosing the final few items.',
        what:
          'The retrieval stage is optimized for <strong>coverage and speed</strong>. The ranking stage is optimized for <strong>precision and ordering</strong>. If the relevant item never makes it into the candidate set, the ranker never gets a chance.',
        why:
          'People often talk as if “the model” recommends an item. In practice, different models do different parts of the job, and the earliest mistakes are often the hardest to recover from.',
        interview:
          'The compact interview answer is: <em>retrieval protects recall, ranking spends compute on precision.</em>',
        details: [
          'Two-tower models are popular for retrieval because they make nearest-neighbor search cheap at serving time.',
          'Cross-encoders and heavier rankers are valuable later because the candidate list is already much smaller.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'candidates = retriever(query, k=500)\nscored = [ranker(query, item) for item in candidates]\nresults = sort_by_score(scored)[:10]',
        },
        quiz: {
          prompt: 'If retrieval misses a relevant item, what can the ranker do later?',
          options: [
            {
              text: 'Nothing, because ranking only sees the shortlist it was given',
              correct: true,
              explanation: 'Right. Ranking cannot rescue candidates that were filtered out upstream.',
            },
            {
              text: 'Recover it by rescanning the whole corpus during ranking',
              correct: false,
              explanation: 'That would turn ranking into retrieval and usually break the latency budget.',
            },
            {
              text: 'Fix it automatically as long as ranking precision is high',
              correct: false,
              explanation: 'High precision only helps within the candidate set that survived retrieval.',
            },
          ],
        },
        viz: 'retrieval-funnel',
        controls: [
          { key: 'candidates', label: 'Retrieved candidates', min: 150, max: 1200, step: 10, value: 420, format: 'integer' },
          { key: 'recall', label: 'Retrieval recall', min: 0.35, max: 0.99, step: 0.01, value: 0.78, format: 'percent' },
          { key: 'precision', label: 'Ranking precision', min: 0.35, max: 0.98, step: 0.01, value: 0.72, format: 'percent' },
        ],
        presets: [
          { label: 'Weak retrieval', values: { candidates: 220, recall: 0.48, precision: 0.84 } },
          { label: 'Balanced pipeline', values: { candidates: 420, recall: 0.78, precision: 0.72 } },
          { label: 'High recall', values: { candidates: 900, recall: 0.93, precision: 0.65 } },
        ],
      },
      {
        id: 'cold-start',
        nav: 'Cold start',
        label: 'Concept 02',
        title: 'Cold start: when history is missing, content has to carry the recommendation',
        summary:
          'Collaborative filtering is powerful because it uses behavior. Cold start happens precisely when that behavior is not available yet.',
        what:
          'For new users or items, there is not enough interaction history to learn from neighbors or embeddings. That means the system leans more heavily on <strong>content features</strong>, metadata, and simple heuristics until enough behavior arrives.',
        why:
          'This explains why even sophisticated recommender systems still depend on metadata quality, onboarding signals, and fallback logic.',
        interview:
          'The key sentence is: <em>cold start is not a bug in collaborative filtering; it is the regime where collaborative evidence literally does not exist yet.</em>',
        details: [
          'Hybrid systems matter because they let content and collaborative signals trade responsibility over time.',
          'Cold-start strategy often shapes the first-user experience more than the ranking model does.',
        ],
        math: {
          title: 'Hybrid blend',
          formula: '\\text{score} = \\alpha \\, \\text{collaborative} + (1-\\alpha) \\, \\text{content}',
          note: 'When behavior history is weak, α should shrink so content features carry more of the decision.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'if user_history < warm_threshold:\n    score = 0.25 * collaborative + 0.75 * content\nelse:\n    score = 0.75 * collaborative + 0.25 * content',
        },
        quiz: {
          prompt: 'What is the defining problem in cold start?',
          options: [
            {
              text: 'The system lacks enough interaction history to trust collaborative signals',
              correct: true,
              explanation: 'Yes. Cold start is about missing behavior, not missing model sophistication.',
            },
            {
              text: 'The ranker is always too slow in production',
              correct: false,
              explanation: 'Latency can matter, but that is not what defines cold start.',
            },
            {
              text: 'Content features stop working when a user is new',
              correct: false,
              explanation: 'Content features are often the fallback that saves the system during cold start.',
            },
          ],
        },
        viz: 'cold-start',
        controls: [
          { key: 'history', label: 'Behavior history', min: 0.0, max: 1.0, step: 0.01, value: 0.28, format: 'percent' },
          { key: 'content', label: 'Content quality', min: 0.2, max: 1.0, step: 0.01, value: 0.76, format: 'percent' },
        ],
        presets: [
          { label: 'New user', values: { history: 0.08, content: 0.74 } },
          { label: 'Warm user', values: { history: 0.74, content: 0.66 } },
          { label: 'Great metadata', values: { history: 0.18, content: 0.94 } },
        ],
      },
    ],
  },
  generative: {
    navMeta: 'chapter 12 / generation and decision-making',
    eyebrow: 'Generation And Decision-Making',
    title: 'Sampling and action selection are easier to read once you see the tradeoff.',
    lede:
      'Generative models and reinforcement learning can feel distant from each other, but they share a common pattern: the system repeatedly chooses between noisy possibilities and better-structured ones.',
    bestFor: 'Modern ML refresh / high-level intuition before deeper math',
    studyMove: 'Use the presets, then move one knob and say what changes before you read the takeaway',
    sections: [
      {
        id: 'diffusion',
        nav: 'Diffusion',
        label: 'Concept 01',
        title: 'Diffusion: generation as progressive denoising',
        summary:
          'A diffusion model learns how to reverse a process that gradually adds noise. Generation starts from noise and repeatedly denoises toward structure.',
        what:
          'Instead of producing the sample in one shot, diffusion walks from a noisy state toward a cleaner one. Each step removes a bit of uncertainty, and enough good steps can turn random noise into a coherent output.',
        why:
          'This mental model makes diffusion far less mystical. The model is not “imagining” from nowhere. It is repeatedly correcting a noisy sample toward something more plausible.',
        interview:
          'The compact explanation is: <em>diffusion generation is iterative denoising guided by a learned reverse process.</em>',
        details: [
          'Classifier-free guidance changes how strongly the denoising process is pulled toward a condition or prompt.',
          'Latent diffusion makes the process cheaper by denoising in a compressed latent space instead of raw pixels.',
        ],
        math: {
          title: 'Reverse step intuition',
          formula: 'x_{t-1} = \\operatorname{denoise}(x_t, \\text{condition})',
          note: 'Each step removes some noise and moves the sample toward a more structured region of the data distribution.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'x = sample_gaussian_noise()\nfor t in reversed(range(T)):\n    eps_hat = model(x, t, prompt)\n    x = denoise_step(x, eps_hat, t)',
        },
        quiz: {
          prompt: 'Why do diffusion models generate in many steps instead of one shot?',
          options: [
            {
              text: 'Because they learn to reverse a noisy process gradually, step by step',
              correct: true,
              explanation: 'Exactly. The model is trained as a reverse denoiser, not as a one-pass direct generator.',
            },
            {
              text: 'Because the prompt is unknown until the last step',
              correct: false,
              explanation: 'No. Conditioning is available throughout the denoising path.',
            },
            {
              text: 'Because diffusion models cannot represent structure early on',
              correct: false,
              explanation: 'They can represent partial structure; the point is that structure sharpens progressively.',
            },
          ],
        },
        viz: 'diffusion',
        controls: [
          { key: 'noise', label: 'Starting noise', min: 0.15, max: 0.95, step: 0.01, value: 0.62, format: 'percent' },
          { key: 'steps', label: 'Denoising steps', min: 3, max: 20, step: 1, value: 11, format: 'integer' },
        ],
        presets: [
          { label: 'Few steps', values: { noise: 0.62, steps: 4 } },
          { label: 'Balanced', values: { noise: 0.62, steps: 11 } },
          { label: 'Heavy cleanup', values: { noise: 0.84, steps: 18 } },
        ],
      },
      {
        id: 'bandit',
        nav: 'Explore vs exploit',
        label: 'Concept 02',
        title: 'Exploration versus exploitation: you need some curiosity, but not forever',
        summary:
          'A bandit problem captures a recurring RL tension: should you choose the option that already looks best, or spend some effort testing alternatives in case they are better?',
        what:
          'Exploitation means choosing the arm that currently seems strongest. Exploration means deliberately trying other arms to reduce uncertainty. Good policies use exploration as a tool for learning, not as a permanent habit.',
        why:
          'This is one of the simplest ways to build RL intuition. Many larger RL systems are still balancing these same incentives, just in more complicated state spaces.',
        interview:
          'The useful sentence is: <em>exploration buys information; exploitation cashes in what you already know.</em>',
        details: [
          'If the reward gap is obvious, excessive exploration mostly burns reward.',
          'If the gap is subtle or uncertain, too little exploration can lock the system into a mediocre option.',
        ],
        math: {
          title: 'Epsilon-greedy rule',
          formula: [
            'a = \\begin{cases}\\text{random action} & \\text{with probability } \\varepsilon \\\\ \\arg\\max_a \\, Q(a) & \\text{otherwise}\\end{cases}',
          ],
          note: 'Exploration buys information; exploitation spends the information you already trust.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'if random.random() < epsilon:\n    action = random_arm()\nelse:\n    action = argmax(estimated_values)',
        },
        quiz: {
          prompt: 'When is under-exploration most dangerous?',
          options: [
            {
              text: 'When the system is still uncertain and could get stuck exploiting a mediocre option too early',
              correct: true,
              explanation: 'Right. Too little exploration can lock in the wrong winner before the evidence is reliable.',
            },
            {
              text: 'When the reward gap is huge and obvious',
              correct: false,
              explanation: 'In that case, heavy exploration is usually the bigger waste.',
            },
            {
              text: 'Only after the policy has fully converged',
              correct: false,
              explanation: 'The real danger is early, while uncertainty is still high.',
            },
          ],
        },
        viz: 'bandit',
        controls: [
          { key: 'epsilon', label: 'Exploration rate', min: 0.01, max: 0.5, step: 0.01, value: 0.12, format: 'percent' },
          { key: 'gap', label: 'Reward gap', min: 0.04, max: 0.32, step: 0.01, value: 0.16, format: 'decimal2' },
        ],
        presets: [
          { label: 'Under-exploring', values: { epsilon: 0.03, gap: 0.06 } },
          { label: 'Balanced', values: { epsilon: 0.12, gap: 0.16 } },
          { label: 'Over-exploring', values: { epsilon: 0.38, gap: 0.22 } },
        ],
      },
    ],
  },
  recommendation: {
    navMeta: 'chapter 07 / recommendation depth',
    eyebrow: 'Recommendation Depth',
    title: 'Modern recommenders work because different signals take turns carrying the job.',
    lede:
      'This chapter moves past the basic funnel and into the ideas that repeatedly show up in real recommender interviews: shared latent space, efficient retrieval, and ranking losses that reflect user order rather than binary classification alone.',
    bestFor: 'Recommendation interviews / product ML refresh',
    studyMove: 'Ask what signal is doing the heavy lifting in each stage',
    sections: [
      {
        id: 'matrix-factorization',
        nav: 'Matrix factorization',
        label: 'Concept 01',
        title: 'Matrix factorization: users and items live in the same preference space',
        summary:
          'The classic recommender intuition is that users and items can both be embedded into one latent space where compatibility becomes a dot product.',
        what:
          'Instead of memorizing every user-item interaction separately, matrix factorization learns a low-dimensional representation for each user and each item. The closer their vectors align, the stronger the predicted preference.',
        why:
          'This is the bridge from classical collaborative filtering to modern embedding-based retrieval systems.',
        interview:
          'The crisp line is: <em>matrix factorization replaces the sparse interaction table with user and item vectors whose dot product predicts affinity.</em>',
        details: [
          'The latent dimensions are not hand-labeled features. They are learned axes of taste or utility.',
          'Cold start remains hard because new users or items do not yet have enough behavior to place them reliably in the space.',
        ],
        math: {
          title: 'Latent score',
          formula: '\\hat{r}_{ui} = p_u^T q_i',
          note: 'The prediction is a dot product between the user vector and the item vector in a shared embedding space.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'user_vec = user_table[user_id]\nitem_vec = item_table[item_id]\nscore = user_vec @ item_vec',
        },
        quiz: {
          prompt: 'What is the key idea behind matrix factorization?',
          options: [
            { text: 'Users and items are both embedded into a shared latent space', correct: true, explanation: 'Exactly. Compatibility becomes geometric alignment in that shared space.' },
            { text: 'Every user gets a separate classifier for each item', correct: false, explanation: 'No. The point is to avoid memorizing every pair independently.' },
            { text: 'It works only with content features and no behavior history', correct: false, explanation: 'It is a collaborative filtering idea, so behavior is central.' },
          ],
        },
        viz: 'matrix-factorization',
        controls: [
          { key: 'alignment', label: 'User-item alignment', min: 0.1, max: 0.95, step: 0.01, value: 0.72, format: 'percent' },
          { key: 'sparsity', label: 'Interaction sparsity', min: 0.1, max: 0.95, step: 0.01, value: 0.46, format: 'percent' },
        ],
        presets: [
          { label: 'Sparse history', values: { alignment: 0.56, sparsity: 0.82 } },
          { label: 'Healthy fit', values: { alignment: 0.72, sparsity: 0.46 } },
          { label: 'Strong match', values: { alignment: 0.9, sparsity: 0.24 } },
        ],
      },
      {
        id: 'two-tower',
        nav: 'Two-tower',
        label: 'Concept 02',
        title: 'Two-tower retrieval: push query and item understanding apart so serving can be fast',
        summary:
          'Two-tower models let you precompute item embeddings offline and only encode the query or user at request time, which makes nearest-neighbor retrieval practical.',
        what:
          'One tower encodes the user or query, and the other tower encodes the item. Because the item representation is independent, you can precompute and index it, then retrieve by similarity at serving time.',
        why:
          'This is the standard retrieval story in recommendation and semantic search because it balances representation learning with latency constraints.',
        interview:
          'The memorable line is: <em>two-tower models buy serving speed by making the item side precomputable.</em>',
        details: [
          'The tradeoff is that you lose some interaction richness compared with a cross-encoder that scores the pair jointly.',
          'That is why two-tower often handles retrieval while a more expensive model handles ranking later.',
        ],
        math: {
          title: 'Retrieval score',
          formula: '\\operatorname{score}(u, i) = f_{user}(u)^T f_{item}(i)',
          note: 'The serving advantage comes from precomputing the item tower and indexing those vectors.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'user_vec = user_tower(user_features)\nitem_vecs = ann_index.search(user_vec, k=200)\nresults = rerank(user_vec, item_vecs)',
        },
        quiz: {
          prompt: 'Why are two-tower models so useful for retrieval?',
          options: [
            { text: 'Because item embeddings can be computed offline and indexed for fast nearest-neighbor search', correct: true, explanation: 'Right. That is the serving win that makes the architecture popular.' },
            { text: 'Because they always outperform cross-encoders on final ranking quality', correct: false, explanation: 'No. Cross-encoders are often stronger rankers precisely because they see the pair jointly.' },
            { text: 'Because they eliminate the need for a second-stage ranker', correct: false, explanation: 'In practice they are often the first stage, not the whole system.' },
          ],
        },
        viz: 'two-tower',
        controls: [
          { key: 'latency', label: 'Serving latency budget', min: 0.1, max: 0.95, step: 0.01, value: 0.68, format: 'percent' },
          { key: 'interaction', label: 'Cross-feature richness', min: 0.1, max: 0.95, step: 0.01, value: 0.52, format: 'percent' },
        ],
        presets: [
          { label: 'Fast retrieval', values: { latency: 0.86, interaction: 0.34 } },
          { label: 'Balanced stack', values: { latency: 0.68, interaction: 0.52 } },
          { label: 'Heavy reranking need', values: { latency: 0.24, interaction: 0.86 } },
        ],
      },
      {
        id: 'rank-objectives',
        nav: 'Ranking loss',
        label: 'Concept 03',
        title: 'Ranking objectives: pairwise and listwise losses care about order, not just labels',
        summary:
          'Feeds and search results are ordered experiences, so the training objective often has to reflect relative order rather than only yes/no labels.',
        what:
          'Pointwise losses treat each example independently. Pairwise losses ask which of two items should rank higher. Listwise losses consider the whole ordered slate and better match what users actually experience.',
        why:
          'This is why ranking teams do not stop at logistic loss. The metric and the training objective both need to reflect order sensitivity.',
        interview:
          'The concise answer is: <em>pairwise and listwise ranking losses are about relative ordering, which is usually closer to the product surface than plain classification.</em>',
        details: [
          'Pairwise losses are often an easier conceptual upgrade from classification.',
          'Listwise losses align better with top-of-list metrics but are more complex to implement and optimize.',
        ],
        math: {
          title: 'Pairwise preference',
          formula: '\\mathcal{L}_{pair} = -\\log \\sigma(s^+ - s^-)',
          note: 'The loss is low when the preferred item scores above the non-preferred item by a healthy margin.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'margin = pos_score - neg_score\nloss = -torch.log(torch.sigmoid(margin))',
        },
        quiz: {
          prompt: 'Why is a pairwise loss often better than plain classification loss for ranking?',
          options: [
            { text: 'Because it directly teaches the model which item should rank above another', correct: true, explanation: 'Exactly. It trains relative ordering rather than independent labels.' },
            { text: 'Because it removes the need for relevance judgments', correct: false, explanation: 'No. You still need preference or relevance information to define the pairs.' },
            { text: 'Because it guarantees perfect NDCG', correct: false, explanation: 'No loss guarantees that. It is simply a better fit to the ordering problem.' },
          ],
        },
        viz: 'ranking-metrics',
        controls: [
          { key: 'topQuality', label: 'Top-rank quality', min: 0.1, max: 0.95, step: 0.01, value: 0.7, format: 'percent' },
          { key: 'tailNoise', label: 'Tail noise', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
        ],
        presets: [
          { label: 'Weak ordering', values: { topQuality: 0.24, tailNoise: 0.42 } },
          { label: 'Balanced ranking', values: { topQuality: 0.7, tailNoise: 0.36 } },
          { label: 'Great top slate', values: { topQuality: 0.88, tailNoise: 0.66 } },
        ],
      },
    ],
  },
  classical: {
    navMeta: 'chapter 02 / classical ml and statistics',
    eyebrow: 'Classical ML And Stats',
    title: 'A lot of ML questions are really statistics questions in disguise.',
    lede:
      'This chapter is the compact statistical spine of the project: likelihood versus prior, fitting versus generalization, and why shrinkage often helps more than it feels like it should.',
    bestFor: 'Core interview prep / fundamentals refresh',
    studyMove: 'Translate each visualization into a sentence about uncertainty or generalization',
    sections: [
      {
        id: 'mle-map',
        nav: 'MLE vs MAP',
        label: 'Concept 01',
        title: 'MLE versus MAP: data fit alone versus data fit plus prior belief',
        summary:
          'Maximum likelihood picks the parameter that best explains the data. MAP adds a prior, so the chosen parameter balances the data with what was plausible beforehand.',
        what:
          'If likelihood asks “what parameter best fits this dataset?”, MAP asks “what parameter is most plausible after combining the data with a prior belief?” Small datasets feel the prior strongly; large datasets eventually overwhelm it.',
        why:
          'This connects Bayesian intuition to regularization and helps explain why priors matter most when data is scarce or noisy.',
        interview:
          'The short line is: <em>MAP is MLE plus a prior, so it shrinks the estimate toward what you considered plausible before seeing the data.</em>',
        details: [
          'A Gaussian prior over weights often corresponds to L2-style shrinkage.',
          'When data is abundant, the likelihood usually dominates and MLE and MAP become closer.',
        ],
        math: {
          title: 'Posterior objective',
          formula: [
            '\\hat{\\theta}_{MLE} = \\arg\\max_\\theta p(D \\mid \\theta)',
            '\\hat{\\theta}_{MAP} = \\arg\\max_\\theta p(D \\mid \\theta) p(\\theta)',
          ],
          note: 'MAP adds the prior term, which nudges the estimate toward parameters you already considered more plausible.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'mle_obj = log_likelihood(theta, data)\nmap_obj = log_likelihood(theta, data) + log_prior(theta)',
        },
        quiz: {
          prompt: 'When does the prior usually matter most in MAP?',
          options: [
            { text: 'When the dataset is small or noisy, so the likelihood is not overwhelmingly decisive', correct: true, explanation: 'Exactly. Priors matter most when the data alone is not yet dominant.' },
            { text: 'When you already have infinite data', correct: false, explanation: 'With huge data, the likelihood typically dominates the posterior.' },
            { text: 'Only when the likelihood is convex', correct: false, explanation: 'Convexity is not the key issue here.' },
          ],
        },
        viz: 'mle-map',
        controls: [
          { key: 'samples', label: 'Dataset strength', min: 0.1, max: 0.95, step: 0.01, value: 0.38, format: 'percent' },
          { key: 'prior', label: 'Prior strength', min: 0.05, max: 0.95, step: 0.01, value: 0.52, format: 'percent' },
        ],
        presets: [
          { label: 'Weak data', values: { samples: 0.18, prior: 0.72 } },
          { label: 'Balanced evidence', values: { samples: 0.38, prior: 0.52 } },
          { label: 'Strong data', values: { samples: 0.86, prior: 0.18 } },
        ],
      },
      {
        id: 'bias-variance',
        nav: 'Bias-variance',
        label: 'Concept 02',
        title: 'Bias versus variance: simple models miss structure, flexible models chase noise',
        summary:
          'The generalization problem is often about balancing underfitting and overfitting rather than maximizing training fit blindly.',
        what:
          'High-bias models are too rigid and miss real structure. High-variance models are too sensitive and memorize noise. Good model capacity usually lives in the middle, where the model captures signal without reacting wildly to every fluctuation.',
        why:
          'This is still one of the clearest mental models for feature engineering, model capacity, regularization, and cross-validation.',
        interview:
          'The memorable line is: <em>training error usually falls with complexity, but test error is U-shaped because variance eventually catches up.</em>',
        details: [
          'Cross-validation is one way to estimate where that generalization sweet spot sits.',
          'Regularization, early stopping, and better data are all attempts to manage variance without giving up too much fit.',
        ],
        math: {
          title: 'Error decomposition',
          formula: '\\mathbb{E}[(y-\\hat{f}(x))^2] = \\operatorname{Bias}^2 + \\operatorname{Variance} + \\text{noise}',
          note: 'The exact decomposition depends on the setup, but the central idea is that total error includes both underfitting and instability.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'for complexity in grid:\n    train_err = fit_and_score(train, complexity)\n    val_err = fit_and_score(val, complexity)',
        },
        quiz: {
          prompt: 'What usually happens as model complexity keeps increasing?',
          options: [
            { text: 'Training error falls, but validation/test error can eventually rise because variance grows', correct: true, explanation: 'Right. That is the classic overfitting pattern.' },
            { text: 'Bias and variance both always decrease together', correct: false, explanation: 'No. The tradeoff exists precisely because reducing bias can increase variance.' },
            { text: 'Generalization always improves as long as training loss improves', correct: false, explanation: 'That is exactly what the bias-variance story warns against.' },
          ],
        },
        viz: 'bias-variance',
        controls: [
          { key: 'complexity', label: 'Model complexity', min: 0.1, max: 0.95, step: 0.01, value: 0.52, format: 'percent' },
          { key: 'noise', label: 'Data noise', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
        ],
        presets: [
          { label: 'Underfit', values: { complexity: 0.14, noise: 0.24 } },
          { label: 'Generalization sweet spot', values: { complexity: 0.52, noise: 0.36 } },
          { label: 'Overfit', values: { complexity: 0.9, noise: 0.64 } },
        ],
      },
      {
        id: 'regularization',
        nav: 'Regularization',
        label: 'Concept 03',
        title: 'Regularization: sometimes the best fit is too fragile to trust',
        summary:
          'Regularization deliberately penalizes complexity so the model prefers simpler, stabler solutions instead of chasing every wiggle in the data.',
        what:
          'Without regularization, a flexible model may exploit accidental quirks of the training set. Regularization adds pressure toward smaller weights or simpler solutions, which can hurt training fit a little while helping unseen data.',
        why:
          'This connects directly to MAP estimation, weight decay, dropout intuition, and why “best training loss” is not the same as “best model.”',
        interview:
          'The compact answer is: <em>regularization accepts a little more bias in exchange for less variance.</em>',
        details: [
          'L1 encourages sparsity. L2 encourages shrinkage without hard zeroing.',
          'Early stopping often behaves like an implicit regularizer because it prevents late-stage overfitting.',
        ],
        math: {
          title: 'Penalized objective',
          formula: [
            '\\mathcal{L}_{L2} = \\mathcal{L}_{data} + \\lambda \\lVert w \\rVert_2^2',
            '\\mathcal{L}_{L1} = \\mathcal{L}_{data} + \\lambda \\lVert w \\rVert_1',
          ],
          note: 'The penalty changes what counts as an attractive solution, not just how you optimize it.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'loss = data_loss + lam * (weights ** 2).sum()\nloss.backward()',
        },
        quiz: {
          prompt: 'Why can regularization improve test performance even if it worsens training loss?',
          options: [
            { text: 'Because a slightly worse fit can generalize better if it is less sensitive to noise', correct: true, explanation: 'Exactly. That is the bias-variance tradeoff in action.' },
            { text: 'Because regularization secretly improves the labels', correct: false, explanation: 'No. It changes the learned solution, not the data labels.' },
            { text: 'Because test sets are always easier than training sets', correct: false, explanation: 'Definitely not.' },
          ],
        },
        viz: 'regularization',
        controls: [
          { key: 'lambda', label: 'Regularization strength', min: 0.05, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
          { key: 'capacity', label: 'Model flexibility', min: 0.1, max: 0.95, step: 0.01, value: 0.72, format: 'percent' },
        ],
        presets: [
          { label: 'Too loose', values: { lambda: 0.12, capacity: 0.88 } },
          { label: 'Balanced shrinkage', values: { lambda: 0.42, capacity: 0.72 } },
          { label: 'Too strong', values: { lambda: 0.86, capacity: 0.42 } },
        ],
      },
    ],
  },
  production: {
    navMeta: 'chapter 09 / production ml systems',
    eyebrow: 'Production ML Systems',
    title: 'Good offline models still fail when the surrounding system lies to them.',
    lede:
      'These are the production questions that keep surfacing in serious interviews: whether train and serve really match, whether offline metrics predict product outcomes, and whether the world has drifted away from the data you trained on.',
    bestFor: 'System design / senior ML interviews',
    studyMove: 'Ask where the system can silently look healthy while actually being broken',
    sections: [
      {
        id: 'serving-skew',
        nav: 'Training-serving skew',
        label: 'Concept 01',
        title: 'Training-serving skew: the model is right for training data and wrong for production data',
        summary:
          'A model can be perfectly fine while the pipeline around it feeds different features online than it saw offline.',
        what:
          'Training-serving skew happens when the feature logic, freshness, preprocessing, or joins differ between offline training and online serving. The result is a model deployed into a feature distribution it was never actually trained to handle.',
        why:
          'This is one of the most common production ML failure modes because the model artifact gets blamed for a data-pipeline mismatch.',
        interview:
          'The short answer is: <em>training-serving skew is a system bug where offline and online feature definitions diverge.</em>',
        details: [
          'Feature stores exist partly to reduce this risk by sharing the same feature definitions across training and serving.',
          'Skew often arrives through time leakage, stale joins, different null handling, or subtle preprocessing mismatches.',
        ],
        math: {
          title: 'Distribution mismatch',
          formula: 'p_{train}(x) \\neq p_{serve}(x)',
          note: 'The model is optimized for one input distribution and deployed on another.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'train_features = offline_transform(raw_events)\nserve_features = online_transform(request)\nassert schema(train_features) == schema(serve_features)',
        },
        quiz: {
          prompt: 'What is the core problem in training-serving skew?',
          options: [
            { text: 'The online features do not actually match the offline features the model learned from', correct: true, explanation: 'Exactly. That mismatch is the heart of the issue.' },
            { text: 'The training set is always too small', correct: false, explanation: 'Small data can hurt, but skew is specifically about mismatch, not sample size.' },
            { text: 'The model is too deep to deploy', correct: false, explanation: 'Depth is unrelated to the definition of skew.' },
          ],
        },
        viz: 'serving-skew',
        controls: [
          { key: 'mismatch', label: 'Feature mismatch', min: 0.05, max: 0.95, step: 0.01, value: 0.34, format: 'percent' },
          { key: 'freshness', label: 'Freshness gap', min: 0.05, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
        ],
        presets: [
          { label: 'Healthy parity', values: { mismatch: 0.12, freshness: 0.18 } },
          { label: 'Sneaky skew', values: { mismatch: 0.34, freshness: 0.42 } },
          { label: 'Pipeline broken', values: { mismatch: 0.82, freshness: 0.74 } },
        ],
      },
      {
        id: 'online-offline',
        nav: 'Online vs offline',
        label: 'Concept 02',
        title: 'Offline metrics and online wins are related, but not identical',
        summary:
          'An offline metric helps you choose promising models, but the product only really cares whether the change improves live behavior.',
        what:
          'Offline evaluation is cheaper, faster, and safer. Online evaluation is closer to the real objective. A healthy ML system uses offline metrics to narrow the search and online testing to confirm actual product value.',
        why:
          'This is a classic interview topic because it shows whether you understand the difference between model quality and business impact.',
        interview:
          'The compact line is: <em>offline metrics are a proxy; online experiments decide whether the product actually got better.</em>',
        details: [
          'A model can improve offline relevance while hurting CTR because latency, novelty, position bias, or feedback loops changed the live experience.',
          'That is why teams often gate launches with both offline minimums and online experiment results.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'if offline_ndcg > baseline and latency < budget:\n    ship_to_ab_test(candidate_model)',
        },
        quiz: {
          prompt: 'Why can an offline-improved model still fail online?',
          options: [
            { text: 'Because the offline metric is only a proxy and may miss live product effects', correct: true, explanation: 'Right. Online behavior includes factors the offline metric may not capture well.' },
            { text: 'Because online tests ignore users entirely', correct: false, explanation: 'They are literally about users.' },
            { text: 'Because offline metrics are never useful', correct: false, explanation: 'They are very useful, just not the whole story.' },
          ],
        },
        viz: 'online-offline',
        controls: [
          { key: 'proxy', label: 'Offline metric gain', min: 0.05, max: 0.95, step: 0.01, value: 0.58, format: 'percent' },
          { key: 'friction', label: 'Live product friction', min: 0.05, max: 0.95, step: 0.01, value: 0.32, format: 'percent' },
        ],
        presets: [
          { label: 'Proxy agrees', values: { proxy: 0.66, friction: 0.18 } },
          { label: 'Mixed reality', values: { proxy: 0.58, friction: 0.32 } },
          { label: 'Offline fooled us', values: { proxy: 0.84, friction: 0.86 } },
        ],
      },
      {
        id: 'drift',
        nav: 'Drift',
        label: 'Concept 03',
        title: 'Drift monitoring: the world changed, so the model’s old assumptions quietly expire',
        summary:
          'Even if your pipeline is correct, live data can move. Monitoring is what tells you the model is now solving yesterday’s problem.',
        what:
          'Drift can happen in inputs, label rates, behavior, or downstream outcomes. The model may still run perfectly, but the relationship it learned is no longer the relationship the world is producing.',
        why:
          'This is why good production systems monitor both model outputs and the data feeding those outputs.',
        interview:
          'The useful line is: <em>drift means the environment changed, not necessarily that the code broke.</em>',
        details: [
          'Population drift changes the input distribution. Concept drift changes the relationship between input and target.',
          'Alerting on raw feature drift alone is not enough; you also want business and model-health indicators.',
        ],
        math: {
          title: 'Distribution drift',
          formula: 'p_t(x, y) \\neq p_{t+1}(x, y)',
          note: 'The data-generating process has moved, so yesterday’s fit can become stale.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'psi = population_stability_index(train_feature, live_feature)\nif psi > alert_threshold:\n    page_team()',
        },
        quiz: {
          prompt: 'What is the main idea behind drift monitoring?',
          options: [
            { text: 'Detect that live data or outcomes have shifted away from what the model was trained on', correct: true, explanation: 'Exactly. Drift monitoring is about the environment moving under the model.' },
            { text: 'Guarantee that the model will never need retraining', correct: false, explanation: 'If anything, it helps tell you when retraining may be needed.' },
            { text: 'Replace online metrics entirely', correct: false, explanation: 'No. Drift monitoring complements, not replaces, business and model metrics.' },
          ],
        },
        viz: 'data-drift',
        controls: [
          { key: 'shift', label: 'Population shift', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
          { key: 'concept', label: 'Concept change', min: 0.05, max: 0.95, step: 0.01, value: 0.28, format: 'percent' },
        ],
        presets: [
          { label: 'Stable live data', values: { shift: 0.12, concept: 0.08 } },
          { label: 'Mild drift', values: { shift: 0.36, concept: 0.28 } },
          { label: 'Model stale', values: { shift: 0.78, concept: 0.66 } },
        ],
      },
    ],
  },
  gbdt: {
    navMeta: 'chapter 10 / gbdts and tabular learning',
    eyebrow: 'GBDTs And Tabular ML',
    title: 'Tabular models win by making many small, useful corrections.',
    lede:
      'Gradient-boosted trees are still one of the highest-value topics for practical ML interviews because they dominate so many structured-data problems. This chapter keeps the focus on splits, residual correction, and why boosting feels different from deep learning.',
    bestFor: 'Tabular ML interviews / practical modeling refresh',
    studyMove: 'Watch what each new tree is correcting rather than thinking about one huge model',
    sections: [
      {
        id: 'tree-split',
        nav: 'Tree split',
        label: 'Concept 01',
        title: 'Tree splits: a good split makes the child nodes more pure than the parent',
        summary:
          'Decision trees work by partitioning the space so that each child node has a clearer label pattern than the mixed parent node.',
        what:
          'A split is useful when it separates the examples into groups that behave differently. The tree is not trying to fit a smooth function everywhere at once; it is carving the space into simpler local regions.',
        why:
          'This is the core intuition behind trees, GBDTs, random forests, and a lot of feature interaction reasoning on tabular data.',
        interview:
          'The compact line is: <em>a tree split is valuable when it reduces impurity by making the child groups more homogeneous.</em>',
        details: [
          'For classification, common impurity measures are Gini and entropy. For regression, the analogue is usually variance reduction.',
          'Because trees split recursively, they naturally model nonlinear interactions without requiring manual feature crosses.',
        ],
        math: {
          title: 'Impurity reduction',
          formula: '\\Delta I = I(parent) - \\sum_c \\frac{n_c}{n} I(child_c)',
          note: 'A split is attractive when the weighted child impurity is substantially lower than the parent impurity.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'best_gain = -inf\nfor feature, threshold in candidates:\n    gain = impurity(parent) - weighted_child_impurity(left, right)',
        },
        quiz: {
          prompt: 'What makes a split good in a decision tree?',
          options: [
            { text: 'It creates child nodes that are more homogeneous than the parent', correct: true, explanation: 'Exactly. The whole point is to reduce impurity.' },
            { text: 'It always uses the feature with the largest raw value', correct: false, explanation: 'No. Split quality depends on how well the partition separates outcomes.' },
            { text: 'It maximizes the number of leaves immediately', correct: false, explanation: 'More leaves are not automatically better.' },
          ],
        },
        viz: 'tree-split',
        controls: [
          { key: 'separation', label: 'Feature separation', min: 0.1, max: 0.95, step: 0.01, value: 0.62, format: 'percent' },
          { key: 'noise', label: 'Label noise', min: 0.05, max: 0.95, step: 0.01, value: 0.28, format: 'percent' },
        ],
        presets: [
          { label: 'Messy split', values: { separation: 0.24, noise: 0.72 } },
          { label: 'Useful split', values: { separation: 0.62, noise: 0.28 } },
          { label: 'Very clean split', values: { separation: 0.9, noise: 0.12 } },
        ],
      },
      {
        id: 'boosting',
        nav: 'Boosting',
        label: 'Concept 02',
        title: 'Boosting: each new tree is trying to fix the residual mistakes of the current ensemble',
        summary:
          'Gradient boosting does not build one giant tree. It builds many small trees, where each new one is trained to correct what the current ensemble still gets wrong.',
        what:
          'The ensemble starts simple and then keeps adding weak learners that target the remaining error. The model improves stage by stage rather than all at once.',
        why:
          'This is the idea that makes XGBoost, LightGBM, and CatBoost so effective on tabular data.',
        interview:
          'The memorable line is: <em>gradient boosting is stagewise residual correction.</em>',
        details: [
          'Learning rate matters because it controls how aggressively each new tree changes the ensemble.',
          'Shallow trees often work surprisingly well because the power comes from many small corrections, not one huge tree.',
        ],
        math: {
          title: 'Additive update',
          formula: 'F_m(x) = F_{m-1}(x) + \\eta h_m(x)',
          note: 'Each new weak learner is added to the ensemble with a controlled step size η.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'residual = y - model.predict(X)\ntree = fit_tree(X, residual)\nmodel += lr * tree',
        },
        quiz: {
          prompt: 'What is each new tree doing in gradient boosting?',
          options: [
            { text: 'Trying to reduce the residual error left by the current ensemble', correct: true, explanation: 'Exactly. That is the stagewise correction idea.' },
            { text: 'Replacing all earlier trees with a better one', correct: false, explanation: 'No. Boosting adds weak learners; it does not throw the earlier ones away.' },
            { text: 'Randomly re-partitioning the data to increase diversity', correct: false, explanation: 'That sounds more like bagging intuition than boosting.' },
          ],
        },
        viz: 'boosting',
        controls: [
          { key: 'rounds', label: 'Boosting rounds', min: 0.1, max: 0.95, step: 0.01, value: 0.58, format: 'percent' },
          { key: 'rate', label: 'Learning rate', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
        ],
        presets: [
          { label: 'Too timid', values: { rounds: 0.42, rate: 0.14 } },
          { label: 'Balanced ensemble', values: { rounds: 0.58, rate: 0.36 } },
          { label: 'Aggressive fit', values: { rounds: 0.88, rate: 0.74 } },
        ],
      },
    ],
  },
  'data-features': {
    navMeta: 'chapter 11 / data and features',
    eyebrow: 'Data And Features',
    title: 'Many bad models are really bad datasets with good branding.',
    lede:
      'This chapter is about the practical, often unglamorous failure modes that make feature work so important: leakage, missingness, and shifts between the data you imagined and the data the system actually sees.',
    bestFor: 'Applied ML interviews / feature engineering refresh',
    studyMove: 'Ask whether the feature is truly available and trustworthy at prediction time',
    sections: [
      {
        id: 'leakage',
        nav: 'Leakage',
        label: 'Concept 01',
        title: 'Leakage: the model secretly sees information that would not exist at prediction time',
        summary:
          'Leakage creates models that look brilliant offline because they are cheating with future or target-adjacent information.',
        what:
          'A feature is leaky when it contains information that would not be available at the moment you truly need the prediction. The model then appears to perform well, but only because evaluation let it peek ahead.',
        why:
          'Leakage is one of the fastest ways to build a useless model that still looks excellent on paper.',
        interview:
          'The sentence to remember is: <em>a leaky feature makes offline evaluation overly optimistic because it encodes future information or target proxies.</em>',
        details: [
          'Time-based leakage is especially common when joins or aggregations accidentally use future events.',
          'Leakage can hide in innocent-looking features like status fields, post-event labels, or features computed after the outcome is already partly known.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'assert feature_timestamp <= prediction_timestamp\n# otherwise the feature may be leaking future information',
        },
        quiz: {
          prompt: 'What makes a feature leaky?',
          options: [
            { text: 'It contains information that would only be known after the prediction should have been made', correct: true, explanation: 'Exactly. Leakage is about unavailable-at-inference information sneaking into training or evaluation.' },
            { text: 'It has many missing values', correct: false, explanation: 'Missingness can be a separate issue, but it does not define leakage.' },
            { text: 'It is weakly correlated with the target', correct: false, explanation: 'Leakage is about invalid information timing, not correlation strength.' },
          ],
        },
        viz: 'feature-leakage',
        controls: [
          { key: 'future', label: 'Future info leakage', min: 0.05, max: 0.95, step: 0.01, value: 0.34, format: 'percent' },
          { key: 'proxy', label: 'Target proxy strength', min: 0.05, max: 0.95, step: 0.01, value: 0.58, format: 'percent' },
        ],
        presets: [
          { label: 'Clean feature set', values: { future: 0.08, proxy: 0.16 } },
          { label: 'Suspicious uplift', values: { future: 0.34, proxy: 0.58 } },
          { label: 'Obvious leakage', values: { future: 0.88, proxy: 0.82 } },
        ],
      },
      {
        id: 'feature-shift',
        nav: 'Shift & missingness',
        label: 'Concept 02',
        title: 'Feature shift and missingness: the same schema can hide a different world',
        summary:
          'Features can keep the same column names while their meaning, frequency, or missingness pattern changes underneath you.',
        what:
          'Distribution shift is not always dramatic. Sometimes the same feature quietly arrives with a new range, a different missingness pattern, or a new user population. That is enough to make a model brittle.',
        why:
          'This is why feature monitoring matters even when the serving pipeline is technically healthy.',
        interview:
          'The useful line is: <em>schema stability is not the same as distribution stability.</em>',
        details: [
          'Missingness itself can carry signal, but it can also indicate upstream breakage.',
          'Shift becomes especially dangerous when the model relied heavily on the drifting feature during training.',
        ],
        math: {
          title: 'Feature distribution change',
          formula: 'p_{train}(x_j) \\neq p_{live}(x_j)',
          note: 'The column name can be identical while the feature distribution and meaning drift underneath it.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'missing_rate = live[col].isna().mean()\nmean_shift = live[col].mean() - train[col].mean()',
        },
        quiz: {
          prompt: 'Why is a stable schema not enough to trust a live feature?',
          options: [
            { text: 'Because the distribution or missingness pattern may have changed even if the column name did not', correct: true, explanation: 'Right. A valid column can still represent a different world than before.' },
            { text: 'Because schemas are never useful in production', correct: false, explanation: 'Schemas are useful, just not sufficient.' },
            { text: 'Because all missing values imply leakage', correct: false, explanation: 'Missingness and leakage are different issues.' },
          ],
        },
        viz: 'feature-shift',
        controls: [
          { key: 'shift', label: 'Mean/range shift', min: 0.05, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
          { key: 'missing', label: 'Missingness change', min: 0.05, max: 0.95, step: 0.01, value: 0.28, format: 'percent' },
        ],
        presets: [
          { label: 'Stable live data', values: { shift: 0.1, missing: 0.08 } },
          { label: 'Noticeable drift', values: { shift: 0.42, missing: 0.28 } },
          { label: 'Broken upstream feed', values: { shift: 0.84, missing: 0.78 } },
        ],
      },
    ],
  },
  'alignment-depth': {
    navMeta: 'chapter 13 / generative and alignment depth',
    eyebrow: 'Alignment Depth',
    title: 'Good generation is not just about quality; it is about steering and not gaming the wrong objective.',
    lede:
      'This chapter goes beyond the first diffusion and bandit intuitions into the more modern alignment ideas: guidance strength, preference optimization, and the classic danger that a proxy reward drifts away from what humans actually wanted.',
    bestFor: 'LLM interviews / modern alignment refresh',
    studyMove: 'Separate the desired objective from the proxy the system is actually optimizing',
    sections: [
      {
        id: 'guidance',
        nav: 'Guidance',
        label: 'Concept 01',
        title: 'Classifier-free guidance: stronger steering can improve fidelity while hurting diversity',
        summary:
          'Guidance is a steering knob. Turning it up can make outputs follow the prompt more strongly, but too much guidance can make samples brittle or repetitive.',
        what:
          'Classifier-free guidance mixes an unconditional and conditional denoising signal. The bigger that guidance scale becomes, the harder the generation process is pushed toward the conditioning signal.',
        why:
          'This is the cleanest modern example of a quality-diversity tradeoff in generative modeling.',
        interview:
          'The compact answer is: <em>guidance strengthens prompt adherence, but too much guidance often hurts diversity and realism.</em>',
        details: [
          'This is why many diffusion systems tune guidance rather than always maxing it out.',
          'The same pattern shows up more broadly in generation: stronger steering often trades breadth for control.',
        ],
        math: {
          title: 'Guided denoising',
          formula: '\\hat{\\epsilon}_{guided} = \\hat{\\epsilon}_{uncond} + w(\\hat{\\epsilon}_{cond} - \\hat{\\epsilon}_{uncond})',
          note: 'The guidance scale w controls how strongly the conditional signal pulls the sample.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'eps = eps_uncond + scale * (eps_cond - eps_uncond)\nx = denoise_step(x, eps, t)',
        },
        quiz: {
          prompt: 'What usually happens when guidance is pushed too high?',
          options: [
            { text: 'Prompt adherence can improve, but diversity and realism often suffer', correct: true, explanation: 'Exactly. Stronger steering is not a free lunch.' },
            { text: 'The model stops using the prompt entirely', correct: false, explanation: 'Too much guidance overuses the prompt; it does not ignore it.' },
            { text: 'Sampling becomes mathematically exact', correct: false, explanation: 'No. Guidance changes the tradeoff, not the fundamental uncertainty.' },
          ],
        },
        viz: 'guidance',
        controls: [
          { key: 'guidance', label: 'Guidance scale', min: 0.05, max: 0.95, step: 0.01, value: 0.48, format: 'percent' },
          { key: 'noise', label: 'Prompt ambiguity', min: 0.05, max: 0.95, step: 0.01, value: 0.36, format: 'percent' },
        ],
        presets: [
          { label: 'Loose generation', values: { guidance: 0.16, noise: 0.42 } },
          { label: 'Balanced guidance', values: { guidance: 0.48, noise: 0.36 } },
          { label: 'Over-steered', values: { guidance: 0.88, noise: 0.62 } },
        ],
      },
      {
        id: 'dpo',
        nav: 'Preference optimization',
        label: 'Concept 02',
        title: 'Preference optimization: train the model to prefer chosen answers over rejected ones',
        summary:
          'Methods like DPO make alignment feel less magical: instead of maximizing an abstract reward directly, they push the policy toward responses humans preferred in pairwise comparisons.',
        what:
          'The system sees a prompt, a preferred answer, and a rejected answer. Training nudges the policy so the preferred answer becomes more likely relative to the rejected one.',
        why:
          'This is one of the most practical ways to explain modern preference tuning without diving straight into full RLHF mechanics.',
        interview:
          'The clear line is: <em>preference optimization learns from relative human choices, not just absolute labels.</em>',
        details: [
          'Pairwise preference data is often easier for humans to produce consistently than assigning absolute quality scores.',
          'The optimization is still only as good as the preference data and the objective you derive from it.',
        ],
        math: {
          title: 'Preference margin',
          formula: '\\log \\sigma\\big(\\beta[(\\log \\pi(y^+\\mid x) - \\log \\pi(y^-\\mid x)) - (\\log \\pi_{ref}(y^+\\mid x) - \\log \\pi_{ref}(y^-\\mid x))]\\big)',
          note: 'The point is not to memorize the whole expression. The important idea is: make preferred responses relatively more likely than rejected ones.',
        },
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'chosen = policy.logprob(prompt, y_pos)\nrejected = policy.logprob(prompt, y_neg)\nloss = -logsigmoid(beta * (chosen - rejected))',
        },
        quiz: {
          prompt: 'What signal is preference optimization using?',
          options: [
            { text: 'Relative preference between a chosen and a rejected answer', correct: true, explanation: 'Exactly. The core signal is pairwise preference.' },
            { text: 'Only next-token likelihood with no human feedback', correct: false, explanation: 'That would be standard supervised language modeling, not preference optimization.' },
            { text: 'A hard-coded rule list instead of data', correct: false, explanation: 'Rules can help elsewhere, but preference optimization learns from preference comparisons.' },
          ],
        },
        viz: 'dpo',
        controls: [
          { key: 'margin', label: 'Chosen-rejected gap', min: 0.05, max: 0.95, step: 0.01, value: 0.54, format: 'percent' },
          { key: 'beta', label: 'Optimization pressure', min: 0.05, max: 0.95, step: 0.01, value: 0.42, format: 'percent' },
        ],
        presets: [
          { label: 'Weak preference signal', values: { margin: 0.18, beta: 0.24 } },
          { label: 'Healthy preference push', values: { margin: 0.54, beta: 0.42 } },
          { label: 'Over-hard push', values: { margin: 0.86, beta: 0.82 } },
        ],
      },
      {
        id: 'reward-hacking',
        nav: 'Reward hacking',
        label: 'Concept 03',
        title: 'Reward hacking: optimizing the proxy too hard can move you away from the real objective',
        summary:
          'Alignment problems often come from the system maximizing a measurable proxy that only imperfectly reflects what humans really meant.',
        what:
          'The proxy reward is a stand-in for the real objective. If the stand-in is imperfect, aggressive optimization can exploit that gap and produce behavior that scores well while feeling wrong to humans.',
        why:
          'This is one of the most reusable alignment intuitions across RL, recommender systems, and LLM tuning.',
        interview:
          'The memorable sentence is: <em>when you optimize the proxy too hard, you often uncover the proxy’s blind spots instead of solving the real problem better.</em>',
        details: [
          'Goodhart’s law is the general warning: when a measure becomes a target, it stops being a good measure.',
          'The fix is usually not “optimize less forever” but to improve the objective, add checks, and monitor for proxy drift.',
        ],
        code: {
          title: 'Code sketch',
          lang: 'python',
          snippet:
            'for step in training:\n    policy = optimize(proxy_reward)\n    audit(policy, heldout_human_checks)',
        },
        quiz: {
          prompt: 'What is reward hacking really exploiting?',
          options: [
            { text: 'A gap between the proxy objective and the true human objective', correct: true, explanation: 'Exactly. The model is finding loopholes in the proxy.' },
            { text: 'A lack of compute during training', correct: false, explanation: 'Compute limits can matter, but that is not the definition of reward hacking.' },
            { text: 'An inability to generate fluent text', correct: false, explanation: 'Fluency is not the key issue here.' },
          ],
        },
        viz: 'reward-hacking',
        controls: [
          { key: 'pressure', label: 'Optimization pressure', min: 0.05, max: 0.95, step: 0.01, value: 0.56, format: 'percent' },
          { key: 'proxyGap', label: 'Proxy-objective gap', min: 0.05, max: 0.95, step: 0.01, value: 0.34, format: 'percent' },
        ],
        presets: [
          { label: 'Low-risk objective', values: { pressure: 0.28, proxyGap: 0.12 } },
          { label: 'Watch carefully', values: { pressure: 0.56, proxyGap: 0.34 } },
          { label: 'Proxy collapsing', values: { pressure: 0.88, proxyGap: 0.78 } },
        ],
      },
    ],
  },
};

const chapterGuides = {
  foundations: {
    route: 'Best first read if you want the interview fundamentals to become intuitive quickly.',
    prerequisites: 'None. This is the cleanest place to start.',
    next: [
      { href: './classical-ml-stats.html', label: 'Classical ML and stats' },
      { href: './deep-learning.html', label: 'Deep learning mechanics' },
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
    ],
    resources: [
      {
        kind: 'Video',
        title: "3Blue1Brown: Bayes' theorem",
        url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: 'StatQuest: Entropy',
        url: 'https://www.youtube.com/watch?v=YtebGVx-Fxw',
        source: 'StatQuest',
      },
      {
        kind: 'Video',
        title: 'StatQuest: Cross-Entropy',
        url: 'https://www.youtube.com/watch?v=6ArSys5qHAU',
        source: 'StatQuest',
      },
    ],
  },
  'neural-basics': {
    route: 'Best first stop if neural networks still feel like a bundle of terms instead of one coherent mechanism.',
    prerequisites: 'Foundations and a little algebra help, but this chapter is meant to be approachable on its own.',
    next: [
      { href: './deep-learning.html', label: 'Deep learning mechanics' },
      { href: './transformers-rag.html', label: 'Transformers and RAG' },
      { href: './classical-ml-stats.html', label: 'Classical ML and stats' },
    ],
    resources: [
      {
        kind: 'Video',
        title: '3Blue1Brown: But what is a neural network?',
        url: 'https://www.3blue1brown.com/lessons/neural-networks',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: '3Blue1Brown: Gradient descent, how neural networks learn',
        url: 'https://www.3blue1brown.com/lessons/gradient-descent',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: '3Blue1Brown: Backpropagation calculus',
        url: 'https://www.3blue1brown.com/lessons/backpropagation-calculus',
        source: '3Blue1Brown',
      },
      {
        kind: 'Notes',
        title: 'CS231n: Neural Networks Part 1',
        url: 'https://cs231n.github.io/neural-networks-1/',
        source: 'Stanford CS231n',
      },
      {
        kind: 'Notes',
        title: 'CS231n: Neural Networks Part 3',
        url: 'https://cs231n.github.io/neural-networks-3/',
        source: 'Stanford CS231n',
      },
      {
        kind: 'Article',
        title: 'Distill: Why Momentum Really Works',
        url: 'https://distill.pub/2017/momentum/',
        source: 'Distill',
      },
      {
        kind: 'Course',
        title: 'Andrej Karpathy: Neural Networks, Zero to Hero',
        url: 'https://karpathy.ai/zero-to-hero.html',
        source: 'Andrej Karpathy',
      },
    ],
  },
  'deep-learning': {
    route: 'Best for turning “training feels magical” into a small set of concrete stability levers.',
    prerequisites: 'Foundations first. Bayes and entropy are not required here, but comfort with gradients helps.',
    next: [
      { href: './transformers-rag.html', label: 'Transformers and RAG' },
      { href: './production-systems.html', label: 'Production systems' },
      { href: './alignment-depth.html', label: 'Alignment depth' },
    ],
    resources: [
      {
        kind: 'Video',
        title: '3Blue1Brown: Neural networks, chapters 1-4',
        url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: 'Andrej Karpathy: The spelled-out intro to neural networks and backpropagation',
        url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
        source: 'Andrej Karpathy',
      },
      {
        kind: 'Paper',
        title: 'Delving Deep into Rectifiers (He initialization)',
        url: 'https://arxiv.org/abs/1502.01852',
        source: 'Kaiming He et al.',
      },
      {
        kind: 'Paper',
        title: 'Deep Residual Learning for Image Recognition',
        url: 'https://arxiv.org/abs/1512.03385',
        source: 'ResNet',
      },
      {
        kind: 'Paper',
        title: 'FlashAttention: Fast and Memory-Efficient Exact Attention',
        url: 'https://arxiv.org/abs/2205.14135',
        source: 'Dao et al.',
      },
    ],
  },
  'transformers-rag': {
    route: 'Best for modern LLM system interviews where you need both architecture intuition and retrieval grounding.',
    prerequisites: 'Foundations plus the deep-learning chapter help a lot.',
    next: [
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
      { href: './production-systems.html', label: 'Production systems' },
      { href: './alignment-depth.html', label: 'Alignment depth' },
    ],
    resources: [
      {
        kind: 'Video',
        title: '3Blue1Brown: But what is a GPT?',
        url: 'https://www.youtube.com/watch?v=wjZofJX0v4M',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: '3Blue1Brown: Attention in transformers',
        url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
        source: '3Blue1Brown',
      },
      {
        kind: 'Video',
        title: 'Umar Jamil: LLaMA explained (KV cache, RoPE, RMSNorm, GQA)',
        url: 'https://www.youtube.com/watch?v=Mn_9W1nCFLo',
        source: 'Umar Jamil',
      },
      {
        kind: 'Paper',
        title: 'Attention Is All You Need',
        url: 'https://arxiv.org/abs/1706.03762',
        source: 'Vaswani et al.',
      },
      {
        kind: 'Paper',
        title: 'FlashAttention',
        url: 'https://arxiv.org/abs/2205.14135',
        source: 'Dao et al.',
      },
    ],
  },
  metrics: {
    route: 'Best for tightening the “what does success mean?” layer that interviews often use to separate strong answers from vague ones.',
    prerequisites: 'Foundations first. Recommendation and search readers should definitely keep this open nearby.',
    next: [
      { href: './recommendation-depth.html', label: 'Recommendation depth' },
      { href: './production-systems.html', label: 'Production systems' },
      { href: './data-features.html', label: 'Data and features' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'StatQuest: ROC and AUC, clearly explained',
        url: 'https://www.youtube.com/watch?v=4jRBRDbJemM',
        source: 'StatQuest',
      },
      {
        kind: 'Video',
        title: 'Victor Lavrenko: NDCG explained',
        url: 'https://www.youtube.com/watch?v=BvRMAgx0mvA',
        source: 'Victor Lavrenko',
      },
      {
        kind: 'Video',
        title: 'Ronny Kohavi: Trustworthy online controlled experiments',
        url: 'https://www.youtube.com/watch?v=ZfhQ-fIg4EU',
        source: 'Ronny Kohavi',
      },
      {
        kind: 'Paper',
        title: 'On Calibration of Modern Neural Networks',
        url: 'https://arxiv.org/abs/1706.04599',
        source: 'Guo et al.',
      },
    ],
  },
  recommendation: {
    route: 'Best for production recommendation and retrieval interviews where ranking, recall, and system staging all matter together.',
    prerequisites: 'Foundations and metrics help a lot. Deep learning is useful but not mandatory for the first pass.',
    next: [
      { href: './production-systems.html', label: 'Production systems' },
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
      { href: './transformers-rag.html', label: 'Transformers and retrieval' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'Google Research: Deep neural networks for YouTube recommendations',
        url: 'https://www.youtube.com/watch?v=7C11p47NW44',
        source: 'Google Research',
      },
      {
        kind: 'Video',
        title: 'Stanford CS246: Recommender systems',
        url: 'https://www.youtube.com/watch?v=1JRrCEgiyHM',
        source: 'Stanford CS246',
      },
      {
        kind: 'Video',
        title: 'James Le: Two-tower models for retrieval',
        url: 'https://www.youtube.com/watch?v=o-pZk5R0TZg',
        source: 'James Le',
      },
      {
        kind: 'Paper',
        title: 'Deep Neural Networks for YouTube Recommendations',
        url: 'https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/',
        source: 'Google Research',
      },
      {
        kind: 'Paper',
        title: 'BPR: Bayesian Personalized Ranking from Implicit Feedback',
        url: 'https://arxiv.org/abs/1205.2618',
        source: 'Rendle et al.',
      },
    ],
  },
  classical: {
    route: 'Best for the statistical backbone behind regularization, bias-variance, likelihood, and practical tabular modeling.',
    prerequisites: 'Foundations first.',
    next: [
      { href: './gbdt-tabular.html', label: 'GBDTs and tabular ML' },
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
      { href: './data-features.html', label: 'Data and features' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'StatQuest: Maximum likelihood',
        url: 'https://www.youtube.com/watch?v=XepXtl9YKwc',
        source: 'StatQuest',
      },
      {
        kind: 'Video',
        title: 'StatQuest: Bias and variance',
        url: 'https://www.youtube.com/watch?v=EuBBz3bI-aA',
        source: 'StatQuest',
      },
      {
        kind: 'Video',
        title: 'StatQuest: Regularization (Ridge / Lasso / ElasticNet)',
        url: 'https://www.youtube.com/watch?v=Q81RR3yKn30',
        source: 'StatQuest',
      },
    ],
  },
  production: {
    route: 'Best for IC5-style interview answers that need tradeoffs, latency budgets, and real failure modes instead of only model talk.',
    prerequisites: 'Recommendation or transformer readers benefit most once metrics are already comfortable.',
    next: [
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
      { href: './data-features.html', label: 'Data and features' },
      { href: './alignment-depth.html', label: 'Alignment depth' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'Chip Huyen: Designing ML systems',
        url: 'https://www.youtube.com/watch?v=RUIcLaXGGcU',
        source: 'Chip Huyen',
      },
      {
        kind: 'Video',
        title: 'Google: A/B testing at scale',
        url: 'https://www.youtube.com/watch?v=DUNk4GPZ9bw',
        source: 'Google',
      },
      {
        kind: 'Video',
        title: 'Meta: Feature store at scale',
        url: 'https://www.youtube.com/watch?v=ZxHo9WGn6KQ',
        source: 'Meta',
      },
      {
        kind: 'Book',
        title: 'Designing Machine Learning Systems',
        url: 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/',
        source: 'Chip Huyen',
      },
    ],
  },
  systems: {
    route: 'Best for multi-stage retrieval interviews where latency budgets and retrieval quality have to be reasoned about together.',
    prerequisites: 'Metrics help. Recommendation depth makes this chapter click faster.',
    next: [
      { href: './recommendation-depth.html', label: 'Recommendation depth' },
      { href: './production-systems.html', label: 'Production systems' },
      { href: './transformers-rag.html', label: 'Transformers and RAG' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'Stanford CS276: Information retrieval playlist',
        url: 'https://www.youtube.com/playlist?list=PLaZQkZp6WhWwoDuD6pQCmgVyDbUWl_ZUi',
        source: 'Stanford CS276',
      },
      {
        kind: 'Video',
        title: 'James Briggs: Dense Passage Retrieval explained',
        url: 'https://www.youtube.com/watch?v=DBsxUSUhfRg',
        source: 'James Briggs',
      },
      {
        kind: 'Video',
        title: 'James Briggs: ColBERT and late interaction',
        url: 'https://www.youtube.com/watch?v=xTzUn3G9YA0',
        source: 'James Briggs',
      },
    ],
  },
  generative: {
    route: 'Best for the first practical generation tradeoffs: sampling behavior, denoising, and exploration versus exploitation.',
    prerequisites: 'Foundations first. Transformer intuition helps but is not required.',
    next: [
      { href: './alignment-depth.html', label: 'Alignment depth' },
      { href: './transformers-rag.html', label: 'Transformers and RAG' },
      { href: './deep-learning.html', label: 'Deep learning mechanics' },
    ],
    resources: [
      {
        kind: 'Paper',
        title: 'Denoising Diffusion Probabilistic Models',
        url: 'https://arxiv.org/abs/2006.11239',
        source: 'Ho et al.',
      },
      {
        kind: 'Paper',
        title: 'Classifier-Free Diffusion Guidance',
        url: 'https://arxiv.org/abs/2207.12598',
        source: 'Ho and Salimans',
      },
      {
        kind: 'Book',
        title: 'Reinforcement Learning: An Introduction',
        url: 'http://incompleteideas.net/book/the-book-2nd.html',
        source: 'Sutton and Barto',
      },
    ],
  },
  gbdt: {
    route: 'Best for practical tabular interviews where trees still beat neural nets more often than people expect.',
    prerequisites: 'Classical ML first makes the bias-variance story much clearer here.',
    next: [
      { href: './classical-ml-stats.html', label: 'Classical ML and stats' },
      { href: './data-features.html', label: 'Data and features' },
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
    ],
    resources: [
      {
        kind: 'Video',
        title: 'StatQuest: XGBoost series',
        url: 'https://www.youtube.com/watch?v=OtD8wVaFm6E',
        source: 'StatQuest',
      },
      {
        kind: 'Paper',
        title: 'XGBoost: A Scalable Tree Boosting System',
        url: 'https://arxiv.org/abs/1603.02754',
        source: 'Chen and Guestrin',
      },
      {
        kind: 'Paper',
        title: 'LightGBM: A Highly Efficient Gradient Boosting Decision Tree',
        url: 'https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html',
        source: 'Ke et al.',
      },
    ],
  },
  'data-features': {
    route: 'Best for the part of ML that quietly ruins great models: feature quality, leakage, and serving-time drift.',
    prerequisites: 'Production systems pairs especially well with this chapter.',
    next: [
      { href: './production-systems.html', label: 'Production systems' },
      { href: './metrics-eval.html', label: 'Metrics and calibration' },
      { href: './gbdt-tabular.html', label: 'GBDTs and tabular ML' },
    ],
    resources: [
      {
        kind: 'Book',
        title: 'Designing Machine Learning Systems',
        url: 'https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/',
        source: 'Chip Huyen',
      },
      {
        kind: 'Paper',
        title: 'Hidden Technical Debt in Machine Learning Systems',
        url: 'https://research.google/pubs/hidden-technical-debt-in-machine-learning-systems/',
        source: 'Google Research',
      },
      {
        kind: 'Video',
        title: 'Meta: Feature Store at Scale',
        url: 'https://www.youtube.com/watch?v=ZxHo9WGn6KQ',
        source: 'Meta',
      },
    ],
  },
  'alignment-depth': {
    route: 'Best for modern post-training interviews where steering, preference learning, and reward misspecification all matter.',
    prerequisites: 'Transformers and generation first. This chapter is more useful once you already know how models generate.',
    next: [
      { href: './transformers-rag.html', label: 'Transformers and RAG' },
      { href: './generative-and-rl.html', label: 'Generation and RL' },
      { href: './production-systems.html', label: 'Production systems' },
    ],
    resources: [
      {
        kind: 'Paper',
        title: 'Direct Preference Optimization',
        url: 'https://arxiv.org/abs/2305.18290',
        source: 'Rafailov et al.',
      },
      {
        kind: 'Paper',
        title: 'Concrete Problems in AI Safety',
        url: 'https://arxiv.org/abs/1606.06565',
        source: 'Amodei et al.',
      },
      {
        kind: 'Paper',
        title: 'Fine-Tuning Language Models from Human Preferences',
        url: 'https://arxiv.org/abs/1909.08593',
        source: 'Ziegler et al.',
      },
    ],
  },
};

function clamp01(value) {
  return Math.max(0.0001, Math.min(0.9999, value));
}

function formatValue(value, format) {
  if (format === 'percent') return `${Math.round(value * 100)}%`;
  if (format === 'integer') return `${Math.round(value)}`;
  if (format === 'decimal2') return Number(value).toFixed(2);
  return `${value}`;
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(text) {
  return escapeHtml(text).replaceAll('"', '&quot;');
}

function renderMathLines(formula) {
  const lines = Array.isArray(formula) ? formula : [formula];
  return lines
    .map(
      (line) => `
        <div class="formula-line">
          <span class="math-render" data-math="${escapeAttribute(line)}">${escapeHtml(line)}</span>
        </div>
      `
    )
    .join('');
}

const formulaAnnotations = {
  bayes: [
    ['P(H \\mid E)', 'your updated belief after seeing the evidence', 'after a positive medical test, this is the actual chance the patient has the disease.'],
    ['P(E \\mid H)', 'how likely that evidence would be if the hypothesis were true', 'if someone really has the disease, how often does the test come back positive?'],
    ['P(H)', 'your starting belief before the new evidence', 'the disease might affect only 1% of the population before you run the test.'],
    ['P(E)', 'how often that evidence appears overall, across all cases', 'positive tests also come from false positives, so this is bigger than just the true-positive rate.'],
  ],
  entropy: [
    ['H(p)', 'the baseline uncertainty in the real outcome distribution', 'a 50/50 coin flip has higher entropy than a coin that lands heads 99% of the time.'],
    ['H(p, q)', 'the surprise you pay when the world follows p but your model predicts q', 'if spam is usually rare but your classifier is confidently wrong, cross-entropy rises.'],
    ['KL(p \\parallel q)', 'the extra cost caused purely by your model being mismatched to reality', 'if the true class probability is 0.7 and your model says 0.2, this mismatch penalty is large.'],
    ['p(x), q(x)', 'the real probability and the model’s guessed probability for outcome x', 'p(spam)=0.7 could be the data, while q(spam)=0.2 is what your model predicted.'],
  ],
  neuron: [
    ['x_1, x_2', 'the input features arriving at the neuron', 'For example: one input might represent the presence of a keyword and another the strength of a user signal.'],
    ['w_1, w_2', 'the weights that decide how strongly each input matters', 'A big positive weight means that input is strong evidence for firing; a negative weight means it pushes against firing.'],
    ['b', 'the bias that shifts the decision even before the inputs arrive', 'A positive bias can make the neuron activate more easily, like lowering a threshold.'],
    ['z', 'the pre-activation score before any nonlinearity', 'This is the raw weighted sum the neuron computes from its inputs and bias.'],
    ['\\phi(z)', 'the activation function applied to that score', 'If φ is ReLU, negative scores are clipped to zero; if it is sigmoid, the score is squeezed into a probability-like range.'],
  ],
  'output-functions': [
    ['z', 'the raw logit before it is turned into a probability', 'A logit of 0 means sigmoid will output 50%; a large positive logit means the model is very confident in the positive class.'],
    ['\\sigma(z)', 'the binary probability produced from one logit', 'In spam detection, this could be the model’s estimated probability that an email is spam.'],
    ['z_i', 'the raw score for class i in a multiclass problem', 'One class logit might correspond to cat, another to dog, and another to horse.'],
    ['\\operatorname{softmax}(z_i)', 'the probability assigned to class i after all class logits compete', 'If one class logit rises, the probabilities of the other classes fall even if their logits stay the same.'],
  ],
  'chain-rule': [
    ['\\frac{\\partial L}{\\partial \\hat{y}}', 'how sensitive the loss is to the current prediction', 'If the prediction is very wrong, this term is usually large.'],
    ['\\frac{\\partial \\hat{y}}{\\partial z}', 'how sensitive the prediction is to the neuron’s raw score', 'With sigmoid, this term becomes small in saturated regions near 0 or 1.'],
    ['\\frac{\\partial z}{\\partial w}', 'how sensitive the raw score is to the weight itself', 'For a simple neuron, this term is just the input value that flowed through that weight.'],
    ['\\frac{\\partial L}{\\partial w}', 'the final gradient for that weight', 'This tells you whether increasing the weight would increase or decrease the loss.'],
  ],
  backprop: [
    ['\\delta', 'the local error signal for the neuron', 'Think of δ as the blame that reaches this neuron after combining the prediction error with the activation derivative.'],
    ['\\hat{y} - y', 'the output error before local gating', 'If the model predicted 0.9 when the true label was 0.1, this term is large and positive.'],
    ['\\phi\\!\\,\\prime(z)', 'the local activation slope', 'If the neuron is saturated or inactive, this term can shrink the blame signal a lot.'],
    ['\\frac{\\partial L}{\\partial w_i}', 'the gradient for one specific weight', 'A weight connected to a large active input usually gets a larger update signal than one connected to a tiny input.'],
  ],
  'gradient-descent': [
    ['\\theta_t', 'the current parameters before the update', 'These are the weights you have right now.'],
    ['\\nabla L(\\theta_t)', 'the slope of the loss at the current parameters', 'It tells you which direction would make the loss increase fastest.'],
    ['\\eta', 'the step size or learning rate', 'A very small η creeps downhill; a very large η can jump past the valley.'],
    ['\\theta_{t+1}', 'the parameters after one update', 'These are the weights you get after taking one downhill step.'],
  ],
  optimizers: [
    ['g_t', 'the gradient observed at step t', 'This is the raw slope estimate coming from the current minibatch.'],
    ['v_t', 'a running velocity or smoothed direction', 'Momentum uses v_t to remember where recent gradients have been pointing.'],
    ['m_t', 'the running first-moment estimate in Adam', 'This is Adam’s smoothed direction term, similar in spirit to momentum.'],
    ['\\beta, \\beta_1, \\beta_2', 'memory parameters that control how much past gradients are remembered', 'Larger β values mean longer memory and smoother updates.'],
  ],
  'lr-schedule': [
    ['\\eta_0', 'the starting learning rate', 'This is the initial step size before any decay or cooling happens.'],
    ['\\gamma', 'the multiplicative drop used in step decay', 'If γ = 0.5, each scheduled drop halves the learning rate.'],
    ['s', 'the interval between step drops', 'For example: drop the learning rate every 10 epochs.'],
    ['T', 'the total training horizon used by the cosine schedule', 'Cosine uses the current position inside training to cool the learning rate smoothly over time.'],
  ],
  'learning-rate': [
    ['\\theta_t', 'the current parameter values before the update', 'the weights of your network right before the next optimizer step.'],
    ['\\eta', 'the step size multiplier', 'with a tiny η, loss improves slowly; with a huge η, training can bounce around and diverge.'],
    ['\\nabla L(\\theta_t)', 'the slope telling you which way increases or decreases loss', 'if validation loss is rising sharply in one direction, the gradient points away from it.'],
    ['\\theta_{t+1}', 'the new parameters after taking one gradient step', 'the weights after one SGD update on the current batch.'],
  ],
  initialization: [
    ['\\operatorname{Var}(W)', 'the variance of the randomly initialized weights'],
    ['fan_{in}', 'how many inputs feed into the layer'],
    ['fan_{out}', 'how many outputs the layer produces'],
    ['\\frac{2}{fan_{in}}', 'the He rule that keeps ReLU networks from shrinking too much'],
  ],
  'gradient-flow': [
    ['\\frac{\\partial L}{\\partial x_0}', 'how strongly the loss signal reaches an early layer'],
    ['\\prod_l \\frac{\\partial x_l}{\\partial x_{l-1}}', 'the chain of layer-by-layer derivative factors'],
    ['\\frac{\\partial L}{\\partial x_L}', 'the gradient signal coming from the final layer'],
  ],
  normalization: [
    ['\\mu', 'the mean being removed during centering'],
    ['\\sigma^2', 'the variance used to rescale activations'],
    ['\\gamma, \\beta', 'learned scale and shift parameters after normalization'],
    ['\\operatorname{RMS}(x)', 'the root-mean-square magnitude used by RMSNorm'],
  ],
  residuals: [
    ['x', 'the incoming representation before the block'],
    ['F(x)', 'the learned correction produced by the block'],
    ['y', 'the output after adding the skip path back in'],
    ['I', 'the identity path that keeps a direct gradient route alive'],
  ],
  'flash-attention': [
    ['QK^T', 'the pairwise attention score matrix before softmax'],
    ['n', 'sequence length, which causes the quadratic blow-up in naive attention'],
    ['d', 'head dimension, which matters for the linear-memory tiled version'],
    ['\\mathcal{O}(n^2)', 'quadratic memory growth from materializing the full score matrix'],
  ],
  tokenization: [
    ['\\text{sequence length cost}', 'the compute cost of processing more tokens'],
    ['\\text{vocabulary cost}', 'the memory and parameter cost of a larger token inventory'],
    ['\\text{subwords}', 'a compromise that keeps both costs manageable'],
  ],
  embeddings: [
    ['q', 'the query embedding vector'],
    ['d', 'a candidate document or item embedding'],
    ['q \\cdot d', 'their dot product before normalization'],
    ['\\lVert q \\rVert, \\lVert d \\rVert', 'the vector magnitudes used to normalize cosine similarity'],
  ],
  positional: [
    ['x_i', 'the token representation at position i before order is injected'],
    ['p_i', 'the positional signal added for position i'],
    ['x_i^{\\prime}', 'the representation after token meaning and position are combined'],
    ['q_i, k_i', 'query and key vectors whose relative orientation can encode position under RoPE'],
  ],
  attention: [
    ['Q', 'queries: what the current token is looking for', 'in “The animal didn’t cross the street because it was tired,” the token “it” is querying for the right referent.'],
    ['K', 'keys: what each context token offers for matching', 'earlier tokens like “animal” and “street” expose different keys for attention to compare against.'],
    ['V', 'values: the actual information carried forward once a token is attended to', 'if attention focuses on “animal,” its value vector is what gets blended into the current token state.'],
    ['\\frac{QK^T}{\\sqrt{d_k}}', 'the scaled relevance scores before softmax turns them into weights', 'if “it” matches “animal” much more than “street,” this score is highest for “animal.”'],
  ],
  'kv-cache': [
    ['t', 'the current decode step or sequence length so far'],
    ['O(1)', 'roughly constant new compute per layer for the fresh token'],
    ['\\text{cache reads}', 'the stored keys and values that are reused instead of recomputed'],
  ],
  rag: [
    ['\\text{retrieval quality}', 'how relevant and complete the fetched evidence is'],
    ['\\text{context use}', 'how well the generator actually leans on that evidence'],
    ['\\text{answer quality}', 'the final groundedness and usefulness of the response'],
  ],
  thresholds: [
    ['TP', 'true positives: real positives you caught', 'fraudulent transactions correctly flagged as fraud.'],
    ['FP', 'false positives: negatives you flagged by mistake', 'a legitimate purchase incorrectly blocked as fraud.'],
    ['FN', 'false negatives: positives you missed', 'an actual fraudulent charge that slipped through unflagged.'],
    ['F_1', 'one score that balances precision and recall', 'useful when missing fraud and falsely blocking users are both costly.'],
  ],
  calibration: [
    ['B', 'how many confidence buckets you split predictions into', '10 bins might group predictions into 0-10%, 10-20%, and so on.'],
    ['n_b', 'how many predictions landed in bucket b', 'maybe 800 predictions fell into the 70-80% confidence bucket.'],
    ['\\operatorname{acc}(b)', 'the actual fraction correct inside that bucket', 'of those 70-80% predictions, perhaps only 62% were truly correct.'],
    ['\\operatorname{conf}(b)', 'the average confidence the model assigned in that bucket', 'the model might have averaged 0.76 confidence for that same group.'],
  ],
  'ranking-metrics': [
    ['rel_i', 'the relevance of the result at position i'],
    ['DCG@k', 'discounted cumulative gain up to rank k'],
    ['IDCG@k', 'the best possible DCG if the results were perfectly ordered'],
    ['NDCG@k', 'DCG normalized by the ideal ordering'],
  ],
  'retrieval-funnel': [
    ['\\text{retrieval recall}', 'how many relevant candidates survive the early stage'],
    ['\\text{downstream precision}', 'how well the later ranker orders the surviving candidates'],
    ['\\text{final quality}', 'overall system usefulness once both stages are combined'],
  ],
  'cold-start': [
    ['\\alpha', 'how much weight goes to collaborative signals'],
    ['\\text{collaborative}', 'behavior-based score from user-item history'],
    ['\\text{content}', 'metadata or feature-based score when history is weak'],
  ],
  diffusion: [
    ['x_t', 'the current noisy sample at step t'],
    ['x_{t-1}', 'the slightly cleaner sample after one reverse step'],
    ['\\operatorname{denoise}(\\cdot)', 'the learned update that removes some noise'],
    ['\\text{condition}', 'the prompt or control signal steering the denoising process'],
  ],
  bandit: [
    ['\\varepsilon', 'the probability of exploring instead of exploiting'],
    ['Q(a)', 'the current estimated value of action a'],
    ['\\arg\\max_a Q(a)', 'the action that currently looks best'],
  ],
  'matrix-factorization': [
    ['p_u', 'the latent taste vector for user u', 'a user might lean toward action movies, anime, and short-form comedy without those tastes being hand-labeled.'],
    ['q_i', 'the latent attribute vector for item i', 'a movie might land near “action” and “sci-fi” in the same hidden space.'],
    ['\\hat{r}_{ui}', 'the predicted strength of the match between that user and item', 'the model’s guess for how much this user will like that movie.'],
    ['p_u^T q_i', 'the alignment score between user taste and item traits', 'if both vectors point toward action-heavy content, the score is high.'],
  ],
  'two-tower': [
    ['f_{user}(u)', 'the encoded user or query representation'],
    ['f_{item}(i)', 'the encoded item representation that can be precomputed'],
    ['\\operatorname{score}(u, i)', 'the retrieval score used for nearest-neighbor search'],
  ],
  'rank-objectives': [
    ['\\mathcal{L}_{pair}', 'the pairwise ranking loss'],
    ['s^+', 'the score of the preferred or positive item'],
    ['s^-', 'the score of the non-preferred or negative item'],
    ['\\sigma(\\cdot)', 'the sigmoid turning the score gap into a smooth preference probability'],
  ],
  'mle-map': [
    ['\\hat{\\theta}_{MLE}', 'the parameter chosen by data fit alone', 'if coin-flip data shows 9 heads out of 10, MLE leans hard toward a 90% heads coin.'],
    ['\\hat{\\theta}_{MAP}', 'the parameter chosen by data fit plus prior belief', 'if you strongly believe coins are usually fair, MAP pulls that 90% estimate back toward 50%.'],
    ['p(D \\mid \\theta)', 'how well parameter \\theta explains the observed data', 'how plausible those 9 heads are if the coin’s head rate were 0.9 versus 0.5.'],
    ['p(\\theta)', 'your prior belief about reasonable parameter values', 'before seeing any flips, you may think extreme coins are unlikely.'],
  ],
  'bias-variance': [
    ['\\operatorname{Bias}^2', 'error from the model being systematically too simple or wrong-shaped'],
    ['\\operatorname{Variance}', 'error from the model being overly sensitive to training noise'],
    ['\\text{noise}', 'irreducible uncertainty in the target itself'],
  ],
  regularization: [
    ['\\mathcal{L}_{data}', 'the part of the loss that rewards fitting the training data', 'classification error on your labeled examples.'],
    ['\\lambda', 'the knob controlling how strongly simplicity is rewarded', 'increasing λ tells the model to accept a slightly worse fit if it becomes much less fragile.'],
    ['\\lVert w \\rVert_2^2', 'the L2 penalty that discourages very large weights', 'instead of one feature getting an extreme coefficient, the model spreads influence more smoothly.'],
    ['\\lVert w \\rVert_1', 'the L1 penalty that pushes some weights all the way to zero', 'in a sparse linear model, irrelevant features can be dropped entirely.'],
  ],
  'serving-skew': [
    ['p_{train}(x)', 'the feature distribution seen during offline training'],
    ['p_{serve}(x)', 'the feature distribution arriving in live serving'],
    ['x', 'the input features given to the model'],
  ],
  'online-offline': [
    ['\\text{offline metric}', 'the proxy score computed safely on held-out data'],
    ['\\text{product value}', 'the true live outcome the business actually cares about'],
    ['\\not\\equiv', 'a reminder that the proxy is not the same thing as the objective'],
  ],
  drift: [
    ['p_t(x, y)', 'the data-generating process at one point in time'],
    ['p_{t+1}(x, y)', 'the later data-generating process after the world has changed'],
    ['x, y', 'the inputs and outcomes that may drift together'],
  ],
  'tree-split': [
    ['I(parent)', 'the impurity before splitting'],
    ['I(child_c)', 'the impurity of child node c after the split'],
    ['\\frac{n_c}{n}', 'the fraction of examples routed into child c'],
    ['\\Delta I', 'the impurity reduction gained by the split'],
  ],
  boosting: [
    ['F_{m-1}(x)', 'the current ensemble prediction before adding a new tree'],
    ['h_m(x)', 'the new weak learner trained to correct residual error'],
    ['\\eta', 'the learning rate controlling how much the new tree changes the ensemble'],
    ['F_m(x)', 'the updated ensemble after adding the new tree'],
  ],
  leakage: [
    ['\\text{feature available after outcome}', 'information that would not exist at real prediction time'],
    ['\\Rightarrow', 'a warning that this implies the evaluation is invalid'],
  ],
  'feature-shift': [
    ['p_{train}(x_j)', 'the distribution of feature j during training'],
    ['p_{live}(x_j)', 'the live distribution of the same feature'],
    ['x_j', 'one particular feature column whose behavior may have changed'],
  ],
  guidance: [
    ['\\hat{\\epsilon}_{uncond}', 'the unconditional denoising estimate'],
    ['\\hat{\\epsilon}_{cond}', 'the denoising estimate conditioned on the prompt'],
    ['w', 'the guidance scale that controls steering strength'],
    ['\\hat{\\epsilon}_{guided}', 'the combined denoising direction used for sampling'],
  ],
  dpo: [
    ['\\pi(y^+\\mid x)', 'the policy probability of the preferred answer for prompt x'],
    ['\\pi(y^-\\mid x)', 'the policy probability of the rejected answer'],
    ['\\pi_{ref}(\\cdot)', 'a reference policy used to keep the update anchored'],
    ['\\beta', 'how strongly the optimization pushes on the preference gap'],
  ],
  'reward-hacking': [
    ['\\text{proxy reward}', 'the measurable stand-in being optimized'],
    ['\\text{true objective}', 'what humans actually care about'],
    ['\\uparrow \\not\\Rightarrow \\uparrow', 'a warning that improving the proxy does not guarantee improving the real goal'],
  ],
};

function renderFormulaAnnotations(sectionId) {
  const entries = formulaAnnotations[sectionId];
  if (!entries || !entries.length) return '';
  return `
    <div class="formula-annotations">
      <p class="tool-kicker">What each part means</p>
      <div class="formula-annotation-list">
        ${entries
          .map(
            ([symbol, meaning, example]) => `
              <div class="formula-annotation">
                <div class="formula-symbol"><span class="math-render" data-math="${escapeAttribute(symbol)}">${escapeHtml(symbol)}</span></div>
                <div class="formula-copy">
                  <p class="formula-meaning">${meaning}</p>
                  ${example ? `<p class="formula-example"><strong>Example:</strong> ${example}</p>` : ''}
                </div>
              </div>
            `
          )
          .join('')}
      </div>
    </div>
  `;
}

function highlightCode(source, lang) {
  const escaped = escapeHtml(source);
  if (lang !== 'python') return escaped;

  return escaped
    .replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/\b(import|def|return|for|in|if|else|elif)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(math|random)\b/g, '<span class="tok-module">$1</span>')
    .replace(/\b\d+(?:\.\d+)?\b/g, '<span class="tok-number">$&</span>');
}

function binaryEntropy(p) {
  const safeP = clamp01(p);
  const safeQ = clamp01(1 - p);
  return -(safeP * Math.log2(safeP) + safeQ * Math.log2(safeQ));
}

function binaryCrossEntropy(p, q) {
  const safeQ = clamp01(q);
  const safeOneMinusQ = clamp01(1 - q);
  return -(p * Math.log2(safeQ) + (1 - p) * Math.log2(safeOneMinusQ));
}

function renderChapterPage(chapterKey) {
  const chapter = chapters[chapterKey];
  const root = document.getElementById('chapter-root');
  if (!chapter || !root) return;

  const navMeta = document.querySelector('[data-nav-meta]');
  const eyebrow = document.querySelector('[data-chapter-eyebrow]');
  const title = document.querySelector('[data-chapter-title]');
  const lede = document.querySelector('[data-chapter-lede]');
  const map = document.querySelector('[data-chapter-map]');

  if (navMeta) navMeta.textContent = chapter.navMeta;
  if (eyebrow) eyebrow.textContent = chapter.eyebrow;
  if (title) title.textContent = chapter.title;
  if (lede) lede.textContent = chapter.lede;
  if (map) {
    map.innerHTML = chapter.sections.map((section) => `<a href="#${section.id}">${section.nav}</a>`).join('');
  }

  document.querySelector('.chapter-guide')?.remove();
  const guideMarkup = renderChapterGuide(chapterKey);
  if (guideMarkup) {
    if (map) {
      map.insertAdjacentHTML('afterend', guideMarkup);
    } else {
      root.insertAdjacentHTML('beforebegin', guideMarkup);
    }
  }

  root.innerHTML = '';
  chapter.sections.forEach((section) => {
    const card = document.createElement('article');
    card.className = 'concept-card';
    card.id = section.id;
    card.innerHTML = renderSectionMarkup(section);
    root.appendChild(card);
    mountVisualization(card, section);
    mountQuiz(card);
    mountGeometry(card, section);
  });

  renderMathBlocks(root);
}

function renderChapterGuide(chapterKey) {
  const guide = chapterGuides[chapterKey];
  if (!guide) return '';

  const resourceShelf = guide.resources?.length
    ? `
      <details class="fold resource-shelf">
        <summary>Further reading</summary>
        <div class="fold-body">
          <div class="resource-grid">
            ${guide.resources
              .map(
                (resource) => `
                  <a class="resource-card" href="${resource.url}" target="_blank" rel="noreferrer">
                    <div class="resource-meta">
                      <span class="resource-type">${resource.kind}</span>
                      <span class="resource-source">${resource.source}</span>
                    </div>
                    <h3>${resource.title}</h3>
                    <span class="resource-cta">Open resource</span>
                  </a>
                `
              )
              .join('')}
          </div>
        </div>
      </details>
    `
    : '';

  if (!resourceShelf) return '';

  return `<section class="chapter-guide">${resourceShelf}</section>`;
}

function renderSectionMarkup(section) {
  return `
    <div class="concept-header concept-copy">
      <p class="concept-label">${section.label}</p>
      <h2>${section.title}</h2>
      <p class="concept-summary">${section.summary}</p>
    </div>
    <div class="concept-layout">
      <div class="concept-column">
        <div class="fact-grid">
          <article class="fact-card">
            <p class="fact-label">What this means</p>
            <p>${section.what}</p>
          </article>
          <article class="fact-card">
            <p class="fact-label">Why it matters</p>
            <p>${section.why}</p>
          </article>
          <article class="fact-card">
            <p class="fact-label">Interview refresh</p>
            <p>${section.interview}</p>
          </article>
        </div>
        <details class="fold">
          <summary>Reference notes</summary>
          <div class="fold-body">
            <ul>${section.details.map((item) => `<li>${item}</li>`).join('')}</ul>
          </div>
        </details>
      </div>
      <div class="concept-column">
        <section class="viz-panel" data-viz="${section.viz}">
          <div class="preset-row">
            ${section.presets
              .map(
                (preset, index) =>
                  `<button class="preset-button${index === 1 || (index === 0 && section.presets.length === 1) ? ' active' : ''}" type="button" data-preset='${JSON.stringify(
                    preset.values
                  )}'>${preset.label}</button>`
              )
              .join('')}
          </div>
          <div class="control-row">
            ${section.controls
              .map(
                (control) => `
                <div class="control-group">
                  <label for="${section.id}-${control.key}">
                    <span>${control.label}</span>
                    <span data-value="${control.key}">${formatValue(control.value, control.format)}</span>
                  </label>
                  <input
                    id="${section.id}-${control.key}"
                    type="range"
                    min="${control.min}"
                    max="${control.max}"
                    step="${control.step}"
                    value="${control.value}"
                    data-key="${control.key}"
                    data-format="${control.format}"
                  >
                </div>
              `
              )
              .join('')}
          </div>
          <canvas class="viz-canvas" width="740" height="360"></canvas>
          <div class="lab-readout">
            <strong class="takeaway-label">Current read</strong>
            <div class="takeaway-line" data-role="takeaway"></div>
            <div class="metric-row" data-role="metrics"></div>
          </div>
        </section>
      </div>
    </div>
    <div class="study-tool-grid">
      ${section.math ? renderMathTool(section.math, section.id) : ''}
      ${section.geometry ? renderGeometryTool(section.geometry) : ''}
      ${section.code ? renderCodeTool(section.code) : ''}
      ${section.quiz ? renderQuizTool(section) : ''}
    </div>
  `;
}

function renderMathTool(math, sectionId) {
  return `
    <details class="fold study-tool">
      <summary>Formula</summary>
      <div class="fold-body">
        <div class="formula-card">
          ${math.title ? `<p class="tool-kicker">${math.title}</p>` : ''}
          ${renderMathLines(math.formula)}
          ${renderFormulaAnnotations(sectionId)}
          ${math.note ? `<p class="tool-note">${math.note}</p>` : ''}
        </div>
      </div>
    </details>
  `;
}

function renderCodeTool(code) {
  return `
    <details class="fold study-tool">
      <summary>Code sketch</summary>
      <div class="fold-body">
        <div class="code-card">
          ${code.title ? `<p class="tool-kicker">${code.title}</p>` : ''}
          <pre><code class="code-block code-block-${code.lang || 'plain'}">${highlightCode(code.snippet, code.lang)}</code></pre>
        </div>
      </div>
    </details>
  `;
}

function renderGeometryTool(geometry) {
  const visual = geometry.type === 'bayes-area'
    ? `
      <div class="bayes-geometry" data-bayes-geometry>
        <div class="bayes-square">
          <div class="bayes-column bayes-column-h" data-bayes-h>
            <div class="bayes-rect bayes-overlap" data-bayes-overlap></div>
          </div>
          <div class="bayes-column bayes-column-not-h" data-bayes-not-h>
            <div class="bayes-rect bayes-eonly" data-bayes-eonly></div>
          </div>
        </div>
        <div class="bayes-legend">
          <div class="bayes-legend-item"><span class="bayes-chip bayes-chip-overlap"></span> overlap: H ∩ E</div>
          <div class="bayes-legend-item"><span class="bayes-chip bayes-chip-eonly"></span> evidence outside H</div>
        </div>
        <p class="tool-note bayes-geometry-note" data-bayes-note></p>
      </div>
    `
    : '';
  return `
    <details class="fold study-tool">
      <summary>Geometric view</summary>
      <div class="fold-body">
        <div class="formula-card geometry-card">
          ${geometry.title ? `<p class="tool-kicker">${geometry.title}</p>` : ''}
          <p class="tool-note">${geometry.body}</p>
          ${visual}
          ${renderMathLines(geometry.formula)}
          ${geometry.note ? `<p class="tool-note">${geometry.note}</p>` : ''}
        </div>
      </div>
    </details>
  `;
}

function renderQuizTool(section) {
  return `
    <details class="fold study-tool">
      <summary>Quick check</summary>
      <div class="fold-body">
        <div class="quiz-card" data-quiz="${section.id}">
          <p class="tool-kicker">One check</p>
          <p class="quiz-prompt">${section.quiz.prompt}</p>
          <div class="quiz-options">
            ${section.quiz.options
              .map(
                (option, index) => `
                  <button
                    type="button"
                    class="quiz-option"
                    data-correct="${option.correct ? 'true' : 'false'}"
                    data-explanation="${escapeAttribute(option.explanation)}"
                  >
                    ${index + 1}. ${option.text}
                  </button>
                `
              )
              .join('')}
          </div>
          <p class="quiz-feedback" data-feedback>Choose an answer to check your understanding.</p>
        </div>
      </div>
    </details>
  `;
}

function mountVisualization(card, section) {
  const panel = card.querySelector('.viz-panel');
  const canvas = panel.querySelector('canvas');
  const inputs = Array.from(panel.querySelectorAll('input'));
  const valueLabels = Object.fromEntries(
    inputs.map((input) => [input.dataset.key, panel.querySelector(`[data-value="${input.dataset.key}"]`)])
  );
  const takeaway = panel.querySelector('[data-role="takeaway"]');
  const metrics = panel.querySelector('[data-role="metrics"]');

  function getState() {
    const state = {};
    inputs.forEach((input) => {
      state[input.dataset.key] = Number(input.value);
    });
    return state;
  }

  function syncLabels(state) {
    inputs.forEach((input) => {
      valueLabels[input.dataset.key].textContent = formatValue(state[input.dataset.key], input.dataset.format);
    });
  }

  function render() {
    const state = getState();
    syncLabels(state);
    const ctx = prepareCanvas(canvas, 740, 360);
    const renderers = {
      bayes: drawBayes,
      entropy: drawEntropy,
      neuron: drawNeuron,
      'activation-basics': drawActivationBasics,
      'output-functions': drawOutputFunctions,
      'forward-pass': drawForwardPass,
      'chain-rule': drawChainRule,
      backprop: drawBackprop,
      'gradient-descent': drawGradientDescent,
      optimizers: drawOptimizers,
      'lr-schedule': drawLearningRateSchedule,
      'learning-rate': drawLearningRate,
      initialization: drawInitialization,
      'gradient-flow': drawGradientFlow,
      normalization: drawNormalization,
      residuals: drawResiduals,
      'flash-attention': drawFlashAttention,
      tokenization: drawTokenization,
      embeddings: drawEmbeddings,
      positional: drawPositional,
      attention: drawAttention,
      'kv-cache': drawKvCache,
      rag: drawRag,
      'threshold-metrics': drawThresholdMetrics,
      calibration: drawCalibration,
      'ranking-metrics': drawRankingMetrics,
      'matrix-factorization': drawMatrixFactorization,
      'two-tower': drawTwoTower,
      'mle-map': drawMleMap,
      'bias-variance': drawBiasVariance,
      regularization: drawRegularization,
      'serving-skew': drawServingSkew,
      'online-offline': drawOnlineOffline,
      'data-drift': drawDataDrift,
      'tree-split': drawTreeSplit,
      boosting: drawBoosting,
      'feature-leakage': drawFeatureLeakage,
      'feature-shift': drawFeatureShift,
      guidance: drawGuidance,
      dpo: drawDpo,
      'reward-hacking': drawRewardHacking,
      'retrieval-funnel': drawRetrievalFunnel,
      'cold-start': drawColdStart,
      diffusion: drawDiffusion,
      bandit: drawBandit,
    };
    const renderer = renderers[section.viz];
    if (renderer) renderer(ctx, state, takeaway, metrics);
    if (section.viz === 'bayes') updateBayesGeometry(card, state);
  }

  inputs.forEach((input) => input.addEventListener('input', render));
  panel.querySelectorAll('.preset-button').forEach((button) => {
    button.addEventListener('click', () => {
      const values = JSON.parse(button.dataset.preset);
      inputs.forEach((input) => {
        if (values[input.dataset.key] !== undefined) input.value = values[input.dataset.key];
      });
      panel.querySelectorAll('.preset-button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      render();
    });
  });

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => render());
    observer.observe(canvas);
  }

  const activePreset = panel.querySelector('.preset-button.active');
  if (activePreset) {
    const values = JSON.parse(activePreset.dataset.preset);
    inputs.forEach((input) => {
      if (values[input.dataset.key] !== undefined) input.value = values[input.dataset.key];
    });
  }
  render();
}

function mountGeometry(card, section) {
  if (!section.geometry || section.geometry.type !== 'bayes-area') return;
  const root = card.querySelector('[data-bayes-geometry]');
  if (!root) return;
  card.__bayesGeometry = {
    h: root.querySelector('[data-bayes-h]'),
    notH: root.querySelector('[data-bayes-not-h]'),
    overlap: root.querySelector('[data-bayes-overlap]'),
    eonly: root.querySelector('[data-bayes-eonly]'),
    note: root.querySelector('[data-bayes-note]'),
  };
}

function updateBayesGeometry(card, state) {
  const geom = card.__bayesGeometry;
  if (!geom) return;
  const prior = state.prior;
  const sensitivity = state.sensitivity;
  const falsePositiveRate = 1 - state.specificity;
  const evidenceMass = prior * sensitivity + (1 - prior) * falsePositiveRate;
  const posterior = evidenceMass === 0 ? 0 : (prior * sensitivity) / evidenceMass;
  geom.h.style.width = `${prior * 100}%`;
  geom.notH.style.width = `${(1 - prior) * 100}%`;
  geom.overlap.style.height = `${sensitivity * 100}%`;
  geom.eonly.style.height = `${falsePositiveRate * 100}%`;
  geom.note.textContent = `Inside the evidence region, ${(posterior * 100).toFixed(1)}% of the area belongs to the hypothesis.`;
}

function mountQuiz(card) {
  const quiz = card.querySelector('[data-quiz]');
  if (!quiz) return;
  const feedback = quiz.querySelector('[data-feedback]');
  quiz.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => {
      quiz.querySelectorAll('.quiz-option').forEach((option) => {
        option.classList.remove('is-correct', 'is-wrong');
      });
      const correct = button.dataset.correct === 'true';
      button.classList.add(correct ? 'is-correct' : 'is-wrong');
      feedback.textContent = button.dataset.explanation;
      feedback.classList.toggle('is-correct', correct);
      feedback.classList.toggle('is-wrong', !correct);
    });
  });
}

function renderMathBlocks(scope = document) {
  if (!window.katex) return;
  scope.querySelectorAll('.math-render').forEach((node) => {
    const expression = node.dataset.math || '';
    window.katex.render(expression, node, {
      throwOnError: false,
      displayMode: true,
    });
  });
}

function prepareCanvas(canvas, baseWidth, baseHeight) {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(320, canvas.clientWidth || baseWidth);
  const cssHeight = cssWidth * (baseHeight / baseWidth);
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform((cssWidth / baseWidth) * dpr, 0, 0, (cssHeight / baseHeight) * dpr, 0, 0);
  return ctx;
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, 740, 360);
  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(0, 0, 740, 360);
  drawGrid(ctx, 740, 360);
}

function drawBayes(ctx, state, takeaway, metrics) {
  const { prior, sensitivity, specificity } = state;
  const falsePositiveRate = 1 - specificity;
  const numerator = prior * sensitivity;
  const denominator = numerator + (1 - prior) * falsePositiveRate;
  const posterior = denominator === 0 ? 0 : numerator / denominator;

  const population = 1000;
  const trueCases = population * prior;
  const healthyCases = population - trueCases;
  const truePositive = trueCases * sensitivity;
  const falsePositive = healthyCases * falsePositiveRate;

  clearCanvas(ctx);

  const bars = [
    { x: 64, label: 'population', value: population, color: 'rgba(201,169,110,0.2)', stroke: '#c9a96e' },
    { x: 224, label: 'true +', value: truePositive, color: 'rgba(110,165,201,0.28)', stroke: '#6ea5c9' },
    { x: 384, label: 'false +', value: falsePositive, color: 'rgba(201,110,138,0.28)', stroke: '#c96e8a' },
  ];

  const maxHeight = 180;
  const baseY = 260;
  ctx.textBaseline = 'alphabetic';
  bars.forEach((bar) => {
    const height = (bar.value / population) * maxHeight;
    const y = baseY - height;
    ctx.fillStyle = bar.color;
    ctx.strokeStyle = bar.stroke;
    ctx.lineWidth = 1.5;
    roundRect(ctx, bar.x, y, 100, height, 18, true, true);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(bar.label.toUpperCase(), bar.x, baseY + 24);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '22px "EB Garamond", serif';
    ctx.fillText(Math.round(bar.value).toString(), bar.x, y - 12);
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Posterior after a positive test', 470, 102);
  ctx.font = '52px "EB Garamond", serif';
  ctx.fillStyle = '#c9a96e';
  ctx.fillText(`${(posterior * 100).toFixed(1)}%`, 470, 166);
  ctx.font = '15px "EB Garamond", serif';
  ctx.fillStyle = '#e8e4de';
  wrapText(
    ctx,
    posterior > 0.75
      ? 'The evidence is convincing because the base rate is high enough and false positives are contained.'
      : posterior > 0.35
        ? 'The test helps, but the healthy population is still large enough that false positives matter.'
        : 'The event starts so rare that even a good test struggles to create a high posterior.',
    470,
    198,
    210,
    22
  );

  takeaway.textContent =
    posterior > 0.75
      ? 'The evidence really moves belief because the base rate is not fighting against you.'
      : posterior > 0.35
        ? 'The signal is useful, but a positive result still needs context before it feels conclusive.'
        : 'A positive result is not enough on its own when the event starts out rare.';

  metrics.innerHTML = metricMarkup([
    ['Posterior', `${(posterior * 100).toFixed(1)}%`],
    ['True positives', `${Math.round(truePositive)}`],
    ['False positives', `${Math.round(falsePositive)}`],
  ]);
}

function drawEntropy(ctx, state, takeaway, metrics) {
  const p = state.p;
  const q = state.q;
  const entropy = binaryEntropy(p);
  const crossEntropy = binaryCrossEntropy(p, q);
  const kl = crossEntropy - entropy;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('True distribution versus model distribution', 58, 62);

  drawDistributionCard(ctx, 70, 108, 230, 170, 'True distribution p', p, '#6ea5c9');
  drawDistributionCard(ctx, 332, 108, 230, 170, 'Model distribution q', q, '#c9a96e');

  ctx.strokeStyle = 'rgba(255,255,255,0.09)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(596, 106);
  ctx.lineTo(596, 286);
  ctx.stroke();

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('H(P)', 620, 128);
  ctx.fillText('H(P, Q)', 620, 194);
  ctx.fillText('KL GAP', 620, 260);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(entropy.toFixed(3), 620, 164);
  ctx.fillText(crossEntropy.toFixed(3), 620, 230);
  ctx.fillStyle = '#c9a96e';
  ctx.fillText(kl.toFixed(3), 620, 296);

  takeaway.textContent =
    Math.abs(kl) < 0.03
      ? 'Your model distribution is close to the truth, so most of the loss is just the task’s own uncertainty.'
      : kl > 0.3
        ? 'Most of the extra loss is not unavoidable uncertainty. It is the model betting on the wrong shape.'
        : 'Some uncertainty belongs to the task, and some belongs to the mismatch between p and q.';

  metrics.innerHTML = metricMarkup([
    ['Entropy', entropy.toFixed(3)],
    ['Cross-entropy', crossEntropy.toFixed(3)],
    ['KL gap', kl.toFixed(3)],
  ]);
}

function drawLearningRate(ctx, state, takeaway, metrics) {
  const lr = state.lr;
  const curvature = state.curvature;
  const lossFn = (x) => 0.32 + curvature * x * x * 0.18;
  const toCanvasX = (x) => 90 + ((x + 3.5) / 7) * 320;
  const toCanvasY = (loss) => 280 - ((loss - 0.32) / 2.2) * 190;

  clearCanvas(ctx);

  ctx.strokeStyle = 'rgba(201,169,110,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 140; i += 1) {
    const x = -3.5 + (7 * i) / 140;
    const px = toCanvasX(x);
    const py = toCanvasY(lossFn(x));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const points = [];
  let x = 2.85;
  let diverged = false;
  let signChanges = 0;
  let previousSign = Math.sign(x);
  for (let i = 0; i < 12; i += 1) {
    points.push({ x, loss: lossFn(x) });
    const grad = 2 * curvature * x;
    x -= lr * grad;
    const sign = Math.sign(x);
    if (sign !== 0 && previousSign !== 0 && sign !== previousSign) signChanges += 1;
    previousSign = sign;
    if (Math.abs(x) > 4.2) {
      diverged = true;
      break;
    }
  }
  points.push({ x, loss: lossFn(Math.max(-3.5, Math.min(3.5, x))) });

  ctx.strokeStyle = '#6ea5c9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const px = toCanvasX(point.x);
    const py = toCanvasY(point.loss);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const px = toCanvasX(point.x);
    const py = toCanvasY(point.loss);
    ctx.fillStyle = index === points.length - 1 ? '#c9a96e' : '#6ea5c9';
    ctx.beginPath();
    ctx.arc(px, py, index === points.length - 1 ? 6 : 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Optimization path on a simple loss valley', 470, 92);
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    diverged
      ? 'The updates are too large, so the path overshoots the minimum and loses stability.'
      : signChanges > 3
        ? 'The optimizer keeps crossing the valley. It is learning, but the path is still too jumpy.'
        : Math.abs(x) > 0.7
          ? 'The updates are safe, but progress is slow because each step is too timid.'
          : 'The optimizer is taking efficient steps toward the minimum without oscillating badly.',
    470,
    132,
    215,
    22
  );

  const finalLoss = lossFn(Math.max(-3.5, Math.min(3.5, x)));
  takeaway.textContent =
    diverged
      ? 'This learning rate is too aggressive for the surface you are on.'
      : signChanges > 3
        ? 'You are trading stability for speed; the updates are landing, but they are noisy.'
        : Math.abs(x) > 0.7
          ? 'Training is stable, but the optimizer is wasting time with small updates.'
          : 'This is the sweet spot: large enough to move, small enough to stay controlled.';

  metrics.innerHTML = metricMarkup([
    ['Final position', x.toFixed(2)],
    ['Final loss', finalLoss.toFixed(3)],
    ['Direction flips', `${signChanges}`],
  ]);
}

function drawGradientFlow(ctx, state, takeaway, metrics) {
  const depth = Math.round(state.depth);
  const derivative = state.derivative;
  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('How gradient magnitude changes across layers', 56, 58);

  const baseX = 72;
  const baseY = 280;
  const maxBarHeight = 170;
  const barGap = 10;
  const barWidth = Math.max(12, Math.min(22, (520 - (depth - 1) * barGap) / depth));
  let maxMagnitude = 0;
  const magnitudes = [];
  for (let i = 0; i < depth; i += 1) {
    const magnitude = Math.pow(derivative, i);
    magnitudes.push(magnitude);
    maxMagnitude = Math.max(maxMagnitude, Math.min(magnitude, 6));
  }

  magnitudes.forEach((mag, index) => {
    const clipped = Math.min(mag, 6);
    const height = (clipped / maxMagnitude) * maxBarHeight;
    const x = baseX + index * (barWidth + barGap);
    const y = baseY - height;
    ctx.fillStyle = derivative < 0.9 ? 'rgba(201,110,138,0.28)' : derivative > 1.1 ? 'rgba(110,165,201,0.28)' : 'rgba(201,169,110,0.24)';
    ctx.strokeStyle = derivative < 0.9 ? '#c96e8a' : derivative > 1.1 ? '#6ea5c9' : '#c9a96e';
    roundRect(ctx, x, y, barWidth, height, 10, true, true);
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('EARLY LAYERS', baseX, 308);
  ctx.fillText('LATE LAYERS', baseX + depth * (barWidth + barGap) - 120, 308);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '16px "EB Garamond", serif';
  wrapText(
    ctx,
    derivative < 0.9
      ? 'Repeated factors below one shrink the signal until early layers barely learn.'
      : derivative > 1.1
        ? 'Repeated factors above one amplify the signal until updates become unstable.'
        : 'Gradients are staying in a workable band, so learning can reach the earlier layers.',
    540,
    120,
    150,
    22
  );

  const firstLayer = magnitudes[magnitudes.length - 1];
  takeaway.textContent =
    derivative < 0.9
      ? 'Depth is hurting you because the learning signal fades before it reaches the earliest layers.'
      : derivative > 1.1
        ? 'Depth is amplifying the learning signal into instability.'
        : 'The gradient signal stays alive across depth, which is what healthy training wants.';

  metrics.innerHTML = metricMarkup([
    ['Depth', `${depth}`],
    ['Last-layer grad', magnitudes[0].toFixed(2)],
    ['First-layer grad', firstLayer.toFixed(3)],
  ]);
}

function drawInitialization(ctx, state, takeaway, metrics) {
  const depth = Math.round(state.depth);
  const scale = state.scale;
  const multiplier = scale * scale;
  const stds = [1];
  for (let i = 1; i < depth; i += 1) {
    stds.push(Math.sqrt(Math.pow(multiplier, i)));
  }
  const clipped = stds.map((value) => Math.min(3.2, value));
  const maxStd = Math.max(...clipped, 1);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('How activation scale evolves before learning even starts', 56, 58);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(74, 238);
  ctx.lineTo(524, 238);
  ctx.stroke();
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('healthy band', 74, 232);

  ctx.strokeStyle = scale < 0.9 ? '#c96e8a' : scale > 1.1 ? '#6ea5c9' : '#c9a96e';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  clipped.forEach((value, index) => {
    const x = 84 + (index / Math.max(1, depth - 1)) * 420;
    const y = 270 - (value / maxStd) * 150;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  clipped.forEach((value, index) => {
    const x = 84 + (index / Math.max(1, depth - 1)) * 420;
    const y = 270 - (value / maxStd) * 150;
    ctx.fillStyle = scale < 0.9 ? '#c96e8a' : scale > 1.1 ? '#6ea5c9' : '#c9a96e';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('LAYER 1', 84, 304);
  ctx.fillText(`LAYER ${depth}`, 438, 304);

  const finalStd = stds[stds.length - 1];
  const regime = finalStd < 0.55 ? 'shrinking' : finalStd > 1.8 ? 'exploding' : 'healthy';

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Initial signal regime', 548, 92);
  ctx.font = '48px "EB Garamond", serif';
  ctx.fillStyle = regime === 'healthy' ? '#c9a96e' : regime === 'shrinking' ? '#c96e8a' : '#6ea5c9';
  ctx.fillText(regime === 'healthy' ? 'balanced' : regime, 548, 150);
  ctx.font = '15px "EB Garamond", serif';
  ctx.fillStyle = '#e8e4de';
  wrapText(
    ctx,
    regime === 'healthy'
      ? 'The activation scale stays in a usable band across depth, so optimization starts from a numerically sane place.'
      : regime === 'shrinking'
        ? 'Signals are fading with depth before learning even begins. Early layers will start almost silent.'
        : 'Signals are amplifying with depth. The network begins in an over-energetic regime that tends to destabilize gradients.',
    548,
    188,
    140,
    22
  );

  takeaway.textContent =
    regime === 'healthy'
      ? 'This initialization keeps activations alive across depth instead of starving or saturating the network.'
      : regime === 'shrinking'
        ? 'Your initialization is too timid. The network is losing signal before the optimizer can do useful work.'
        : 'Your initialization is too hot. The network starts with amplified signals that make training brittle.';

  metrics.innerHTML = metricMarkup([
    ['Layer 1 std', stds[0].toFixed(2)],
    ['Last-layer std', finalStd.toFixed(2)],
    ['Per-layer factor', multiplier.toFixed(2)],
  ]);
}

function drawNormalization(ctx, state, takeaway, metrics) {
  const batchCoupling = state.batchCoupling;
  const centering = state.centering;

  let mode = 'LayerNorm';
  if (batchCoupling > 0.6) mode = 'BatchNorm';
  else if (centering < 0.4) mode = 'RMSNorm';

  const rawMean = -0.7 + batchCoupling * 1.3;
  const rawScale = 0.8 + batchCoupling * 1.7;
  const meanAfter = mode === 'RMSNorm' ? rawMean : rawMean * (1 - centering * 0.92);
  const scaleAfter =
    mode === 'BatchNorm' ? 1 + (rawScale - 1) * 0.08
      : mode === 'LayerNorm' ? 1 + (rawScale - 1) * 0.12
        : 1 + (rawScale - 1) * 0.14;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Before and after normalization', 56, 58);

  const cards = [
    {
      x: 56,
      title: 'before norm',
      mean: rawMean,
      scale: rawScale,
      accent: '#c96e8a',
    },
    {
      x: 286,
      title: mode,
      mean: meanAfter,
      scale: scaleAfter,
      accent: mode === 'BatchNorm' ? '#6ea5c9' : '#c9a96e',
    },
  ];

  cards.forEach((card, index) => {
    ctx.fillStyle = `${card.accent}16`;
    ctx.strokeStyle = card.accent;
    ctx.lineWidth = 1.2;
    roundRect(ctx, card.x, 92, 180, 192, 20, true, true);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(card.title.toUpperCase(), card.x + 18, 116);

    const zeroY = 176;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(card.x + 18, zeroY);
    ctx.lineTo(card.x + 162, zeroY);
    ctx.stroke();

    const meanHeight = card.mean * 48;
    ctx.fillStyle = `${card.accent}44`;
    roundRect(ctx, card.x + 32, zeroY - Math.max(0, meanHeight), 42, Math.abs(meanHeight), 10, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText('mean', card.x + 28, 236);

    const scaleHeight = Math.max(18, Math.min(112, card.scale * 52));
    ctx.fillStyle = `${card.accent}2a`;
    roundRect(ctx, card.x + 100, 244 - scaleHeight, 42, scaleHeight, 10, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.fillText('rms', card.x + 100, 236);

    if (index === 1) {
      ctx.fillStyle = '#e8e4de';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(mode === 'BatchNorm' ? 'batch stats' : mode === 'LayerNorm' ? 'per example' : 'scale only', card.x + 18, 264);
    }
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('What changes', 510, 92);
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    mode === 'BatchNorm'
      ? 'BatchNorm recenters and rescales aggressively, but its behavior depends on the other examples in the batch.'
      : mode === 'LayerNorm'
        ? 'LayerNorm stabilizes each example independently, which is why transformer blocks lean on it.'
        : 'RMSNorm mostly fixes scale, not mean. That lighter touch is often enough for modern LLM blocks.',
    510,
    132,
    180,
    22
  );

  takeaway.textContent =
    mode === 'BatchNorm'
      ? 'You are getting strong stabilization, but the statistics depend on the batch that happened to show up.'
      : mode === 'LayerNorm'
        ? 'You are stabilizing each example directly, which is why this works so naturally in transformer-style stacks.'
        : 'You are mostly correcting scale, which keeps the block numerically steady without full recentering.';

  metrics.innerHTML = metricMarkup([
    ['Mode', mode],
    ['Mean after', meanAfter.toFixed(2)],
    ['RMS after', scaleAfter.toFixed(2)],
  ]);
}

function drawResiduals(ctx, state, takeaway, metrics) {
  const depth = Math.round(state.depth);
  const derivative = state.derivative;
  const noSkip = [];
  const withSkip = [];
  for (let i = 0; i < depth; i += 1) {
    noSkip.push(Math.pow(derivative, i));
    withSkip.push(Math.pow(1 + 0.35 * (derivative - 1), i));
  }
  const maxValue = Math.max(1, ...noSkip, ...withSkip);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Gradient path with and without a skip connection', 56, 58);

  const originX = 82;
  const originY = 286;
  const chartWidth = 430;
  const chartHeight = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + chartWidth, originY);
  ctx.stroke();

  const toPoint = (index, value) => ({
    x: originX + (index / Math.max(1, depth - 1)) * chartWidth,
    y: originY - (Math.min(value, maxValue) / maxValue) * chartHeight,
  });

  [
    { series: noSkip, color: '#c96e8a', label: 'plain stack' },
    { series: withSkip, color: '#c9a96e', label: 'with residual' },
  ].forEach(({ series, color, label }, seriesIndex) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    series.forEach((value, index) => {
      const point = toPoint(index, value);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    ctx.fillStyle = color;
    const legendY = 108 + seriesIndex * 26;
    roundRect(ctx, 548, legendY - 10, 16, 10, 6, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(label, 572, legendY);
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('EARLY LAYERS', originX, 312);
  ctx.fillText('LATE LAYERS', originX + chartWidth - 74, 312);

  const plainFinal = noSkip[noSkip.length - 1];
  const residualFinal = withSkip[withSkip.length - 1];
  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    residualFinal > plainFinal
      ? 'The residual path softens the repeated multiplication problem, so deeper layers stay easier to optimize.'
      : 'When the branch itself is unstable, the residual path still helps, but it cannot rescue everything on its own.',
    548,
    174,
    144,
    22
  );

  takeaway.textContent =
    residualFinal > plainFinal
      ? 'The skip path is preserving a usable learning route that the plain stack loses much faster.'
      : 'Residuals are helping, but the learned branch is still aggressive enough to make training delicate.';

  metrics.innerHTML = metricMarkup([
    ['Plain stack', plainFinal.toFixed(3)],
    ['With residual', residualFinal.toFixed(3)],
    ['Depth', `${depth}`],
  ]);
}

function drawFlashAttention(ctx, state, takeaway, metrics) {
  const seqLen = Math.round(state.seqLen);
  const headDim = Math.round(state.headDim);
  const standardUnits = seqLen * seqLen + 3 * seqLen * headDim;
  const flashUnits = 4 * seqLen * headDim;
  const standardMb = (standardUnits * 4) / 1e6;
  const flashMb = (flashUnits * 4) / 1e6;
  const ratio = standardMb / Math.max(flashMb, 0.001);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Memory footprint of naive vs tiled attention', 56, 58);

  const bars = [
    { x: 104, label: 'standard attention', value: standardMb, color: '#c96e8a' },
    { x: 286, label: 'flash attention', value: flashMb, color: '#c9a96e' },
  ];
  const maxMb = Math.max(...bars.map((bar) => bar.value), 1);
  const baseY = 286;
  const maxHeight = 180;

  bars.forEach((bar) => {
    const height = (bar.value / maxMb) * maxHeight;
    const y = baseY - height;
    ctx.fillStyle = `${bar.color}26`;
    ctx.strokeStyle = bar.color;
    ctx.lineWidth = 1.4;
    roundRect(ctx, bar.x, y, 116, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '24px "EB Garamond", serif';
    ctx.fillText(`${bar.value.toFixed(1)} MB`, bar.x, y - 14);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    wrapText(ctx, bar.label.toUpperCase(), bar.x, 314, 128, 18);
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Why the gap opens', 500, 92);
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    'The naive version stores the full score matrix, which grows with n squared. Flash Attention keeps only small working tiles plus Q, K, and V blocks, so memory grows much more gently.',
    500,
    132,
    184,
    22
  );
  ctx.font = '48px "EB Garamond", serif';
  ctx.fillStyle = '#c9a96e';
  ctx.fillText(`${ratio.toFixed(1)}×`, 500, 252);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(ctx, 'less working-memory pressure in this toy setup', 500, 286, 184, 22);

  takeaway.textContent =
    seqLen > 1600
      ? 'At longer contexts, IO dominates. Flash Attention matters because it stops the quadratic score matrix from owning the memory budget.'
      : 'At short contexts the difference is modest, but the IO advantage compounds quickly as sequence length grows.';

  metrics.innerHTML = metricMarkup([
    ['Seq. length', seqLen.toLocaleString()],
    ['Standard mem.', `${standardMb.toFixed(1)} MB`],
    ['Flash mem.', `${flashMb.toFixed(1)} MB`],
  ]);
}

function drawTokenization(ctx, state, takeaway, metrics) {
  const merge = state.merge;
  const rarity = state.rarity;
  const sequenceLength = Math.round(16 - merge * 10 + rarity * 5);
  const vocabPressure = Math.round(1800 + merge * 5200 - rarity * 900);
  const rareWordCoverage = Math.max(0.12, 0.92 - merge * 0.58 + rarity * 0.34);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('One sentence, represented at three different granularities', 56, 58);

  const cards = [
    {
      x: 56,
      y: 96,
      width: 196,
      height: 190,
      title: 'character-heavy',
      tokens: ['t', 'h', 'e', '_', 'q', 'u', 'i', 'c', 'k', '_', 'f', 'o', 'x'],
      accent: '#6ea5c9',
    },
    {
      x: 272,
      y: 96,
      width: 196,
      height: 190,
      title: 'balanced subwords',
      tokens: ['the', '_quick', '_brown', '_fox'],
      accent: '#c9a96e',
    },
    {
      x: 488,
      y: 96,
      width: 196,
      height: 190,
      title: 'very coarse words',
      tokens: ['the', 'quick', 'brown', 'fox'],
      accent: '#c96e8a',
    },
  ];

  cards.forEach((card) => {
    ctx.fillStyle = `${card.accent}18`;
    ctx.strokeStyle = `${card.accent}`;
    ctx.lineWidth = 1.2;
    roundRect(ctx, card.x, card.y, card.width, card.height, 20, true, true);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(card.title.toUpperCase(), card.x + 18, card.y + 24);

    let cursorX = card.x + 18;
    let cursorY = card.y + 54;
    ctx.font = '16px "EB Garamond", serif';
    card.tokens.forEach((token) => {
      const tokenWidth = Math.max(28, ctx.measureText(token).width + 18);
      if (cursorX + tokenWidth > card.x + card.width - 18) {
        cursorX = card.x + 18;
        cursorY += 36;
      }
      ctx.fillStyle = `${card.accent}22`;
      roundRect(ctx, cursorX, cursorY - 20, tokenWidth, 28, 14, true, false);
      ctx.fillStyle = '#e8e4de';
      ctx.fillText(token, cursorX + 10, cursorY);
      cursorX += tokenWidth + 8;
    });
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '16px "EB Garamond", serif';
  wrapText(
    ctx,
    merge < 0.32
      ? 'The vocabulary stays tiny, but the model has to process a long sequence because many common patterns are still split apart.'
      : merge > 0.76
        ? 'The sequence is short, but the vocabulary is getting heavy and rare words become harder to cover gracefully.'
        : 'This is the sweet spot subword tokenizers chase: many common chunks become compact without giving up compositional coverage.',
    56,
    324,
    628,
    22
  );

  takeaway.textContent =
    merge < 0.32
      ? 'You are saving vocabulary size, but paying for it with longer sequences.'
      : merge > 0.76
        ? 'You are compressing the sequence, but pushing too much complexity into the vocabulary.'
        : 'Subwords work because they share the burden between sequence length and vocabulary size.';

  metrics.innerHTML = metricMarkup([
    ['Seq. length', `${sequenceLength} tokens`],
    ['Vocab pressure', vocabPressure.toLocaleString()],
    ['Rare-word coverage', `${Math.round(rareWordCoverage * 100)}%`],
  ]);
}

function drawEmbeddings(ctx, state, takeaway, metrics) {
  const semantic = state.semantic;
  const noise = state.noise;
  const relevant = clamp01(0.38 + semantic * 0.58 - noise * 0.08);
  const decoy = clamp01(0.22 + noise * 0.46 - semantic * 0.12);
  const offTopic = clamp01(0.08 + (1 - semantic) * 0.18 + noise * 0.04);
  const best = Math.max(relevant, decoy, offTopic);
  const margin = relevant - decoy;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A query vector and three candidate chunks in embedding space', 56, 58);

  const query = { x: 212, y: 206 };
  const docs = [
    { label: 'relevant chunk', x: 212 + (1 - relevant) * 170, y: 206 - semantic * 52, color: '#c9a96e' },
    { label: 'keyword decoy', x: 212 + (1 - decoy) * 190, y: 144 + noise * 90, color: '#c96e8a' },
    { label: 'off-topic', x: 144 + offTopic * 110, y: 92 + (1 - semantic) * 110, color: '#6ea5c9' },
  ];

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(query.x, query.y, 148, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#e8e4de';
  ctx.beginPath();
  ctx.arc(query.x, query.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '15px "EB Garamond", serif';
  ctx.fillText('query', query.x - 14, query.y + 26);

  docs.forEach((doc) => {
    ctx.strokeStyle = `${doc.color}88`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(query.x, query.y);
    ctx.lineTo(doc.x, doc.y);
    ctx.stroke();

    ctx.fillStyle = doc.color;
    ctx.beginPath();
    ctx.arc(doc.x, doc.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e8e4de';
    ctx.font = '15px "EB Garamond", serif';
    ctx.fillText(doc.label, doc.x + 14, doc.y + 4);
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(468, 96);
  ctx.lineTo(468, 286);
  ctx.stroke();

  const bars = [
    ['relevant', relevant, '#c9a96e'],
    ['decoy', decoy, '#c96e8a'],
    ['off-topic', offTopic, '#6ea5c9'],
  ];
  bars.forEach(([label, score, color], index) => {
    const y = 128 + index * 58;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label).toUpperCase(), 500, y - 6);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 500, y + 4, 170, 18, 10, true, false);
    ctx.fillStyle = color;
    roundRect(ctx, 500, y + 4, 170 * Number(score), 18, 10, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(score) * 100)}%`, 620, y - 6);
  });

  takeaway.textContent =
    margin < 0.08
      ? 'The semantic match is not separating the true answer cleanly from a lexical decoy.'
      : semantic > 0.75
        ? 'The meaning match is strong enough that the right chunk sits clearly closer than the distractors.'
        : 'Embeddings are useful when the relevant chunk is geometrically closer than the distractors.';

  metrics.innerHTML = metricMarkup([
    ['Best match', `${Math.round(best * 100)}%`],
    ['Relevant margin', `${Math.round(margin * 100)} pts`],
    ['Lexical distraction', `${Math.round(noise * 100)}%`],
  ]);
}

function drawPositional(ctx, state, takeaway, metrics) {
  const distance = state.distance;
  const context = state.context;
  const learnedStability = clamp01(0.92 - context * 0.58 - Math.max(0, distance - 0.5) * 0.18);
  const ropeStability = clamp01(0.94 - context * 0.32 - Math.max(0, distance - 0.5) * 0.08);
  const ambiguity = clamp01(0.82 - distance * 0.28);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('The same tokens can be a bag, or a sequence with recoverable order', 56, 58);

  ctx.fillStyle = 'rgba(110,165,201,0.14)';
  ctx.strokeStyle = '#6ea5c9';
  roundRect(ctx, 64, 104, 268, 164, 20, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('WITHOUT POSITION', 84, 128);
  [
    { text: 'dog', x: 108, y: 180 },
    { text: 'bites', x: 188, y: 150 },
    { text: 'man', x: 252, y: 208 },
  ].forEach((token) => {
    ctx.fillStyle = 'rgba(110,165,201,0.2)';
    roundRect(ctx, token.x, token.y - 22, 68, 30, 14, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(token.text, token.x + 14, token.y);
  });
  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    'The set of tokens is visible, but nothing in the representation says which one came first.',
    84,
    232,
    220,
    20
  );

  ctx.fillStyle = 'rgba(201,169,110,0.12)';
  ctx.strokeStyle = '#c9a96e';
  roundRect(ctx, 360, 104, 324, 164, 20, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('WITH POSITION', 382, 128);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(398, 202);
  ctx.lineTo(650, 202);
  ctx.stroke();
  const positions = [
    { text: 'dog', x: 410 },
    { text: 'bites', x: 410 + distance * 120 },
    { text: 'man', x: 410 + distance * 120 + 88 },
  ];
  positions.forEach((token, index) => {
    ctx.fillStyle = index === 1 ? 'rgba(201,169,110,0.22)' : 'rgba(255,255,255,0.08)';
    roundRect(ctx, token.x, 180, 70, 30, 14, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(token.text, token.x + 14, 201);
  });
  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    'Now the model can tell not just which tokens are present, but where the relationship sits along the sequence.',
    382,
    232,
    260,
    20
  );

  const stabilityBars = [
    ['learned absolute', learnedStability, '#c96e8a'],
    ['rope / relative', ropeStability, '#c9a96e'],
  ];
  stabilityBars.forEach(([label, value, color], index) => {
    const y = 308 + index * 24;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label).toUpperCase(), 80, y);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 244, y - 14, 182, 14, 8, true, false);
    ctx.fillStyle = color;
    roundRect(ctx, 244, y - 14, 182 * Number(value), 14, 8, true, false);
  });

  takeaway.textContent =
    context > 0.75
      ? 'Long context is stressing the positional scheme, which is why extrapolation behavior matters so much in modern LLMs.'
      : 'Position is what turns a bag of tokens into an ordered sequence the model can reason over.';

  metrics.innerHTML = metricMarkup([
    ['Order ambiguity w/o pos', `${Math.round(ambiguity * 100)}%`],
    ['Learned stability', `${Math.round(learnedStability * 100)}%`],
    ['RoPE stability', `${Math.round(ropeStability * 100)}%`],
  ]);
}

function drawAttention(ctx, state, takeaway, metrics) {
  const match = state.match;
  const sharpness = state.sharpness;
  const rawScores = [
    0.24 + match * 0.18,
    0.42 + match * 0.28,
    0.78 + match * 0.6,
    0.34 + (1 - match) * 0.18,
  ];
  const tempered = rawScores.map((score) => Math.exp(score * sharpness * 2.4));
  const total = tempered.reduce((sum, value) => sum + value, 0);
  const weights = tempered.map((value) => value / total);
  const focus = Math.max(...weights);
  const entropy = -weights.reduce((sum, value) => sum + value * Math.log2(Math.max(value, 1e-9)), 0);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('One current token choosing where to look back', 56, 58);

  const tokens = [
    { x: 86, label: 'the', accent: '#6ea5c9' },
    { x: 210, label: 'model', accent: '#6ea5c9' },
    { x: 334, label: 'found', accent: '#c9a96e' },
    { x: 458, label: 'evidence', accent: '#c96e8a' },
  ];

  tokens.forEach((token, index) => {
    const weight = weights[index];
    const barHeight = 120 * weight;
    ctx.fillStyle = `${token.accent}18`;
    ctx.strokeStyle = token.accent;
    roundRect(ctx, token.x, 146, 86, 124, 18, true, true);
    ctx.fillStyle = token.accent;
    roundRect(ctx, token.x + 24, 246 - barHeight, 38, barHeight, 14, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(token.label, token.x + 18, 180);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`${Math.round(weight * 100)}%`, token.x + 22, 204);
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(584, 96);
  ctx.lineTo(584, 286);
  ctx.stroke();

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('TOP WEIGHT', 616, 126);
  ctx.fillText('ATTENTION ENTROPY', 616, 194);
  ctx.fillText('CONTEXT STYLE', 616, 262);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(`${Math.round(focus * 100)}%`, 616, 160);
  ctx.fillText(entropy.toFixed(2), 616, 228);
  ctx.fillStyle = '#c9a96e';
  ctx.font = '22px "EB Garamond", serif';
  ctx.fillText(
    sharpness > 1.15 ? 'very focused' : sharpness < 0.55 ? 'broad scan' : 'mixed focus',
    616,
    294
  );

  takeaway.textContent =
    sharpness > 1.15
      ? 'The model is locking onto one token, which is great when the dependency is clear but brittle if the signal is noisy.'
      : sharpness < 0.55
        ? 'The model is spreading attention broadly, which keeps options open but dilutes the strongest dependency.'
        : 'Attention is balancing focus and flexibility instead of forcing a hard lookup.';

  metrics.innerHTML = metricMarkup([
    ['Top attention', `${Math.round(focus * 100)}%`],
    ['Weight entropy', entropy.toFixed(2)],
    ['Query match', `${Math.round(match * 100)}%`],
  ]);
}

function drawKvCache(ctx, state, takeaway, metrics) {
  const tokens = state.tokens;
  const layers = state.layers;
  const seqLen = Math.round(80 + tokens * 920);
  const depth = Math.round(12 + layers * 48);
  const fullRecompute = seqLen * depth;
  const cachedStep = depth + seqLen * 0.38;
  const speedup = fullRecompute / cachedStep;
  const cacheMemory = seqLen * depth * 0.0034;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Generation without reuse versus generation with a KV cache', 56, 58);

  const bars = [
    { x: 88, label: 'recompute all past tokens', value: fullRecompute, color: '#c96e8a' },
    { x: 280, label: 'reuse cached past state', value: cachedStep, color: '#6ea5c9' },
  ];
  const maxValue = fullRecompute;
  bars.forEach((bar) => {
    const height = 172 * (bar.value / maxValue);
    const y = 274 - height;
    ctx.fillStyle = `${bar.color}22`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 116, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '17px "EB Garamond", serif';
    wrapText(ctx, bar.label, bar.x, 306, 128, 18);
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(470, 100);
  ctx.lineTo(470, 286);
  ctx.stroke();

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('SEQUENCE LENGTH', 502, 124);
  ctx.fillText('DECODE SPEEDUP', 502, 192);
  ctx.fillText('CACHE MEMORY', 502, 260);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(seqLen.toString(), 502, 158);
  ctx.fillText(`${speedup.toFixed(1)}x`, 502, 226);
  ctx.fillStyle = '#c9a96e';
  ctx.fillText(`${cacheMemory.toFixed(1)} MB`, 502, 294);

  takeaway.textContent =
    seqLen > 700
      ? 'The longer the generation gets, the more absurd full recomputation becomes and the more valuable cached reuse feels.'
      : 'KV cache is a classic systems tradeoff: keep memory around so each new token does not redo old work.';

  metrics.innerHTML = metricMarkup([
    ['Context tokens', `${seqLen}`],
    ['Layers', `${depth}`],
    ['Speedup', `${speedup.toFixed(1)}x`],
  ]);
}

function drawRag(ctx, state, takeaway, metrics) {
  const retrieval = state.retrieval;
  const contextUse = state.contextUse;
  const groundedness = retrieval * contextUse;
  const hallucinationRisk = 1 - groundedness;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Retrieval supplies evidence. Generation decides how much of it survives.', 56, 58);

  const stages = [
    {
      label: 'retrieve',
      subtitle: `${Math.round(retrieval * 100)}% evidence quality`,
      width: 180 + retrieval * 110,
      accent: '#6ea5c9',
      y: 98,
    },
    {
      label: 'context pack',
      subtitle: `${Math.round((retrieval * 0.92) * 100)}% useful context`,
      width: 170 + retrieval * 88,
      accent: '#c9a96e',
      y: 164,
    },
    {
      label: 'answer',
      subtitle: `${Math.round(groundedness * 100)}% grounded output`,
      width: 150 + groundedness * 126,
      accent: '#c96e8a',
      y: 230,
    },
  ];

  stages.forEach((stage, index) => {
    const x = 72 + index * 74;
    ctx.fillStyle = `${stage.accent}20`;
    ctx.strokeStyle = stage.accent;
    ctx.lineWidth = 1.4;
    roundRect(ctx, x, stage.y, stage.width, 38, 16, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(stage.label, x + 16, stage.y + 24);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(stage.subtitle.toUpperCase(), x + stage.width + 12, stage.y + 23);
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(468, 100);
  ctx.lineTo(468, 286);
  ctx.stroke();

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('RETRIEVAL', 502, 124);
  ctx.fillText('CONTEXT USE', 502, 192);
  ctx.fillText('HALLUCINATION RISK', 502, 260);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(`${Math.round(retrieval * 100)}%`, 502, 158);
  ctx.fillText(`${Math.round(contextUse * 100)}%`, 502, 226);
  ctx.fillStyle = '#c9a96e';
  ctx.fillText(`${Math.round(hallucinationRisk * 100)}%`, 502, 294);

  takeaway.textContent =
    retrieval < 0.45
      ? 'The generator cannot ground on evidence it never retrieved.'
      : contextUse < 0.45
        ? 'You have decent evidence, but the answer is not leaning on it hard enough.'
        : 'This is what a healthy RAG pipeline feels like: good evidence comes in, and the model actually uses it.';

  metrics.innerHTML = metricMarkup([
    ['Retrieved evidence', `${Math.round(retrieval * 100)}%`],
    ['Context usage', `${Math.round(contextUse * 100)}%`],
    ['Grounded answer', `${Math.round(groundedness * 100)}%`],
  ]);
}

function drawThresholdMetrics(ctx, state, takeaway, metrics) {
  const threshold = state.threshold;
  const prevalence = state.prevalence;
  const positiveMean = 0.72;
  const negativeMean = 0.34;
  const positiveSpread = 0.14;
  const negativeSpread = 0.16;
  const tpr = clamp01(1 - (threshold - positiveMean + positiveSpread * 1.6));
  const fpr = clamp01(1 - (threshold - negativeMean + negativeSpread * 1.7));
  const precision = (prevalence * tpr) / Math.max(1e-6, prevalence * tpr + (1 - prevalence) * fpr);
  const recall = tpr;
  const f1 = (2 * precision * recall) / Math.max(1e-6, precision + recall);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Two score distributions and one decision threshold', 56, 58);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(74, 272);
  ctx.lineTo(680, 272);
  ctx.stroke();

  const toX = (v) => 92 + v * 552;
  const drawBell = (mean, spread, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 80; i += 1) {
      const x = i / 80;
      const density = Math.exp(-((x - mean) ** 2) / (2 * spread ** 2));
      const px = toX(x);
      const py = 272 - density * 122;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };

  drawBell(negativeMean, negativeSpread, '#6ea5c9');
  drawBell(positiveMean, positiveSpread, '#c9a96e');

  const tx = toX(threshold);
  ctx.strokeStyle = '#c96e8a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx, 104);
  ctx.lineTo(tx, 286);
  ctx.stroke();
  ctx.fillStyle = '#c96e8a';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('THRESHOLD', tx - 34, 96);

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('NEGATIVE CASES', 88, 306);
  ctx.fillText('POSITIVE CASES', 526, 306);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(474, 104);
  ctx.lineTo(474, 246);
  ctx.stroke();

  const statLines = [
    ['PRECISION', precision],
    ['RECALL', recall],
    ['F1', f1],
  ];
  statLines.forEach(([label, value], index) => {
    const y = 128 + index * 46;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label), 504, y);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(value) * 100)}%`, 504, y + 30);
  });

  takeaway.textContent =
    threshold < 0.4
      ? 'This is a permissive cutoff: you catch more positives, but you also invite many more false alarms.'
      : threshold > 0.75
        ? 'This is a strict cutoff: when you predict positive you mean it, but you will miss more true cases.'
        : 'A middle threshold balances missed positives against false alarms instead of pushing hard toward one extreme.';

  metrics.innerHTML = metricMarkup([
    ['Precision', `${Math.round(precision * 100)}%`],
    ['Recall', `${Math.round(recall * 100)}%`],
    ['F1', f1.toFixed(2)],
  ]);
}

function drawCalibration(ctx, state, takeaway, metrics) {
  const drift = state.drift;
  const sharpness = state.sharpness;
  const bins = 5;
  const rows = [];
  let ece = 0;

  for (let i = 0; i < bins; i += 1) {
    const conf = 0.14 + i * 0.18 + (sharpness - 0.5) * 0.08;
    const signedDrift = (drift - 0.5) * 0.42;
    const acc = clamp01(conf - signedDrift * (0.45 + i * 0.12));
    rows.push({ conf: clamp01(conf), acc });
    ece += Math.abs(acc - clamp01(conf)) / bins;
  }

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A reliability view: confidence versus observed accuracy', 56, 58);

  const originX = 86;
  const originY = 282;
  const plotW = 286;
  const plotH = 168;

  ctx.strokeStyle = 'rgba(255,255,255,0.09)';
  ctx.lineWidth = 1;
  ctx.strokeRect(originX, originY - plotH, plotW, plotH);
  ctx.strokeStyle = 'rgba(201,169,110,0.5)';
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + plotW, originY - plotH);
  ctx.stroke();

  rows.forEach((row, index) => {
    const x = originX + 16 + index * 54;
    const confH = row.conf * (plotH - 18);
    const accH = row.acc * (plotH - 18);
    ctx.fillStyle = 'rgba(110,165,201,0.18)';
    roundRect(ctx, x, originY - confH, 18, confH, 8, true, false);
    ctx.fillStyle = 'rgba(201,169,110,0.42)';
    roundRect(ctx, x + 22, originY - accH, 18, accH, 8, true, false);
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('confidence', 90, 306);
  ctx.fillText('accuracy', 176, 306);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(470, 104);
  ctx.lineTo(470, 286);
  ctx.stroke();

  const avgConf = rows.reduce((sum, row) => sum + row.conf, 0) / bins;
  const avgAcc = rows.reduce((sum, row) => sum + row.acc, 0) / bins;
  const stats = [
    ['AVG CONF', avgConf],
    ['AVG ACC', avgAcc],
    ['ECE', ece],
  ];
  stats.forEach(([label, value], index) => {
    const y = 128 + index * 46;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label), 502, y);
    ctx.fillStyle = label === 'ECE' ? '#c9a96e' : '#e8e4de';
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(value) * 100)}%`, 502, y + 30);
  });

  takeaway.textContent =
    avgConf - avgAcc > 0.08
      ? 'The model is overconfident: it talks bigger than it performs.'
      : avgAcc - avgConf > 0.08
        ? 'The model is underconfident: it is doing better than its scores suggest.'
        : 'Confidence and reality are reasonably aligned, which is what calibration is trying to preserve.';

  metrics.innerHTML = metricMarkup([
    ['Avg confidence', `${Math.round(avgConf * 100)}%`],
    ['Observed accuracy', `${Math.round(avgAcc * 100)}%`],
    ['ECE', ece.toFixed(2)],
  ]);
}

function drawRankingMetrics(ctx, state, takeaway, metrics) {
  const topQuality = state.topQuality;
  const tailNoise = state.tailNoise;
  const relevance = [
    clamp01(0.25 + topQuality * 0.85),
    clamp01(0.18 + topQuality * 0.62),
    clamp01(0.12 + topQuality * 0.4),
    clamp01(0.08 + (1 - tailNoise) * 0.38),
    clamp01(0.05 + (1 - tailNoise) * 0.24),
  ];
  const dcg = relevance.reduce((sum, rel, idx) => sum + ((2 ** rel - 1) / Math.log2(idx + 2)), 0);
  const ideal = [...relevance].sort((a, b) => b - a).reduce((sum, rel, idx) => sum + ((2 ** rel - 1) / Math.log2(idx + 2)), 0);
  const ndcg = dcg / Math.max(1e-6, ideal);
  const firstStrong = relevance.findIndex((rel) => rel > 0.6);
  const mrr = firstStrong === -1 ? 0 : 1 / (firstStrong + 1);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A ranking surface where the top positions matter most', 56, 58);

  relevance.forEach((rel, index) => {
    const y = 104 + index * 42;
    ctx.fillStyle = index === 0 ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.03)';
    roundRect(ctx, 84, y, 320, 28, 14, true, false);
    ctx.fillStyle = rel > 0.65 ? '#c9a96e' : rel > 0.35 ? '#6ea5c9' : '#8a8680';
    roundRect(ctx, 84, y, 320 * rel, 28, 14, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(`#${index + 1}`, 52, y + 19);
    ctx.fillText(`relevance ${rel.toFixed(2)}`, 420, y + 19);
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('TOP OF LIST', 84, 324);
  ctx.fillText('LOWER POSITIONS ARE DISCOUNTED', 278, 324);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(540, 104);
  ctx.lineTo(540, 286);
  ctx.stroke();

  const stats = [
    ['NDCG@5', ndcg],
    ['MRR', mrr],
    ['TOP QUALITY', topQuality],
  ];
  stats.forEach(([label, value], index) => {
    const y = 128 + index * 46;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label), 566, y);
    ctx.fillStyle = label === 'TOP QUALITY' ? '#c9a96e' : '#e8e4de';
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(value) * 100)}%`, 566, y + 30);
  });

  takeaway.textContent =
    ndcg > 0.82
      ? 'The useful items are surfacing early, which is exactly what ranking metrics are designed to reward.'
      : firstStrong > 1
        ? 'There may be a good item in the list, but it is landing too low to feel satisfying in a real product.'
        : 'Ranking quality lives at the top of the list, not in whether some relevant item exists somewhere in the tail.';

  metrics.innerHTML = metricMarkup([
    ['NDCG@5', ndcg.toFixed(2)],
    ['MRR', mrr.toFixed(2)],
    ['Top-rank quality', `${Math.round(topQuality * 100)}%`],
  ]);
}

function drawMatrixFactorization(ctx, state, takeaway, metrics) {
  const alignment = state.alignment;
  const sparsity = state.sparsity;
  const score = clamp01(0.2 + alignment * 0.74 - sparsity * 0.12);
  const reconstruction = clamp01(0.28 + alignment * 0.6 - sparsity * 0.24);
  const coldStartRisk = clamp01(0.18 + sparsity * 0.62 - alignment * 0.1);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('One user and several items inside a shared preference space', 56, 58);

  const user = { x: 182, y: 188 };
  const items = [
    { label: 'item A', x: 182 + alignment * 120, y: 188 - alignment * 34, color: '#c9a96e' },
    { label: 'item B', x: 102 + sparsity * 60, y: 116 + sparsity * 56, color: '#6ea5c9' },
    { label: 'item C', x: 286 - alignment * 28, y: 252 - sparsity * 24, color: '#c96e8a' },
  ];

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(user.x, user.y, 126, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#e8e4de';
  ctx.beginPath();
  ctx.arc(user.x, user.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '16px "EB Garamond", serif';
  ctx.fillText('user vector', user.x - 26, user.y + 26);

  items.forEach((item) => {
    ctx.strokeStyle = `${item.color}88`;
    ctx.beginPath();
    ctx.moveTo(user.x, user.y);
    ctx.lineTo(item.x, item.y);
    ctx.stroke();
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8e4de';
    ctx.fillText(item.label, item.x + 12, item.y + 4);
  });

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(456, 102);
  ctx.lineTo(456, 286);
  ctx.stroke();

  [['Affinity', score], ['Reconstruction', reconstruction], ['Cold-start risk', coldStartRisk]].forEach(([label, value], i) => {
    const y = 124 + i * 56;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(label.toUpperCase(), 488, y);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 488, y + 10, 170, 18, 10, true, false);
    ctx.fillStyle = i === 2 ? '#c96e8a' : i === 1 ? '#6ea5c9' : '#c9a96e';
    roundRect(ctx, 488, y + 10, 170 * Number(value), 18, 10, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(value) * 100)}%`, 620, y);
  });

  takeaway.textContent =
    sparsity > 0.7
      ? 'The shared latent space is still useful, but sparse history makes placement uncertain and cold-start risk high.'
      : 'Shared embeddings work because user-item preference becomes geometric alignment instead of a giant sparse lookup table.';

  metrics.innerHTML = metricMarkup([
    ['Affinity', `${Math.round(score * 100)}%`],
    ['Reconstruction', `${Math.round(reconstruction * 100)}%`],
    ['Cold-start risk', `${Math.round(coldStartRisk * 100)}%`],
  ]);
}

function drawTwoTower(ctx, state, takeaway, metrics) {
  const latency = state.latency;
  const interaction = state.interaction;
  const retrievalSpeed = clamp01(0.26 + latency * 0.68);
  const pairRichness = clamp01(0.18 + interaction * 0.72 - latency * 0.08);
  const annWin = clamp01(0.22 + latency * 0.58);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Split the model so item embeddings can be precomputed offline', 56, 58);

  const boxes = [
    { x: 74, y: 126, w: 132, h: 82, title: 'user tower', color: '#6ea5c9' },
    { x: 284, y: 126, w: 132, h: 82, title: 'item tower', color: '#c9a96e' },
    { x: 500, y: 116, w: 146, h: 102, title: 'ANN index', color: '#c96e8a' },
  ];
  boxes.forEach((box) => {
    ctx.fillStyle = `${box.color}18`;
    ctx.strokeStyle = box.color;
    roundRect(ctx, box.x, box.y, box.w, box.h, 20, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '20px "EB Garamond", serif';
    ctx.fillText(box.title, box.x + 20, box.y + 44);
  });
  ctx.strokeStyle = '#8a8680';
  ctx.lineWidth = 1.2;
  [[206, 167, 284, 167], [416, 167, 500, 167]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(ctx, 'Precompute item vectors once. Only encode the user at request time, then retrieve by nearest neighbors.', 74, 254, 590, 22);

  takeaway.textContent =
    interaction > 0.75
      ? 'You want richer pair interactions than a pure two-tower setup can express, so a second-stage ranker becomes more valuable.'
      : 'Two-tower models are fast because the item side is precomputed and indexed before serving starts.';

  metrics.innerHTML = metricMarkup([
    ['Retrieval speed', `${Math.round(retrievalSpeed * 100)}%`],
    ['Pair richness', `${Math.round(pairRichness * 100)}%`],
    ['ANN benefit', `${Math.round(annWin * 100)}%`],
  ]);
}

function drawMleMap(ctx, state, takeaway, metrics) {
  const samples = state.samples;
  const prior = state.prior;
  const mlePeak = 0.28 + samples * 0.48;
  const priorPeak = 0.32;
  const mapPeak = (mlePeak * (0.25 + samples) + priorPeak * prior) / (0.25 + samples + prior);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Likelihood pulls toward the data. MAP also listens to the prior.', 56, 58);

  const originX = 84;
  const originY = 286;
  const width = 360;
  const height = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(originX, originY - height, width, height);
  const toX = (v) => originX + v * width;
  const drawCurve = (peak, spread, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i += 1) {
      const x = i / 100;
      const density = Math.exp(-((x - peak) ** 2) / (2 * spread ** 2));
      const px = toX(x);
      const py = originY - density * 130;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };
  drawCurve(priorPeak, 0.11, '#6ea5c9');
  drawCurve(mlePeak, 0.1 + (1 - samples) * 0.1, '#c9a96e');
  drawCurve(mapPeak, 0.09, '#c96e8a');

  [['PRIOR', priorPeak, '#6ea5c9'], ['MLE', mlePeak, '#c9a96e'], ['MAP', mapPeak, '#c96e8a']].forEach(([label, peak, color], i) => {
    const x = toX(Number(peak));
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(x, 112); ctx.lineTo(x, 286); ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(String(label), x - 14, 104 + i * 12);
  });

  takeaway.textContent =
    samples < 0.3
      ? 'With weak data, the prior noticeably pulls the estimate away from pure MLE.'
      : 'As data gets stronger, MAP and MLE move closer because the likelihood starts dominating the prior.';

  metrics.innerHTML = metricMarkup([
    ['MLE peak', mlePeak.toFixed(2)],
    ['MAP peak', mapPeak.toFixed(2)],
    ['Prior pull', Math.abs(mapPeak - mlePeak).toFixed(2)],
  ]);
}

function drawBiasVariance(ctx, state, takeaway, metrics) {
  const complexity = state.complexity;
  const noise = state.noise;
  const trainErr = clamp01(0.9 - complexity * 0.7);
  const valErr = clamp01(0.28 + ((complexity - 0.48) ** 2) * 1.7 + noise * 0.28);
  const bias = clamp01(0.78 - complexity * 0.62);
  const variance = clamp01(0.1 + complexity * 0.72 + noise * 0.1);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Training error falls, but validation error eventually bends upward', 56, 58);

  const ox = 84, oy = 286, w = 360, h = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(ox, oy - h, w, h);
  const toX = (v) => ox + v * w;
  const toY = (v) => oy - v * h;

  ctx.strokeStyle = '#6ea5c9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const c = i / 100;
    const v = clamp01(0.9 - c * 0.7);
    if (i === 0) ctx.moveTo(toX(c), toY(v)); else ctx.lineTo(toX(c), toY(v));
  }
  ctx.stroke();

  ctx.strokeStyle = '#c9a96e';
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const c = i / 100;
    const v = clamp01(0.28 + ((c - 0.48) ** 2) * 1.7 + noise * 0.28);
    if (i === 0) ctx.moveTo(toX(c), toY(v)); else ctx.lineTo(toX(c), toY(v));
  }
  ctx.stroke();

  const x = toX(complexity);
  const y = toY(valErr);
  ctx.fillStyle = '#c96e8a';
  ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();

  takeaway.textContent =
    complexity < 0.3
      ? 'This is the underfit regime: bias dominates because the model is too rigid.'
      : complexity > 0.75
        ? 'This is the overfit regime: variance is catching up and validation error is paying for it.'
        : 'The middle region is where the model is expressive enough without becoming too unstable.';

  metrics.innerHTML = metricMarkup([
    ['Train error', trainErr.toFixed(2)],
    ['Val error', valErr.toFixed(2)],
    ['Bias / variance', `${bias.toFixed(2)} / ${variance.toFixed(2)}`],
  ]);
}

function drawRegularization(ctx, state, takeaway, metrics) {
  const lambda = state.lambda;
  const capacity = state.capacity;
  const weightNorm = clamp01(capacity * (1 - lambda * 0.72));
  const trainFit = clamp01(0.88 - lambda * 0.34 + capacity * 0.12);
  const generalization = clamp01(0.42 + lambda * 0.34 - Math.max(0, lambda - 0.78) * 0.42 + capacity * 0.06);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A little shrinkage can hurt fit slightly while helping stability', 56, 58);

  const bars = [
    { x: 98, label: 'weight norm', value: weightNorm, color: '#6ea5c9' },
    { x: 274, label: 'train fit', value: trainFit, color: '#c96e8a' },
    { x: 450, label: 'test stability', value: generalization, color: '#c9a96e' },
  ];
  bars.forEach((bar) => {
    const height = 164 * bar.value;
    const y = 270 - height;
    ctx.fillStyle = `${bar.color}20`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 106, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(bar.label, bar.x, 304);
  });

  takeaway.textContent =
    lambda > 0.8
      ? 'This is over-regularized: the model is too constrained to express useful structure.'
      : 'Regularization is helpful when it trims fragile solutions without collapsing the model into underfit.';

  metrics.innerHTML = metricMarkup([
    ['Weight norm', `${Math.round(weightNorm * 100)}%`],
    ['Train fit', `${Math.round(trainFit * 100)}%`],
    ['Test stability', `${Math.round(generalization * 100)}%`],
  ]);
}

function drawServingSkew(ctx, state, takeaway, metrics) {
  const mismatch = state.mismatch;
  const freshness = state.freshness;
  const parity = clamp01(0.94 - mismatch * 0.62 - freshness * 0.28);
  const liveTrust = clamp01(0.88 - mismatch * 0.54 - freshness * 0.22);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Offline and online can share a model while disagreeing on the features', 56, 58);

  const lanes = [
    { y: 126, label: 'offline training pipeline', good: clamp01(0.92 - freshness * 0.16), color: '#6ea5c9' },
    { y: 198, label: 'online serving pipeline', good: liveTrust, color: '#c96e8a' },
  ];
  lanes.forEach((lane) => {
    ctx.fillStyle = `${lane.color}18`;
    ctx.strokeStyle = lane.color;
    roundRect(ctx, 88, lane.y, 320, 40, 16, true, true);
    ctx.fillStyle = lane.color;
    roundRect(ctx, 88, lane.y, 320 * lane.good, 40, 16, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(lane.label, 104, lane.y + 25);
  });

  wrapText(ctx, 'The artifact is the same, but the live system feeds a different feature reality when preprocessing, joins, or freshness do not match.', 88, 286, 590, 22);

  takeaway.textContent =
    mismatch > 0.65
      ? 'The model is not really seeing the same problem online that it saw offline.'
      : 'Skew is a systems bug disguised as a model problem.';

  metrics.innerHTML = metricMarkup([
    ['Train/serve parity', `${Math.round(parity * 100)}%`],
    ['Live feature trust', `${Math.round(liveTrust * 100)}%`],
    ['Freshness gap', `${Math.round(freshness * 100)}%`],
  ]);
}

function drawOnlineOffline(ctx, state, takeaway, metrics) {
  const proxy = state.proxy;
  const friction = state.friction;
  const offline = clamp01(0.34 + proxy * 0.56);
  const online = clamp01(offline - friction * 0.42 + 0.08);
  const gap = offline - online;

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A strong offline gain can shrink once real users and product friction enter', 56, 58);

  [
    { x: 126, label: 'offline metric', value: offline, color: '#6ea5c9' },
    { x: 334, label: 'online lift', value: online, color: '#c9a96e' },
    { x: 542, label: 'friction', value: friction, color: '#c96e8a' },
  ].forEach((bar) => {
    const height = 168 * bar.value;
    const y = 268 - height;
    ctx.fillStyle = `${bar.color}20`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 96, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(bar.label, bar.x - 2, 304);
  });

  takeaway.textContent =
    gap > 0.18
      ? 'The offline proxy is optimistic relative to live reality, so this change still needs online proof.'
      : 'Offline evaluation is useful, but online impact is the final judge.';

  metrics.innerHTML = metricMarkup([
    ['Offline score', `${Math.round(offline * 100)}%`],
    ['Online lift', `${Math.round(online * 100)}%`],
    ['Proxy gap', `${Math.round(gap * 100)} pts`],
  ]);
}

function drawDataDrift(ctx, state, takeaway, metrics) {
  const shift = state.shift;
  const concept = state.concept;
  const liveHealth = clamp01(0.9 - shift * 0.42 - concept * 0.42);
  const alert = clamp01(shift * 0.62 + concept * 0.54);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('The code still runs, but the live data distribution is moving away', 56, 58);

  const ox = 86, oy = 286, w = 320, h = 160;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(ox, oy - h, w, h);
  const toX = (v) => ox + v * w;
  const drawCurve = (mean, spread, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i += 1) {
      const x = i / 100;
      const density = Math.exp(-((x - mean) ** 2) / (2 * spread ** 2));
      const px = toX(x);
      const py = oy - density * 120;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };
  drawCurve(0.36, 0.12, '#6ea5c9');
  drawCurve(0.36 + shift * 0.32, 0.12 + concept * 0.06, '#c9a96e');

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('TRAIN', 90, 306);
  ctx.fillText('LIVE', 156, 306);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.moveTo(490, 102); ctx.lineTo(490, 286); ctx.stroke();
  [['Live health', liveHealth], ['Alert risk', alert], ['Concept change', concept]].forEach(([label, value], i) => {
    const y = 124 + i * 56;
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(label.toUpperCase(), 520, y);
    ctx.fillStyle = i === 1 ? '#c96e8a' : i === 2 ? '#6ea5c9' : '#c9a96e';
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillText(`${Math.round(Number(value) * 100)}%`, 520, y + 30);
  });

  takeaway.textContent =
    alert > 0.6
      ? 'The model may still be serving predictions, but the environment has moved enough that stale assumptions are becoming costly.'
      : 'Drift means the world changed underneath the model, not necessarily that the implementation broke.';

  metrics.innerHTML = metricMarkup([
    ['Population shift', `${Math.round(shift * 100)}%`],
    ['Concept change', `${Math.round(concept * 100)}%`],
    ['Alert risk', `${Math.round(alert * 100)}%`],
  ]);
}

function drawTreeSplit(ctx, state, takeaway, metrics) {
  const separation = state.separation;
  const noise = state.noise;
  const gain = clamp01(0.18 + separation * 0.72 - noise * 0.28);
  const leftPurity = clamp01(0.3 + separation * 0.56 - noise * 0.12);
  const rightPurity = clamp01(0.34 + separation * 0.5 - noise * 0.16);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A split helps when the children are cleaner than the parent', 56, 58);

  const nodes = [
    { x: 156, y: 126, label: 'parent', purity: clamp01(0.46 - separation * 0.18 + noise * 0.2), color: '#8a8680' },
    { x: 88, y: 226, label: 'left child', purity: leftPurity, color: '#6ea5c9' },
    { x: 258, y: 226, label: 'right child', purity: rightPurity, color: '#c9a96e' },
  ];
  nodes.forEach((node) => {
    ctx.fillStyle = `${node.color}20`;
    ctx.strokeStyle = node.color;
    roundRect(ctx, node.x, node.y, 116, 58, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '17px "EB Garamond", serif';
    ctx.fillText(node.label, node.x + 18, node.y + 24);
    ctx.font = '14px "EB Garamond", serif';
    ctx.fillText(`purity ${Math.round(node.purity * 100)}%`, node.x + 18, node.y + 42);
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath(); ctx.moveTo(214, 184); ctx.lineTo(146, 226); ctx.moveTo(272, 184); ctx.lineTo(316, 226); ctx.stroke();

  takeaway.textContent =
    gain < 0.25
      ? 'This split is not buying much because the children are still too mixed.'
      : 'A good tree split earns its keep by creating cleaner child regions than the parent node.';

  metrics.innerHTML = metricMarkup([
    ['Split gain', `${Math.round(gain * 100)}%`],
    ['Left purity', `${Math.round(leftPurity * 100)}%`],
    ['Right purity', `${Math.round(rightPurity * 100)}%`],
  ]);
}

function drawBoosting(ctx, state, takeaway, metrics) {
  const rounds = state.rounds;
  const rate = state.rate;
  const stage1 = clamp01(0.82 - rate * 0.08);
  const stage2 = clamp01(stage1 - rounds * rate * 0.34);
  const stage3 = clamp01(stage2 - rounds * rate * 0.22);
  const overfitRisk = clamp01(rounds * 0.46 + rate * 0.42 - 0.22);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Each new tree tries to reduce the residual error left by the ensemble', 56, 58);

  const residuals = [stage1, stage2, stage3];
  residuals.forEach((value, idx) => {
    const x = 108 + idx * 158;
    const height = 170 * value;
    const y = 270 - height;
    ctx.fillStyle = idx === 0 ? 'rgba(201,110,138,0.2)' : idx === 1 ? 'rgba(110,165,201,0.2)' : 'rgba(201,169,110,0.2)';
    ctx.strokeStyle = idx === 0 ? '#c96e8a' : idx === 1 ? '#6ea5c9' : '#c9a96e';
    roundRect(ctx, x, y, 98, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(`tree ${idx + 1}`, x + 22, 304);
  });

  takeaway.textContent =
    overfitRisk > 0.62
      ? 'The ensemble is correcting aggressively enough that it is starting to chase noise rather than just residual signal.'
      : 'Boosting works because many small corrections can outperform one giant tree.';

  metrics.innerHTML = metricMarkup([
    ['Residual after t1', stage1.toFixed(2)],
    ['Residual after t3', stage3.toFixed(2)],
    ['Overfit risk', `${Math.round(overfitRisk * 100)}%`],
  ]);
}

function drawFeatureLeakage(ctx, state, takeaway, metrics) {
  const future = state.future;
  const proxy = state.proxy;
  const offline = clamp01(0.42 + future * 0.36 + proxy * 0.28);
  const live = clamp01(offline - future * 0.52 - proxy * 0.18);
  const gap = offline - live;

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Leakage makes the offline score sparkle for the wrong reason', 56, 58);

  [
    { x: 140, label: 'offline eval', value: offline, color: '#c9a96e' },
    { x: 374, label: 'live reality', value: live, color: '#6ea5c9' },
  ].forEach((bar) => {
    const height = 176 * bar.value;
    const y = 270 - height;
    ctx.fillStyle = `${bar.color}20`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 116, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(bar.label, bar.x + 6, 304);
  });
  ctx.fillStyle = '#c96e8a';
  ctx.font = '18px "EB Garamond", serif';
  ctx.fillText(`gap ${Math.round(gap * 100)} pts`, 548, 188);

  takeaway.textContent =
    gap > 0.22
      ? 'This is the classic leakage signature: unbelievable offline performance that collapses once future information disappears.'
      : 'A feature can look predictive offline simply because evaluation let it peek into the future.';

  metrics.innerHTML = metricMarkup([
    ['Offline score', `${Math.round(offline * 100)}%`],
    ['Live score', `${Math.round(live * 100)}%`],
    ['Leakage gap', `${Math.round(gap * 100)} pts`],
  ]);
}

function drawFeatureShift(ctx, state, takeaway, metrics) {
  const shift = state.shift;
  const missing = state.missing;
  const stability = clamp01(0.92 - shift * 0.44 - missing * 0.34);
  const monitorNeed = clamp01(0.16 + shift * 0.54 + missing * 0.42);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('The column name stayed the same, but the feature stopped behaving the same', 56, 58);

  [['train mean', 0.34, '#6ea5c9'], ['live mean', 0.34 + shift * 0.34, '#c9a96e']].forEach(([label, mean, color], idx) => {
    const x = 100 + idx * 220;
    const h = 170 * Number(mean);
    const y = 270 - h;
    ctx.fillStyle = `${color}20`;
    ctx.strokeStyle = color;
    roundRect(ctx, x, y, 110, h, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '17px "EB Garamond", serif';
    ctx.fillText(String(label), x + 12, 304);
  });
  ctx.fillStyle = 'rgba(201,110,138,0.2)';
  ctx.strokeStyle = '#c96e8a';
  roundRect(ctx, 540, 120, 96, 150 * missing, 18, true, true);
  ctx.fillStyle = '#e8e4de';
  ctx.fillText('missingness', 532, 304);

  takeaway.textContent =
    monitorNeed > 0.62
      ? 'The schema may still validate, but the feature has drifted enough that relying on it blindly is risky.'
      : 'Feature monitoring is about behavior, not just whether the column still exists.';

  metrics.innerHTML = metricMarkup([
    ['Stability', `${Math.round(stability * 100)}%`],
    ['Missingness change', `${Math.round(missing * 100)}%`],
    ['Monitor need', `${Math.round(monitorNeed * 100)}%`],
  ]);
}

function drawGuidance(ctx, state, takeaway, metrics) {
  const guidance = state.guidance;
  const noise = state.noise;
  const adherence = clamp01(0.26 + guidance * 0.72 - noise * 0.08);
  const diversity = clamp01(0.84 - guidance * 0.48 - noise * 0.16);
  const realism = clamp01(0.6 + guidance * 0.18 - Math.max(0, guidance - 0.72) * 0.54);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Guidance steers toward the prompt, but too much steering gets brittle', 56, 58);

  [
    { x: 96, label: 'prompt adherence', value: adherence, color: '#c9a96e' },
    { x: 286, label: 'diversity', value: diversity, color: '#6ea5c9' },
    { x: 476, label: 'realism', value: realism, color: '#c96e8a' },
  ].forEach((bar) => {
    const h = 170 * bar.value;
    const y = 270 - h;
    ctx.fillStyle = `${bar.color}20`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 106, h, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(bar.label, bar.x - 4, 304);
  });

  takeaway.textContent =
    guidance > 0.8
      ? 'This is over-steered: the sample hugs the prompt harder, but diversity and realism are starting to pay the price.'
      : 'Guidance is a steering knob, not a monotonic quality knob.';

  metrics.innerHTML = metricMarkup([
    ['Adherence', `${Math.round(adherence * 100)}%`],
    ['Diversity', `${Math.round(diversity * 100)}%`],
    ['Realism', `${Math.round(realism * 100)}%`],
  ]);
}

function drawDpo(ctx, state, takeaway, metrics) {
  const margin = state.margin;
  const beta = state.beta;
  const chosen = clamp01(0.42 + margin * 0.46 + beta * 0.08);
  const rejected = clamp01(0.46 - margin * 0.28 + beta * 0.04);
  const preferenceGain = clamp01(chosen - rejected + 0.5);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Push the policy to prefer the chosen answer over the rejected one', 56, 58);

  [
    { x: 142, label: 'chosen response', value: chosen, color: '#c9a96e' },
    { x: 380, label: 'rejected response', value: rejected, color: '#c96e8a' },
  ].forEach((bar) => {
    const h = 176 * bar.value;
    const y = 270 - h;
    ctx.fillStyle = `${bar.color}20`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 120, h, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(bar.label, bar.x - 6, 304);
  });
  ctx.fillStyle = '#6ea5c9';
  ctx.font = '18px "EB Garamond", serif';
  ctx.fillText(`preference gain ${Math.round(preferenceGain * 100)}%`, 482, 170);

  takeaway.textContent =
    beta > 0.75
      ? 'The preference push is strong, which can help quickly but risks becoming brittle if the preference data is noisy.'
      : 'Preference tuning is about relative likelihood: chosen answers should outrank rejected ones.';

  metrics.innerHTML = metricMarkup([
    ['Chosen prob.', `${Math.round(chosen * 100)}%`],
    ['Rejected prob.', `${Math.round(rejected * 100)}%`],
    ['Preference gain', `${Math.round(preferenceGain * 100)}%`],
  ]);
}

function drawRewardHacking(ctx, state, takeaway, metrics) {
  const pressure = state.pressure;
  const proxyGap = state.proxyGap;
  const proxy = clamp01(0.34 + pressure * 0.6);
  const trueObj = clamp01(0.38 + pressure * 0.2 - proxyGap * pressure * 0.42);
  const exploitRisk = clamp01(0.16 + pressure * 0.42 + proxyGap * 0.46);

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('The proxy keeps going up even while the real objective bends away', 56, 58);

  const ox = 94, oy = 286, w = 360, h = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(ox, oy - h, w, h);
  const toX = (v) => ox + v * w;
  const toY = (v) => oy - v * h;

  ctx.strokeStyle = '#c9a96e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const t = i / 100;
    const v = clamp01(0.28 + t * 0.64);
    if (i === 0) ctx.moveTo(toX(t), toY(v)); else ctx.lineTo(toX(t), toY(v));
  }
  ctx.stroke();

  ctx.strokeStyle = '#c96e8a';
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const t = i / 100;
    const v = clamp01(0.34 + t * 0.26 - proxyGap * t * 0.56);
    if (i === 0) ctx.moveTo(toX(t), toY(v)); else ctx.lineTo(toX(t), toY(v));
  }
  ctx.stroke();

  const x = toX(pressure);
  ctx.fillStyle = '#6ea5c9';
  ctx.beginPath(); ctx.arc(x, toY(trueObj), 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('optimization pressure', x - 42, 304);

  takeaway.textContent =
    exploitRisk > 0.68
      ? 'The proxy is being optimized hard enough that its blind spots are starting to dominate the behavior.'
      : 'The danger is not optimization by itself. The danger is optimizing the wrong stand-in for what humans actually care about.';

  metrics.innerHTML = metricMarkup([
    ['Proxy reward', `${Math.round(proxy * 100)}%`],
    ['True objective', `${Math.round(trueObj * 100)}%`],
    ['Exploit risk', `${Math.round(exploitRisk * 100)}%`],
  ]);
}

function drawRetrievalFunnel(ctx, state, takeaway, metrics) {
  const candidates = Math.round(state.candidates);
  const recall = state.recall;
  const precision = state.precision;
  const relevantTotal = 20;
  const retrievedRelevant = relevantTotal * recall;
  const shortlist = 50;
  const topK = 10;
  const topRelevant = Math.min(retrievedRelevant, topK * precision);
  const latency = 18 + candidates * 0.03 + shortlist * 0.18;

  clearCanvas(ctx);

  const stages = [
    { label: 'retrieve', value: candidates, color: '#6ea5c9', relevant: retrievedRelevant },
    { label: 'shortlist', value: shortlist, color: '#c9a96e', relevant: Math.min(retrievedRelevant, shortlist * precision) },
    { label: 'top 10', value: topK, color: '#c96e8a', relevant: topRelevant },
  ];

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A pipeline where each stage solves a narrower problem', 56, 60);

  const maxValue = candidates;
  stages.forEach((stage, index) => {
    const width = 410 * (stage.value / maxValue);
    const x = 78;
    const y = 104 + index * 86;
    ctx.fillStyle = `${stage.color}25`;
    ctx.strokeStyle = stage.color;
    roundRect(ctx, x, y, width, 46, 16, true, true);
    ctx.fillStyle = stage.color;
    roundRect(ctx, x, y, Math.max(14, width * (stage.relevant / stage.value || 0)), 46, 16, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(stage.label, x + 18, y + 29);
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8a8680';
    ctx.fillText(`${stage.value} items`, x + width + 20, y + 20);
    ctx.fillText(`${stage.relevant.toFixed(1)} relevant`, x + width + 20, y + 38);
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '16px "EB Garamond", serif';
  wrapText(
    ctx,
    recall < 0.6
      ? 'The retriever is dropping too many relevant items. The ranker cannot recover items it never sees.'
      : precision < 0.55
        ? 'Retrieval is healthy, but the ranker is still wasting the shortlist on mediocre items.'
        : 'The pipeline is balanced: retrieval preserves options and ranking uses compute where it matters.',
    520,
    126,
    170,
    22
  );

  takeaway.textContent =
    recall < 0.6
      ? 'The bottleneck is early recall, not the final ranker.'
      : precision < 0.55
        ? 'The retriever is doing its job, but the ranking stage still needs better discrimination.'
        : 'This is why staged systems exist: cheap recall first, expensive precision later.';

  metrics.innerHTML = metricMarkup([
    ['Top-10 relevant', topRelevant.toFixed(1)],
    ['Recall kept', `${Math.round(recall * 100)}%`],
    ['Est. latency', `${latency.toFixed(0)} ms`],
  ]);
}

function drawColdStart(ctx, state, takeaway, metrics) {
  const history = state.history;
  const content = state.content;
  const collaborativeWeight = Math.pow(history, 0.75);
  const contentWeight = 1 - collaborativeWeight;
  const collaborativeStrength = collaborativeWeight * 0.88;
  const contentStrength = contentWeight * (0.42 + content * 0.5);
  const blended = collaborativeStrength + contentStrength;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('How the system shifts responsibility during cold start', 56, 60);

  const bars = [
    { x: 90, label: 'collaborative', value: collaborativeStrength, color: '#6ea5c9' },
    { x: 250, label: 'content', value: contentStrength, color: '#c9a96e' },
    { x: 410, label: 'blended score', value: blended, color: '#c96e8a' },
  ];

  bars.forEach((bar) => {
    const height = 170 * Math.min(bar.value, 1);
    const y = 270 - height;
    ctx.fillStyle = `${bar.color}25`;
    ctx.strokeStyle = bar.color;
    roundRect(ctx, bar.x, y, 108, height, 18, true, true);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(bar.label.toUpperCase(), bar.x, 300);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '24px "EB Garamond", serif';
    ctx.fillText(`${Math.round(bar.value * 100)}%`, bar.x, y - 12);
  });

  ctx.font = '16px "EB Garamond", serif';
  ctx.fillStyle = '#e8e4de';
  wrapText(
    ctx,
    history < 0.2
      ? 'There is not enough behavior history yet, so metadata and content features are doing most of the work.'
      : history > 0.65
        ? 'The system can trust collaborative patterns because the user or item now has enough interaction history.'
        : 'The system is in a hybrid regime where content and behavior both matter.',
    560,
    120,
    140,
    22
  );

  takeaway.textContent =
    history < 0.2
      ? 'Cold start means content has to carry the recommendation until behavior arrives.'
      : history > 0.65
        ? 'Once history accumulates, collaborative signals become the stronger guide.'
        : 'Hybrid recommenders are valuable because signal quality changes over a user or item’s lifetime.';

  metrics.innerHTML = metricMarkup([
    ['History signal', `${Math.round(history * 100)}%`],
    ['Content quality', `${Math.round(content * 100)}%`],
    ['Blended confidence', `${Math.round(blended * 100)}%`],
  ]);
}

function drawDiffusion(ctx, state, takeaway, metrics) {
  const noise = state.noise;
  const steps = Math.round(state.steps);
  const denoiseProgress = Math.min(1, steps / 20);
  const residual = noise * (1 - denoiseProgress * 0.88);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A structured target, a noisy sample, and the denoised path', 56, 58);

  const points = [];
  for (let i = 0; i <= 80; i += 1) {
    const t = i / 80;
    const target = Math.sin(t * Math.PI * 1.7) * 0.5 + Math.cos(t * Math.PI * 3.1) * 0.18;
    const deterministicNoise = (Math.sin(t * 18) + Math.cos(t * 27)) * 0.18;
    const noisy = target + deterministicNoise * noise;
    const denoised = target + deterministicNoise * residual;
    points.push({ t, target, noisy, denoised });
  }

  drawSeries(ctx, points, 'target', '#c9a96e', 2.5, 82, 290, 430, 150);
  drawSeries(ctx, points, 'denoised', '#6ea5c9', 2.5, 82, 290, 430, 150);

  ctx.fillStyle = '#c96e8a';
  points.forEach((point, index) => {
    if (index % 3 !== 0) return;
    const x = 82 + point.t * 430;
    const y = 210 - point.noisy * 90;
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('NOISY START', 82, 314);
  ctx.fillText('DENOISED TRAJECTORY', 244, 314);
  ctx.fillText('TARGET SHAPE', 426, 314);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '16px "EB Garamond", serif';
  wrapText(
    ctx,
    steps < 6
      ? 'There are not enough reverse steps yet, so the sample still carries obvious noise.'
      : residual > 0.18
        ? 'The denoiser is improving the sample, but a lot of uncertainty is still unresolved.'
        : 'The repeated denoising steps have pushed the sample much closer to the underlying target structure.',
    548,
    118,
    138,
    22
  );

  takeaway.textContent =
    steps < 6
      ? 'Diffusion feels rough when the reverse process stops too early.'
      : residual > 0.18
        ? 'Each denoising step removes some uncertainty, but not all of it.'
        : 'This is the core intuition: coherent samples emerge by repeatedly removing noise.';

  metrics.innerHTML = metricMarkup([
    ['Steps', `${steps}`],
    ['Residual noise', residual.toFixed(2)],
    ['Approx. fidelity', `${Math.round((1 - residual) * 100)}%`],
  ]);
}

function drawBandit(ctx, state, takeaway, metrics) {
  const epsilon = state.epsilon;
  const gap = state.gap;
  const bestReward = 0.58 + gap / 2;
  const otherReward = 0.58 - gap / 2;
  const horizon = 200;
  const expectedPerPull = (1 - epsilon) * bestReward + epsilon * ((bestReward + otherReward) / 2);
  const cumulativeReward = expectedPerPull * horizon;
  const optimalReward = bestReward * horizon;
  const regret = optimalReward - cumulativeReward;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Exploration buys information. Exploitation cashes it in.', 56, 58);

  const arms = [
    { x: 90, reward: bestReward, label: 'best arm', color: '#6ea5c9' },
    { x: 260, reward: otherReward, label: 'second arm', color: '#c96e8a' },
  ];

  arms.forEach((arm) => {
    const height = 180 * arm.reward;
    const y = 260 - height;
    ctx.fillStyle = `${arm.color}25`;
    ctx.strokeStyle = arm.color;
    roundRect(ctx, arm.x, y, 110, height, 18, true, true);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '22px "EB Garamond", serif';
    ctx.fillText(arm.reward.toFixed(2), arm.x, y - 12);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(arm.label.toUpperCase(), arm.x, 286);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  roundRect(ctx, 438, 128, 220, 28, 14, true, false);
  ctx.fillStyle = '#c9a96e';
  roundRect(ctx, 438, 128, 220 * epsilon, 28, 14, true, false);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('EXPLORATION SHARE', 438, 118);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '18px "EB Garamond", serif';
  ctx.fillText(`${Math.round(epsilon * horizon)} exploratory pulls`, 438, 190);
  ctx.fillText(`${Math.round((1 - epsilon) * horizon)} exploit pulls`, 438, 218);
  ctx.fillText(`expected reward ${cumulativeReward.toFixed(1)}`, 438, 246);
  ctx.fillText(`regret ${regret.toFixed(1)}`, 438, 274);

  const underExploring = epsilon < 0.06 && gap < 0.09;
  const overExploring = epsilon > 0.28 && gap > 0.16;
  takeaway.textContent = underExploring
    ? 'When the arms are close, too little exploration can trap you in a mediocre choice.'
    : overExploring
      ? 'Once the reward gap is obvious, excessive exploration mostly throws away reward.'
      : 'You want enough exploration to learn, then enough exploitation to benefit from what you learned.';

  metrics.innerHTML = metricMarkup([
    ['Explore rate', `${Math.round(epsilon * 100)}%`],
    ['Reward gap', gap.toFixed(2)],
    ['Expected regret', regret.toFixed(1)],
  ]);
}

function drawNeuron(ctx, state, takeaway, metrics) {
  const { x1, x2, w1, w2, bias } = state;
  const c1 = x1 * w1;
  const c2 = x2 * w2;
  const z = c1 + c2 + bias;
  const a = 1 / (1 + Math.exp(-z));
  const dominant = Math.abs(c1) > Math.abs(c2) ? 'x1 path' : 'x2 path';

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('One neuron: inputs become one score, then one activation', 56, 58);

  const inputs = [
    { label: 'x1', value: x1, weight: w1, contribution: c1, x: 88, y: 118, color: '#6ea5c9' },
    { label: 'x2', value: x2, weight: w2, contribution: c2, x: 88, y: 214, color: '#c96e8a' },
  ];

  inputs.forEach((input) => {
    ctx.fillStyle = `${input.color}16`;
    ctx.strokeStyle = input.color;
    roundRect(ctx, input.x, input.y, 110, 54, 18, true, true);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(input.label.toUpperCase(), input.x + 16, input.y + 20);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '22px "EB Garamond", serif';
    ctx.fillText(input.value.toFixed(2), input.x + 16, input.y + 41);

    const lineY = input.y + 27;
    ctx.strokeStyle = input.contribution >= 0 ? '#c9a96e' : '#c96e8a';
    ctx.lineWidth = 1 + Math.abs(input.weight) * 3.2;
    ctx.beginPath();
    ctx.moveTo(input.x + 110, lineY);
    ctx.lineTo(316, lineY);
    ctx.stroke();

    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`w=${input.weight.toFixed(2)}`, 222, lineY - 8);
  });

  ctx.fillStyle = 'rgba(201,169,110,0.12)';
  ctx.strokeStyle = '#c9a96e';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(374, 180, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('PRE-ACTIVATION Z', 330, 162);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(z.toFixed(2), 348, 202);

  ctx.fillStyle = 'rgba(110,165,201,0.12)';
  ctx.strokeStyle = '#6ea5c9';
  roundRect(ctx, 492, 112, 172, 140, 20, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('SIGMOID OUTPUT', 514, 136);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, 514, 154, 126, 22, 12, true, false);
  ctx.fillStyle = '#6ea5c9';
  roundRect(ctx, 514, 154, 126 * a, 22, 12, true, false);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '42px "EB Garamond", serif';
  ctx.fillText(`${Math.round(a * 100)}%`, 514, 224);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    z > 1
      ? 'The weighted evidence is strongly positive, so the neuron activates confidently.'
      : z < -1
        ? 'The weighted evidence is mostly negative, so the neuron stays quiet.'
        : 'The inputs are balancing each other, so the neuron is still uncertain.',
    492,
    266,
    180,
    22
  );

  takeaway.textContent =
    Math.abs(z) < 0.5
      ? 'This neuron is sitting near its decision boundary, so small input changes still matter a lot.'
      : z > 0
        ? 'The positive evidence outweighs the negative evidence, so the neuron fires.'
        : 'Negative evidence is winning, so the neuron output stays low.';

  metrics.innerHTML = metricMarkup([
    ['z score', z.toFixed(2)],
    ['activation', a.toFixed(2)],
    ['dominant path', dominant],
  ]);
}

function drawActivationBasics(ctx, state, takeaway, metrics) {
  const z = state.z;
  const slope = state.slope;
  const sig = 1 / (1 + Math.exp(-(z * slope)));
  const tanh = Math.tanh(z * slope);
  const relu = Math.max(0, z * slope);
  const sigGrad = slope * sig * (1 - sig);

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '26px "EB Garamond", serif';
  wrapText(ctx, 'Different activations keep the same input in different regimes', 56, 58, 560, 30);

  const originX = 76;
  const originY = 250;
  const width = 380;
  const height = 150;
  const toX = (v) => originX + ((v + 3) / 6) * width;
  const toY = (v) => originY - ((v + 1.2) / 3.4) * height;

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + width, originY);
  ctx.moveTo(originX + width / 2, originY - height);
  ctx.lineTo(originX + width / 2, originY + 12);
  ctx.stroke();

  const series = [
    { color: '#6ea5c9', fn: (x) => 1 / (1 + Math.exp(-(x * slope))), label: 'sigmoid' },
    { color: '#c96e8a', fn: (x) => Math.tanh(x * slope), label: 'tanh' },
    { color: '#c9a96e', fn: (x) => Math.max(0, x * slope) / 3, label: 'relu' },
  ];

  series.forEach((seriesItem) => {
    ctx.strokeStyle = seriesItem.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i += 1) {
      const x = -3 + (6 * i) / 100;
      const y = seriesItem.fn(x);
      const px = toX(x);
      const py = seriesItem.label === 'relu' ? originY - y * height : toY(y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });

  const markerX = toX(z);
  ctx.strokeStyle = '#e8e4de';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(markerX, originY - height);
  ctx.lineTo(markerX, originY + 8);
  ctx.stroke();

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText(`z=${z.toFixed(2)}`, markerX - 26, originY - height - 10);

  const stats = [
    ['sigmoid', sig, '#6ea5c9'],
    ['tanh', (tanh + 1) / 2, '#c96e8a'],
    ['relu', Math.min(1, relu / 3), '#c9a96e'],
  ];
  stats.forEach(([label, value, color], index) => {
    const y = 126 + index * 66;
    ctx.fillStyle = color;
    roundRect(ctx, 510, y - 7, 16, 10, 6, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '18px "EB Garamond", serif';
    ctx.fillText(String(label), 536, y + 2);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('OUTPUT', 536, y + 24);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '28px "EB Garamond", serif';
    ctx.fillText(`${Number(value).toFixed(2)}`, 536, y + 54);
  });

  takeaway.textContent =
    z < -0.8
      ? 'On the negative side, ReLU shuts off completely while sigmoid and tanh mostly saturate.'
      : z > 1.4
        ? 'Large positive inputs push sigmoid and tanh toward saturation, while ReLU keeps growing.'
        : 'Near zero, these activations are most responsive, which is why this region matters so much for training.';

  metrics.innerHTML = metricMarkup([
    ['sigmoid grad', sigGrad.toFixed(2)],
    ['tanh out', tanh.toFixed(2)],
    ['relu active', relu > 0 ? 'yes' : 'no'],
  ]);
}

function drawOutputFunctions(ctx, state, takeaway, metrics) {
  const binary = state.binary;
  const classA = state.classA;
  const classB = state.classB;
  const classC = 0;
  const binaryProb = 1 / (1 + Math.exp(-binary));
  const exps = [classA, classB, classC].map((v) => Math.exp(v));
  const total = exps.reduce((sum, v) => sum + v, 0);
  const probs = exps.map((v) => v / total);
  const topIndex = probs.indexOf(Math.max(...probs));
  const labels = ['A', 'B', 'C'];

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Binary output and multiclass output are solving different jobs', 56, 58);

  ctx.fillStyle = 'rgba(110,165,201,0.12)';
  ctx.strokeStyle = '#6ea5c9';
  roundRect(ctx, 72, 110, 240, 164, 20, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('SIGMOID / BINARY', 94, 136);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, 94, 160, 156, 24, 12, true, false);
  ctx.fillStyle = '#6ea5c9';
  roundRect(ctx, 94, 160, 156 * binaryProb, 24, 12, true, false);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '44px "EB Garamond", serif';
  ctx.fillText(`${Math.round(binaryProb * 100)}%`, 94, 236);
  ctx.font = '16px "EB Garamond", serif';
  ctx.fillText(`logit ${binary.toFixed(2)}`, 94, 262);

  ctx.fillStyle = 'rgba(201,169,110,0.12)';
  ctx.strokeStyle = '#c9a96e';
  roundRect(ctx, 350, 110, 324, 164, 20, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('SOFTMAX / MULTICLASS', 372, 136);
  probs.forEach((prob, index) => {
    const y = 164 + index * 34;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 428, y, 156, 18, 10, true, false);
    ctx.fillStyle = index === topIndex ? '#c9a96e' : '#6ea5c9';
    roundRect(ctx, 428, y, 156 * prob, 18, 10, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '15px "EB Garamond", serif';
    ctx.fillText(`class ${labels[index]}`, 372, y + 13);
    ctx.fillText(`${Math.round(prob * 100)}%`, 596, y + 13);
  });

  takeaway.textContent =
    Math.abs(classA - classB) < 0.2
      ? 'Softmax is still uncertain because the class logits are competing closely.'
      : `Softmax is choosing class ${labels[topIndex]} because that logit is winning the relative competition.`;

  metrics.innerHTML = metricMarkup([
    ['binary prob', `${Math.round(binaryProb * 100)}%`],
    ['top class', labels[topIndex]],
    ['top margin', `${Math.round((Math.max(...probs) - probs.slice().sort((a, b) => b - a)[1]) * 100)} pts`],
  ]);
}

function drawForwardPass(ctx, state, takeaway, metrics) {
  const x1 = state.x1;
  const x2 = state.x2;
  const h1 = Math.max(0, 1.2 * x1 - 0.6 * x2 + 0.15);
  const h2 = Math.max(0, -0.5 * x1 + 1.15 * x2 - 0.1);
  const logit = 1.35 * h1 + 0.95 * h2 - 0.7;
  const yhat = 1 / (1 + Math.exp(-logit));
  const dominant = h1 > h2 ? 'hidden 1' : 'hidden 2';

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('A forward pass builds hidden features, then reads them out', 56, 58);

  const nodes = {
    x1: { x: 96, y: 132, r: 30, label: 'x1', value: x1 },
    x2: { x: 96, y: 228, r: 30, label: 'x2', value: x2 },
    h1: { x: 298, y: 132, r: 34, label: 'h1', value: h1 },
    h2: { x: 298, y: 228, r: 34, label: 'h2', value: h2 },
    out: { x: 536, y: 180, r: 42, label: 'ŷ', value: yhat },
  };

  const edges = [
    ['x1', 'h1', '#6ea5c9'],
    ['x2', 'h1', '#6ea5c9'],
    ['x1', 'h2', '#c96e8a'],
    ['x2', 'h2', '#c96e8a'],
    ['h1', 'out', '#c9a96e'],
    ['h2', 'out', '#c9a96e'],
  ];
  edges.forEach(([from, to, color]) => {
    const a = nodes[from];
    const b = nodes[to];
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x + a.r, a.y);
    ctx.lineTo(b.x - b.r, b.y);
    ctx.stroke();
  });

  Object.values(nodes).forEach((node) => {
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = node.label === 'ŷ' ? '#c9a96e' : '#6ea5c9';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(node.label.toUpperCase(), node.x - 14, node.y - 12);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '22px "EB Garamond", serif';
    ctx.fillText(node.value.toFixed(2), node.x - 20, node.y + 16);
  });

  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    dominant === 'hidden 1'
      ? 'The first hidden unit is carrying more of the final prediction, so this input pattern is activating its feature more strongly.'
      : 'The second hidden unit is carrying more of the final prediction, so the network is reading this example through a different intermediate feature.',
    72,
    314,
    600,
    22
  );

  takeaway.textContent =
    'The forward pass is just signal transformation: raw inputs become hidden features, and hidden features become the final prediction.';

  metrics.innerHTML = metricMarkup([
    ['hidden 1', h1.toFixed(2)],
    ['hidden 2', h2.toFixed(2)],
    ['prediction', `${Math.round(yhat * 100)}%`],
  ]);
}

function drawChainRule(ctx, state, takeaway, metrics) {
  const error = state.error;
  const slope = state.slope;
  const input = state.input;
  const grad = error * slope * input;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('The chain rule multiplies local sensitivities into one gradient', 56, 58);

  const factors = [
    { label: 'loss to prediction', value: error, x: 76, color: '#c96e8a' },
    { label: 'prediction to z', value: slope, x: 262, color: '#6ea5c9' },
    { label: 'z to weight', value: input, x: 448, color: '#c9a96e' },
  ];

  factors.forEach((factor, idx) => {
    const h = Math.min(120, Math.max(18, Math.abs(factor.value) * 120));
    const y = 248 - h;
    ctx.fillStyle = `${factor.color}20`;
    ctx.strokeStyle = factor.color;
    roundRect(ctx, factor.x, 120, 140, 150, 18, true, true);
    ctx.fillStyle = factor.color;
    roundRect(ctx, factor.x + 44, y, 52, h, 12, true, false);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    wrapText(ctx, factor.label.toUpperCase(), factor.x + 16, 148, 104, 16);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '22px "EB Garamond", serif';
    ctx.fillText(factor.value.toFixed(2), factor.x + 44, 232);
    if (idx < factors.length - 1) {
      ctx.fillStyle = '#8a8680';
      ctx.font = '22px "EB Garamond", serif';
      ctx.fillText('x', factor.x + 154, 202);
    }
  });

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.strokeStyle = grad >= 0 ? '#c9a96e' : '#c96e8a';
  roundRect(ctx, 612, 132, 88, 120, 18, true, true);
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('GRADIENT', 626, 156);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '34px "EB Garamond", serif';
  ctx.fillText(grad.toFixed(2), 626, 214);

  takeaway.textContent =
    slope < 0.12
      ? 'The local activation slope is choking the gradient, so even a real prediction error barely reaches the weight.'
      : input < 0.2
        ? 'The path exists, but the weight did not influence the output much because the input through that edge was tiny.'
        : 'This weight gets a meaningful gradient because the loss signal, local slope, and input path are all alive.';

  metrics.innerHTML = metricMarkup([
    ['error term', error.toFixed(2)],
    ['local slope', slope.toFixed(2)],
    ['final gradient', grad.toFixed(2)],
  ]);
}

function drawBackprop(ctx, state, takeaway, metrics) {
  const x1 = state.x1;
  const x2 = state.x2;
  const error = state.error;
  const localSlope = 0.72;
  const delta = error * localSlope;
  const grads = [
    { label: 'dw1', value: x1 * delta, color: '#6ea5c9' },
    { label: 'dw2', value: x2 * delta, color: '#c96e8a' },
    { label: 'db', value: delta, color: '#c9a96e' },
  ];

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Backprop turns one error signal into parameter-by-parameter updates', 56, 58);

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('UPSTREAM ERROR', 80, 126);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '40px "EB Garamond", serif';
  ctx.fillText(error.toFixed(2), 80, 172);
  ctx.font = '16px "EB Garamond", serif';
  ctx.fillText(`local slope ${localSlope.toFixed(2)} -> delta ${delta.toFixed(2)}`, 80, 204);

  grads.forEach((grad, index) => {
    const x = 72 + index * 206;
    const y = 234;
    const h = Math.min(120, Math.max(10, Math.abs(grad.value) * 120));
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = grad.color;
    roundRect(ctx, x, 96, 158, 190, 18, true, true);
    ctx.fillStyle = grad.value >= 0 ? `${grad.color}66` : `${grad.color}33`;
    roundRect(ctx, x + 52, y - h, 54, h, 12, true, false);
    ctx.fillStyle = '#8a8680';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(grad.label.toUpperCase(), x + 18, 120);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '26px "EB Garamond", serif';
    ctx.fillText(grad.value.toFixed(2), x + 18, 156);
    ctx.font = '14px "EB Garamond", serif';
    ctx.fillText(`update ${(-grad.value).toFixed(2)}`, x + 18, 186);
  });

  takeaway.textContent =
    Math.abs(grads[0].value) > Math.abs(grads[1].value)
      ? 'The first weight gets more blame because more signal flowed through that edge during the forward pass.'
      : 'The second weight gets more blame because that path influenced the output more strongly on this example.';

  metrics.innerHTML = metricMarkup([
    ['delta', delta.toFixed(2)],
    ['dw1', grads[0].value.toFixed(2)],
    ['dw2', grads[1].value.toFixed(2)],
  ]);
}

function drawGradientDescent(ctx, state, takeaway, metrics) {
  const position = state.position;
  const lr = state.lr;
  const curvature = state.curvature;
  const lossFn = (x) => 0.24 + curvature * x * x * 0.18;
  const gradFn = (x) => 2 * curvature * x * 0.18;
  const grad = gradFn(position);
  const next = position - lr * grad;
  const toCanvasX = (x) => 96 + ((x + 3.2) / 6.4) * 340;
  const toCanvasY = (loss) => 274 - ((loss - 0.24) / 2.0) * 180;

  clearCanvas(ctx);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Gradient descent uses the local slope to choose the next step', 56, 58);

  ctx.strokeStyle = '#c9a96e';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 1) {
    const x = -3.2 + (6.4 * i) / 100;
    const px = toCanvasX(x);
    const py = toCanvasY(lossFn(x));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const px = toCanvasX(position);
  const py = toCanvasY(lossFn(position));
  const nx = toCanvasX(next);
  const ny = toCanvasY(lossFn(next));
  ctx.strokeStyle = '#6ea5c9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(nx, ny);
  ctx.stroke();
  ctx.fillStyle = '#e8e4de';
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6ea5c9';
  ctx.beginPath();
  ctx.arc(nx, ny, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('CURRENT', px - 28, py - 12);
  ctx.fillText('NEXT', nx - 16, ny - 12);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '15px "EB Garamond", serif';
  wrapText(
    ctx,
    Math.abs(next) > Math.abs(position)
      ? 'The step is too aggressive, so the update moves farther from the minimum instead of closer to it.'
      : 'The update uses the local slope to move closer to the minimum in one small downhill step.',
    478,
    134,
    182,
    22
  );

  takeaway.textContent =
    Math.abs(next) > Math.abs(position)
      ? 'This step is overshooting the valley.'
      : 'Gradient descent is just repeated local downhill steps like this one.';

  metrics.innerHTML = metricMarkup([
    ['gradient', grad.toFixed(2)],
    ['step', (lr * grad).toFixed(2)],
    ['next loss', lossFn(next).toFixed(3)],
  ]);
}

function drawOptimizers(ctx, state, takeaway, metrics) {
  const noise = state.noise;
  const lr = state.lr;
  const steps = 16;
  const baseGrad = (x) => 0.38 * x + 0.22 * Math.cos(2.0 * x);
  const noisyGrad = (x, t) => baseGrad(x) + noise * 0.6 * Math.sin(t * 1.4 + x * 1.8);

  function simulate(kind) {
    let x = 2.6;
    let velocity = 0;
    let m = 0;
    let v = 0;
    const path = [];
    for (let t = 1; t <= steps; t += 1) {
      const g = noisyGrad(x, t);
      if (kind === 'sgd') {
        x -= lr * g;
      } else if (kind === 'momentum') {
        velocity = 0.82 * velocity + 0.18 * g;
        x -= lr * 1.15 * velocity;
      } else {
        m = 0.86 * m + 0.14 * g;
        v = 0.96 * v + 0.04 * g * g;
        x -= (lr * 0.9 * m) / (Math.sqrt(v) + 0.08);
      }
      path.push({ t: t / steps, x });
    }
    return path;
  }

  const sgd = simulate('sgd');
  const momentum = simulate('momentum');
  const adam = simulate('adam');
  const finalVals = [sgd.at(-1).x, momentum.at(-1).x, adam.at(-1).x];
  const maxAbs = Math.max(2.8, ...finalVals.map((v) => Math.abs(v)));

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Different optimizers follow the same gradients with different memory', 56, 58);

  const originX = 76;
  const originY = 286;
  const width = 400;
  const height = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(originX, originY - height, width, height);
  const toPoint = (point) => ({
    x: originX + point.t * width,
    y: originY - ((point.x + maxAbs) / (2 * maxAbs)) * height,
  });

  [
    ['SGD', sgd, '#c96e8a'],
    ['Momentum', momentum, '#c9a96e'],
    ['Adam', adam, '#6ea5c9'],
  ].forEach(([label, series, color], idx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    series.forEach((point, index) => {
      const p = toPoint(point);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    roundRect(ctx, 520, 112 + idx * 52, 16, 10, 6, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(label, 546, 122 + idx * 52);
    ctx.fillText(series.at(-1).x.toFixed(2), 620, 122 + idx * 52);
  });

  takeaway.textContent =
    noise > 0.55
      ? 'When gradients are noisy, optimizers that remember recent history usually follow a steadier path than plain SGD.'
      : 'With calmer gradients, the optimizers look more similar because there is less zig-zag to smooth away.';

  metrics.innerHTML = metricMarkup([
    ['SGD final', sgd.at(-1).x.toFixed(2)],
    ['Momentum final', momentum.at(-1).x.toFixed(2)],
    ['Adam final', adam.at(-1).x.toFixed(2)],
  ]);
}

function drawLearningRateSchedule(ctx, state, takeaway, metrics) {
  const initial = state.initial;
  const decay = state.decay;
  const epochs = 24;
  const constant = [];
  const step = [];
  const cosine = [];
  for (let e = 0; e <= epochs; e += 1) {
    const t = e / epochs;
    constant.push({ t, value: initial });
    const stepDrops = Math.floor(e / 8);
    step.push({ t, value: initial * Math.pow(1 - decay * 0.55, stepDrops) });
    cosine.push({ t, value: 0.08 + (initial - 0.08) * 0.5 * (1 + Math.cos(Math.PI * t * (0.45 + decay * 0.55))) });
  }

  clearCanvas(ctx);
  ctx.fillStyle = '#e8e4de';
  ctx.font = '28px "EB Garamond", serif';
  ctx.fillText('Schedules cool the optimizer instead of keeping the same step size forever', 56, 58);

  const originX = 76;
  const originY = 286;
  const width = 400;
  const height = 170;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.strokeRect(originX, originY - height, width, height);
  const toPoint = (point) => ({
    x: originX + point.t * width,
    y: originY - (point.value / Math.max(initial, 0.12)) * (height - 10),
  });

  [
    ['Constant', constant, '#c96e8a'],
    ['Step decay', step, '#c9a96e'],
    ['Cosine', cosine, '#6ea5c9'],
  ].forEach(([label, series, color], idx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    series.forEach((point, index) => {
      const p = toPoint(point);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    roundRect(ctx, 520, 112 + idx * 52, 16, 10, 6, true, false);
    ctx.fillStyle = '#e8e4de';
    ctx.font = '16px "EB Garamond", serif';
    ctx.fillText(label, 546, 122 + idx * 52);
    ctx.fillText(series.at(-1).value.toFixed(2), 620, 122 + idx * 52);
  });

  takeaway.textContent =
    decay < 0.2
      ? 'A nearly constant learning rate keeps its energy late into training, which is simple but can make fine-tuning the minimum harder.'
      : decay > 0.75
        ? 'An aggressive schedule cools the optimizer quickly, which helps refinement but can also slow progress too early.'
        : 'The schedule is doing the usual job: larger exploratory steps early, smaller stabilizing steps later.';

  metrics.innerHTML = metricMarkup([
    ['initial lr', initial.toFixed(2)],
    ['step final', step.at(-1).value.toFixed(2)],
    ['cosine final', cosine.at(-1).value.toFixed(2)],
  ]);
}

function drawDistributionCard(ctx, x, y, width, height, title, prob, accent) {
  ctx.fillStyle = 'rgba(255,255,255,0.018)';
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, x, y, width, height, 18, true, true);

  ctx.fillStyle = '#8a8680';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText(title.toUpperCase(), x + 20, y + 28);

  const barY = y + 86;
  const barHeight = 26;
  const usableWidth = width - 40;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, x + 20, barY, usableWidth, barHeight, 14, true, false);
  ctx.fillStyle = accent;
  roundRect(ctx, x + 20, barY, usableWidth * prob, barHeight, 14, true, false);

  ctx.fillStyle = '#e8e4de';
  ctx.font = '18px "EB Garamond", serif';
  ctx.fillText(`Class A: ${(prob * 100).toFixed(0)}%`, x + 20, y + 142);
  ctx.fillText(`Class B: ${((1 - prob) * 100).toFixed(0)}%`, x + 20, y + 166);
}

function drawSeries(ctx, points, key, color, width, originX, originY, chartWidth, chartHeight) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = originX + point.t * chartWidth;
    const y = originY - point[key] * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function metricMarkup(rows) {
  return rows
    .map(
      ([label, value]) => `
        <div class="metric-card">
          <span class="metric-label">${label}</span>
          <span class="metric-value">${value}</span>
        </div>
      `
    )
    .join('');
}

function drawGrid(ctx, width, height) {
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  words.forEach((word) => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, currentY);
      line = `${word} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  if (line) ctx.fillText(line.trim(), x, currentY);
}

document.addEventListener('DOMContentLoaded', () => {
  const chapterKey = document.body.dataset.chapter;
  if (chapterKey) renderChapterPage(chapterKey);
});
