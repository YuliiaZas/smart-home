import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardDataInfo, DashboardInfo } from '@shared/models';
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

  updateDashboardInfo({ id, title, icon }: DashboardInfo): Observable<DashboardInfo> {
    return this.http.put<DashboardInfo>(`${this.dashboardsPath}/${id}`, { title, icon });
  }

  updateDashboardData(dashboardId: string, dashboardData: DashboardDataInfo): Observable<DashboardDataInfo> {
    return this.http.put<DashboardDataInfo>(`${this.dashboardsPath}/${dashboardId}`, dashboardData);
  }
}
