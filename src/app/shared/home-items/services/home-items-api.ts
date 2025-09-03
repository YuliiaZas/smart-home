import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DeviceInfo, HomeItemInfo } from '@shared/models';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class HomeItemsApi {
  private http = inject(HttpClient);
  readonly homeItemsPath = `${environment.apiUrl}/api/devices`;

  fetchAllHomeItems(): Observable<HomeItemInfo[]> {
    return this.http.get<HomeItemInfo[]>(this.homeItemsPath);
  }

  updateDeviceState(deviceId: string | null, state: DeviceInfo['state']): Observable<DeviceInfo | null> {
    if (!deviceId) return of(null);
    return this.http.patch<DeviceInfo>(`${this.homeItemsPath}/${deviceId}`, { state });
  }
}
