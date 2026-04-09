/* ==========================================================================
   ML Visualizations — Theme Color Palette for Canvas Drawing
   Matches daniellobato.me personal website style
   ========================================================================== */

const T = {
  // Core accents
  gold:      '#c9a96e',
  blue:      '#6ea5c9',
  rose:      '#c96e8a',

  // Lighter variants (data series, highlights)
  goldLight: '#e0c992',
  blueLight: '#92c5e0',
  roseLight: '#d9a0b8',

  // Dimmer variants (secondary elements)
  goldDim:   '#a08550',
  blueDim:   '#5587a5',
  roseDim:   '#a05570',

  // Neutral palette for canvas
  fg:        '#e8e4de',
  fgDim:     '#8a8680',
  fgMuted:   '#5a5650',
  bg:        '#0d0d14',
  bgCard:    '#111118',
  grid:      '#1a1a24',
  gridLight: '#2a2a3a',
  border:    '#2a2a3a',

  // Data visualization palette (ordered for multi-series charts)
  data: ['#c9a96e', '#6ea5c9', '#c96e8a', '#e0c992', '#92c5e0', '#d9a0b8', '#a08550', '#5587a5'],

  // Semantic colors
  positive:  '#8ab87a',
  negative:  '#c96e6e',
  warning:   '#c9a96e',
  info:      '#6ea5c9',
};

