import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  #sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';

    const sanitized = this.#sanitizer.sanitize(SecurityContext.HTML, value);

    return this.#sanitizer.bypassSecurityTrustHtml(sanitized || '');
  }
}
