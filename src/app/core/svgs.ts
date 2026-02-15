/**
 * Central registry for all SVGs used in the app.
 *
 * - **Icon SVGs:** All icon SVGs are provided by Lucide and registered in `src/app/core/icons.ts`.
 *   Use Lucide via that file (lucide-angular). Do not duplicate icon SVG markup here.
 *
 * - **Custom SVGs:** Any SVG that is not in Lucide (e.g. custom logo, illustration, badge) must be
 *   added here as an exported constant (SVG string or component) and imported where needed. This
 *   keeps all SVG assets in one place and avoids inline SVG in templates.
 *
 * Summary:
 *   - Icons in use → see core/icons.ts (ICONS_IN_USE).
 *   - Custom SVG markup → add below and list in SVGS_IN_USE.
 *
 * Example when adding a custom SVG:
 *   export const MY_CUSTOM_SVG = `<svg>...</svg>`;
 *   // Then add 'MY_CUSTOM_SVG' to SVGS_IN_USE.
 */

/** Names of custom SVG constants defined in this file (for tracking). Icon SVGs are in core/icons.ts. */
export const SVGS_IN_USE: readonly string[] = [] as const;
