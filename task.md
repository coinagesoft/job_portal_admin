# Checklist: Bind Homepage Hero APIs

- `[x]` Update `src/services/api.js` to strip `Content-Type` for `FormData` bodies
- `[x]` Add departments methods `getDepartments`, `createDepartment`, `updateDepartment`, `toggleDepartment`, `deleteDepartment` in `src/services/homepageService.js`
- `[x]` Modify `src/components/HomePageManagement.js` for Departments:
  - `[x]` Add states for `deletedDepartmentIds` and `originalDepartments`
  - `[x]` Fetch departments in parallel inside `fetchPageData`
  - `[x]` Add custom callbacks `onAdd`, `onDelete`, `onUpdate`, and `onMove` in `RegistrationDropdownSection` for departments
  - `[x]` Add saves, deletes, and active state toggles to `save` concurrently
- `[x]` Verify changes by running Next.js build compilerdate preview rendering
  - `[x]` Update `save` callback to issue PUT and optional banner upload POST requests
- `[x]` Verify changes by running Next.js build compilerification.
