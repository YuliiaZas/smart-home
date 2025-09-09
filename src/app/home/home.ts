import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Dictionary } from '@ngrx/entity';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardInfo, Entity, EntityInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { EditActionButtons, Mover, MoverButtonStyle, MoverSurroundDirective, Spinner } from '@shared/components';
import { TabInfoFormService, DashboardInfoFormService } from '@shared/edit';
import { DashboardsFacade, TabsFacade } from '@state';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    MatButtonModule,
    MatIconModule,
    EditActionButtons,
    Mover,
    MoverSurroundDirective,
    Spinner,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.edit-mode]': 'isEditMode()',
  },
})
export class Home {
  #dashboardsFacade = inject(DashboardsFacade);
  #tabsFacade = inject(TabsFacade);
  #dashboardInfoFormService = inject(DashboardInfoFormService);
  #tabInfoFormService = inject(TabInfoFormService);
  #destroyRef = inject(DestroyRef);
  editMessages = EDIT_MESSAGES;

  dashboardEntity = Entity.DASHBOARD;
  tabEntity = Entity.TAB;
  moverButtonStyles = MoverButtonStyle.ARROWS;
  addTabButtonLabel = this.editMessages.createEntity(this.tabEntity);

  tabsIds = toSignal<string[]>(this.#tabsFacade.tabsIds$, { requireSync: true });
  tabsEntities = toSignal<Dictionary<EntityInfo>>(this.#tabsFacade.tabsEntities$, { requireSync: true });

  currentDashboardInfo = toSignal<DashboardInfo | null>(this.#dashboardsFacade.currentDashboardInfo$);
  currentTabInfo = toSignal<EntityInfo | null>(this.#tabsFacade.currentTabInfo$);

  isEditMode = toSignal(this.#dashboardsFacade.isEditMode$);

  isLoading = toSignal(this.#dashboardsFacade.isLoading$);

  enterEditMode() {
    this.#dashboardsFacade.enterEditMode();
  }

  discardChanges() {
    this.#dashboardsFacade.discardChanges();
  }

  saveChanges() {
    this.#dashboardsFacade.saveCurrentDashboard();
  }

  renameCurrentDashboard() {
    const currentDashboardInfo = this.currentDashboardInfo();
    if (!currentDashboardInfo) return;

    this.#dashboardInfoFormService
      .edit(currentDashboardInfo)
      .pipe(
        filter((dashboardInfo) => dashboardInfo !== null),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((dashboardInfo: DashboardInfo) => {
        this.#dashboardsFacade.changeDashboardInfo(dashboardInfo);
      });
  }

  deleteCurrentDashboard() {
    const currentDashboardInfo = this.currentDashboardInfo();
    if (!currentDashboardInfo) return;

    this.#dashboardsFacade.deleteDashboard(currentDashboardInfo.id);
  }

  addTab() {
    this.#tabInfoFormService
      .addNew()
      .pipe(
        filter((tabInfo) => tabInfo !== null),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((tabInfo: EntityInfo) => {
        this.#tabsFacade.addTab(tabInfo);
      });
  }

  renameCurrentTab() {
    const currentTabInfo = this.currentTabInfo();
    if (!currentTabInfo) return;

    this.#tabInfoFormService
      .edit(currentTabInfo)
      .pipe(
        filter((tabInfo) => tabInfo !== null),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((tabInfo: EntityInfo) => {
        this.#tabsFacade.renameTab(tabInfo);
      });
  }

  deleteCurrentTab() {
    this.#tabsFacade.deleteCurrentTab();
  }

  setTabSorting(sortedIds: string[]) {
    this.#tabsFacade.reorderTabs(sortedIds);
  }
}
