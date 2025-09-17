import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/auth';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TabsEffects, tabsFeature } from '@state/tabs';
import { CardsEffects, cardsFeature } from '@state/cards';
import {
  CurrentDashboardEffects,
  currentDashboardFeature,
  DashboardsListEffects,
  dashboardsListFeature,
  DashboardsOrchestratorEffects,
} from '@state/dashboards';
import { HomeItemsEffects, homeItemsFeature } from '@state/home-items';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideStore(),
    provideState(dashboardsListFeature),
    provideState(currentDashboardFeature),
    provideState(tabsFeature),
    provideState(cardsFeature),
    provideState(homeItemsFeature),
    provideEffects([
      DashboardsListEffects,
      CurrentDashboardEffects,
      DashboardsOrchestratorEffects,
      TabsEffects,
      CardsEffects,
      HomeItemsEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      name: 'Smart Home App',
    }),
  ],
};
