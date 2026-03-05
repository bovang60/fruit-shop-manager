# Generation checklist (per-screen)

Use this checklist to validate a generated screen matches the project contract. Each generated screen should satisfy these items.

## Pre-Generation Checklist (Design File Workflow)

- [ ] Design file exists at: `src/components/{{kebab-screen}}/design.md`
- [ ] Design file contains valid HTML markup OR layout description
- [ ] Design file follows format (see DESIGN_FILE_EXAMPLE.md)
- [ ] Command format correct: `Design: [path]\nGen: [Screen Name]`
- [ ] File path is absolute and correct

## Post-Generation Checklist

### 1. File Structure

- [ ] Files created in correct location:
  - `src/components/{{kebab-screen}}/{{PascalScreen}}.tsx` (container)
  - `src/components/{{kebab-screen}}/{{PascalScreen}}View.tsx` (view)
  - `src/components/{{kebab-screen}}/{{PascalScreen}}.css` (styles)

### 2. Container ({{PascalScreen}}.tsx)

- [ ] Imports `useNavigate` from `react-router-dom` (if needed)
- [ ] Imports services from `../../services/` or `../../utils/` (if needed)
- [ ] Declares state with `useState`
- [ ] Has validation logic (if form screen)
- [ ] Has API integration (loading, error handling)
- [ ] **Does NOT import CSS**
- [ ] Renders View component with typed props
- [ ] Navigation handlers implemented (onGoToLogin, etc.)

### 3. View ({{PascalScreen}}View.tsx)

- [ ] Imports CSS: `import './{{PascalScreen}}.css'`
- [ ] Imports Header from `../common/header/Header`
- [ ] Imports Footer from `../common/footer/Footer`
- [ ] Declares typed `Props` interface/type
- [ ] Component receives props (no internal state except UI-only)
- [ ] Contains **ONLY** presentational markup
- [ ] Semantic HTML used (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] Layout matches design file structure

### 4. Styles ({{PascalScreen}}.css)

- [ ] Follows design system colors:
  - Primary: `#33f20d`
  - Text: `#121811`
  - Muted: `#678a60`
  - Background: `#f6f8f5`
  - Border: `#dde6db`
- [ ] Class-based styling (no CSS modules)
- [ ] Root class: `.{{kebab}}-root`
- [ ] Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: ≥ 1024px
- [ ] No inline styles that alter layout
- [ ] Styles transformed from design file (if provided)

### 5. Design Fidelity (if design file provided)

- [ ] Layout structure matches design file
- [ ] HTML elements match design markup
- [ ] CSS classes match or transformed correctly
- [ ] Static content converted to dynamic props
- [ ] Forms converted to controlled components
- [ ] Buttons have proper event handlers

### 6. Class Names Contract

- [ ] Root wrapper: `.{{screen}}-root`
- [ ] Header: `.{{screen}}-header`
- [ ] Main: `.{{screen}}-main`
- [ ] Footer: `.{{screen}}-footer`
- [ ] Form elements (if applicable):
  - `.field` (field wrapper)
  - `.error-message` (error display)
  - `button.primary` (CTA buttons)
  - `button.secondary` (secondary actions)
  - `.link-btn` (link-style buttons)

### 7. TypeScript & Props

- [ ] View Props interface declared with proper types
- [ ] Container passes all required props
- [ ] Callbacks typed correctly: `(value: Type) => void`
- [ ] Event handlers typed: `(e: React.FormEvent) => void`
- [ ] No TypeScript errors (`npm run dev` runs clean)

### 8. Accessibility

- [ ] All inputs have `<label>` with matching `htmlFor`
- [ ] Error states use `aria-invalid` and `aria-describedby`
- [ ] Buttons have explicit `type` attribute
- [ ] Images have `alt` text (or use background-image for decorative)
- [ ] Focus states visible on interactive elements
- [ ] Keyboard navigation works (proper tab order)

### 9. Functionality

- [ ] Form validation works (if form screen)
- [ ] Loading states display correctly
- [ ] Error messages show properly (general + field-specific)
- [ ] Navigation works (useNavigate handlers)
- [ ] API integration follows pattern (try-catch, resultCd check)
- [ ] Success/error callbacks work

### 10. Responsive Design

- [ ] Mobile view works (< 768px)
- [ ] Tablet view works (768px - 1023px)
- [ ] Desktop view works (≥ 1024px)
- [ ] Split-screen layouts stack on mobile (if applicable)
- [ ] Sidebar hides/collapses on mobile (if applicable)
- [ ] Images scale properly
- [ ] Touch targets ≥ 44px on mobile

## How to run automated check

Use the Node helper included in this folder:

```powershell
node src/gen-AI/check_generated.js <kebab-screen>
```

The script prints a JSON report and a human-friendly summary with each checklist item PASS/FAIL and a short message.

## Manual Testing Steps

### Step 1: Visual Check
1. Run `npm run dev`
2. Navigate to the screen in browser
3. Check layout matches design file (if provided)
4. Test on different screen sizes:
   - Mobile: < 768px (Chrome DevTools)
   - Tablet: 768px - 1023px
   - Desktop: ≥ 1024px

### Step 2: Functionality Check
1. Test form submission (if applicable)
2. Check validation messages
3. Test navigation links/buttons
4. Verify loading states
5. Test error handling (disconnect network, invalid input)

### Step 3: Code Review
1. Open all 3 files
2. Verify Container/View separation
3. Check TypeScript types
4. Review class names
5. Verify imports are correct

### Step 4: Accessibility Check
1. Tab through all interactive elements
2. Check focus indicators visible
3. Test with screen reader (NVDA/JAWS)
4. Verify ARIA attributes
5. Check color contrast (WCAG AA)

## Common Issues & Fixes

### Issue: TypeScript errors
**Fix:** 
- Check Props interface matches actual props passed
- Verify imports (useState, useNavigate, etc.)
- Run `npm run dev` to see errors

### Issue: CSS not applied
**Fix:**
- Verify View imports CSS: `import './{{Screen}}.css'`
- Check class names match between View and CSS
- Clear browser cache

### Issue: Layout broken on mobile
**Fix:**
- Add responsive media queries
- Use `flex-direction: column` for mobile
- Test with Chrome DevTools device toolbar

### Issue: Navigation not working
**Fix:**
- Import useNavigate: `import { useNavigate } from 'react-router-dom'`
- Call navigate with correct path: `navigate('/login')`
- Check route defined in App.tsx

### Issue: API calls fail
**Fix:**
- Check backend is running (localhost:8080)
- Verify API endpoint correct
- Check CORS settings
- Test with Postman/curl first

## Updated

Last updated: 2026-02-26 - Added design file workflow checklist
