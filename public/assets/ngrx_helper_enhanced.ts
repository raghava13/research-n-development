/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actions, ofType } from '@ngrx/effects';
import {
  Action,
  ActionReducer,
  createAction,
  createReducer,
  on,
  props,
  ReducerTypes,
  Store,
} from '@ngrx/store';
import { produce } from 'immer';
import { catchError, exhaustMap, filter, map, Observable, of, switchMap, withLatestFrom, EMPTY } from 'rxjs';

/** Models */
export interface DefaultState<T> {
  data: null | T;
  error: null | string;
  isAdding: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  isUpdating: boolean;
}

export function createDefaultState<T>(data: null | T = null): DefaultState<T> {
  return {
    data,
    error: null,
    isLoading: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
  };
}

export interface GenericReducerConfig<TState> {
  actions: any;
  // Callbacks for custom state updates after CRUD operations
  onAddSuccess?: (state: TState, item: any) => Partial<TState>;
  onDeleteSuccess?: (state: TState, id: number | string) => Partial<TState>;
  onUpdateSuccess?: (state: TState, item: any) => Partial<TState>;
  stateKey: keyof TState; // Key to identify which AsyncState property to update
}

export interface EffectMessageConfig {
  successMessage?: string;
  failureMessage?: string;
}

/** */

/** Action Helper */
export function createLoadActions<T>(feature: string) {
  return {
    load: createAction(`[${feature}] Load`, props<{ params?: any; forceReload?: boolean }>()),
    loadSuccess: createAction(
      `[${feature}] Load Success`,
      props<{ data: T; message?: string }>()
    ),
    loadFailure: createAction(
      `[${feature}] Load Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createAddActions<T>(feature: string) {
  return {
    add: createAction(`[${feature}] Add`, props<{ payload: T }>()),
    addSuccess: createAction(
      `[${feature}] Add Success`,
      props<{ item: any; message?: string }>()
    ),
    addFailure: createAction(
      `[${feature}] Add Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createUpdateActions<T>(feature: string) {
  return {
    update: createAction(
      `[${feature}] Update`,
      props<{ id: number | string; payload: T }>()
    ),
    updateSuccess: createAction(
      `[${feature}] Update Success`,
      props<{ item: any; message?: string }>()
    ),
    updateFailure: createAction(
      `[${feature}] Update Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createDeleteActions(feature: string) {
  return {
    delete: createAction(
      `[${feature}] Delete`,
      props<{ id: (number | string)[] | (number | string) }>()
    ),
    deleteSuccess: createAction(
      `[${feature}] Delete Success`,
      props<{ id: (number | string)[] | (number | string); message?: string }>()
    ),
    deleteFailure: createAction(
      `[${feature}] Delete Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

/** */

/** Reducer Helper */
export function createImmerReducer<State, A extends Action = Action>(
  initialState: State,
  ...onList: ReducerTypes<State, any>[]
): ActionReducer<State, A> {
  const reducer = createReducer(initialState, ...onList);
  return (state: State = initialState, action: A) =>
    produce(state, (draft: State) => reducer(draft, action));
}

export function createDefaultReducerHandlers<TState>(
  config: GenericReducerConfig<TState>
) {
  const { actions, stateKey, onAddSuccess, onUpdateSuccess, onDeleteSuccess } =
    config;

  const handlers: any[] = [];

  // Load handlers
  if (actions.load) {
    handlers.push(
      on(actions.load, (state: TState) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: true,
          error: null,
        },
      })),
      on(actions.loadSuccess, (state: TState, { data }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          data,
          isLoading: false,
          error: null,
        },
      })),
      on(actions.loadFailure, (state: TState, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error,
        },
      }))
    );
  }

  // Add handlers - reuse isLoading and error
  if (actions.add) {
    handlers.push(
      on(actions.add, (state: TState) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isAdding: true,
          error: null,
        },
      })),
      on(actions.addSuccess, (state: TState, { item }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isAdding: false,
          error: null,
        },
        ...(onAddSuccess ? onAddSuccess(state, item) : {}),
      })),
      on(actions.addFailure, (state: TState, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isAdding: false,
          error,
        },
      }))
    );
  }

  // Update handlers - reuse isLoading and error
  if (actions.update) {
    handlers.push(
      on(actions.update, (state: TState) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isUpdating: true,
          error: null,
        },
      })),
      on(actions.updateSuccess, (state: TState, { item }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isUpdating: false,
          error: null,
        },
        ...(onUpdateSuccess ? onUpdateSuccess(state, item) : {}),
      })),
      on(actions.updateFailure, (state: TState, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isUpdating: false,
          error,
        },
      }))
    );
  }

  // Delete handlers - reuse isLoading and error
  if (actions.delete) {
    handlers.push(
      on(actions.delete, (state: TState) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isDeleting: true,
          error: null,
        },
      })),
      on(actions.deleteSuccess, (state: TState, { id }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isDeleting: false,
          error: null,
        },
        ...(onDeleteSuccess ? onDeleteSuccess(state, id) : {}),
      })),
      on(actions.deleteFailure, (state: TState, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isDeleting: false,
          error,
        },
      }))
    );
  }

  // Reset handler
  if (actions.reset) {
    handlers.push(
      on(actions.reset, (state: TState) => ({
        ...state,
        [stateKey]: {
          ...createDefaultState(),
        },
      }))
    );
  }

  return handlers;
}
/** */

