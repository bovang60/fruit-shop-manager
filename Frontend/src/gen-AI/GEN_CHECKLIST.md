# Generation checklist (per-screen)

Use this checklist to validate a generated screen matches the project contract. Each generated screen should satisfy these items.

- [ ] 1. Files created in correct location:

  - `src/components/{{kebab-screen}}/{{PascalScreen}}.tsx` (container)
  - `src/components/{{kebab-screen}}/{{PascalScreen}}View.tsx` (view)
  - `src/components/{{kebab-screen}}/{{PascalScreen}}.css` (styles)

- [ ] 2. View file imports its CSS: `import './{{PascalScreen}}.css'`
- [ ] 3. Container imports and renders the View component
- [ ] 4. View declares a `Props` type or `interface Props` and uses it for the component
- [ ] 5. Container holds state/handlers and passes values + callbacks to View via props
- [ ] 6. View contains semantic markup and uses class-name contract (at least these classes present):
  - `.register-root` or `.login-root` (root wrapper)
  - `.register-wrap`, `.register-card` (or similar card classes)
  - `.field`, `.form-actions`, `.primary`, `.link-btn`
- [ ] 7. Accessibility basics present: labels for inputs, buttons with `type`, `aria-invalid` used by the view for errors (if present)
- [ ] 8. No inline styles that alter layout (grid columns, major padding). Styles must be in CSS file.
- [ ] 9. Container shows mock API behavior on submit (loading state, success callback or message)

How to run an automated check

Use the Node helper included in this folder:

```powershell
node src/gen-AI/check_generated.js <kebab-screen>
```

The script prints a JSON report and a human-friendly summary with each checklist item PASS/FAIL and a short message.
