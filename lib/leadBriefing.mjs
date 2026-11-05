const labels = new Set([
  'campaign', 'qualification', 'named contact', 'website', 'google reviews',
  'google listing', 'verified', 'google rating', 'apollo contact',
  'apollo contact location', 'apollo profile', 'apollo company website',
  'apollo company verified', 'industry',
]);

export function safeBriefingUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function parseLeadBriefing(notes) {
  const fields = {};
  const narrative = [];
  const scriptLines = [];
  let inScript = false;

  for (const line of String(notes || '').split(/\r?\n/)) {
    const match = line.match(/^\s*([^:]+):[ \t]*(.*)$/);
    const label = match?.[1].trim().toLowerCase();
    if (label === 'call script') {
      inScript = true;
      if (match[2]) scriptLines.push(match[2]);
    } else if (labels.has(label)) {
      if (fields[label] && fields[label] !== match[2].trim()) {
        narrative.push(`${match[1].trim()}: ${fields[label]}`);
      }
      fields[label] = match[2].trim();
      inScript = false;
    } else if (inScript) {
      scriptLines.push(line);
    } else {
      narrative.push(line);
    }
  }

  const prompts = [];
  const spoken = [];
  for (const line of scriptLines) {
    const prompt = line.match(/^\s*(If interested|If busy|If they decline|Voicemail):\s*(.+)$/i);
    if (prompt) prompts.push({ label:prompt[1], text:prompt[2] });
    else spoken.push(line);
  }
  // Question breaks make a long imported script readable without rewriting it.
  const paragraphs = spoken.join('\n').trim().replace(/\?[ \t]+/g, '?\n').split(/\n+/).map((text) => text.trim()).filter(Boolean);
  return { fields, narrative:narrative.join('\n').trim(), script:scriptLines.join('\n').trim(), paragraphs, prompts };
}
