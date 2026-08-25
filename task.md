# Checklist: Bind Homepage Hero APIs

- `[x]` Update `src/services/api.js` to strip `Content-Type` for `FormData` bodies
- `[x]` Add departments methods `getDepartments`, `createDepartment`, `updateDepartment`, `toggleDepartment`, `deleteDepartment` in `src/services/homepageService.js`
- `[x]` Modify `src/components/HomePageManagement.js` for Departments:
  - `[x]` Add states for `deletedDepartmentIds` and `originalDepartments`
  - `[x]` Fetch departments in parallel inside `fetchPageData`
  - `[x]` Add custom callbacks `onAdd`, `onDelete`, `onUpdate`, and `onMove` in `RegistrationDropdownSection` for departments
  - `[x]` Implement country normalization and transaction mapping updates in `src/app/admin/revenue/page.js`
- `[x]` Implement server-side filter parameter passing in the transaction fetch hook in `src/app/admin/revenue/page.js`
- `[x]` Fix the page pagination controls (correct Next page handler and preserve pagination when filters are active)
- `[x]` Test and verify the changes by running Next.js build compilerification.
