# IMPORTANT IMPLEMENTATION RULES

This frontend MUST be fully functional against the existing backend.

Do NOT generate:

* fake placeholder UI
* decorative-only components
* dead buttons
* mock interactions
* static fake data
* disconnected frontend logic

Every interaction must connect to actual backend workflows.

ALL forms, buttons, actions, and interactions must:

* trigger real API calls
* update application state correctly
* handle loading states
* handle optimistic updates
* handle API errors
* synchronize relational data properly
* reflect backend mutations immediately in the UI

The frontend must behave like a real application, not a visual concept.

---

# SCREEN IMPLEMENTATION REQUIREMENTS

For every screen:

1. Identify backend endpoints used
2. Define required frontend state
3. Define loading/error/empty states
4. Define optimistic update behavior
5. Define mutation flow
6. Define cache invalidation/update logic
7. Define relational synchronization behavior

---

# RELATIONAL WORKFLOW EXAMPLES

## Example — Stop Reordering

If a stop is reordered:

* route sequence updates immediately
* local state updates optimistically
* backend mutation triggers
* itinerary timeline refreshes
* dependent budget calculations refresh
* failure rollback behavior exists

## Example — Expense Addition

If an expense is added:

* totals update instantly
* charts update reactively
* budget warnings refresh
* trip aggregate values synchronize

Do NOT skip implementation behavior details.

Focus heavily on:

* state consistency
* relational synchronization
* frontend/backend continuity
* real production interaction behavior
* actual usable application logic

---

# VISUAL CONSISTENCY RULES

The frontend must maintain a consistent cinematic design language across ALL pages.

Do NOT:

* redesign the UI style per page
* introduce random gradients
* use inconsistent spacing systems
* mix multiple design aesthetics
* create isolated visual concepts

All pages must inherit from the same:

* spacing system
* typography hierarchy
* motion language
* surface treatment system
* navigation structure
* lighting philosophy
* interaction philosophy

The UI should feel like one connected product experience.

---

# CINEMATIC UI RESTRAINT RULES

The interface should feel:

* immersive
* atmospheric
* premium
* spatial
* cinematic

WITHOUT:

* excessive glow
* cyberpunk styling
* animation overload
* meaningless floating effects
* overuse of blur/glassmorphism
* distracting motion

Motion must support:

* navigation clarity
* spatial continuity
* interaction feedback
* hierarchy

NOT decoration.

---

# COMPONENT REUSE RULES

Do NOT generate unique component systems for every page.

Prefer:

* reusable layout systems
* reusable cards
* reusable modal structures
* reusable animation patterns
* reusable loading systems
* reusable navigation behaviors

The frontend must feel scalable and maintainable.

---

# ARCHITECTURE RULES

Frontend architecture must remain:

* modular
* scalable
* production-structured
* component-driven

Avoid:

* deeply nested page logic
* duplicated API logic
* scattered state handling
* page-specific utility duplication
* tightly coupled components

Prefer:

* shared hooks
* reusable services
* centralized API handling
* normalized frontend state
* isolated UI primitives

---

# RESPONSIVE RULES

The application must be fully responsive.

Do NOT:

* simply shrink desktop layouts
* hide important workflows on mobile
* overload mobile screens

Mobile UX must feel:

* intentional
* fluid
* touch-friendly
* immersive
* performant

---

# PERFORMANCE RULES

Avoid:

* GPU-heavy animation abuse
* unnecessary rerenders
* oversized component trees
* animation stacking
* unoptimized assets

Prioritize:

* lazy loading
* route-level splitting
* animation efficiency
* responsive image handling
* optimized state updates

---

# BACKEND INTEGRITY RULES

Do NOT invent:

* nonexistent endpoints
* fake backend capabilities
* unsupported mutations
* imaginary database structures

All frontend workflows must align with:

* existing models
* existing relationships
* existing API behavior
* existing backend architecture

If backend functionality is missing:
explicitly identify the missing backend requirement instead of hallucinating frontend behavior.
