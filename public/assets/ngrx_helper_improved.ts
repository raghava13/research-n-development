/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actions, ofType } from '@ngrx/effects';
import {
  Action,
  ActionCreator,
  ActionReducer,
  createAction,
  createReducer,
  on,
  props,
  ReducerTypes,
  TypedAction,
} from '@ngrx/store';
import { produce } from 'immer';
import { catchError, exhaustMap, map, Observable, of, switchMap } from 'rxjs';

/** ===== Models ===== */

export interface DefaultState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function createDefaultState<T>(data: T | null = null): DefaultState<T> {
  return {
    data,
    error: null,
    isLoading: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
  };
}

/** ===== Action Types ===== */

export interface LoadActionsGroup<T> {
  load: ActionCreator<
    string,
    (props: { params?: any }) => { params?: any } & TypedAction<string>
  >;
  loadSuccess: ActionCreator<
    string,
    (props: { data: T }) => { data: T } & TypedAction<string>
  >;
  loadFailure: ActionCreator<
    string,
    (props: { error: string }) => { error: string } & TypedAction<string>
  >;
  reset: ActionCreator<string, () => TypedAction<string>>;
}

export interface AddActionsGroup<TRequest, TResponse = any> {
  add: ActionCreator<
    string,
    (props: { payload: TRequest }) => { payload: TRequest } & TypedAction<string>
  >;
  addSuccess: ActionCreator<
    string,
    (props: { item: TResponse }) => { item: TResponse } & TypedAction<string>
  >;
  addFailure: ActionCreator<
    string,
    (props: { error: string }) => { error: string } & TypedAction<string>
  >;
  reset: ActionCreator<string, () => TypedAction<string>>;
}

export interface UpdateActionsGroup<TRequest, TResponse = any> {
  update: ActionCreator<
    string,
    (props: { id: number | string; payload: TRequest }) => {
      id: number | string;
      payload: TRequest;
    } & TypedAction<string>
  >;
  updateSuccess: ActionCreator<
    string,
    (props: { item: TResponse }) => { item: TResponse } & TypedAction<string>
  >;
  updateFailure: ActionCreator<
    string,
    (props: { error: string }) => { error: string } & TypedAction<string>
  >;
  reset: ActionCreator<string, () => TypedAction<string>>;
}

export interface DeleteActionsGroup {
  delete: ActionCreator<
    string,
    (props: { id: number | string | (number | string)[] }) => {
      id: number | string | (number | string)[];
    } & TypedAction<string>
  >;
  deleteSuccess: ActionCreator<
    string,
    (props: { id: number | string | (number | string)[] }) => {
      id: number | string | (number | string)[];
    } & TypedAction<string>
  >;
  deleteFailure: ActionCreator<
    string,
    (props: { error: string }) => { error: string } & TypedAction<string>
  >;
  reset: ActionCreator<string, () => TypedAction<string>>;
}

/** ===== Reducer Config Types ===== */

export interface GenericReducerConfig<TState, TData = any> {
  actions: Partial<
    LoadActionsGroup<TData> &
      AddActionsGroup<any, any> &
      UpdateActionsGroup<any, any> &
      DeleteActionsGroup
  >;
  stateKey: keyof TState;
  onAddSuccess?: (state: TState, item: any) => Partial<TState>;
  onDeleteSuccess?: (
    state: TState,
    id: number | string | (number | string)[]
  ) => Partial<TState>;
  onUpdateSuccess?: (state: TState, item: any) => Partial<TState>;
}

/** ===== Effect Config Types ===== */

export interface EffectConfig {
  successMessage?: string | ((response: any) => string);
  errorMessage?: string | ((error: any) => string);
}

export interface LoadEffectConfig extends EffectConfig {
  successMessage?: string | ((data: any) => string);
}

export interface AddEffectConfig extends EffectConfig {
  successMessage?: string | ((item: any) => string);
}

export interface UpdateEffectConfig extends EffectConfig {
  successMessage?: string | ((item: any) => string);
}

export interface DeleteEffectConfig extends EffectConfig {
  successMessage?: string | ((id: any) => string);
}

/** ===== Action Creators ===== */

