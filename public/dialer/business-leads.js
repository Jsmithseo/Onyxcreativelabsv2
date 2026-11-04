window.importedLeads = window.importedLeads || [];
window.importedLeads.push(
  ...[
    ["Artist Growth", "Nashville, Tennessee", "CT", 22],
    ["MGLogics", "Broadlands, Virginia", "ET", 17],
    ["Billoo", "Waynesville, Ohio", "ET", 19],
    ["Permissionless", "Morristown, New Jersey", "ET", 17],
    ["Loman AI", "Austin, Texas", "CT", 33],
    ["DataOceans", "Alpharetta, Georgia", "ET", 42],
    ["Broadcast Pix", "Tyngsborough, Massachusetts", "ET", 21],
    ["KarmaSuite", "San Francisco, California", "PT", 10],
    ["Sunsama", "Oakland, California", "PT", 10],
    ["BidWizer", "Charlotte, North Carolina", "ET", 10],
    ["Toke", "Hartford, Connecticut", "ET", 14],
    ["CellarTracker", "Seattle, Washington", "PT", 27],
    ["ReferPro", "Lehi, Utah", "MT", 35],
    ["Driveline PULSE", "Kent, Washington", "PT", 12],
    ["FastForward.ai", "Mountain View, California", "PT", 25]
  ].map(([company, location, zone, employees]) => ({
    name: "Company contact to research",
    company,
    title: "Engineering / technical leader",
    phone: "—",
    email: "—",
    linkedin: "",
    location,
    zone,
    source: "Apollo company search",
    stage: "New",
    followOffset: null,
    notes: `Apollo match: ${employees} employees. Contact details need enrichment before calling.`,
    campaign: "business"
  }))
);
