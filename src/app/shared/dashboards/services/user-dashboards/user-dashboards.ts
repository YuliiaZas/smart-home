import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { DashboardDataInfo, DashboardInfo, DashboardTabInfo, TabInfo } from '@shared/models';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserDashboards {
  private http = inject(HttpClient);
  readonly dashboardsPath = '/api/dashboards';

  private isDashboardsFetchingSubject = new BehaviorSubject<boolean | undefined>(undefined);
  private isCurrentDashboardDataFetchingSubject = new BehaviorSubject<boolean | undefined>(undefined);

  private userDashboardsSubject = new BehaviorSubject<DashboardInfo[]>([]);
  private currentDashboardIdSubject = new BehaviorSubject<string | null>(null);
  private currentDashboardTabsSubject = new BehaviorSubject<TabInfo[]>([]);
  private currentDashboardDataSubject = new BehaviorSubject<Record<string, DashboardTabInfo>>({});

  isDashboardsFetching$ = this.isDashboardsFetchingSubject.asObservable();
  isCurrentDashboardDataFetching$ = this.isCurrentDashboardDataFetchingSubject.asObservable();

  userDashboards$ = this.userDashboardsSubject.asObservable();
  currentDashboardId$ = this.currentDashboardIdSubject.asObservable();
  currentDashboardTabs$ = this.currentDashboardTabsSubject.asObservable();
  currentDashboardData$ = this.currentDashboardDataSubject.asObservable();

  resetDashboardsData() {
    this.isDashboardsFetchingSubject.next(undefined);
    this.isCurrentDashboardDataFetchingSubject.next(undefined);
    this.userDashboardsSubject.next([]);
    this.currentDashboardIdSubject.next(null);
    this.currentDashboardTabsSubject.next([]);
    this.currentDashboardDataSubject.next({});
  }

  setCurrentDashboardId(dashboardId: string | null): void {
    if (this.currentDashboardIdSubject.value === dashboardId) return;

    this.isCurrentDashboardDataFetchingSubject.next(true);
    this.currentDashboardIdSubject.next(dashboardId);
  }

  constructor() {
    this.currentDashboardId$
      .pipe(
        switchMap((dashboardId) => {
          return dashboardId
            ? this.fetchDashboardData(dashboardId).pipe(
                catchError(() => of()),
                map((dashboardData: DashboardDataInfo) => this.transformDashboardData(dashboardData))
              )
            : of(this.transformDashboardData());
        })
      )
      .subscribe(({ tabsInfo, tabsData }) => {
        this.currentDashboardTabsSubject.next(tabsInfo);
        this.currentDashboardDataSubject.next(tabsData);
        this.isCurrentDashboardDataFetchingSubject.next(false);
      });
  }

  getUserDashboards(): Observable<DashboardInfo[]> {
    this.isDashboardsFetchingSubject.next(true);

    return this.fetchUserDashboards().pipe(
      tap((dashboards) => {
        this.userDashboardsSubject.next(dashboards);
        this.isDashboardsFetchingSubject.next(false);
      })
    );
  }

  private transformDashboardData(dashboardData?: DashboardDataInfo): {
    tabsInfo: TabInfo[];
    tabsData: Record<string, DashboardTabInfo>;
  } {
    const tabsInfo: TabInfo[] = [];
    const tabsData: Record<string, DashboardTabInfo> = {};

    if (dashboardData?.tabs) {
      for (const tab of dashboardData.tabs) {
        tabsInfo.push({
          id: tab.id,
          title: tab.title,
        });
        tabsData[tab.id] = tab;
      }
    }

    return { tabsInfo, tabsData };
  }

  private fetchUserDashboards(): Observable<DashboardInfo[]> {
    return this.http.get<DashboardInfo[]>(`${environment.apiUrl}${this.dashboardsPath}`);
  }

  private fetchDashboardData(dashboardId: string | null): Observable<DashboardDataInfo> {
    return this.http.get<DashboardDataInfo>(`${environment.apiUrl}${this.dashboardsPath}/${dashboardId}`);
  }
}
