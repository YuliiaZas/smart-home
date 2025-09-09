import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  DashboardDataInfo,
  DashboardDataInfoWithItemsIds,
  DashboardDataWithItemsIds,
  DashboardInfo,
} from '@shared/models';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserDashboards {
  private http = inject(HttpClient);
  readonly dashboardsPath = `${environment.apiUrl}/api/dashboards`;

  fetchUserDashboards(): Observable<DashboardInfo[]> {
    return this.http.get<DashboardInfo[]>(this.dashboardsPath);
  }

  fetchDashboardData(dashboardId: string | null): Observable<DashboardDataInfo | null> {
    if (!dashboardId) return of(null);
    return this.http.get<DashboardDataInfo>(`${this.dashboardsPath}/${dashboardId}`);
  }

  addDashboard(dashboardInfo: DashboardInfo): Observable<DashboardInfo> {
    return this.http.post<DashboardInfo>(this.dashboardsPath, dashboardInfo);
  }

  deleteDashboard(dashboardId: string): Observable<void> {
    return this.http.delete<void>(`${this.dashboardsPath}/${dashboardId}`);
  }

  updateDashboardData(
    dashboardId: string,
    dashboardInfo: DashboardInfo | null,
    dashboardData: DashboardDataWithItemsIds | null
  ): Observable<DashboardDataInfo> {
    const dashboard: Partial<DashboardDataInfoWithItemsIds> = {
      ...(dashboardInfo ? { title: dashboardInfo.title, icon: dashboardInfo.icon } : {}),
      ...dashboardData,
    };
    return this.#updateDashboardData(dashboardId, dashboard);
  }

  #updateDashboardData(
    dashboardId: string,
    dashboard: Partial<DashboardDataInfoWithItemsIds>
  ): Observable<DashboardDataInfo> {
    return this.http.patch<DashboardDataInfo>(`${this.dashboardsPath}/${dashboardId}`, dashboard);
  }
}
