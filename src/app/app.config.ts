import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { Auth, authInterceptor } from '@shared/auth';
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
} from '@state/dashboars';
import { HomeItemsEffects, homeItemsFeature } from '@state/home-items';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAppInitializer(() => {
      const authService = inject(Auth);
      return authService.updateCurrentUser();
    }),
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
