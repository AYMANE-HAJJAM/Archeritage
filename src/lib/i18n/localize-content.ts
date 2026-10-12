/**
 * Helpers to merge stable, locale-neutral content (slugs, images, hrefs, ids
 * defined in `src/content/site/*.ts`) with localized copy coming from
 * next-intl message catalogs (`messages/{locale}/*.json`).
 *
 * Structured TS content stays the single source of truth for anything that
 * must not change across locales (slugs, image paths, hrefs, status flags).
 * Message JSON stays the single source of truth for any user-facing text.
 */

/** Picks a translated record entry by key, falling back to the base value when missing. */
export function pickLocalized<T>(dictionary: Record<string, T> | undefined, key: string, fallback: T): T {
  const value = dictionary?.[key];
  return value === undefined ? fallback : value;
}

/**
 * Merges an ordered list of stable content items with a keyed dictionary of
 * localized overrides, matching each item by `keyOf(item)`.
 */
export function mergeLocalizedList<Item, Localized>(
  items: readonly Item[],
  localizedByKey: Record<string, Localized> | undefined,
  keyOf: (item: Item) => string,
  merge: (item: Item, localized: Localized | undefined) => Item & Partial<Localized>,
): Array<Item & Partial<Localized>> {
  return items.map((item) => merge(item, localizedByKey?.[keyOf(item)]));
}
