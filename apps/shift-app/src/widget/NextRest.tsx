/** The home-screen widget (Android): next rest day and today's shift. Drawn from the same saved data as the app. */
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { todayKey, weekday } from '../core/dates';
import { clock } from '../core/dayline';
import { dayOn, nextRest, shiftMinutes } from '../core/days';
import { t } from '../i18n/en';
import { planOf, Saved } from '../store';

export function NextRest({ data, now }: { data: Saved; now: Date }) {
  const plan = planOf(data);
  const today = todayKey(now);
  const day = dayOn(plan, today);
  const rest = nextRest(plan, today);
  const big = day?.kind === 'rest' ? t.today.restToday : rest ? t.today.inDays(rest.inDays) : t.today.noRest;
  const when = rest && day?.kind !== 'rest' ? `${t.days[weekday(rest.key)]}, ${t.monthsShort[Number(rest.key.slice(5, 7)) - 1]} ${Number(rest.key.slice(8))}` : '';
  const log = data.log[today];
  const line = log && log.out === null ? t.widget.clockedIn(clock(log.in).text)
    : day?.kind === 'work' ? `${t.widget.today}  ${clock(day.start).text} – ${clock(day.start + shiftMinutes(day)).text}`
    : day?.kind === 'rest' ? t.widget.rest : t.widget.notMarked;
  return (
    <FlexWidget clickAction="OPEN_APP" style={{ height: 'match_parent', width: 'match_parent', padding: 18, borderRadius: 26, backgroundGradient: { from: '#16304F', to: '#0A0F15', orientation: 'TOP_BOTTOM' }, justifyContent: 'space-between' }}>
      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget text={t.widget.nextRest} style={{ fontSize: 11, color: '#AEB6C4', letterSpacing: 0.1 }} />
        <TextWidget text={big} style={{ fontSize: 30, color: '#FFFFFF', fontWeight: '700' }} />
        {when !== '' && <TextWidget text={when} style={{ fontSize: 14, color: '#4FD08F', fontWeight: '600' }} />}
      </FlexWidget>
      <TextWidget text={line} style={{ fontSize: 14, color: '#E6E9EE', fontWeight: '500' }} />
    </FlexWidget>
  );
}
