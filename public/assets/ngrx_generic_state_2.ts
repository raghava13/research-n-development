// ============================================================================
// 1. GENERIC STATE INTERFACE
// ============================================================================

export interface GenericState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export const initialGenericState: GenericState<any> = {
  data: null,
  isLoading: false,
  error: null,
};

// ============================================================================
// 2. GENERIC ACTION CREATORS
// ============================================================================

import { createAction, props } from '@ngrx/store';

export interface GenericActionConfig {
  feature: string;
  enableLoad?: boolean;
  enableAdd?: boolean;
  enableUpdate?: boolean;
  enableDelete?: boolean;
}

export function createGenericActions<T, AddPayload = T, UpdatePayload = T>(
  config: GenericActionConfig
) {
  const { feature, enableLoad = true, enableAdd = false, enableUpdate = false, enableDelete = false } = config;

  const actions: any = {};

  // Load Actions (enabled by default for most cases)
  if (enableLoad) {
    actions.load = createAction(
      `[${feature}] Load`,
      props<{ params?: any }>()
    );
    actions.loadSuccess = createAction(
      `[${feature}] Load Success`,
      props<{ data: T }>()
    );
    actions.loadFailure = createAction(
      `[${feature}] Load Failure`,
      props<{ error: string }>()
    );
  }

  // Add Actions (optional)
  if (enableAdd) {
    actions.add = createAction(
      `[${feature}] Add`,
      props<{ payload: AddPayload }>()
    );
    actions.addSuccess = createAction(
      `[${feature}] Add Success`,
      props<{ item: any }>()
    );
    actions.addFailure = createAction(
      `[${feature}] Add Failure`,
      props<{ error: string }>()
    );
  }

  // Update Actions (optional)
  if (enableUpdate) {
    actions.update = createAction(
      `[${feature}] Update`,
      props<{ id: string | number; payload: UpdatePayload }>()
    );
    actions.updateSuccess = createAction(
      `[${feature}] Update Success`,
      props<{ item: any }>()
    );
    actions.updateFailure = createAction(
      `[${feature}] Update Failure`,
      props<{ error: string }>()
    );
  }

  // Delete Actions (optional)
  if (enableDelete) {
    actions.delete = createAction(
      `[${feature}] Delete`,
      props<{ id: string | number }>()
    );
    actions.deleteSuccess = createAction(
      `[${feature}] Delete Success`,
      props<{ id: string | number }>()
    );
    actions.deleteFailure = createAction(
      `[${feature}] Delete Failure`,
      props<{ error: string }>()
    );
  }

  // Reset action for clearing state
  actions.reset = createAction(`[${feature}] Reset`);

  return actions;
}

// ============================================================================
// 3. GENERIC REDUCER CREATOR
// ============================================================================

import { createReducer, on, ActionReducer } from '@ngrx/store';

export interface GenericReducerConfig<T> {
  actions: any;
  initialState: GenericState<T>;
  additionalReducers?: (reducer: ActionReducer<GenericState<T>>) => ActionReducer<GenericState<T>>;
  // Callbacks for custom state updates after CRUD operations
  onAddSuccess?: (state: GenericState<T>, item: any) => Partial<GenericState<T>>;
  onUpdateSuccess?: (state: GenericState<T>, item: any) => Partial<GenericState<T>>;
  onDeleteSuccess?: (state: GenericState<T>, id: string | number) => Partial<GenericState<T>>;
}

