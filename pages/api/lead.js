import { sendContactEmail } from '../../lib/bdrMail';
import { createWebsiteLeadHandler } from '../../lib/websiteLead.mjs';

export default createWebsiteLeadHandler({ sendEmail: sendContactEmail });
