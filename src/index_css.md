@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base resets and glassmorphism helpers */
:root{
  --bg: linear-gradient(180deg,#f6f8ff 0%, #eef4ff 100%);
  --card: rgba(255,255,255,0.85);
  --card-border: rgba(15,23,42,0.06);
  --accent: #7b9cff; /* soft blue */
  --glass-shadow: 0 8px 30px rgba(16,24,40,0.06);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

html, body, #root { height: 100%; }

body{
  margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
  background: var(--bg); color: #0f172a; -webkit-font-smoothing:antialiased;
}

/* Glass card */
.glass{
  background: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(6px) saturate(105%);
  -webkit-backdrop-filter: blur(6px) saturate(105%);
  border-radius: 12px;
}

.glass-soft{
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(15,23,42,0.04);
  border-radius: 10px;
}

.btn-accent{
  background: linear-gradient(90deg, rgba(123,156,255,0.95), rgba(98,140,255,0.92));
  color: white; border: none; padding-left:14px; padding-right:14px;
  box-shadow: 0 8px 20px rgba(99,132,255,0.12);
}

.small-muted { color: rgba(15,23,42,0.6); font-size: 0.9rem }

/* Design system tokens for spacing, type, radius */
:root {
  --space-1: 6px;
  --space-2: 10px;
  --space-3: 16px;
  --space-4: 20px;
  --space-5: 28px;
  --space-6: 40px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --h1: 28px;
  --h2: 20px;
  --body: 15px;
}

/* Section rhythm and helpers */
.section { margin-top: var(--space-5); margin-bottom: var(--space-5); }
.section-title { font-size: var(--h2); margin-bottom: var(--space-3); font-weight:600 }

/* Consistent grid for stats */
.stats-grid { display:flex; gap: var(--space-3); justify-content:center; align-items:stretch }
.stats-item { min-width:120px; padding: calc(var(--space-2) + 4px); border-radius: var(--radius-sm) }

/* Review cards grid spacing */
.review-cards { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: var(--space-4); }


/* Utility tweaks for cleaner layout */
.app-container { max-width: 960px; width: 100%; padding: 24px }
.card-padding { padding: 20px }

/* Form controls — small, elegant, glass style */
.form-input, .form-select, textarea {
  transition: box-shadow 0.18s ease, transform 0.12s ease, background-color 0.18s ease;
}

.form-select, .form-input {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 8px 10px;
  border-radius: 8px;
  color: inherit;
}

.form-select:focus, .form-input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 6px 18px rgba(124,108,240,0.12);
  transform: translateY(-1px);
}

textarea {
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  padding: 14px;
  color: inherit;
}

.word-btn {
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.word-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.18); }

.copied-notice {
  margin-top: 8px;
  font-size: 0.9rem;
  color: rgba(230,238,248,0.9);
}

