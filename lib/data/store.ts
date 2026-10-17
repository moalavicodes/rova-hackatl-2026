"use client";

// Browser store (D-005): starts from the JSON seed, keeps the demo's live state in
// localStorage, and syncs open tabs, so the Student, Teacher, and Parent views share one state
// on the same laptop. All state changes go through the pure functions in lib/rules/engine.ts.

import { useSyncExternalStore } from "react";
import { resetLLM } from "@/lib/llm";
import {
  apply_teacher_action,
  log_event,
  run_recheck,
  seedState,
  type RovaState,
} from "@/lib/rules/engine";
import type { Alert, Event, TeacherAction } from "@/lib/types";

const STORAGE_KEY = "rova-demo-v1";
const serverSnapshot = seedState();
const listeners = new Set<() => void>();
let current: RovaState | null = null;

function read(): RovaState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as RovaState;
      if (parsed?.version === 1) return parsed;
    }
  } catch {
    // Private window or blocked storage: run from the seed without saving.
  }
  return seedState();
}

function notify() {
  for (const listener of listeners) listener();
}

function commit(next: RovaState) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: the state still works for this tab.
  }
  notify();
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  current = read();
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getState(): RovaState {
  current ??= read();
  return current;
}

export function useRovaState(): RovaState {
  return useSyncExternalStore(subscribe, getState, () => serverSnapshot);
}

// log_event for each event in order; returns the alerts they created.
export function logEvents(events: Event[]): Alert[] {
  let state = getState();
  const created: Alert[] = [];
  for (const event of events) {
    const result = log_event(state, event);
    state = result.state;
    created.push(...result.newAlerts);
  }
  commit(state);
  return created;
}

export function teacherAction(alertId: string, action: TeacherAction) {
  commit(apply_teacher_action(getState(), alertId, action));
}

// The loop tracker's "fast-forward 7 days" passes the alert's scheduled recheck time.
export function recheck(alertId: string, nowOverride?: Date) {
  commit(run_recheck(getState(), alertId, nowOverride));
}

export function resetDemo() {
  resetLLM();
  commit(seedState());
}
