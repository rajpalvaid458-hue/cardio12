/**
 * Local Notification System for Workout and Nutrition Reminders.
 * Handles Web Notification API, audio alerts, and scheduled reminder calculations.
 */

import { playWorkoutReminderTone, playMealReminderTone, playNotificationChime } from './audio';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

/** Check current browser Notification API permission state safely */
export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    return Notification.permission as NotificationPermissionState;
  } catch {
    return 'unsupported';
  }
}

/** Request user permission for browser desktop/mobile notifications */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm as NotificationPermissionState;
  } catch (err) {
    console.warn('Notification permission request error:', err);
    return getNotificationPermission();
  }
}

/** Dispatch a native browser notification if granted */
export function sendBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    onClick?: () => void;
  }
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    if (Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/favicon.ico',
        tag: options?.tag || 'pulsefit-reminder',
      });

      notif.onclick = () => {
        window.focus();
        if (options?.onClick) {
          options.onClick();
        }
        notif.close();
      };

      return true;
    }
  } catch (err) {
    console.warn('Failed to send native Notification:', err);
  }
  return false;
}

/** Play audio tone according to reminder type */
export function playReminderAudio(type: 'workout' | 'meal' | 'general' | 'water') {
  try {
    if (type === 'workout') {
      playWorkoutReminderTone();
    } else if (type === 'meal') {
      playMealReminderTone();
    } else {
      playNotificationChime();
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Parse time string (e.g. "06:30 PM", "6:30 PM", "18:30") to { hours24: number, minutes: number }
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 18, minutes: 0 };

  const clean = timeStr.trim();
  const is12Hour = /am|pm/i.test(clean);

  if (is12Hour) {
    const parts = clean.split(/[:\s]+/);
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const modifier = (parts[2] || '').toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
  } else {
    const [h, m] = clean.split(':').map((s) => parseInt(s, 10) || 0);
    return { hours: h, minutes: m };
  }
}

/**
 * Format hours and minutes to 12-hour "hh:mm A" string
 */
export function formatTo12Hour(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayHours < 10 ? '0' : ''}${displayHours}:${displayMins} ${period}`;
}

/**
 * Convert minutes offset before a scheduled time to a time string
 * E.g., scheduled "06:00 PM", offset 45 mins -> "05:15 PM"
 */
export function getTimeWithMinutesOffset(baseTimeStr: string, offsetMinsBefore: number): string {
  const { hours, minutes } = parseTimeString(baseTimeStr);
  let totalMins = hours * 60 + minutes - offsetMinsBefore;
  if (totalMins < 0) totalMins += 24 * 60;
  const newHours = Math.floor(totalMins / 60) % 24;
  const newMins = totalMins % 60;
  return formatTo12Hour(newHours, newMins);
}

/**
 * Check if the target scheduled time matches current local time (hours and minutes)
 */
export function isCurrentTimeMatching(scheduledTimeStr: string, date: Date = new Date()): boolean {
  const { hours: targetH, minutes: targetM } = parseTimeString(scheduledTimeStr);
  const currentH = date.getHours();
  const currentM = date.getMinutes();
  return currentH === targetH && currentM === targetM;
}

/**
 * Get human readable countdown to a time string (e.g. "in 45 mins", "in 2 hrs 10 mins", "tomorrow at ...")
 */
export function getTimeRemainingString(scheduledTimeStr: string): string {
  const now = new Date();
  const { hours, minutes } = parseTimeString(scheduledTimeStr);

  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  let diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    // Already passed today, target tomorrow
    diffMs += 24 * 60 * 60 * 1000;
  }

  const diffMins = Math.round(diffMs / (1000 * 60));
  if (diffMins < 60) {
    return `in ${diffMins} min${diffMins === 1 ? '' : 's'}`;
  }
  const diffHours = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;
  if (remMins === 0) {
    return `in ${diffHours} hr${diffHours === 1 ? '' : 's'}`;
  }
  return `in ${diffHours} hr${diffHours === 1 ? '' : 's'} ${remMins}m`;
}