export function createLoadActions<T>(feature: string): LoadActionsGroup<T> {
  return {
    load: createAction(`[${feature}] Load`, props<{ params?: any }>()),
    loadSuccess: createAction(
      `[${feature}] Load Success`,
      props<{ data: T }>()
    ),
    loadFailure: createAction(
      `[${feature}] Load Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createAddActions<TRequest, TResponse = any>(
  feature: string
): AddActionsGroup<TRequest, TResponse> {
  return {
    add: createAction(`[${feature}] Add`, props<{ payload: TRequest }>()),
    addSuccess: createAction(
      `[${feature}] Add Success`,
      props<{ item: TResponse }>()
    ),
    addFailure: createAction(
      `[${feature}] Add Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createUpdateActions<TRequest, TResponse = any>(
  feature: string
): UpdateActionsGroup<TRequest, TResponse> {
  return {
    update: createAction(
      `[${feature}] Update`,
      props<{ id: number | string; payload: TRequest }>()
    ),
    updateSuccess: createAction(
      `[${feature}] Update Success`,
      props<{ item: TResponse }>()
    ),
    updateFailure: createAction(
      `[${feature}] Update Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

export function createDeleteActions(feature: string): DeleteActionsGroup {
  return {
    delete: createAction(
      `[${feature}] Delete`,
      props<{ id: number | string | (number | string)[] }>()
    ),
    deleteSuccess: createAction(
      `[${feature}] Delete Success`,
      props<{ id: number | string | (number | string)[] }>()
    ),
    deleteFailure: createAction(
      `[${feature}] Delete Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

/** ===== Reducer Helpers ===== */

export function createImmerReducer<State, A extends Action = Action>(
  initialState: State,
  ...onList: ReducerTypes<State, any>[]
): ActionReducer<State, A> {
  const reducer = createReducer(initialState, ...onList);
  return (state: State = initialState, action: A) =>
    produce(state, (draft: State) => reducer(draft, action));
}

export function createDefaultReducerHandlers<TState, TData = any>(
  config: GenericReducerConfig<TState, TData>
): ReducerTypes<TState, ActionCreator[]>[] {
  const { actions, stateKey, onAddSuccess, onUpdateSuccess, onDeleteSuccess } =
    config;

  const handlers: ReducerTypes<TState, ActionCreator[]>[] = [];

  // Load handlers
  if (actions.load && actions.loadSuccess && actions.loadFailure) {
    handlers.push(
      on(actions.load, (state: TState) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isLoading: true,
            error: null,
          },
        };
      }),
      on(actions.loadSuccess, (state: TState, { data }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            data,
            isLoading: false,
            error: null,
          },
        };
      }),
      on(actions.loadFailure, (state: TState, { error }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isLoading: false,
            error,
          },
        };
      })
    );
  }

  // Add handlers
  if (actions.add && actions.addSuccess && actions.addFailure) {
    handlers.push(
      on(actions.add, (state: TState) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isAdding: true,
            error: null,
          },
        };
      }),
      on(actions.addSuccess, (state: TState, { item }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isAdding: false,
            error: null,
          },
          ...(onAddSuccess ? onAddSuccess(state, item) : {}),
        };
      }),
      on(actions.addFailure, (state: TState, { error }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isAdding: false,
            error,
          },
        };
      })
    );
  }

  // Update handlers
  if (actions.update && actions.updateSuccess && actions.updateFailure) {
    handlers.push(
      on(actions.update, (state: TState) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isUpdating: true,
            error: null,
          },
        };
      }),
      on(actions.updateSuccess, (state: TState, { item }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isUpdating: false,
            error: null,
          },
          ...(onUpdateSuccess ? onUpdateSuccess(state, item) : {}),
        };
      }),
      on(actions.updateFailure, (state: TState, { error }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isUpdating: false,
            error,
          },
        };
      })
    );
  }

  // Delete handlers
  if (actions.delete && actions.deleteSuccess && actions.deleteFailure) {
    handlers.push(
      on(actions.delete, (state: TState) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isDeleting: true,
            error: null,
          },
        };
      }),
      on(actions.deleteSuccess, (state: TState, { id }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isDeleting: false,
            error: null,
          },
          ...(onDeleteSuccess ? onDeleteSuccess(state, id) : {}),
        };
      }),
      on(actions.deleteFailure, (state: TState, { error }) => {
        const currentState = state[stateKey] as any;
        return {
          ...state,
          [stateKey]: {
            ...currentState,
            isDeleting: false,
            error,
          },
        };
      })
    );
  }

  // Reset handler
  if (actions.reset) {
    handlers.push(
      on(actions.reset, (state: TState) => ({
        ...state,
        [stateKey]: createDefaultState(),
      }))
    );
  }

  return handlers;
}