export function createGenericReducer<T>(config: GenericReducerConfig<T>) {
  const { actions, initialState, additionalReducers, onAddSuccess, onUpdateSuccess, onDeleteSuccess } = config;

  const handlers: any[] = [];

  // Load handlers
  if (actions.load) {
    handlers.push(
      on(actions.load, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })),
      on(actions.loadSuccess, (state, { data }) => ({
        ...state,
        data,
        isLoading: false,
        error: null,
      })),
      on(actions.loadFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      }))
    );
  }

  // Add handlers - reuse isLoading and error
  if (actions.add) {
    handlers.push(
      on(actions.add, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })),
      on(actions.addSuccess, (state, { item }) => ({
        ...state,
        isLoading: false,
        error: null,
        ...(onAddSuccess ? onAddSuccess(state, item) : {}),
      })),
      on(actions.addFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      }))
    );
  }

  // Update handlers - reuse isLoading and error
  if (actions.update) {
    handlers.push(
      on(actions.update, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })),
      on(actions.updateSuccess, (state, { item }) => ({
        ...state,
        isLoading: false,
        error: null,
        ...(onUpdateSuccess ? onUpdateSuccess(state, item) : {}),
      })),
      on(actions.updateFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      }))
    );
  }

  // Delete handlers - reuse isLoading and error
  if (actions.delete) {
    handlers.push(
      on(actions.delete, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })),
      on(actions.deleteSuccess, (state, { id }) => ({
        ...state,
        isLoading: false,
        error: null,
        ...(onDeleteSuccess ? onDeleteSuccess(state, id) : {}),
      })),
      on(actions.deleteFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      }))
    );
  }

  // Reset handler
  if (actions.reset) {
    handlers.push(
      on(actions.reset, () => initialState)
    );
  }

  let reducer = createReducer(initialState, ...handlers);

  // Apply additional reducers if provided
  if (additionalReducers) {
    reducer = additionalReducers(reducer);
  }

  return reducer;
}

// ============================================================================
// 4. GENERIC EFFECTS CREATOR
// ============================================================================

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';

export interface GenericEffectsConfig<T, AddPayload = T, UpdatePayload = T> {
  actions: any;
  loadService?: (params?: any) => any;
  addService?: (payload: AddPayload) => any;
  updateService?: (id: string | number, payload: UpdatePayload) => any;
  deleteService?: (id: string | number) => any;
}

export function createGenericEffects<T, AddPayload = T, UpdatePayload = T>(
  actions$: Actions,
  config: GenericEffectsConfig<T, AddPayload, UpdatePayload>
) {
  const { actions, loadService, addService, updateService, deleteService } = config;
  const effects: any = {};

  // Load Effect
  if (actions.load && loadService) {
    effects.load$ = createEffect(() =>
      actions$.pipe(
        ofType(actions.load),
        switchMap(({ params }) =>
          loadService(params).pipe(
            map((data: T) => actions.loadSuccess({ data })),
            catchError((error) =>
              of(actions.loadFailure({ error: error.message || 'Load failed' }))
            )
          )
        )
      )
    );
  }

  // Add Effect
  if (actions.add && addService) {
    effects.add$ = createEffect(() =>
      actions$.pipe(
        ofType(actions.add),
        exhaustMap(({ payload }) =>
          addService(payload).pipe(
            map((item: any) => actions.addSuccess({ item })),
            catchError((error) =>
              of(actions.addFailure({ error: error.message || 'Add failed' }))
            )
          )
        )
      )
    );
  }

  // Update Effect
  if (actions.update && updateService) {
    effects.update$ = createEffect(() =>
      actions$.pipe(
        ofType(actions.update),
        exhaustMap(({ id, payload }) =>
          updateService(id, payload).pipe(
            map((item: any) => actions.updateSuccess({ item })),
            catchError((error) =>
              of(actions.updateFailure({ error: error.message || 'Update failed' }))
            )
          )
        )
      )
    );
  }

  // Delete Effect
  if (actions.delete && deleteService) {
    effects.delete$ = createEffect(() =>
      actions$.pipe(
        ofType(actions.delete),
        exhaustMap(({ id }) =>
          deleteService(id).pipe(
            map(() => actions.deleteSuccess({ id })),
            catchError((error) =>
              of(actions.deleteFailure({ error: error.message || 'Delete failed' }))
            )
          )
        )
      )
    );
  }

  return effects;
}

// ============================================================================
// 5. GENERIC SELECTORS CREATOR
// ============================================================================

import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export function createGenericSelectors<T>(featureName: string) {
  const selectFeature = createFeatureSelector<GenericState<T>>(featureName);

  return {
    selectFeature,
    selectData: createSelector(selectFeature, (state) => state.data),
    selectIsLoading: createSelector(selectFeature, (state) => state.isLoading),
    selectError: createSelector(selectFeature, (state) => state.error),
  };
}

// ============================================================================
// 6. USAGE EXAMPLES
// ============================================================================

