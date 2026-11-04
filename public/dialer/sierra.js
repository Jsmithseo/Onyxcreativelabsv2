const storageKey = "onyx-sierra-reviews-test-v1";
const defaultLeads = [
  { id:"demo-1", name:"Harbor Fitness", company:"Local fitness studio", phone:"415-555-0138", zone:"PT", status:"New" },
  { id:"demo-2", name:"North Bay Pilates", company:"Boutique wellness studio", phone:"707-555-0182", zone:"PT", status:"New" },
  { id:"demo-3", name:"Greenline Training", company:"Personal training business", phone:"510-555-0167", zone:"PT", status:"New" }
];
let state = { leads: defaultLeads, activity: [], selected: "demo-1", signedIn: false };
try { state = { ...state, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; } catch { /* local test state starts clean */ }
if (new URLSearchParams(window.location.search).has("signin")) state.signedIn = false;
if (!Array.isArray(state.leads) || !state.leads.length) state.leads = defaultLeads;
const $ = (id) => document.getElementById(id);
const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString([], { month:"short", day:"numeric" }) : "—";
const persist = () => localStorage.setItem(storageKey, JSON.stringify(state));
let toastTimer;
function toast(message) { const node = $("toast"); node.textContent = message; node.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove("show"), 2600); }
function selectedLead() { return state.leads.find((lead) => lead.id === state.selected) || state.leads[0]; }
function activityToday() { const today = new Date().toDateString(); return state.activity.filter((item) => new Date(item.at).toDateString() === today); }
function render() {
  const lead = selectedLead(); const today = activityToday();
  $("leadName").textContent = lead.name; $("leadCompany").textContent = `${lead.company} · Onyx Reviews`; $("leadPhone").textContent = lead.phone; $("leadZone").textContent = lead.zone;
  $("manualDial").href = `tel:${lead.phone.replace(/\D/g, "")}`; $("leadNumber").textContent = `${state.leads.findIndex((item) => item.id === lead.id) + 1} of ${state.leads.length}`;
  $("disposition").value = lead.disposition || ""; $("notes").value = lead.notes || ""; $("followUp").value = lead.followUp || "";
  $("callsToday").innerHTML = `${today.length} <em>/ 120</em>`; $("appointmentsToday").innerHTML = `${today.filter((item) => item.disposition === "Appointment set").length} <em>/ 3</em>`;
  $("followupsDue").textContent = state.leads.filter((item) => item.followUp === new Date().toISOString().slice(0,10)).length;
  $("leadQueue").innerHTML = state.leads.map((item) => `<button class="queue-row ${item.id === lead.id ? "active" : ""}" data-lead="${item.id}"><span><strong>${item.name}</strong><small>${item.company} · ${item.phone} · ${item.zone}</small></span><span class="tag">${item.status || "New"}</span></button>`).join("");
  $("leadQueue").querySelectorAll("[data-lead]").forEach((node) => node.onclick = () => { state.selected = node.dataset.lead; persist(); render(); });
  $("history").innerHTML = today.length ? [...today].reverse().map((item) => `<div class="history-row"><span><strong>${item.name}</strong><small>${item.disposition}${item.followUp ? ` · Follow up ${formatDate(item.followUp)}` : ""}</small></span><small>${new Date(item.at).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</small></div>`).join("") : '<div class="empty">No calls saved today yet.</div>';
}
$("loginButton").onclick = () => { state.signedIn = true; persist(); $("loginView").style.display = "none"; $("app").style.display = "block"; render(); };
$("scheduleButton").onclick = () => { $("calendarModal").classList.add("show"); $("calendarModal").setAttribute("aria-hidden", "false"); };
$("closeCalendar").onclick = () => { $("calendarModal").classList.remove("show"); $("calendarModal").setAttribute("aria-hidden", "true"); };
$("saveOutcome").onclick = () => { const lead = selectedLead(), disposition = $("disposition").value; if (!disposition) { toast("Choose an outcome before saving"); return; } lead.disposition = disposition; lead.notes = $("notes").value.trim(); lead.followUp = $("followUp").value; lead.status = disposition === "Appointment set" ? "Appointment set" : disposition === "Connected — follow up" ? "Follow-up" : "Called"; state.activity.push({ name:lead.name, disposition, followUp:lead.followUp, at:new Date().toISOString() }); persist(); toast("Call outcome saved"); render(); };
$("todayDate").textContent = new Date().toLocaleDateString([], { month:"short", day:"numeric" });
if (state.signedIn) { $("loginView").style.display = "none"; $("app").style.display = "block"; render(); }