/** ===== Effect Helpers ===== */

function resolveMessage(
  message: string | ((data: any) => string) | undefined,
  data: any,
  defaultMessage: string
): string {
  if (!message) return defaultMessage;
  return typeof message === 'function' ? message(data) : message;
}

export function createLoadEffect<TParams = any, TResponse = any>(
  actions$: Actions,
  actions: LoadActionsGroup<TResponse>,
  loadService: (params?: TParams) => Observable<TResponse>,
  config?: LoadEffectConfig
) {
  return actions$.pipe(
    ofType(actions.load),
    switchMap(({ params }) =>
      loadService(params).pipe(
        map((data: TResponse) => {
          if (config?.successMessage) {
            const message = resolveMessage(
              config.successMessage,
              data,
              'Load successful'
            );
            console.log(message);
          }
          return actions.loadSuccess({ data });
        }),
        catchError((error: any) => {
          const errorMessage = resolveMessage(
            config?.errorMessage,
            error,
            error?.message || 'Load failed'
          );
          return of(actions.loadFailure({ error: errorMessage }));
        })
      )
    )
  );
}

export function createAddEffect<TRequest, TResponse = any>(
  actions$: Actions,
  actions: AddActionsGroup<TRequest, TResponse>,
  addService: (payload: TRequest) => Observable<TResponse>,
  config?: AddEffectConfig
) {
  return actions$.pipe(
    ofType(actions.add),
    exhaustMap(({ payload }) =>
      addService(payload).pipe(
        map((item: TResponse) => {
          if (config?.successMessage) {
            const message = resolveMessage(
              config.successMessage,
              item,
              'Add successful'
            );
            console.log(message);
          }
          return actions.addSuccess({ item });
        }),
        catchError((error: any) => {
          const errorMessage = resolveMessage(
            config?.errorMessage,
            error,
            error?.message || 'Add failed'
          );
          return of(actions.addFailure({ error: errorMessage }));
        })
      )
    )
  );
}

export function createUpdateEffect<TRequest, TResponse = any>(
  actions$: Actions,
  actions: UpdateActionsGroup<TRequest, TResponse>,
  updateService: (
    id: number | string,
    payload: TRequest
  ) => Observable<TResponse>,
  config?: UpdateEffectConfig
) {
  return actions$.pipe(
    ofType(actions.update),
    exhaustMap(({ id, payload }) =>
      updateService(id, payload).pipe(
        map((item: TResponse) => {
          if (config?.successMessage) {
            const message = resolveMessage(
              config.successMessage,
              item,
              'Update successful'
            );
            console.log(message);
          }
          return actions.updateSuccess({ item });
        }),
        catchError((error: any) => {
          const errorMessage = resolveMessage(
            config?.errorMessage,
            error,
            error?.message || 'Update failed'
          );
          return of(actions.updateFailure({ error: errorMessage }));
        })
      )
    )
  );
}

export function createDeleteEffect<
  TId extends number | string | (number | string)[] = number | string,
  TResponse = void
>(
  actions$: Actions,
  actions: DeleteActionsGroup,
  deleteService: (id: TId) => Observable<TResponse>,
  config?: DeleteEffectConfig
) {
  return actions$.pipe(
    ofType(actions.delete),
    exhaustMap(({ id }) =>
      deleteService(id as TId).pipe(
        map(() => {
          if (config?.successMessage) {
            const message = resolveMessage(
              config.successMessage,
              id,
              'Delete successful'
            );
            console.log(message);
          }
          return actions.deleteSuccess({ id });
        }),
        catchError((error: any) => {
          const errorMessage = resolveMessage(
            config?.errorMessage,
            error,
            error?.message || 'Delete failed'
          );
          return of(actions.deleteFailure({ error: errorMessage }));
        })
      )
    )
  );
}