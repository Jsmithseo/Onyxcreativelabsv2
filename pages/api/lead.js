import { sendContactEmail } from '../../lib/bdrMail';
import { saveUndeliveredInquiry } from '../../lib/websiteLeadInbox.mjs';
import { createWebsiteLeadHandler } from '../../lib/websiteLead.mjs';

export default createWebsiteLeadHandler({ sendEmail: sendContactEmail, saveUndeliveredInquiry });
