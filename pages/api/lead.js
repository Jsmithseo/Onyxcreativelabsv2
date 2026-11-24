import { sendContactEmail } from '../../lib/bdrMail';
import { saveUndeliveredInquiry } from '../../lib/websiteLeadInbox.mjs';
import { createWebsiteLeadHandler } from '../../lib/websiteLead.mjs';
import { countAcceptedInquiry } from '../../lib/websiteInquiryMetrics.mjs';

export default createWebsiteLeadHandler({
  sendEmail: sendContactEmail,
  saveUndeliveredInquiry,
  recordAcceptedInquiry: countAcceptedInquiry,
});
