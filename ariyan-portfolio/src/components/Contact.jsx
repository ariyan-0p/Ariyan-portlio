import { useEffect, useRef, useState } from 'react';
import { gsap, goTo } from '../lib/scroll';
import { PROFILE } from '../data';

// Web3Forms: notifies Ariyan of every lead (public access key by design).
const WEB3FORMS_ACCESS_KEY = '27fbabea-da5e-4cff-9520-6cf096ef7e24';
// Brevo: optional automated sequence to the client. Flip on once the form URL exists.
const BREVO_ENABLED = false;
const BREVO_FORM_URL = '';

const PROJECT_TYPES = ['Web App', 'Mobile App', 'E-Commerce', 'SaaS / Platform', 'Other'];
const BUDGETS = ['< ₹25k', '₹25k – ₹75k', '₹75k – ₹2L', '₹2L+', 'Not sure yet'];
const TIMELINES = ['ASAP', 'Within 1 month', '1 – 3 months', 'Flexible'];
const TOTAL = 3;

function Chips({ options, value, onPick, label }) {
  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button type="button" role="radio" aria-checked={value === o} key={o} className={value === o ? 'is-on' : ''} onClick={() => onPick(o)}>{o}</button>
      ))}
    </div>
  );
}

export default function Contact() {
  const root = useRef(null);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: '' });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ct__big .ch__in', {
        yPercent: 110, duration: 1.3, stagger: 0.045, ease: 'expo.out',
        scrollTrigger: { trigger: '.ct__big', start: 'top 85%' },
      });
      gsap.from('.ct__rev', {
        y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: '.ct__grid', start: 'top 82%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const valid = () => {
    if (step === 1) return form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.replace(/\D/g, '').length >= 7;
    if (step === 2) return form.projectType && form.budget && form.timeline;
    return form.message.trim().length > 0;
  };
  const next = () => valid() && setStep((s) => Math.min(s + 1, TOTAL));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async (e) => {
    e.preventDefault();
    if (!valid()) return;
    setStatus('loading');
    setErr('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New lead: ${form.name} — ${form.projectType}`,
          from_name: 'Portfolio Contact Form',
          name: form.name, email: form.email, phone: form.phone, project_type: form.projectType,
          budget: form.budget, timeline: form.timeline, message: form.message,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed.');
      if (BREVO_ENABLED && BREVO_FORM_URL) {
        const b = new FormData();
        b.append('EMAIL', form.email); b.append('FIRSTNAME', form.name); b.append('SMS', form.phone); b.append('PROJECT_TYPE', form.projectType);
        b.append('BUDGET', form.budget); b.append('TIMELINE', form.timeline); b.append('MESSAGE', form.message);
        fetch(BREVO_FORM_URL, { method: 'POST', mode: 'no-cors', body: b }).catch(() => {});
      }
      setStatus('success');
    } catch (ex) {
      setStatus('error');
      setErr(ex.message || 'Network error. Please try again.');
    }
  };

  const split = (t) => t.split('').map((c, i) => <span className="ch" key={i}><span className="ch__in">{c === ' ' ? ' ' : c}</span></span>);

  return (
    <section id="contact" ref={root} className="ct">
      <div className="mf__idx"><span>(05)</span><span>Contact</span></div>
      <h2 className="ct__big" aria-label="Let’s build">
        <span className="line">{split('LET’S')}</span>
        <span className="line line--r">{split('BUILD')}<em className="ct__dot">.</em></span>
      </h2>

      <div className="ct__grid">
        <div className="ct__side">
          <p className="ct__lede ct__rev">Tell me what you’re making. I reply within a day — usually faster.</p>
          <ul className="ct__links ct__rev">
            <li><span>Mail</span><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></li>
            <li><span>Phone</span><a href={PROFILE.tel}>{PROFILE.phone}</a></li>
            <li><span>WhatsApp</span><a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer">Message me ↗</a></li>
            <li><span>LinkedIn</span><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">ariyan-samal ↗</a></li>
            <li><span>Résumé</span><a href={PROFILE.resume} target="_blank" rel="noopener noreferrer">View PDF ↗</a></li>
          </ul>
        </div>

        <form className="form ct__rev" onSubmit={submit} noValidate>
          {status === 'success' ? (
            <div className="form__done" role="status">
              <pre aria-hidden="true">{'[ ✓ ]'}</pre>
              <h3>Message received.</h3>
              <p>Thanks, {form.name.split(' ')[0]}. I’ll get back to you at {form.email} within a day.</p>
              <button type="button" className="btn" onClick={() => { setStatus('idle'); setStep(1); setForm({ name: '', email: '', phone: '', projectType: '', budget: '', timeline: '', message: '' }); }}><span>Send another</span></button>
            </div>
          ) : (
            <>
              <div className="form__prog">
                <span>Step {step}/{TOTAL}</span>
                <div><i style={{ transform: `scaleX(${step / TOTAL})` }} /></div>
                <span>{['Who', 'What', 'Details'][step - 1]}</span>
              </div>

              {step === 1 && (
                <div className="form__step" key="s1">
                  <label><span>01 — Name</span><input value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
                  <label><span>02 — Email</span><input type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@company.com" autoComplete="email" /></label>
                  <label><span>03 — Phone</span><input type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="Your phone number" autoComplete="tel" /></label>
                </div>
              )}
              {step === 2 && (
                <div className="form__step" key="s2">
                  <div className="form__q"><span>04 — What are we building?</span><Chips label="Project type" options={PROJECT_TYPES} value={form.projectType} onPick={set('projectType')} /></div>
                  <div className="form__q"><span>05 — Budget</span><Chips label="Budget" options={BUDGETS} value={form.budget} onPick={set('budget')} /></div>
                  <div className="form__q"><span>06 — Timeline</span><Chips label="Timeline" options={TIMELINES} value={form.timeline} onPick={set('timeline')} /></div>
                </div>
              )}
              {step === 3 && (
                <div className="form__step" key="s3">
                  <label><span>07 — Tell me about it</span><textarea rows={5} value={form.message} onChange={(e) => set('message')(e.target.value)} placeholder="Goals, references, anything that helps…" /></label>
                </div>
              )}

              {status === 'error' && <p className="form__err" role="alert">{err}</p>}

              <div className="form__actions">
                {step > 1 ? <button type="button" className="btn" onClick={back}><i>←</i><span>Back</span></button> : <span />}
                {step < TOTAL ? (
                  <button type="button" className="btn btn--solid" onClick={next} disabled={!valid()}><span>Continue</span><i>→</i></button>
                ) : (
                  <button type="submit" className="btn btn--solid" disabled={status === 'loading' || !valid()}><span>{status === 'loading' ? 'Sending…' : 'Send message'}</span><i>↗</i></button>
                )}
              </div>
            </>
          )}
        </form>
      </div>

      <footer className="foot">
        <span>© 2026 Ariyan Samal</span>
        <span>{PROFILE.location}</span>
        <span>{PROFILE.coords}</span>
        <button onClick={() => goTo('top')}>Back to top ↑</button>
      </footer>
    </section>
  );
}
