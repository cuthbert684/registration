# Interactive Workshop Registration

A responsive React application built for **Lab 2: Interactive Workshop Registration**. It practises React state, controlled inputs, event handling, validation, immutable array updates, and accessible form feedback.

## Features

- Controlled inputs for full name (`text`), email (`email`), phone (`tel`), preferred date (`date`), age (`number`), portfolio/profile (`url`), and workshop (`select`).
- Field-specific validation with accessible error messages. Empty names, invalid email/phone/URL, dates in the past, ages outside 16–100, and missing workshop choices are rejected.
- Submitting valid data prevents page refresh, adds a registration using the spread operator, clears the form, and displays success feedback.
- Registrations are removed immutably with `filter()`.
- Responsive layout, keyboard focus indicators, labels, status feedback, and empty states.
- **Extension feature:** search registrations by name/email/session and filter by workshop; summary statistics update with the registration count.
- Registrations are held in React state for the current browser session; they are not saved to a server or database.

## Requirements

- Node.js (LTS recommended)
- npm
- VS Code or another code editor

## Run locally

1. Extract the ZIP file.
2. Open the `jj` project folder in VS Code.
3. Open a terminal in that folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite in your browser (usually `http://localhost:5173`).

To check the production build, run `npm run build`.

## Project structure

```text
jj/
├── index.html
├── package.json
├── README.md
├── screenshots/
│   ├── 01-registration-form.png
│   └── 02-registration-list.png
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Testing checklist

- [ ] Empty form is blocked and shows specific errors.
- [ ] Invalid email and phone are rejected.
- [ ] A past date is rejected; today/future dates are allowed.
- [ ] Ages below 16 or above 100 are rejected; boundary ages 16 and 100 are allowed.
- [ ] Invalid portfolio URL is rejected.
- [ ] Missing workshop selection is rejected.
- [ ] Valid registration appears immediately and the form clears.
- [ ] Remove deletes only the selected registration.
- [ ] Search and workshop filter work.
- [ ] Layout is usable on mobile and desktop.

## Screenshots

Two UI preview images are included in `screenshots/` to document the intended form and registration-list layouts. After running the app locally, replace these previews with screenshots captured from your working browser for final submission.

## Extension feature explanation

The registration list includes a search field and workshop filter. They use controlled React state and `useMemo` to show matching registrations without changing the original registrations array. This makes it easier to find a participant when the list grows.