/* 
// ===== EXAMPLE 1: Simple Load-Only Feature (Most Common Case) =====

// models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// store/user/user.actions.ts
import { createGenericActions } from './generic-state.utils';

export const UserActions = createGenericActions<User[]>({
  feature: 'User',
  enableLoad: true, // Only load actions needed
});

// store/user/user.reducer.ts
import { createGenericReducer, initialGenericState } from './generic-state.utils';

export const userReducer = createGenericReducer({
  actions: UserActions,
  initialState: initialGenericState,
});

// store/user/user.effects.ts
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import { createGenericEffects } from './generic-state.utils';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  effects = createGenericEffects(this.actions$, {
    actions: UserActions,
    loadService: (params) => this.userService.getUsers(params),
  });

  load$ = this.effects.load$;
}

// store/user/user.selectors.ts
import { createGenericSelectors } from './generic-state.utils';

export const UserSelectors = createGenericSelectors<User[]>('user');

// Component usage
export class UserListComponent implements OnInit {
  users$ = this.store.select(UserSelectors.selectData);
  isLoading$ = this.store.select(UserSelectors.selectIsLoading);
  error$ = this.store.select(UserSelectors.selectError);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(UserActions.load({}));
  }
}

// ===== EXAMPLE 2: Full CRUD Feature =====

// store/product/product.actions.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export const ProductActions = createGenericActions<Product[], Partial<Product>, Partial<Product>>({
  feature: 'Product',
  enableLoad: true,
  enableAdd: true,
  enableUpdate: true,
  enableDelete: true,
});

// store/product/product.reducer.ts
export const productReducer = createGenericReducer<Product[]>({
  actions: ProductActions,
  initialState: initialGenericState,
  // Custom logic to update state after CRUD operations
  onAddSuccess: (state, item) => ({
    data: state.data ? [...state.data, item] : [item],
  }),
  onUpdateSuccess: (state, item) => ({
    data: state.data ? state.data.map(p => p.id === item.id ? item : p) : state.data,
  }),
  onDeleteSuccess: (state, id) => ({
    data: state.data ? state.data.filter(p => p.id !== id) : state.data,
  }),
});

// store/product/product.effects.ts
@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  effects = createGenericEffects(this.actions$, {
    actions: ProductActions,
    loadService: () => this.productService.getProducts(),
    addService: (payload) => this.productService.addProduct(payload),
    updateService: (id, payload) => this.productService.updateProduct(id, payload),
    deleteService: (id) => this.productService.deleteProduct(id),
  });

  load$ = this.effects.load$;
  add$ = this.effects.add$;
  update$ = this.effects.update$;
  delete$ = this.effects.delete$;
}

// Component usage
export class ProductManagementComponent {
  products$ = this.store.select(ProductSelectors.selectData);
  isLoading$ = this.store.select(ProductSelectors.selectIsLoading);
  error$ = this.store.select(ProductSelectors.selectError);

  constructor(private store: Store) {}

  addProduct(product: Partial<Product>) {
    this.store.dispatch(ProductActions.add({ payload: product }));
  }

  updateProduct(id: number, product: Partial<Product>) {
    this.store.dispatch(ProductActions.update({ id, payload: product }));
  }

  deleteProduct(id: number) {
    this.store.dispatch(ProductActions.delete({ id }));
  }
}

// ===== EXAMPLE 3: Adding Custom Actions =====

// store/order/order.actions.ts
export const OrderActions = {
  ...createGenericActions<Order[]>({
    feature: 'Order',
    enableLoad: true,
  }),
  // Additional custom actions
  filterByStatus: createAction(
    '[Order] Filter By Status',
    props<{ status: string }>()
  ),
  clearFilters: createAction('[Order] Clear Filters'),
};

// store/order/order.reducer.ts
export const orderReducer = createGenericReducer({
  actions: OrderActions,
  initialState: { ...initialGenericState, filteredData: null },
  additionalReducers: (reducer) => {
    return (state, action) => {
      // Handle custom actions
      if (action.type === OrderActions.filterByStatus.type) {
        const typedAction = action as ReturnType<typeof OrderActions.filterByStatus>;
        return {
          ...state,
          filteredData: state.data?.filter((order: any) => order.status === typedAction.status),
        };
      }
      if (action.type === OrderActions.clearFilters.type) {
        return {
          ...state,
          filteredData: null,
        };
      }
      return reducer(state, action);
    };
  },
});
*/