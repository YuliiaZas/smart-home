# Smart Home

Deployment: https://yuliiazas-smart-home.netlify.app

This application allows authorized users to manage dashboards with smart home devices. Users can create dashboards, add tabs in there, and add devices to cards inside tabs.

## 🎯 Purpose

The main goals of this project were:

- Practicing creating **service-driven modal components** with dynamic content (forms with various inputs and validation, or simple dialog),
- Gaining additional experience with **NgRx**:
  - using `createFeature`, `createEntityAdapter`,
  - handling effects between features with orchestrators
  - creating features facades.
- Using **Angular signals** across the project.
- Building UI using **Angular Material** components.

## 🛠 Implementation Details for modal with forms

- Typed forms are dynamically generated inside the modal component, based on data provided to the modal service.
- Modal submit handlers:
  - Async handler: while async action is in progress, the spinner is shown. On success, the modal closes automatically; on error, a provided error message is displayed. Success and error are handled with RxJS observables.
  - Sync handler: modal closes immediately when the submit button is clicked.
- For implementation details, see:
  - `BaseEditFormService` → `src/app/core/edit-entity/services/base-edit-form.service.ts`
  - `ModalService` → `src/app/shared/modal/services/modal.service.ts`
  - `BaseForm` and `FormInput` components → `src/app/shared/form/components`

## 📚 Background

- Initially created as part of the RS School Angular course: [Smart Home UI](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/angular-smart-home-ui/smart-home-part-1.md) (Parts 1–3).
- Originally used a json-server backend: [Smart Home API](https://github.com/pavelrazuvalau/smart-home-json-server).
- Later improvements:
  - Added **user registration**.
  - Persisted u**ser-specific devices state and dashboards**.
  - Updated backend accordingly: [Custom Smart Home API](https://github.com/YuliiaZas/smart-home-json-server/tree/dev_edit-functionality).

## ⚡ Tech Stack

- Angular V20
- Angular Material
- NgRx (feature state, entity adapter, effects, facades)
- Signals
- RxJS

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
