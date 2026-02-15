/**
 * Central registry for custom SVG markup used in the app.
 *
 * - **Icons:** Use Lucide via `src/app/core/icons.ts` (lucide-angular). Do not add icon SVGs here.
 * - **Custom SVGs:** If a feature needs an SVG that is not in Lucide (e.g. custom logo, illustration),
 *   add it here as an exported constant (e.g. SVG string or Angular component) and import it where needed.
 *   This keeps SVG assets in one place and avoids inline SVG in templates.
 *
 * Example (when needed):
 *   export const MY_CUSTOM_SVG = `<svg>...</svg>`;
 *   // Or export a component that wraps the SVG.
 *
 * Currently unused: the app uses only Lucide icons from core/icons.ts.
 */

export const SVGS_IN_USE: readonly string[] = [] as const;
