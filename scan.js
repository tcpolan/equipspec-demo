/**
 * EquipSpec Nameplate Scanner — MVP Prototype
 *
 * This is a front-end prototype demonstrating the user flow.
 * In production, the "analyze" step would call a real backend:
 *   1. On-device OCR (Apple Vision / Google ML Kit) for raw text
 *   2. Multimodal LLM (Claude API) with image + raw text for structured extraction
 *   3. EquipSpec database lookup for full specs + replacement matches
 *
 * For now, it simulates the flow with a hardcoded Hoshizaki KM-901MAJ result.
 */

(function () {
  // Elements
  const steps = {
    capture: document.getElementById('step-capture'),
    analyzing: document.getElementById('step-analyzing'),
    results: document.getElementById('step-results'),
    equipment: document.getElementById('step-equipment'),
    visualId: document.getElementById('step-visual-id'),
  };

  const photoInput = document.getElementById('photo-input');
  const captureArea = document.getElementById('capture-area');
  const previewArea = document.getElementById('preview-area');
  const previewImg = document.getElementById('preview-img');
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnRetake = document.getElementById('btn-retake');
  const btnConfirm = document.getElementById('btn-confirm');
  const btnScanAnother = document.getElementById('btn-scan-another');
  const linkManualEntry = document.getElementById('link-manual-entry');
  const linkVisualId = document.getElementById('link-visual-id');

  // Step navigation
  function showStep(name) {
    Object.values(steps).forEach(function (el) {
      el.classList.remove('active');
    });
    steps[name].classList.add('active');
    window.scrollTo(0, 0);
  }

  // Photo capture
  photoInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (ev) {
      previewImg.src = ev.target.result;
      captureArea.style.display = 'none';
      previewArea.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Retake
  btnRetake.addEventListener('click', function () {
    previewArea.style.display = 'none';
    captureArea.style.display = 'block';
    photoInput.value = '';
  });

  // Analyze — simulate the LLM processing steps
  btnAnalyze.addEventListener('click', function () {
    showStep('analyzing');

    var analyzeSteps = ['a1', 'a2', 'a3', 'a4', 'a5'];
    var current = 0;

    function advanceStep() {
      if (current >= analyzeSteps.length) {
        // Done — show results
        showStep('results');
        return;
      }

      // Mark previous as done
      if (current > 0) {
        document.getElementById(analyzeSteps[current - 1]).className = 'a-step done';
      }

      // Mark current as active
      document.getElementById(analyzeSteps[current]).className = 'a-step active';
      current++;

      // Simulate processing time (faster for early steps, slower for LLM)
      var delay = current <= 2 ? 600 : current <= 4 ? 900 : 1200;
      setTimeout(advanceStep, delay);
    }

    // Start the animation
    // Reset all steps first
    analyzeSteps.forEach(function (id) {
      document.getElementById(id).className = 'a-step';
    });
    setTimeout(advanceStep, 400);
  });

  // Confirm results — go to equipment page
  btnConfirm.addEventListener('click', function () {
    // In production: take confirmed values, look up in database
    // For prototype: show the hardcoded equipment page
    var model = document.getElementById('f-model').value;
    var manufacturer = document.getElementById('f-manufacturer').value;
    var serial = document.getElementById('f-serial').value;

    // Update equipment page with confirmed values
    document.getElementById('eq-title').textContent = manufacturer + ' ' + model;
    document.getElementById('eq-model-text').textContent = model;
    document.getElementById('eq-serial-badge').textContent = 'S/N: ' + serial;

    showStep('equipment');
  });

  // Scan another
  btnScanAnother.addEventListener('click', function () {
    previewArea.style.display = 'none';
    captureArea.style.display = 'block';
    photoInput.value = '';
    showStep('capture');
  });

  // Manual entry link — just focus the model field in results
  linkManualEntry.addEventListener('click', function (e) {
    e.preventDefault();
    // Clear all fields and show results for manual entry
    document.getElementById('f-manufacturer').value = '';
    document.getElementById('f-model').value = '';
    document.getElementById('f-serial').value = '';
    document.getElementById('f-voltage').value = '';
    document.getElementById('f-phase').value = '';
    document.getElementById('f-amps').value = '';
    document.getElementById('result-title').textContent = 'Enter Equipment Details';
    document.getElementById('result-subtitle').textContent = 'Type the model number from the nameplate';
    document.getElementById('result-confidence').textContent = 'Manual Entry';
    document.getElementById('result-confidence').className = 'badge badge-yellow';
    document.getElementById('result-age').style.display = 'none';
    showStep('results');
    document.getElementById('f-model').focus();
  });

  // Visual ID link
  linkVisualId.addEventListener('click', function (e) {
    e.preventDefault();
    showStep('visualId');
  });

  // Type selection buttons in visual ID flow
  var typeBtns = document.querySelectorAll('.type-btn');
  typeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      typeBtns.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
    });
  });
})();
