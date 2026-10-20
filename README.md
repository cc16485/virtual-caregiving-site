# Caring Companions Virtual Caregiving site

Static site, no build step (same setup as mo-care.com). Two pages:

- `index.html`: the family page (price builder + "Get started" form)
- `careers.html`: the page for caregivers in the Philippines and Vietnam

The family form posts to the same Hub `lead-intake` door every mo-care.com form uses.
Each submission becomes a Hub lead (source "Website") with `care_for: "Virtual Caregiving"`
and the visit details in the message. If it fails, the family sees an error with the office phone.

Prices are copied from mo-care.com/hometogether (`RATES` in `assets/site.js`). Change both together.

## Before launch

- [x] Web address: virtual.mo-care.com (GitHub Pages, repo cc16485/virtual-caregiving-site; the *.mo-care.com wildcard DNS already points here)
- [ ] Remove the noindex line from both pages and delete robots.txt so Google can find the site
- [ ] Real photos of Samantha and Katlin in the "Our story" section (no stock photos)
- [ ] Background checks set up (NBI clearance in the Philippines, criminal record certificate in Vietnam): the site promises one
- [ ] Confirm the HomeTogether platform can record visits, and add recording consent to the family agreement: the site says visits are recorded
- [ ] Decide where families read visit notes: the site promises a note after every visit
- [ ] Write the real no-answer and emergency steps, with a US person on call
- [ ] Round 1 hiring link: point the "Round 1 opens soon" button on `careers.html` at it
- [ ] Send one real test from the live page to the Hub, then delete the test lead
- [ ] Update mo-care.com/hometogether so both pages tell the same caregiver story
