(() => {
  const verifiedPhones = {
    "60eeb1ee9d4ffc0001afc36f": "+386 3 154 16 03",
    "5b23dcd7a6da988071237271": "+1 570-288-9331 ext 1023",
    "651266e8b1f8b60001659cd7": "+1 224-990-2237",
    "66f8416c7a9fc2000115504a": "+1 206-457-3987",
    "5d66a7bcf651250c1be19056": "+972 53-482-3363",
    "6048a4c164f72b0001794740": "+1 323-449-4429"
  };
  const doNotCall = new Set(["66f2d2c14f248a00015d2c54", "66fa71d58c6d57000104445c"]);
  window.importedLeads.forEach((lead) => {
    if (verifiedPhones[lead.apolloPersonId]) { lead.phone = verifiedPhones[lead.apolloPersonId]; lead.notes = "Apollo-enriched direct phone. Confirm local calling compliance before dialing."; }
    if (doNotCall.has(lead.apolloPersonId)) { lead.dnc = true; lead.stage = "Do Not Call"; lead.notes = "Apollo marked this phone Do Not Call."; }
  });
})();
