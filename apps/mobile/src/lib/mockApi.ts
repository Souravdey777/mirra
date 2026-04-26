import { chatMessages, personaSnapshot, postDrafts, suggestionChips, todayPrompt } from "@mirra/product";

const mockLatency = 120;

function wait<T>(value: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), mockLatency);
  });
}

export function fetchTodayThread() {
  return wait({
    messages: chatMessages,
    drafts: postDrafts,
    suggestions: suggestionChips,
    prompt: todayPrompt
  });
}

export function fetchPersonaSnapshot() {
  return wait(personaSnapshot);
}
