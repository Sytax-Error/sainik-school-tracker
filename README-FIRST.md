# Copilot Setup Kit — Sainik School Tracker

## Included files

```text
.github/
├── copilot-instructions.md
├── instructions/
│   ├── backend.instructions.md
│   └── frontend.instructions.md
└── prompts/
    └── start-sainik-tracker.prompt.md

docs/
├── MVP_SCOPE.md
├── IMPLEMENTATION_PLAN.md
├── KNOWN_LIMITATIONS.md
├── UI_DESIGN_SYSTEM.md          # Complete design system (colors, components, accessibility)
├── UI_IMPROVEMENT_PLAN.md       # Strategic UI improvement plan (6 focus areas)
└── UI_COLOR_QUICK_REF.md        # Quick reference card for daily development

source-data/
└── Sainik Phase wise Sheets.xls
```

## Design System Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **UI_DESIGN_SYSTEM.md** | Complete design system: color tokens, component guidelines, accessibility rules, implementation patterns | Detailed specifications, new component design, accessibility review |
| **UI_IMPROVEMENT_PLAN.md** | Strategic plan: 6 improvement areas, scope guard, design direction | Planning work, understanding priorities, scope boundaries |
| **UI_COLOR_QUICK_REF.md** | Quick reference: Tailwind classes, patterns, anti-patterns | Daily development, quick class lookups, code reviews |
| **frontend/src/utils/designTokens.ts** | Source of truth for all design tokens | Adding new tokens, verifying values, cross-referencing |
| **frontend/tailwind.config.js** | Tailwind theme configuration | Adding new utilities, extending theme |

**Rule**: `designTokens.ts` is the single source of truth. Tailwind config and documentation must mirror it.

## How to use

1. Create or open the root folder for the new project in VS Code.
2. Copy all files and folders from this kit into that root folder.
3. Confirm the Excel file is available at:

   `source-data/Sainik Phase wise Sheets.xls`

4. Open GitHub Copilot Chat in VS Code.
5. Use Agent mode.
6. Type:

   `/start-sainik-tracker`

7. Let Copilot complete Phase 1 only.
8. Review the generated files and terminal results.
9. Run the same prompt again to continue with the first incomplete phase.

## Fallback when the slash prompt is not visible

Open:

`.github/prompts/start-sainik-tracker.prompt.md`

Then use the play button in the editor, or copy its body into Copilot Chat.

## Instruction diagnostics

If Copilot appears to ignore the files:

1. Open the Chat view.
2. Right-click the Chat area.
3. Open Diagnostics.
4. Confirm these instructions are loaded:
   - `.github/copilot-instructions.md`
   - `.github/instructions/frontend.instructions.md`
   - `.github/instructions/backend.instructions.md`

## Important

Do not ask Copilot to generate the complete project in one step. Continue phase by phase so the build remains understandable and errors are easier to fix.
