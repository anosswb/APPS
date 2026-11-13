# 18 — Mileage log
**Tool · for American gig drivers and people who drive for work · first-guess score 27/40 · about 3 weeks**

## What it is
A simple log of work trips. Start a trip, end a trip, and it keeps the miles, the date and the purpose. At the end of the year you have a clean record.

## The special thing
Pay once, and your record stays on your phone. The big mileage apps are monthly subscriptions that follow you all day.

## What to put in version 1
- **Start and stop a trip** with one tap (distance from GPS only while a trip is running), or type the miles.
- **Purpose:** a short list you edit (delivery, client visit, supplies).
- **Totals** by week, month and year, with a per-mile rate you set.
- **Report** for any period as PDF and spreadsheet file.
- A widget to start a trip.

## What NOT to put
Tracking all day in the background, tax advice, a promise about deductions, bank links.

## The world (first direction)
A glovebox logbook and a dashboard odometer: worn paper, rolling number wheels. **Signature:** the miles roll up like an old odometer.

## Why people come back
Every working day. The record is only useful if it is complete, and the app makes that easy.

## How it earns
- **iPhone:** free = 20 trips a month. One-time unlock ($9.99–14.99): unlimited trips and reports.
- **Android:** a small ad on the totals page; a video to export a report.
- **Protected moment:** starting and ending a trip.

## Build order
1. Trip maths and reports as tested functions.
2. Grey box: start, stop, see the trip. Check battery use and that location is used only during a trip.
3. Purposes, totals, reports, widget.
4. World, then `/slop-check`.

## Check first
Mileage apps in the US store, their monthly prices and bad reviews · the stores' rules for location (ask only while in use; explain why) and the privacy answers this adds · what a mileage record should contain, from the official IRS pages (we list the fields; we never give tax advice) · US search phrases ("mileage tracker", "mileage log").

## What Anass does
Picks the world. We test with American delivery drivers from their online groups.

## Biggest risk
Location adds privacy work and store questions, and the leaders are strong. **Answer:** location only during a trip, typed miles always possible, "pay once" up front.
