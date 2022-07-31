import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StateService {
  private state = new BehaviorSubject<AppState>(
    {
      limit: 10,
      offset: 0
    }
  )

  private increaseLimitAction = new Subject<number>()
  private decreaseLimitAction = new Subject<number>()
  private increaseOffsetAction = new Subject<number>()
  private decreaseOffsetAction = new Subject<number>()

  public limit$ = this.createSelector(state => state.limit);
  public offset$ = this.createSelector(state => state.offset);

  constructor() {
    this.createReducer(this.increaseLimitAction, (state, limit) => {
      state.limit += limit
      return state;
    })

    this.createReducer(this.decreaseLimitAction, (state, limit) => {
      state.limit -= limit
      return state;
    })
    this.createReducer(this.increaseOffsetAction, (state, offset) => {
      state.offset += offset
      return state;
    })
    this.createReducer(this.decreaseOffsetAction, (state, offset) => {
      state.offset -= offset
      return state;
    })
  }

  /** Action */
  public IncreaseLimit(limit: number) {
    this.increaseLimitAction.next(limit);
  }

  public DecreaseLimit(limit: number) {
    this.decreaseLimitAction.next(limit);
  }

  public IncreaseOffset(limit: number) {
    this.increaseOffsetAction.next(limit);
  }

  public DecreaseOffset(limit: number) {
    this.decreaseOffsetAction.next(limit);
  }

  /** Reducer */
  private createReducer<T>(
    action$: Observable<T>,
    accumulator: (state: AppState, action: T) => AppState
  ) {
    action$.subscribe(
      (action) => {
        const state = { ...this.state.value };
        const newState = accumulator(state, action);
        this.state.next(newState);
      }
    )
  }

  /** Selector */
  private createSelector<T>(
    selector: (state: AppState) => T
  ): Observable<T> {
    return this.state.pipe(
      map(selector),
      distinctUntilChanged(),
      shareReplay(1)
    )
  }
}

export interface AppState {
  limit: number;
  offset: number;
}
