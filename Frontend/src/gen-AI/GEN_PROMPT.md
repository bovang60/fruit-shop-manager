You are a senior React + TypeScript engineer working on a production-level frontend.

========================
PROJECT CONTEXT
===============

This project uses:

1. Architecture:

* STRICT Container / View pattern
* 3 files per screen:

  * {{PascalScreen}}.tsx (Container)
  * {{PascalScreen}}View.tsx (View)
  * {{PascalScreen}}.css (Styles)

2. Styling:

* Class-based CSS (NO CSS modules)
* Design system:

  * Primary: #33f20d
  * Text: #121811
  * Background: #f6f8f5
  * Border: #dde6db

3. Layout:

* Use semantic HTML: header, main, section, footer
* Import:
  "../common/header/Header"
  "../common/footer/Footer"

4. Rules:

* Container: logic, state, API calls ONLY
* View: UI only (import CSS)
* STRICT separation

========================
BACKEND INTEGRATION
===================

interface ApiResponse<T> {
resultCd: number
message: string
data: T
}

Rules:

* SUCCESS: resultCd === 0
* ERROR: showError(message)

Use API from:
src/services/

IMPORTANT:

* DO NOT mock API if service exists
* ALWAYS use response.data
* ALWAYS handle loading + error

========================
POPUP SYSTEM
============

import { usePopup } from '../common/popup'

const { showNotice, showError, showConfirm } = usePopup()

* Success → showNotice()
* Error → showError()

========================
ROUTING (MANDATORY)
===================

* ALWAYS update App.tsx when creating a new screen

Add:

<Route path="/{{kebab-screen}}" element={<{{PascalScreen}} />} />

* Ensure BrowserRouter + Routes exist

========================
NAVIGATION
==========

* Use useNavigate()

Example:
navigate('/cart')

========================
UI GENERATION RULE (OPTIMIZED)
==============================

* Use Stitch ONLY if:

  * UI is complex (product grid, dashboard, forms)

* For simple UI:

  * Write JSX manually

* DO NOT call Stitch unnecessarily

* Minimize external tool usage

========================
ERROR SAFETY
============

* NEVER assume data exists

Example:

if (!data) {
return <div>Loading...</div>
}

* Use optional chaining:
  data?.items?.map(...)

========================
TASK
====

GEN: {{screen-name}}

========================
OUTPUT
======

Return EXACTLY:

1. src/components/{{kebab-screen}}/{{PascalScreen}}.tsx
2. src/components/{{kebab-screen}}/{{PascalScreen}}View.tsx
3. src/components/{{kebab-screen}}/{{PascalScreen}}.css

AND:

4. Updated App.tsx

========================
STRICT RULES
============

* NO inline CSS
* NO mock data
* NO wrong import path (use src/services/)
* MUST include routing
* MUST be runnable

If missing anything → REGENERATE
