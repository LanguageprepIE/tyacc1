// script.js — Handle quiz and practice interactions

document.addEventListener('DOMContentLoaded', () => {
  // QUIZ: instant feedback per question and score tracking
  const quizForm = document.getElementById('quiz-form');
  const questions = Array.from(quizForm.querySelectorAll('.question'));
  const scoreEl = document.getElementById('score');
  const resetBtn = document.getElementById('reset-quiz');

  let score = 0;
  const total = questions.length;

  // Helper: update score display
  function updateScore() {
    scoreEl.textContent = `Score: ${score} / ${total}`;
  }

  // Check an individual fieldset (question) when the user selects an option
  questions.forEach((fieldset) => {
    const correct = fieldset.dataset.answer;
    // Listen for change events on inputs inside this fieldset
    fieldset.addEventListener('change', (e) => {
      // Find which input is selected
      const checked = fieldset.querySelector('input[type="radio"]:checked');
      const feedback = fieldset.querySelector('.q-feedback');

      // Avoid double-counting: if the fieldset already has 'answered' attribute, do nothing
      if (fieldset.dataset.answered === 'true') return;

      if (checked) {
        const value = checked.value;
        // Compare as strings (works for our numeric and text answers)
        if (value === correct) {
          feedback.textContent = '✔ Correct!';
          feedback.classList.remove('incorrect');
          feedback.classList.add('correct');
          score += 1;
        } else {
          feedback.textContent = '✖ Not quite — correct answer: ' + correct;
          feedback.classList.remove('correct');
          feedback.classList.add('incorrect');
        }
        fieldset.dataset.answered = 'true';
        // Disable the radios so the answer is final (instant feedback design)
        fieldset.querySelectorAll('input[type="radio"]').forEach(inp => inp.disabled = true);
        updateScore();
      }
    });
  });

  // Reset quiz to allow re-taking
  resetBtn.addEventListener('click', () => {
    score = 0;
    updateScore();
    questions.forEach((fieldset) => {
      fieldset.dataset.answered = 'false';
      const feedback = fieldset.querySelector('.q-feedback');
      feedback.textContent = '';
      feedback.classList.remove('correct','incorrect');
      fieldset.querySelectorAll('input[type="radio"]').forEach(inp => {
        inp.checked = false;
        inp.disabled = false;
      });
    });
  });

  // PRACTICE section: check answers and show step-by-step output
  const checkButtons = Array.from(document.querySelectorAll('.check-btn'));
  checkButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const parent = btn.closest('.practice-item');
      const input = parent.querySelector('.practice-input');
      const feedback = parent.querySelector('.feedback');

      // Read data attributes to determine which side to find
      const a = input.dataset.a ? Number(input.dataset.a) : null;
      const b = input.dataset.b ? Number(input.dataset.b) : null;
      const c = input.dataset.c ? Number(input.dataset.c) : null;
      const user = input.value.trim();

      if (user === '') {
        feedback.innerHTML = '<span class="incorrect">Please enter a number.</span>';
        return;
      }
      const userNum = Number(user);

      // Use Pythagoras depending on which values exist
      let correctAnswer, steps;

      if (a !== null && b !== null) {
        // find c: c = sqrt(a^2 + b^2)
        const sq = a*a + b*b;
        correctAnswer = Math.sqrt(sq);
        steps = `Step: ${a}² + ${b}² = ${sq} → c = √${sq} = ${correctAnswer}`;
      } else if (c !== null && a !== null) {
        // find b: b = sqrt(c^2 - a^2) but check c > a
        const diff = c*c - a*a;
        if (diff < 0) {
          feedback.innerHTML = '<span class="incorrect">No real solution (c must be larger than a).</span>';
          return;
        }
        correctAnswer = Math.sqrt(diff);
        steps = `Step: ${c}² − ${a}² = ${c*c} − ${a*a} = ${diff} → b = √${diff} = ${correctAnswer}`;
      } else {
        feedback.innerHTML = '<span class="incorrect">Problem is missing data.</span>';
        return;
      }

      // Allow small rounding differences by checking within 0.01
      const close = Math.abs(userNum - correctAnswer) < 0.01;

      if (close) {
        feedback.innerHTML = `<span class="correct">Correct! ✅<br>${steps}</span>`;
      } else {
        // Show the correct answer rounded nicely
        const corrRounded = Math.round(correctAnswer * 100) / 100;
        feedback.innerHTML = `<span class="incorrect">Not quite. The answer is ${corrRounded}.<br>${steps}</span>`;
      }
    });
  });

  // Initialize score display
  updateScore();
});
