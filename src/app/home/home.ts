import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Entity } from '@shared/models';
import { EDIT_MESSAGES } from '@shared/constants';
import { EditActionButtons, Mover, MoverButtonStyle, MoverSurroundDirective, Spinner } from '@shared/components';
import { executeWithDestroy } from '@shared/utils';
import { HomeService } from '@core/services';

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
  #homeService = inject(HomeService);
  #destroyRef = inject(DestroyRef);
  editMessages = EDIT_MESSAGES;

  dashboardEntity = Entity.DASHBOARD;
  tabEntity = Entity.TAB;
  moverButtonStyles = MoverButtonStyle.ARROWS;
  addTabButtonLabel = this.editMessages.createEntity(this.tabEntity);

  tabsIds = this.#homeService.tabsIds;
  tabsEntities = this.#homeService.tabsEntities;

  currentDashboardInfo = this.#homeService.currentDashboardInfo;

  isEditMode = this.#homeService.isEditMode;

  isDashboardSaving = this.#homeService.isDashboardSaving;

  enterEditMode() {
    this.#homeService.enterEditMode();
  }

  discardChanges() {
    this.#homeService.discardChanges();
  }

  saveChanges() {
    this.#homeService.saveChanges();
  }

  renameCurrentDashboard() {
    executeWithDestroy(this.#homeService.renameCurrentDashboard(), this.#destroyRef);
  }

  deleteCurrentDashboard() {
    this.#homeService.deleteCurrentDashboard();
  }

  addTab() {
    executeWithDestroy(this.#homeService.addTab(), this.#destroyRef);
  }

  renameCurrentTab() {
    executeWithDestroy(this.#homeService.renameCurrentTab(), this.#destroyRef);
  }

  deleteCurrentTab() {
    this.#homeService.deleteCurrentTab();
  }

  setTabSorting(sortedIds: string[]) {
    this.#homeService.setTabSorting(sortedIds);
  }
}
