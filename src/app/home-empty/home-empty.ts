import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ERROR_MESSAGES } from '@shared/constants';

@Component({
  selector: 'app-home-empty',
  imports: [],
  templateUrl: './home-empty.html',
  styleUrl: './home-empty.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEmpty {
  private activatedRoute = inject(ActivatedRoute);

  createMessage = ERROR_MESSAGES.emptyHomeData.create;

  parameters = toSignal(this.activatedRoute.paramMap);
  isDashboardsEmpty = computed(() => !this.parameters()?.get('dashboardId'));
  emptyMessage = computed(() =>
    this.isDashboardsEmpty() ? ERROR_MESSAGES.emptyHomeData.dashboards : ERROR_MESSAGES.emptyHomeData.tabs
  );
}
