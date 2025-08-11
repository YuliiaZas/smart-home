import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERROR_MESSAGES, ROUTING_PATHS } from '@shared/constants';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  title = ERROR_MESSAGES.notFound.title;
  description = ERROR_MESSAGES.notFound.description;
  homePageLinkTitle = ERROR_MESSAGES.notFound.homeLink;
  homePageRouterLink = ROUTING_PATHS.HOME;
}
