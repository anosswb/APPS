# 06 — Operator daily checks
**Tool · for American forklift, lift and equipment operators, and truck drivers who do a pre-trip inspection · first-guess score 31/40 · about 4 weeks**

## What it is
The paper checklist an operator fills before starting a machine, on the phone. Tick each point, photograph a defect, sign, and send a clean PDF to the supervisor in one minute.

## The special thing
It works with gloves, in sunlight and with no signal. It is made for the person in the cab, not for the office.

## What to put in version 1
- **Pick a machine type** (forklift, telehandler, excavator, lift platform, crane, truck) and get an example checklist you can edit.
- **Three big buttons per point:** OK, defect, not applicable.
- **Defect:** take a photo, add a note (typing or the phone's dictation).
- **Sign with a finger.**
- **PDF** with date, time, machine number, operator, results and photos. Share by text message or email.
- **History** per machine, kept on the phone.
- A reminder at the start of the shift.

## What NOT to put
Team dashboards, cloud storage, fleet tracking, any promise that the checklist meets a law or a standard. The lists are examples; the user follows the site's own rules.

## The world (first direction)
Site-ready: asphalt grey, one hi-vis amber, very large controls, condensed numbers. **Signature:** a full-width amber "All clear" bar that slides across when every point is done, with a firm double tap in the hand.

## Why people come back
It is required every shift. The reminder, the one-minute flow and the history make it faster than paper.

## How it earns
- **iPhone:** free = one machine and the example list. One-time unlock ($6.99–9.99; people who use it for work pay more): unlimited machines, own checklists, a company logo on the PDF, export of all records.
- **Android:** light ads on the history page only. Honest note: with no purchases on Android in Morocco, Android brings reach and reviews more than money.
- **Protected moment:** filling a checklist. No ad, ever.

## Build order
1. Checklist data model and the PDF maker, with tests.
2. Grey box: fill a 20-point list in under a minute with one thumb.
3. Photos, signature, share. History. Reminder.
4. World, then `/slop-check` in bright light.

## Check first
Existing inspection apps in the US store (most are team products with accounts and subscriptions; a simple personal one may be the gap) · what US rules ask for: forklifts are to be examined before each shift under OSHA's powered industrial truck rule, and commercial drivers write a vehicle inspection report (read the official OSHA and FMCSA pages; we describe, we never promise compliance) · US search phrases ("forklift checklist", "pre trip inspection", "daily equipment inspection").

## What Anass does
Says if he knows this job from the inside and how the paper form is really used. Then we test the grey box with American operators found in their online groups.

## Biggest risk
Only strong if Anass knows these users. And safety is a sensitive subject. **Answer:** no safety promises anywhere; clear words that it is a helper for the user's own checklist.
