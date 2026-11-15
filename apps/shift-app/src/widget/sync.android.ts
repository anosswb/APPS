/** Android: draws the widget when the system asks, and redraws it whenever the app's data changes. */
import React from 'react';
import { registerWidgetTaskHandler, requestWidgetUpdate, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { load, Saved } from '../store';
import { NextRest } from './NextRest';

export const WIDGET = 'NextRest';

async function handler({ widgetAction, renderWidget }: WidgetTaskHandlerProps) {
  if (widgetAction === 'WIDGET_DELETED') return;
  const data = await load();
  renderWidget(React.createElement(NextRest, { data, now: new Date() }));
}

export function registerWidget(): void {
  registerWidgetTaskHandler(handler);
}

export function updateWidget(data: Saved): void {
  requestWidgetUpdate({ widgetName: WIDGET, renderWidget: () => React.createElement(NextRest, { data, now: new Date() }) }).catch((e) => console.warn('Could not update the widget', e));
}