/** Effect Helper */
export function createLoadEffect<TResponse, TState = any>(
  actions$: Actions<Action<string>>,
  actions: any,
  loadService: (params?: any) => Observable<TResponse>,
  store?: Store<TState>,
  selector?: (state: TState) => any,
  messageConfig?: EffectMessageConfig
) {
  const defaultSuccessMessage = messageConfig?.successMessage || 'Data loaded successfully';
  const defaultFailureMessage = messageConfig?.failureMessage || 'Load failed';

  if (!store || !selector) {
    // If no store or selector provided, skip the data check
    return actions$.pipe(
      ofType(actions.load),
      switchMap(({ params }) =>
        loadService(params).pipe(
          map((data: TResponse) => 
            actions.loadSuccess({ data, message: defaultSuccessMessage })
          ),
          catchError(error =>
            of(actions.loadFailure({ error: error.message || defaultFailureMessage }))
          )
        )
      )
    );
  }

  // With store and selector, check if data exists
  return actions$.pipe(
    ofType(actions.load),
    withLatestFrom(store.select(selector)),
    switchMap(([{ params, forceReload }, state]) => {
      // Check if data already exists and forceReload is not true
      if (state?.data !== null && !forceReload) {
        return EMPTY;
      }

      return loadService(params).pipe(
        map((data: TResponse) => 
          actions.loadSuccess({ data, message: defaultSuccessMessage })
        ),
        catchError(error =>
          of(actions.loadFailure({ error: error.message || defaultFailureMessage }))
        )
      );
    })
  );
}

export function createAddEffect<TRequest, TResponse = void>(
  actions$: Actions<Action<string>>,
  actions: any,
  addService: (payload: TRequest) => Observable<TResponse>,
  messageConfig?: EffectMessageConfig
) {
  const defaultSuccessMessage = messageConfig?.successMessage || 'Item added successfully';
  const defaultFailureMessage = messageConfig?.failureMessage || 'Add failed';

  return actions$.pipe(
    ofType(actions.add),
    exhaustMap(({ payload }) =>
      addService(payload).pipe(
        map((item: TResponse) => 
          actions.addSuccess({ item, message: defaultSuccessMessage })
        ),
        catchError(error =>
          of(actions.addFailure({ error: error.message || defaultFailureMessage }))
        )
      )
    )
  );
}

export function createUpdateEffect<TRequest, TResponse = void>(
  actions$: Actions<Action<string>>,
  actions: any,
  updateService: (
    id: number | string,
    payload: TRequest
  ) => Observable<TResponse>,
  messageConfig?: EffectMessageConfig
) {
  const defaultSuccessMessage = messageConfig?.successMessage || 'Item updated successfully';
  const defaultFailureMessage = messageConfig?.failureMessage || 'Update failed';

  return actions$.pipe(
    ofType(actions.update),
    exhaustMap(({ id, payload }) =>
      updateService(id, payload).pipe(
        map((item: TResponse) => 
          actions.updateSuccess({ item, message: defaultSuccessMessage })
        ),
        catchError(error =>
          of(
            actions.updateFailure({
              error: error.message || defaultFailureMessage,
            })
          )
        )
      )
    )
  );
}

export function createDeleteEffect<TRequest, TResponse = void>(
  actions$: Actions<Action<string>>,
  actions: any,
  deleteService: (id: TRequest) => Observable<TResponse>,
  messageConfig?: EffectMessageConfig
) {
  const defaultSuccessMessage = messageConfig?.successMessage || 'Item deleted successfully';
  const defaultFailureMessage = messageConfig?.failureMessage || 'Delete failed';

  return actions$.pipe(
    ofType(actions.delete),
    exhaustMap(({ id }) =>
      deleteService(id).pipe(
        map(() => 
          actions.deleteSuccess({ id, message: defaultSuccessMessage })
        ),
        catchError(error =>
          of(
            actions.deleteFailure({
              error: error.message || defaultFailureMessage,
            })
          )
        )
      )
    )
  );
}