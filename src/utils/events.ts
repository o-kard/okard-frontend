// src/utils/events.ts

export const BOOKMARK_TOGGLED_EVENT = "BOOKMARK_TOGGLED";

export interface BookmarkToggledPayload {
  campaignId: string;
  isBookmarked: boolean;
}

export function dispatchBookmarkToggled(campaignId: string, isBookmarked: boolean) {
  const event = new CustomEvent<BookmarkToggledPayload>(BOOKMARK_TOGGLED_EVENT, {
    detail: { campaignId, isBookmarked },
  });
  window.dispatchEvent(event);
}

export function subscribeToBookmarkToggled(callback: (payload: BookmarkToggledPayload) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<BookmarkToggledPayload>;
    callback(customEvent.detail);
  };

  window.addEventListener(BOOKMARK_TOGGLED_EVENT, handler);
  return () => window.removeEventListener(BOOKMARK_TOGGLED_EVENT, handler);
}
