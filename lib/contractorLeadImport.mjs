const MAX_ROWS = 500;

function text(value, limit = 4000) {
  return String(value ?? '').trim().slice(0, limit);
}

function email(value) {
  const result = text(value, 320).toLowerCase();
  return result && result !== '—' ? result : '';
}

function phone(value) {
  return text(value, 80).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
}

function header(value) {
  return text(value, 120).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function csvRows(csv) {
  const rows = [[]];
  let cell = '';
  let quoted = false;
  const input = String(csv || '');
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      rows[rows.length - 1].push(cell);
      cell = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      rows[rows.length - 1].push(cell);
      cell = '';
      if (rows[rows.length - 1].some((value) => text(value))) rows.push([]);
      else rows[rows.length - 1] = [];
    } else {
      cell += character;
    }
  }
  if (cell || rows[rows.length - 1].length) rows[rows.length - 1].push(cell);
  return rows.filter((row) => row.some((value) => text(value)));
}

function valueAt(headers, values, names) {
  const index = headers.findIndex((item) => names.includes(item));
  return index < 0 ? '' : text(values[index]);
}

export function normaliseContractorImportRow(row = {}) {
  const firstName = text(row.firstName || row.first_name, 120);
  const lastName = text(row.lastName || row.last_name, 120);
  const leadEmail = email(row.email);
  const leadPhone = text(row.phone, 80);
  const normalPhone = phone(leadPhone);
  const name = text(row.name, 240) || `${firstName} ${lastName}`.trim() || leadEmail || leadPhone;
  const industry = text(row.industry, 240);
  const employees = text(row.employees, 120);
  const revenue = text(row.revenue, 120);
  const notes = [
    text(row.notes, 10000),
    industry && `Industry: ${industry}`,
    employees && `Employees: ${employees}`,
    revenue && `Revenue: ${revenue}`,
  ].filter(Boolean).join('\n');
  const errors = [];
  if (!name) errors.push('A name, email, or phone number is required.');
  if (leadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
    errors.push('Email address is invalid.');
  }
  if (!leadEmail && normalPhone.length < 7) {
    errors.push('Provide a valid email or phone number.');
  }
  return {
    name,
    company: text(row.company, 240),
    title: text(row.title, 240),
    phone: leadPhone,
    email: leadEmail,
    linkedin: text(row.linkedin || row.linkedinUrl, 2000),
    location: text(row.location, 320),
    zone: text(row.zone || row.timeZone, 32).toUpperCase(),
    source: 'Contractor CSV import',
    notes,
    industry,
    errors,
  };
}

export function previewContractorCsv(csv) {
  const rows = csvRows(csv);
  if (rows.length < 2) return { rows: [], accepted: [], rejected: [{ row: 0, errors: ['No lead rows found.'] }] };
  const headers = rows[0].map(header);
  const seen = new Set();
  const preview = rows.slice(1, MAX_ROWS + 1).map((values, index) => {
    const row = normaliseContractorImportRow({
      firstName: valueAt(headers, values, ['first name', 'firstname', 'first']),
      lastName: valueAt(headers, values, ['last name', 'lastname', 'last']),
      name: valueAt(headers, values, ['name', 'full name']),
      company: valueAt(headers, values, ['company', 'company name']),
      title: valueAt(headers, values, ['title', 'job title']),
      phone: valueAt(headers, values, ['phone', 'phone number', 'company phone', 'direct phone']),
      email: valueAt(headers, values, ['email', 'email address']),
      linkedin: valueAt(headers, values, ['linkedin', 'linkedin url', 'person linkedin url']),
      location: valueAt(headers, values, ['location']) || [valueAt(headers, values, ['city']), valueAt(headers, values, ['state']), valueAt(headers, values, ['country'])].filter(Boolean).join(', '),
      zone: valueAt(headers, values, ['time zone', 'timezone', 'tz']),
      industry: valueAt(headers, values, ['industry']),
      employees: valueAt(headers, values, ['employees', 'company headcount']),
      revenue: valueAt(headers, values, ['annual revenue', 'revenue']),
      notes: valueAt(headers, values, ['notes', 'note']),
    });
    const key = row.email ? `email:${row.email}` : row.phone ? `phone:${phone(row.phone)}` : '';
    if (key && seen.has(key)) row.errors.push('Duplicate contact in this CSV.');
    if (key) seen.add(key);
    return { row: index + 2, ...row };
  });
  if (rows.length - 1 > MAX_ROWS) {
    preview.push({ row: MAX_ROWS + 2, errors: [`Only the first ${MAX_ROWS} rows can be imported at once.`] });
  }
  return {
    rows: preview,
    accepted: preview.filter((row) => !row.errors?.length),
    rejected: preview.filter((row) => row.errors?.length),
  };
}

export function allowedContractorImport(principal, campaignId) {
  return Boolean(
    principal?.role === 'contractor' &&
      principal.email &&
      principal.campaignIds?.includes(String(campaignId || ''))
  );
}

export function importIdentity({ campaignId, ownerEmail, lead }) {
  const contact = email(lead.email) || phone(lead.phone) || text(lead.name, 240).toLowerCase();
  return [String(campaignId || ''), email(ownerEmail), contact, text(lead.company, 240).toLowerCase()].join('|');
}
