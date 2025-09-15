import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export function executeWithDestroy<T>(
  source: Observable<T>,
  destroyReference: DestroyRef,
  onNext?: (value: T) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): Observable<T> {
  return source.pipe(takeUntilDestroyed(destroyReference)).subscribe({
    next: onNext,
    error: onError,
    complete: onComplete,
  }) as unknown as Observable<T>;
}
