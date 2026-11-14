import React from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from '../i18n/en';
import { space } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Rule } from '../ui/Rule';
import { Type } from '../ui/Type';
import { ReminderTime } from './plan';

interface Props {
  /** null while the question is open; then what happened */
  result: 'on' | 'blocked' | null;
  time: ReminderTime;
  onAnswer: (yes: boolean) => void;
}

/** The one-time question after a solved daily puzzle. Set like a small notice on the page, never a pop-up. */
export function ReminderAsk({ result, time, onAnswer }: Props) {
  return (
    <View style={styles.box} accessibilityLiveRegion="polite">
      <Rule />
      {result === null ? (
        <>
          <Type variant="bodyItalic" style={styles.text}>
            {t.reminder.ask}
          </Type>
          <Type tone="muted" style={styles.about}>
            {t.reminder.askAbout}
          </Type>
          <View style={styles.actions}>
            <Btn label={t.reminder.no} kind="quiet" onPress={() => onAnswer(false)} />
            <Btn label={t.reminder.yes} kind="outline" onPress={() => onAnswer(true)} />
          </View>
        </>
      ) : (
        <Type variant="bodyItalic" tone="muted" style={[styles.text, styles.done]}>
          {result === 'on' ? t.reminder.isOn(t.reminder.times[time]) : t.reminder.blocked}
        </Type>
      )}
      <Rule />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: space.l },
  text: { marginTop: space.m },
  about: { marginTop: space.xs },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: space.s, marginVertical: space.s },
  done: { marginBottom: space.m },
});
