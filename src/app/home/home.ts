import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardInfo, Entity, TabInfo } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { EditActionButtons, Mover, MoverButtonStyle, MoverSurroundDirective } from '@shared/components';
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
  editMessages = EDIT_MESSAGES;

  dashboardEntity = Entity.DASHBOARD;
  tabEntity = Entity.TAB;
  moverButtonStyles = MoverButtonStyle.ARROWS;
  addTabButtonLabel = this.editMessages.createEntity(this.tabEntity);

  tabsIds = toSignal<string[]>(this.#tabsFacade.tabsIds$, { requireSync: true });
  tabsEntities = toSignal<Dictionary<TabInfo>>(this.#tabsFacade.tabsEntities$, { requireSync: true });

  currentDashboard = toSignal<DashboardInfo>(
    this.#dashboardsFacade.currentDashboardInfo$.pipe(filter((database) => !!database)),
    { requireSync: true }
  );

  isEditMode = toSignal(this.#dashboardsFacade.isEditMode$);

  enterEditMode() {
    this.#dashboardsFacade.enterEditMode();
  }

  deleteCurrentDashboard() {
    console.log('Deleting current dashboard:', this.currentDashboard().id);
    // this.#dashboardsFacade.deleteDashboard(this.currentDashboard().id);
  }

  discardChanges() {
    this.#dashboardsFacade.discardChanges();
  }

  saveChanges() {
    console.log('Saving changes');
    // this.#dashboardsFacade.saveCurrentDashboard();
  }

  renameCurrentDashboard() {
    console.log('Renaming current dashboard to:');
    // this.#dashboardsFacade.renameCurrentDashboard(title);
  }

  renameCurrentTab() {
    console.log('Edit current tab');
  }

  deleteCurrentTab() {
    console.log('Deleting current tab');
    this.#tabsFacade.deleteCurrentTab();
  }

  addTab() {
    console.log('Adding new tab');
    // this.#tabsFacade.addTab();
  }

  setTabSorting(sortedIds: string[]) {
    this.#tabsFacade.reorderTabs(sortedIds);
  }
}
