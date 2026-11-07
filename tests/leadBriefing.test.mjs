import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadBriefing } from '../lib/leadBriefing.mjs';

const notes = `Industry: Landscaping
Google reviews: 12
Website: https://example.com
Prospect is Sierra Landscaping. Ask for Sierra, the owner.
Call script:
Hi, could I speak with Sierra about customer reviews?
This is Sierra with Onyx Creative Labs. I'm calling about Sierra Landscaping. Your Google listing showed 12 reviews.
Would you be open to a 15-minute introduction?
If interested: Confirm Sierra's business email.
If busy: Ask for a convenient callback time.`;

test('the same lead uses each signed-in contractor in the displayed and copied script', () => {
  for (const name of ['Jeremy Smith', 'Sierra Robinson', 'María-José Díaz']) {
    const firstName = name.split(' ')[0];
    const briefing = parseLeadBriefing(notes, { contractorName:name });
    const introduction = `This is ${firstName} with Onyx Creative Labs.`;
    assert.ok(briefing.script.includes(introduction), 'copied script uses the caller');
    assert.ok(briefing.paragraphs.some(paragraph => paragraph.startsWith(introduction)), 'display uses the same caller');
    assert.ok(briefing.script.includes("I'm calling about Sierra Landscaping. Your Google listing showed 12 reviews."));
    assert.equal(briefing.paragraphs[0], 'Hi, could I speak with Sierra about customer reviews?');
    assert.equal(briefing.narrative, 'Prospect is Sierra Landscaping. Ask for Sierra, the owner.');
    assert.equal(briefing.fields['google reviews'], '12');
    assert.equal(briefing.prompts[0].text, "Confirm Sierra's business email.");
  }
  assert.ok(notes.includes('This is Sierra with Onyx Creative Labs.'), 'shared source notes remain unchanged');
});

test('missing contractor names use a neutral introduction rather than another caller', () => {
  for (const contractorName of [undefined, null, '', '   ']) {
    const briefing = parseLeadBriefing(notes, { contractorName });
    assert.ok(briefing.script.includes("I'm calling from Onyx Creative Labs."));
    assert.equal(briefing.script.includes('This is Sierra with Onyx Creative Labs'), false);
    assert.ok(briefing.paragraphs.some(paragraph => paragraph.startsWith("I'm calling from Onyx Creative Labs.")));
  }
});

test('personalization handles other imported callers and leaves prospect names and unrelated scripts intact', () => {
  const briefing = parseLeadBriefing(notes.replace('This is Sierra with Onyx Creative Labs.', 'This is Morgan Ellis with Onyx Creative Labs.'), { contractorName:'  Jeremy  Smith  ' });
  assert.ok(briefing.script.includes('This is Jeremy with Onyx Creative Labs.'));
  const prospectScript = 'Hi Sierra, your team at Sierra Landscaping was recommended to me.';
  assert.equal(parseLeadBriefing(`Call script: ${prospectScript}`, { contractorName:'Jeremy Smith' }).script, prospectScript);
});
