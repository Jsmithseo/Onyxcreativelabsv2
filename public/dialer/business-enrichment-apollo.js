(() => {
  const verifiedPhones = {
    "5f6307ba0671c2008cef7541": "+1 978-806-1060",
    "67541195deef1b0001f99d03": "+27 83 777 3877",
    "66f2e248a7fa140001fdeaad": "+1 413-426-2638",
    "54a4efb4746869367601106f": "+91 77025 60186",
    "54a326ca7468693fda34b857": "+44 78 3584 4770",
    "5f99c0123638520001d3da17": "+1 267-424-9731",
    "54aaa7e074686908c8fdbf10": "+886 922 899 287",
    "64c7aa947a1b9f0001798ff0": "+55 11 98431-0348"
  };
  window.importedLeads.forEach((lead) => {
    if (verifiedPhones[lead.apolloPersonId]) {
      lead.phone = verifiedPhones[lead.apolloPersonId];
      lead.notes = "Apollo-enriched direct phone. Confirm local calling compliance before dialing.";
    }
  });
})();