document.addEventListener('DOMContentLoaded', function() {
  var subtitleRewriteMap = {
    '05-ml-system-design.html': {
      '1. ML Pipeline Architecture': {
        what: 'An ML system is a pipeline that turns raw data into a trained model, serves predictions, and feeds outcomes back into retraining.',
        try: 'Follow the offline and online paths and notice why one optimizes for training quality while the other optimizes for serving speed.'
      },
      '2. A/B Testing & Statistical Significance': {
        what: 'A/B testing asks whether a product change caused a real lift or whether the difference could easily be noise.',
        try: 'Change sample size and effect size to see why small experiments produce wide uncertainty.'
      },
      '3. Feature Store Architecture': {
        what: 'A feature store keeps training and serving features consistent so the model sees the same definitions offline and online.',
        try: 'Switch between batch and streaming paths to see which features can be precomputed and which must stay fresh.'
      },
      '4. Online vs Batch Serving Comparison': {
        what: 'Online serving optimizes freshness per request, while batch serving optimizes throughput and cost over large workloads.',
        try: 'Move the freshness and latency controls to see when each serving pattern makes sense.'
      },
      '5. Model Monitoring & Data Drift Detection': {
        what: 'Monitoring asks whether the live system still matches the world it was trained for.',
        try: 'Trigger drift and watch the difference between a changing input distribution and a degrading model.'
      }
    },
    '07-metrics-evaluation.html': {
      'Receiver Operating Characteristic (ROC) Curve & Area Under the Curve (AUC)': {
        what: 'ROC shows the tradeoff between catching positives and creating false alarms as you move the decision threshold.',
        try: 'Drag the threshold and watch true-positive rate and false-positive rate move together.'
      },
      'Precision-Recall Curve': {
        what: 'Precision-recall focuses on the positive class, which makes it more informative than ROC on heavily imbalanced problems.',
        try: 'Move the threshold and see how catching more positives usually lowers precision.'
      },
      'Confusion Matrix & Derived Metrics': {
        what: 'A confusion matrix counts the four basic outcomes, and most classification metrics are just different summaries of those counts.',
        try: 'Change the threshold and see which cells grow or shrink.'
      },
      'Calibration Plot & Confidence': {
        what: 'Calibration asks whether a model’s confidence matches real-world frequency.',
        try: 'Adjust temperature and see how a model can keep the same ranking while producing better probabilities.'
      },
      'Ranking Metrics: Normalized Discounted Cumulative Gain (NDCG) & Mean Average Precision (MAP)': {
        what: 'Ranking metrics reward putting the right items near the top, not just somewhere in the list.',
        try: 'Reorder the list and notice why early mistakes hurt more than late ones.'
      }
    }
  };

  function getPageKey() {
    var path = window.location.pathname || '';
    return path.replace(/^\/+/, '');
  }

  function normalizeTitle(title) {
    return (title || '')
      .replace(/\s+/g, ' ')
      .replace(/^\d+\.\s*/, '')
      .replace(/[📊📈🎯⚖️🏆]/g, '')
      .trim();
  }

  function decodeEntities(text) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  function getRewriteForTitle(pageKey, title) {
    var pageMap = subtitleRewriteMap[pageKey];
    if (!pageMap) return null;

    if (pageMap[title]) return pageMap[title];

    var normalized = normalizeTitle(title);
    var keys = Object.keys(pageMap);
    for (var i = 0; i < keys.length; i++) {
      if (normalizeTitle(keys[i]) === normalized) {
        return pageMap[keys[i]];
      }
    }

    return null;
  }

  function splitSentences(text) {
    return (text || '')
      .split(/(?<=[.!?])\s+/)
      .map(function(part) { return part.trim(); })
      .filter(Boolean);
  }

  function startsWithImperative(text) {
    return /^(click|drag|toggle|watch|adjust|use|set|press|trace|slide|play|compare|switch)\b/i.test(text || '');
  }

  function genericLeadFromTitle(title) {
    var normalized = normalizeTitle(title).toLowerCase();

    if (normalized.indexOf('pipeline') !== -1) return 'This section explains the system design behind an end-to-end ML pipeline.';
    if (normalized.indexOf('a/b testing') !== -1) return 'This section explains how to tell a real experiment win from random noise.';
    if (normalized.indexOf('feature store') !== -1) return 'This section explains how teams keep training and serving features consistent.';
    if (normalized.indexOf('serving') !== -1) return 'This section explains the tradeoff between freshness, latency, and throughput in model serving.';
    if (normalized.indexOf('monitoring') !== -1 || normalized.indexOf('drift') !== -1) return 'This section explains how to detect when a deployed model is drifting away from reality.';
    if (normalized.indexOf('roc') !== -1) return 'This section explains how threshold changes trade recall against false alarms.';
    if (normalized.indexOf('precision-recall') !== -1) return 'This section explains how positive-class quality changes as you move the threshold.';
    if (normalized.indexOf('confusion matrix') !== -1) return 'This section explains how classification outcomes turn into the metrics people quote in interviews.';
    if (normalized.indexOf('calibration') !== -1) return 'This section explains whether a model’s confidence can be trusted as a probability.';
    if (normalized.indexOf('ndcg') !== -1 || normalized.indexOf('map') !== -1 || normalized.indexOf('ranking metrics') !== -1) return 'This section explains how to judge ranking quality when top positions matter most.';

    return 'This section builds intuition for ' + normalizeTitle(title) + '.';
  }

  function structureSubtitle(subtitle, title, section) {
    var pageKey = getPageKey();
    var rawText = decodeEntities(subtitle.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!rawText || subtitle.querySelector('.subtitle-main') || subtitle.querySelector('.subtitle-guiding')) return;

    var sectionChildren = Array.from((section && section.children) || []);
    var hasConceptPrimer = sectionChildren.some(function(el) {
      return el.classList && el.classList.contains('concept-primer');
    });
    if (hasConceptPrimer) {
      var sentences = splitSentences(rawText);
      var guiding = rawText;

      if (/^goal:/i.test(guiding)) {
        guiding = guiding.replace(/^goal:\s*/i, '').trim();
      }

      if (sentences.length > 1) {
        guiding = sentences[sentences.length - 1];
      }

      guiding = guiding.replace(/^the key question is\s+/i, '').trim();
      if (guiding && !/[?]$/.test(guiding)) {
        guiding = guiding.replace(/[.]$/, '').trim() + '?';
      }

      subtitle.innerHTML = '<span class="subtitle-guiding">' + guiding + '</span>';
      return;
    }

    var rewrite = getRewriteForTitle(pageKey, title);
    var lead = '';
    var prompt = '';

    if (rewrite) {
      lead = rewrite.what;
      prompt = rewrite.try;
    } else {
      var sentences = splitSentences(rawText);
      if (!sentences.length) return;

      if (startsWithImperative(sentences[0])) {
        lead = genericLeadFromTitle(title);
        prompt = rawText;
      } else {
        lead = sentences[0];
        prompt = sentences.slice(1).join(' ');
      }
    }

    var html = '<span class="subtitle-main">' + lead + '</span>';

    if (prompt) {
      if (prompt.length > 165) {
        html += '<details class="subtitle-more"><summary>How To Explore</summary><div class="subtitle-more-body">' + prompt + '</div></details>';
      } else {
        html += '<span class="subtitle-prompt">' + prompt + '</span>';
      }
    }

    subtitle.innerHTML = html;
  }

  function wrapInDetails(element, className, summaryText) {
    if (!element || !element.parentNode) return;
    if (element.parentNode.tagName === 'DETAILS') return;
    var parent = element.parentNode;
    var nextSibling = element.nextSibling;

    var details = document.createElement('details');
    details.className = className;

    var summary = document.createElement('summary');
    summary.textContent = summaryText;
    details.appendChild(summary);

    var body = document.createElement('div');
    body.className = className + '-body';
    body.appendChild(element);
    details.appendChild(body);

    details.open = false;
    parent.insertBefore(details, nextSibling);
  }

  function wrapGroupInDetails(elements, className, summaryText) {
    if (!elements || !elements.length) return;

    var first = elements[0];
    if (!first.parentNode || first.parentNode.tagName === 'DETAILS') return;

    var details = document.createElement('details');
    details.className = className;

    var summary = document.createElement('summary');
    summary.textContent = summaryText;
    details.appendChild(summary);

    var body = document.createElement('div');
    body.className = className + '-body';
    first.parentNode.insertBefore(details, first);
    details.appendChild(body);

    elements.forEach(function(el) {
      body.appendChild(el);
    });
  }

  document.querySelectorAll('.viz-section, .section').forEach(function(section) {
    var children = Array.from(section.children || []);
    var titleEl = children.find(function(el) { return el.tagName === 'H2'; });
    var subtitle = children.find(function(el) { return el.classList && el.classList.contains('subtitle'); });
    if (!subtitle) {
      subtitle = children.find(function(el) {
        return el.tagName === 'P';
      });
      if (subtitle) {
        subtitle.classList.add('subtitle');
      }
    }
    if (!titleEl || !subtitle) return;
    structureSubtitle(subtitle, titleEl.textContent || '', section);

    var hasConceptPrimer = children.some(function(el) {
      return el.classList && el.classList.contains('concept-primer');
    });

    var challengeBox = children.find(function(el) {
      return el.classList && el.classList.contains('challenge-box');
    });
    if (challengeBox) {
      wrapInDetails(challengeBox, 'section-fold', 'Practice Challenge');
    }

    var sectionLinks = children.find(function(el) {
      return el.classList && el.classList.contains('section-links');
    });
    if (sectionLinks) {
      wrapInDetails(sectionLinks, 'section-fold', 'Reference Links');
    }

    var looseNotes = children.filter(function(el) {
      return el.classList && (el.classList.contains('interview-tip') || el.classList.contains('mnemonic'));
    });
    if (looseNotes.length) {
      wrapGroupInDetails(looseNotes, 'secondary-drawer', 'Interview Notes');
    }

    var directInsightBoxes = children.filter(function(el) {
      return el.classList && el.classList.contains('insight-box');
    });
    if (directInsightBoxes.length > 1) {
      var extraInsightBoxes = directInsightBoxes.slice(1);
      var extraInsightText = extraInsightBoxes.map(function(el) {
        return (el.textContent || '').trim();
      }).join(' ');
      var extraInsightLabel = /common mistakes?|pitfalls?/i.test(extraInsightText)
        ? 'Common Mistakes And Notes'
        : 'Additional Notes';
      wrapGroupInDetails(extraInsightBoxes, 'section-fold', extraInsightLabel);
    }

    if (hasConceptPrimer) {
      var learningStrip = children.find(function(el) {
        return el.classList && el.classList.contains('learning-strip');
      });
      if (learningStrip) {
        learningStrip.classList.add('learning-strip--quiet');
      }

      var studyNotes = children.filter(function(el) {
        return el.classList && (el.classList.contains('mission-box') || el.classList.contains('teaching-grid'));
      });
      if (studyNotes.length) {
        wrapGroupInDetails(studyNotes, 'section-fold', 'Study Notes');
      }

      var inlineCheck = children.find(function(el) {
        return el.classList && el.classList.contains('inline-check');
      });
      if (inlineCheck) {
        wrapInDetails(inlineCheck, 'section-fold', 'Check Yourself');
      }

      var insightBox = children.find(function(el) {
        return el.classList && el.classList.contains('insight-box');
      });
      if (insightBox) {
        wrapInDetails(insightBox, 'section-fold', 'Concept Notes');
      }
    }
  });

  document.querySelectorAll('.code-example').forEach(function(example, index) {
    example.classList.remove('open');

    var toggle = example.querySelector('.code-toggle');
    var content = example.querySelector('.code-content');
    if (!toggle || !content) return;

    toggle.setAttribute('type', 'button');
    toggle.removeAttribute('onclick');

    if (!content.id) {
      content.id = 'code-example-content-' + index;
    }

    toggle.setAttribute('aria-controls', content.id);
    toggle.setAttribute('aria-expanded', 'false');
    content.hidden = true;

    toggle.addEventListener('click', function() {
      var isOpen = example.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      content.hidden = !isOpen;
    });
  });

  document.querySelectorAll('.insight-box').forEach(function(box) {
    var firstDivider = Array.from(box.children).find(function(el) {
      return el.classList && el.classList.contains('divider');
    });

    var keyPoints = Array.from(box.children).filter(function(el) {
      return el.classList && el.classList.contains('key-point');
    });

    if (keyPoints.length > 3) {
      var extraKeyPoints = keyPoints.slice(2);
      var details = document.createElement('details');
      details.className = 'insight-more';

      var summary = document.createElement('summary');
      summary.textContent = 'More detail';
      details.appendChild(summary);

      var body = document.createElement('div');
      body.className = 'insight-more-body';
      extraKeyPoints.forEach(function(point) {
        body.appendChild(point);
      });
      details.appendChild(body);

      if (firstDivider) {
        box.insertBefore(details, firstDivider);
      } else {
        box.appendChild(details);
      }
    }

    var tips = Array.from(box.children).filter(function(el) {
      return el.classList && (el.classList.contains('interview-tip') || el.classList.contains('mnemonic'));
    });

    if (tips.length > 0) {
      var extraTips = tips.slice(0);
      var tipDetails = document.createElement('details');
      tipDetails.className = 'insight-more';

      var tipSummary = document.createElement('summary');
      tipSummary.textContent = 'Interview notes';
      tipDetails.appendChild(tipSummary);

      var tipBody = document.createElement('div');
      tipBody.className = 'insight-more-body';
      extraTips.forEach(function(tip) {
        tipBody.appendChild(tip);
      });
      tipDetails.appendChild(tipBody);

      var codeExample = Array.from(box.children).find(function(el) {
        return el.classList && el.classList.contains('code-example');
      });

      if (codeExample) {
        box.insertBefore(tipDetails, codeExample);
      } else {
        box.appendChild(tipDetails);
      }
    }

    if (firstDivider) {
      var trailingContent = [];
      var collecting = false;

      Array.from(box.children).forEach(function(el) {
        if (el === firstDivider) {
          collecting = true;
          return;
        }

        if (collecting) {
          trailingContent.push(el);
        }
      });

      if (trailingContent.length) {
        var referenceNotes = document.createElement('details');
        referenceNotes.className = 'reference-notes';

        var referenceSummary = document.createElement('summary');
        referenceSummary.textContent = 'Reference, examples, and interview notes';
        referenceNotes.appendChild(referenceSummary);

        var referenceBody = document.createElement('div');
        referenceBody.className = 'reference-notes-body';
        trailingContent.forEach(function(el) {
          referenceBody.appendChild(el);
        });
        referenceNotes.appendChild(referenceBody);

        box.insertBefore(referenceNotes, firstDivider);
        firstDivider.remove();
      }
    }
  });

  function wrapSecondaryBlock(block, className, label) {
    if (!block || !block.parentNode) return;
    if (block.parentElement && block.parentElement.classList && block.parentElement.classList.contains('secondary-drawer-body')) {
      return;
    }

    var details = document.createElement('details');
    details.className = className;

    var summary = document.createElement('summary');
    summary.textContent = label;
    details.appendChild(summary);

    var body = document.createElement('div');
    body.className = 'secondary-drawer-body';
    block.parentNode.insertBefore(details, block);
    body.appendChild(block);
    details.appendChild(body);
  }

  document.querySelectorAll('.viz-section, .section').forEach(function(section) {
    var hasConceptPrimer = !!section.querySelector('.concept-primer');
    if (!hasConceptPrimer) return;

    wrapSecondaryBlock(section.querySelector('.inline-check'), 'secondary-drawer secondary-drawer--check', 'Check yourself');
    wrapSecondaryBlock(section.querySelector('.insight-box'), 'secondary-drawer secondary-drawer--notes', 'Concept notes');
  });

  document.querySelectorAll('.challenge-box').forEach(function(box) {
    wrapSecondaryBlock(box, 'secondary-drawer secondary-drawer--practice', 'Practice challenge');
  });

  document.querySelectorAll('.section-links').forEach(function(links) {
    wrapSecondaryBlock(links, 'secondary-drawer secondary-drawer--references', 'References');
  });

  document.querySelectorAll('.study-guide').forEach(function(guide) {
    var title = guide.querySelector('h2');
    var summary = title ? title.textContent.trim() : 'How to use this chapter';
    wrapInDetails(guide, 'section-fold section-fold--guide', summary);
  });
});
