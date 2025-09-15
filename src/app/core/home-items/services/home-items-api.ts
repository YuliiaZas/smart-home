import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { DeviceInfo, DeviceUpdateResult, HomeItemInfo } from '@shared/models';
import { getErrorValueString } from '@shared/utils';
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

  updateDevicesState(deviceIds: string[], state: DeviceInfo['state']): Observable<DeviceUpdateResult> {
    if (deviceIds.length === 0) {
      return of({ success: [], failedIds: [], error: null });
    }

    const updateRequests = deviceIds.map((id) =>
      this.updateDeviceState(id, state).pipe(
        map((result) => ({ deviceId: id, result, error: null })),
        catchError((error: unknown) => of({ deviceId: id, result: null, error: getErrorValueString(error) }))
      )
    );

    return forkJoin(updateRequests).pipe(
      map((results) => {
        const success: DeviceInfo[] = [];
        const failedIds: string[] = [];
        const errorArray: string[] = [];

        for (const { deviceId, result, error } of results) {
          if (result && !error) {
            success.push(result);
          } else {
            failedIds.push(deviceId);
            errorArray.push(error || deviceId);
          }
        }
        const error: Error | null =
          errorArray.length > 0 ? new Error(errorArray.join('. ') || 'Unknown error occurred') : null;

        return {
          success,
          failedIds,
          error,
        };
      })
    );
  }
}
