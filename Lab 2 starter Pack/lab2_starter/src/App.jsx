import { useMemo, useState } from 'react';

const initialForm = { name: '', email: '', phone: '', date: '', age: '', portfolio: '', workshop: '' };
const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

function validate(values) {
  const next = {};
  if (!values.name.trim()) next.name = 'Please enter your full name.';
  else if (values.name.trim().length < 2) next.name = 'Name must contain at least 2 characters.';
  if (!values.email.trim()) next.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = 'Enter a valid email, for example alex@example.com.';
  if (!values.phone.trim()) next.phone = 'Please enter your phone number.';
  else if (!/^\+?[0-9 ()-]{7,20}$/.test(values.phone.trim()) || values.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a valid phone number with at least 7 digits.';
  if (!values.date) next.date = 'Choose your preferred workshop date.';
  else if (values.date < todayString) next.date = 'Choose today or a future date.';
  if (values.age === '') next.age = 'Enter your age.';
  else if (Number(values.age) < 16 || Number(values.age) > 100) next.age = 'Age must be between 16 and 100.';
  if (!values.portfolio.trim()) next.portfolio = 'Add a portfolio URL (or your LinkedIn/GitHub profile).';
  else {
    try { const url = new URL(values.portfolio); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
    catch { next.portfolio = 'Enter a complete URL beginning with https://'; }
  }
  if (!values.workshop) next.workshop = 'Select a workshop session.';
  return next;
}

const fields = [
  { key: 'name', label: 'Full name', type: 'text', placeholder: 'e.g. Alex Namusoke', autoComplete: 'name' },
  { key: 'email', label: 'Email address', type: 'email', placeholder: 'alex@example.com', autoComplete: 'email' },
  { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '+256 700 123456', autoComplete: 'tel' },
  { key: 'date', label: 'Preferred date', type: 'date' },
  { key: 'age', label: 'Age', type: 'number', placeholder: '18', min: 16, max: 100 },
  { key: 'portfolio', label: 'Portfolio / profile URL', type: 'url', placeholder: 'https://github.com/yourname' },
];

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All sessions');

  const visibleRegistrations = useMemo(() => registrations.filter((item) => {
    const search = `${item.name} ${item.email} ${item.workshop}`.toLowerCase();
    return search.includes(query.toLowerCase()) && (filter === 'All sessions' || item.workshop === filter);
  }), [registrations, query, filter]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setNotice('');
  }

  function submit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setNotice('Please correct the highlighted fields before registering.');
      const firstInvalid = Object.keys(validationErrors)[0];
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    const newRegistration = { ...form, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toLocaleDateString() };
    setRegistrations((current) => [...current, newRegistration]);
    setForm(initialForm);
    setErrors({});
    setNotice(`Registration successful! ${newRegistration.name} has been added.`);
  }

  function removeRegistration(id) {
    const registration = registrations.find((item) => item.id === id);
    setRegistrations((current) => current.filter((item) => item.id !== id));
    setNotice(registration ? `${registration.name}'s registration was removed.` : 'Registration removed.');
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <div className="brand-mark" aria-hidden="true">WR</div>
        <div className="hero-copy">
          <p className="eyebrow">LEARN • CONNECT • BUILD</p>
          <h1>Workshop Registration</h1>
          <p className="hero-description">Reserve your place, meet curious people, and build practical skills with our hands-on sessions.</p>
        </div>
        <div className="hero-chip"><span className="live-dot" /> Registration open</div>
      </header>

      <section className="stats" aria-label="Registration summary">
        <div className="stat-card"><span className="stat-icon">✦</span><div><p>Total registrations</p><strong>{registrations.length}</strong></div></div>
        <div className="stat-card"><span className="stat-icon">◎</span><div><p>Available sessions</p><strong>3</strong></div></div>
        <div className="stat-card"><span className="stat-icon">✓</span><div><p>Form status</p><strong className="status-text">Ready to join</strong></div></div>
      </section>

      <div className="content-grid">
        <section className="panel form-panel" aria-labelledby="form-heading">
          <div className="section-heading"><div><p className="eyebrow">YOUR DETAILS</p><h2 id="form-heading">Join a workshop</h2></div><span className="step-pill">STEP 1 OF 1</span></div>
          <p className="muted intro">Complete the details below. Fields marked <span className="required-star">*</span> are required.</p>
          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              {fields.map((field) => (
                <div className="field" key={field.key}>
                  <label htmlFor={field.key}>{field.label} <span className="required-star">*</span></label>
                  <input id={field.key} name={field.key} type={field.type} value={form[field.key]} placeholder={field.placeholder || ''} autoComplete={field.autoComplete} min={field.min} max={field.max} maxLength={field.key === 'name' ? 80 : undefined} minLength={field.key === 'name' ? 2 : undefined} aria-invalid={Boolean(errors[field.key])} aria-describedby={errors[field.key] ? `${field.key}-error` : undefined} onChange={(e) => updateField(field.key, e.target.value)} />
                  {errors[field.key] && <p className="field-error" id={`${field.key}-error`} role="alert">{errors[field.key]}</p>}
                </div>
              ))}
              <div className="field field-wide">
                <label htmlFor="workshop">Choose a workshop <span className="required-star">*</span></label>
                <select id="workshop" name="workshop" value={form.workshop} aria-invalid={Boolean(errors.workshop)} aria-describedby={errors.workshop ? 'workshop-error' : undefined} onChange={(e) => updateField('workshop', e.target.value)}>
                  <option value="">Select a session</option><option value="React Fundamentals">React Fundamentals</option><option value="Web Design Essentials">Web Design Essentials</option><option value="Git & GitHub Basics">Git &amp; GitHub Basics</option>
                </select>
                {errors.workshop && <p className="field-error" id="workshop-error" role="alert">{errors.workshop}</p>}
              </div>
            </div>
            <p className="privacy-note"><span aria-hidden="true">🔒</span> Your details are used only to manage workshop registration.</p>
            {notice && <p className={`notice ${notice.startsWith('Please correct') ? 'notice-error' : 'notice-success'}`} role="status">{notice}</p>}
            <button className="primary-button" type="submit">Complete registration <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <aside className="panel info-panel">
          <p className="eyebrow">WHAT TO EXPECT</p><h2>Make your next step count.</h2>
          <p className="muted">Small, practical sessions designed to help you learn by doing.</p>
          <div className="session-list">
            <div className="session-item"><span className="session-symbol purple">&lt;/&gt;</span><div><strong>React Fundamentals</strong><p>Components, state and events</p></div></div>
            <div className="session-item"><span className="session-symbol blue">✎</span><div><strong>Web Design Essentials</strong><p>Layout, colour and responsive UI</p></div></div>
            <div className="session-item"><span className="session-symbol green">⌘</span><div><strong>Git &amp; GitHub Basics</strong><p>Version control and teamwork</p></div></div>
          </div>
          <div className="tip-box"><strong>Before you register</strong><p>Use a valid email and phone number. Your preferred date must be today or later, and you must be at least 16 years old.</p></div>
        </aside>
      </div>

      <section className="panel registrations-panel" aria-labelledby="registrations-heading">
        <div className="registrations-heading"><div><p className="eyebrow">LIVE LIST</p><h2 id="registrations-heading">Workshop registrations <span className="count-badge">{registrations.length}</span></h2><p className="muted">Successful submissions appear here immediately.</p></div></div>
        <div className="list-tools"><label className="search-box" htmlFor="registration-search"><span aria-hidden="true">⌕</span><input id="registration-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or session" /></label><label className="filter-label" htmlFor="session-filter">Filter <select id="session-filter" value={filter} onChange={(e) => setFilter(e.target.value)}><option>All sessions</option><option>React Fundamentals</option><option>Web Design Essentials</option><option>Git &amp; GitHub Basics</option></select></label></div>
        {visibleRegistrations.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">＋</span><h3>{registrations.length ? 'No matching registrations' : 'No registrations yet'}</h3><p>{registrations.length ? 'Try another search or choose a different session filter.' : 'Complete the form above to add the first participant to this list.'}</p></div> : <div className="registration-list">{visibleRegistrations.map((item) => <article className="registration-card" key={item.id}><div className="avatar" aria-hidden="true">{item.name.trim().charAt(0).toUpperCase()}</div><div className="registration-details"><h3>{item.name}</h3><p>{item.email} <span className="separator">•</span> {item.phone}</p><div className="registration-meta"><span className="session-tag">{item.workshop}</span><span>Preferred date: {item.date}</span><span>Age {item.age}</span></div>{item.portfolio && <a href={item.portfolio} target="_blank" rel="noreferrer">View portfolio ↗</a>}</div><button className="remove-button" type="button" onClick={() => removeRegistration(item.id)} aria-label={`Remove registration for ${item.name}`}>Remove</button></article>)}</div>}
      </section>
      <footer className="footer"><span>Workshop Registration</span><span>Built for learning • Accessible by design</span></footer>
    </main>
  );
}
