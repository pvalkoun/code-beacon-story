/**
 * Convert an arbitrary string (field path, section title, etc.) into a
 * URL-hash-safe slug.
 *
 *   "partner_status.att"  -> "partner_status-att"
 *   "parent_account[]"    -> "parent_account"
 *   "Setup Guide"         -> "setup-guide"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\[\]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fieldAnchorId(path: string): string {
  return `field-${slugify(path)}`;
}
