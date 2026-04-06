/* ===== Predict-Then-Observe =====
 *
 * Usage in HTML:
 *   <div class="predict-box" id="predict-gd-lr">
 *     <div class="predict-label">Predict</div>
 *     <div class="predict-question">If you crank the learning rate to 5, what happens?</div>
 *     <div class="predict-options">
 *       <button class="predict-btn" data-choice="converge">Converges faster</button>
 *       <button class="predict-btn" data-choice="diverge" data-correct>Diverges!</button>
 *       ...
 *     </div>
 *     <div class="predict-locked-msg">Your prediction is locked. Now try it -- move the slider above.</div>
 *     <div class="predict-result" data-correct-text="Exactly right! ..." data-wrong-text="Not quite. ..."></div>
 *   </div>
 *
 * Usage in JS:
 *   new PredictBox('predict-gd-lr', 'gdvLR');
 *   // Second arg = the ID of the input that triggers the reveal
 */
class PredictBox {
  constructor(id, triggerInputId, opts = {}) {
    this.el = document.getElementById(id);
    if (!this.el) return;
    this.trigger = document.getElementById(triggerInputId);
    this.phase = 'predict'; // predict → locked → revealed
    this.delay = opts.delay || 1200;
    this.prediction = null;

    const btns = this.el.querySelectorAll('.predict-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => this.select(btn));
    });
  }

  select(btn) {
    if (this.phase !== 'predict') return;
    this.prediction = btn.dataset.choice;
    this.isCorrect = btn.hasAttribute('data-correct');
    this.phase = 'locked';
    this.el.classList.add('phase-locked');

    // Dim all buttons, highlight selected
    this.el.querySelectorAll('.predict-btn').forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
    });
    btn.classList.add('selected');

    // Listen for interaction
    if (this.trigger) {
      const handler = () => {
        setTimeout(() => this.reveal(), this.delay);
      };
      this.trigger.addEventListener('input', handler, { once: true });
      this.trigger.addEventListener('click', handler, { once: true });
    }
  }

  reveal() {
    if (this.phase === 'revealed') return;
    this.phase = 'revealed';
    this.el.classList.remove('phase-locked');
    this.el.classList.add('phase-revealed');
    if (!this.isCorrect) this.el.classList.add('wrong');

    const resultEl = this.el.querySelector('.predict-result');
    const selectedBtn = this.el.querySelector('.predict-btn.selected');

    if (this.isCorrect) {
      resultEl.classList.add('correct');
      resultEl.textContent = resultEl.dataset.correctText || 'Correct!';
      if (selectedBtn) selectedBtn.classList.add('correct');
    } else {
      resultEl.classList.add('wrong');
      resultEl.textContent = resultEl.dataset.wrongText || 'Not quite!';
      if (selectedBtn) selectedBtn.classList.add('wrong');
      // Highlight the correct answer
      const correctBtn = this.el.querySelector('.predict-btn[data-correct]');
      if (correctBtn) correctBtn.classList.add('was-correct');
    }
  }
}


/* ===== Challenge Box =====
 *
 * Usage in HTML:
 *   <div class="challenge-box" id="challenge-gd">
 *     <div class="challenge-label">Challenge</div>
 *     <ul class="challenge-list">
 *       <li class="challenge-item" data-idx="0">
 *         <span class="challenge-check"></span>
 *         <span class="challenge-difficulty easy">Easy</span>
 *         <span>Get all optimizers to converge</span>
 *       </li>
 *       ...
 *     </ul>
 *     <div class="challenge-progress">
 *       <div class="challenge-progress-bar"><div class="challenge-progress-fill"></div></div>
 *       <span class="challenge-progress-text">0/3</span>
 *     </div>
 *     <div class="challenge-celebration"></div>
 *   </div>
 *
 * Usage in JS:
 *   const challengeGD = new ChallengeBox('challenge-gd', [
 *     { test: () => gdvStep > 0 && allConverged(), celebration: 'All three reached the minimum!' },
 *     { test: () => ..., celebration: '...' },
 *   ]);
 *
 *   // In your draw function:
 *   function drawGDV() { ...; challengeGD.check(); }
 */
class ChallengeBox {
  constructor(id, challenges) {
    this.el = document.getElementById(id);
    if (!this.el) return;
    this.challenges = challenges; // [{test: fn, celebration: string}]
    this.storageKey = 'challenge_' + id;
    this.completed = new Set(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));
    this.items = this.el.querySelectorAll('.challenge-item');
    this.celebrationEl = this.el.querySelector('.challenge-celebration');

    // Restore completed state
    this.completed.forEach(i => {
      const item = this.el.querySelector(`.challenge-item[data-idx="${i}"]`);
      if (item) {
        item.classList.add('completed');
        item.querySelector('.challenge-check').textContent = '\u2713';
      }
    });
    this.updateProgress();
  }

  check() {
    if (!this.el) return;
    this.challenges.forEach((c, i) => {
      if (this.completed.has(i)) return;
      try {
        if (c.test()) {
          this.complete(i, c.celebration);
        }
      } catch(e) { /* ignore test errors */ }
    });
  }

  complete(i, celebration) {
    this.completed.add(i);
    localStorage.setItem(this.storageKey, JSON.stringify([...this.completed]));

    const item = this.el.querySelector(`.challenge-item[data-idx="${i}"]`);
    if (item) {
      item.classList.add('completed');
      item.querySelector('.challenge-check').textContent = '\u2713';
    }

    this.updateProgress();

    if (celebration && this.celebrationEl) {
      this.celebrationEl.textContent = celebration;
      this.celebrationEl.classList.add('show');
      setTimeout(() => this.celebrationEl.classList.remove('show'), 4000);
    }
  }

  updateProgress() {
    const total = this.challenges.length;
    const done = this.completed.size;
    const fill = this.el.querySelector('.challenge-progress-fill');
    const text = this.el.querySelector('.challenge-progress-text');
    if (fill) fill.style.width = (done / total * 100) + '%';
    if (text) text.textContent = done + '/' + total;
  }
}
