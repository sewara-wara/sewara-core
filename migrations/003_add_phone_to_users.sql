-- WhatsApp number, stored normalized as 62xxxxxxxxxx (no +, no leading 0) so it can be used directly in https://wa.me/<phone>.
-- Optional for seekers; owners will need it to post listings.

ALTER TABLE users
  ADD COLUMN phone VARCHAR(20) NULL AFTER email;
