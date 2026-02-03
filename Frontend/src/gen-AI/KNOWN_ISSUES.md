# Known issues and automatic fixes for generated screens

Purpose

- Record recurrent generation/runtime problems and describe automatic fixes the generator should apply after generating files. Generators and other AIs should consult this file and apply fixes before returning files to the user.

Current known issues (2026-02-04)

1. Runtime: "requested module ... does not provide an export named '<TypeName>'"

- Symptom: Container imports a TypeScript type as a runtime export, e.g. `import X, { Y } from './XView'` where `Y` is a type-only export. In ESM runtime (package.json "type": "module") the type is removed and the import fails.
- Auto-fix rule for generator:
  - Always export view props as an explicit type named `Props` or export the types as named types (e.g. `export type RegisterValues = { ... }`).
  - In container files, import types using TypeScript type-only imports. Examples the generator must use:
    - `import View, { type RegisterValues } from './RegisterView'` // valid TS type-only import
    - or `import type { RegisterValues } from './RegisterView'` and `import RegisterView from './RegisterView'`
  - Prefer `import View, { type X }` pattern to keep a single import statement.

2. Checker false-negatives: 'view:declares-props' and 'view:labels'

- Symptom: The checker (`check_generated.js`) expects to find `type Props` or `interface Props` in the view and simple `<label>` tags. In some generated views the Props type or label markup is present but not matching the regex, causing FAIL.
- Auto-fix rule for generator:
  - Always include an explicit `export type Props = { ... }` (exact token `type Props`) in the top of the view file even if other exported types exist.
  - Use plain `<label>` elements (not templated or JSX expressions) so the checker regex can detect them.

3. Inline styles vs CSS import

- Symptom: Generated view uses inline style objects that violate project conventions.
- Auto-fix rule:
  - Ensure the view imports its CSS (e.g. `import './Register.css'`) and move layout/visual styles to the CSS file. If inline styles appear, move them to the generated CSS and remove inline attributes.

Automation guidance for generator

- After generating files, perform these steps automatically:
  1. Run the local checker: `node src/gen-AI/check_generated.js <kebab-screen>`.
  2. If the checker reports `view:declares-props` FAIL, add `export type Props = { ... }` to the view using the props the container passes.
  3. If the checker reports `view:labels` FAIL, search the view for form controls and ensure each input is wrapped by a plain `<label>...</label>` element; add missing labels.
  4. If the checker reports inline styles, move styles into the CSS file and ensure `import './<Pascal>.css'` is present.
  5. Re-run the checker and return the updated files and report.

Record maintenance

- Update this file when new recurring issues are found or when the checker is improved.
