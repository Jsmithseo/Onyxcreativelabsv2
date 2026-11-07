import { useEffect, useMemo, useState } from 'react';
import { parseLeadBriefing, safeBriefingUrl } from '../../lib/leadBriefing.mjs';

function ExternalLinkIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M9 2.5h4.5V7M13 3 7 9M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5a1.25 1.25 0 0 0 1.25 1.25h7.5a1.25 1.25 0 0 0 1.25-1.25V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function checkedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat('en-US', {
    month:'short', day:'numeric', year:'numeric', timeZone:'America/Los_Angeles',
  }).format(date);
}

export default function LeadBriefing({ notes, contractorName }) {
  const briefing = useMemo(() => parseLeadBriefing(notes, { contractorName }), [notes, contractorName]);
  const [copyStatus, setCopyStatus] = useState('');
  const { fields, narrative, script, paragraphs, prompts } = briefing;
  const website = safeBriefingUrl(fields.website);
  const googleListing = safeBriefingUrl(fields['google listing']);
  const apolloProfile = safeBriefingUrl(fields['apollo profile']);
  const apolloWebsite = safeBriefingUrl(fields['apollo company website']);
  const reviewCount = /^\d[\d,]*$/.test(fields['google reviews'] || '') ? Number(fields['google reviews'].replaceAll(',', '')) : null;
  const rating = /^\d(?:\.\d+)?$/.test(fields['google rating'] || '') && Number(fields['google rating']) <= 5 ? Number(fields['google rating']).toFixed(1) : '';
  const verified = checkedDate(fields.verified);
  const apolloVerified = checkedDate(fields['apollo company verified']);
  const hasSnapshot = website || reviewCount !== null || rating;
  const hasSources = googleListing || apolloProfile || apolloWebsite || verified || apolloVerified || fields.qualification || fields['apollo contact'] || fields['named contact'];

  useEffect(() => {
    if (!copyStatus) return undefined;
    const timer = window.setTimeout(() => setCopyStatus(''), 2500);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Select the script text to copy.');
    }
  }

  if (!hasSnapshot && !narrative && !script && !hasSources) return null;

  return <section className="lead-briefing" aria-label="Lead briefing">
    {hasSnapshot && <section className="business-snapshot" aria-label="Business snapshot">
      <h3>Business snapshot</h3>
      {(reviewCount !== null || rating) && <dl className="snapshot-metrics">
        {reviewCount !== null && <div><dt>Google reviews</dt><dd>{reviewCount.toLocaleString('en-US')}</dd></div>}
        {rating && <div><dt>Google rating</dt><dd>{rating}<span> / 5</span></dd></div>}
      </dl>}
      {website && <a className="website-link" href={website} target="_blank" rel="noopener noreferrer"><span>{new URL(website).hostname.replace(/^www\./, '')}</span><ExternalLinkIcon /></a>}
    </section>}

    {narrative && <section className="briefing-notes"><h3>Lead briefing</h3><p>{narrative}</p></section>}

    {script && <section className="script-card" aria-label="Call script">
      <header><h3>Call script</h3><button type="button" onClick={copyScript} aria-label="Copy call script">{copyStatus === 'Copied' ? 'Copied' : 'Copy script'}</button></header>
      <div className="script-body">{paragraphs.map((paragraph, index) => <p className={index === 0 ? 'opener' : ''} key={index}>{paragraph}</p>)}</div>
      {prompts.length > 0 && <dl className="script-prompts">{prompts.map((prompt, index) => <div key={index}><dt>{prompt.label}</dt><dd>{prompt.text}</dd></div>)}</dl>}
      <span className={copyStatus && copyStatus !== 'Copied' ? 'copy-help' : 'copy-status'} role="status">{copyStatus}</span>
    </section>}

    {hasSources && <details className="briefing-sources">
      <summary>Sources & verification <span aria-hidden="true">⌄</span></summary>
      <div className="source-content">
        {verified && <p className="checked">Google listing checked {verified}</p>}
        <div className="source-links">
          {googleListing && <a href={googleListing} target="_blank" rel="noopener noreferrer">Google listing <ExternalLinkIcon /></a>}
          {apolloProfile && <a href={apolloProfile} target="_blank" rel="noopener noreferrer">Apollo contact <ExternalLinkIcon /></a>}
          {apolloWebsite && apolloWebsite !== website && <a href={apolloWebsite} target="_blank" rel="noopener noreferrer">Company reference <ExternalLinkIcon /></a>}
        </div>
        {fields['apollo contact'] && <dl className="contact-match"><div><dt>Matched contact</dt><dd>{fields['apollo contact']}</dd></div>{fields['apollo contact location'] && <div><dt>Contact location</dt><dd>{fields['apollo contact location']}</dd></div>}{apolloVerified && <div><dt>Apollo checked</dt><dd>{apolloVerified}</dd></div>}</dl>}
        {!fields['apollo contact'] && fields['named contact'] && <p className="source-note">Contact name not verified. Ask for the owner or reviews manager.</p>}
        {fields.qualification && <p className="source-note">{fields.qualification}</p>}
      </div>
    </details>}

    <style jsx>{`
      .lead-briefing{display:grid;gap:18px;min-width:0;margin-top:20px;padding-top:20px;border-top:1px solid var(--line,#ddd)}
      h3{margin:0;color:var(--ink,#171717);font-size:13px;font-weight:700;line-height:1.4}
      .snapshot-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:10px 0 0;padding:12px 14px;border:1px solid #e5e5e2;border-radius:8px;background:#f8f8f6}
      .snapshot-metrics div{display:flex;flex-direction:column;gap:3px;min-width:0}.snapshot-metrics dt{color:#6b6b65;font-size:11px;font-weight:400}.snapshot-metrics dd{margin:0;color:#171717;font-size:20px;font-weight:650;line-height:1.25;font-variant-numeric:tabular-nums}.snapshot-metrics dd span{font-size:12px;font-weight:400;color:#73736b}
      .website-link{display:inline-flex;align-items:center;gap:7px;max-width:100%;margin-top:9px;color:#333;font-size:12px;text-decoration:none}.website-link span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.website-link:hover span{text-decoration:underline}
      .briefing-notes p{margin:8px 0 0;color:#525252;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
      .script-card{position:relative;min-width:0;padding:15px 16px 16px;border:1px solid #dce4de;border-radius:9px;background:#f7faf7}
      .script-card header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px;padding:0;border:0}.script-card h3{color:#264b34}.script-card button{flex:0 0 auto;min-height:28px;padding:3px 8px;border:1px solid #d5dfd7;border-radius:5px;background:#fff;color:#355641;font:inherit;font-size:11px;font-weight:600;cursor:pointer}.script-card button:hover{background:#edf3ee}
      .script-body p{margin:0 0 10px;color:#3e4940;font-size:13px;line-height:1.65;overflow-wrap:anywhere}.script-body p:last-child{margin-bottom:0}.script-body .opener{color:#202d23;font-weight:600}
      .script-prompts{display:grid;gap:11px;margin:14px 0 0;padding-top:13px;border-top:1px solid #dfe7e0}.script-prompts dt{margin:0 0 3px;color:#2c4934;font-size:11px;font-weight:700}.script-prompts dd{margin:0;color:#536056;font-size:12px;line-height:1.55;overflow-wrap:anywhere}
      .copy-status{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
      .copy-help{display:block;margin-top:10px;color:#737373;font-size:11px}
      .briefing-sources{min-width:0;border-top:1px solid #e8e8e5}.briefing-sources summary{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px;color:#666;font-size:12px;font-weight:500;list-style:none;cursor:pointer}.briefing-sources summary::-webkit-details-marker{display:none}.briefing-sources summary>span{font-size:16px;line-height:1;transition:transform .15s}.briefing-sources[open] summary>span{transform:rotate(180deg)}
      .source-content{padding:0 0 4px}.checked{margin:1px 0 9px;color:#737373;font-size:11px}.source-links{display:flex;flex-wrap:wrap;gap:7px}.source-links a{display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:6px 8px;border:1px solid #e1e1de;border-radius:5px;color:#484848;background:#fff;font-size:11px;text-decoration:none}.source-links a:hover{background:#f7f7f5}
      .contact-match{display:grid;gap:8px;margin:13px 0 0}.contact-match dt{color:#7a7a73;font-size:10px;font-weight:400}.contact-match dd{margin:2px 0 0;color:#454545;font-size:12px;line-height:1.5;overflow-wrap:anywhere}.source-note{margin:12px 0 0;color:#737373;font-size:11px;line-height:1.55;overflow-wrap:anywhere}
      a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid #1b7348;outline-offset:3px}
      @media(prefers-reduced-motion:reduce){.briefing-sources summary>span{transition:none}}
    `}</style>
  </section>;
}
