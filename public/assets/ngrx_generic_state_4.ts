// ============================================================================
// 1. ISOLATED ASYNC STATE INTERFACE
// ============================================================================

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAsyncState: AsyncState<any> = {
  data: null,
  isLoading: false,
  error: null,
};

export function createAsyncState<T>(data: T | null = null): AsyncState<T> {
  return {
    data,
    isLoading: false,
    error: null,
  };
}

// ============================================================================
// 2. GENERIC ACTION CREATORS
// ============================================================================

import { createAction, props } from '@ngrx/store';

export function createLoadActions<T>(feature: string) {
  return {
    load: createAction(
      `[${feature}] Load`,
      props<{ params?: any }>()
    ),
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

export function createAddActions<T>(feature: string) {
  return {
    add: createAction(
      `[${feature}] Add`,
      props<{ payload: T }>()
    ),
    addSuccess: createAction(
      `[${feature}] Add Success`,
      props<{ item: any }>()
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
      props<{ id: string | number; payload: T }>()
    ),
    updateSuccess: createAction(
      `[${feature}] Update Success`,
      props<{ item: any }>()
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
      props<{ id: string | number }>()
    ),
    deleteSuccess: createAction(
      `[${feature}] Delete Success`,
      props<{ id: string | number }>()
    ),
    deleteFailure: createAction(
      `[${feature}] Delete Failure`,
      props<{ error: string }>()
    ),
    reset: createAction(`[${feature}] Reset`),
  };
}

// Combined actions creator for full CRUD
export function createCrudActions<TData, TAdd = TData, TUpdate = TData>(feature: string) {
  return {
    ...createLoadActions<TData>(feature),
    ...createAddActions<TAdd>(feature),
    ...createUpdateActions<TUpdate>(feature),
    ...createDeleteActions(feature),
  };
}

// ============================================================================
// 3. GENERIC REDUCER CREATOR
// ============================================================================

import { createReducer, on, ActionReducer, ActionCreator } from '@ngrx/store';

export interface GenericReducerConfig<TState, TData> {
  actions: any;
  initialState: TState;
  stateKey: keyof TState;  // Key to identify which AsyncState property to update
  additionalActions?: Array<{
    action: ActionCreator;
    reducer: (state: TState, action: any) => TState;
  }>;
  // Callbacks for custom state updates after CRUD operations
  onAddSuccess?: (state: TState, item: any) => Partial<TState>;
  onUpdateSuccess?: (state: TState, item: any) => Partial<TState>;
  onDeleteSuccess?: (state: TState, id: string | number) => Partial<TState>;
}

export function createGenericReducer<TState, TData>(
  config: GenericReducerConfig<TState, TData>
) {
  const { 
    actions, 
    initialState, 
    stateKey, 
    additionalActions = [],
    onAddSuccess, 
    onUpdateSuccess, 
    onDeleteSuccess 
  } = config;

  const handlers: any[] = [];

  // Load handlers
  if (actions.load) {
    handlers.push(
      on(actions.load, (state) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: true,
          error: null,
        },
      })),
      on(actions.loadSuccess, (state, { data }) => ({
        ...state,
        [stateKey]: {
          data,
          isLoading: false,
          error: null,
        },
      })),
      on(actions.loadFailure, (state, { error }) => ({
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
      on(actions.add, (state) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: true,
          error: null,
        },
      })),
      on(actions.addSuccess, (state, { item }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error: null,
        },
        ...(onAddSuccess ? onAddSuccess(state, item) : {}),
      })),
      on(actions.addFailure, (state, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error,
        },
      }))
    );
  }

  // Update handlers - reuse isLoading and error
  if (actions.update) {
    handlers.push(
      on(actions.update, (state) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: true,
          error: null,
        },
      })),
      on(actions.updateSuccess, (state, { item }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error: null,
        },
        ...(onUpdateSuccess ? onUpdateSuccess(state, item) : {}),
      })),
      on(actions.updateFailure, (state, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error,
        },
      }))
    );
  }

  // Delete handlers - reuse isLoading and error
  if (actions.delete) {
    handlers.push(
      on(actions.delete, (state) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: true,
          error: null,
        },
      })),
      on(actions.deleteSuccess, (state, { id }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error: null,
        },
        ...(onDeleteSuccess ? onDeleteSuccess(state, id) : {}),
      })),
      on(actions.deleteFailure, (state, { error }) => ({
        ...state,
        [stateKey]: {
          ...(state[stateKey] as any),
          isLoading: false,
          error,
        },
      }))
    );
  }

  // Reset handler
  if (actions.reset) {
    handlers.push(
      on(actions.reset, () => initialState)
    );
  }

  // Additional custom actions
  additionalActions.forEach(({ action, reducer }) => {
    handlers.push(on(action, reducer));
  });

  return createReducer(initialState, ...handlers);
}

// ============================================================================
// 4. FUNCTIONAL EFFECTS CREATOR
// ============================================================================

import { inject } from '@angular/core';
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

export function createLoadEffect<T>(
  actions: any,
  loadService: (params?: any) => any
) {
  return createEffect(
    (actions$ = inject(Actions)) =>
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
      ),
    { functional: true }
  );
}

export function createAddEffect<AddPayload>(
  actions: any,
  addService: (payload: AddPayload) => any
) {
  return createEffect(
    (actions$ = inject(Actions)) =>
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
      ),
    { functional: true }
  );
}

export function createUpdateEffect<UpdatePayload>(
  actions: any,
  updateService: (id: string | number, payload: UpdatePayload) => any
) {
  return createEffect(
    (actions$ = inject(Actions)) =>
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
      ),
    { functional: true }
  );
}

export function createDeleteEffect(
  actions: any,
  deleteService: (id: string | number) => any
) {
  return createEffect(
    (actions$ = inject(Actions)) =>
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
      ),
    { functional: true }
  );
}

// ============================================================================
// 5. GENERIC SELECTORS CREATOR
// ============================================================================

import { createFeatureSelector, createSelector } from '@ngrx/store';

export function createGenericSelectors<TState, TData>(
  featureName: string,
  stateKey: keyof TState
) {
  const selectFeature = createFeatureSelector<TState>(featureName);
  const selectAsyncState = createSelector(
    selectFeature,
    (state) => state[stateKey] as AsyncState<TData>
  );

  return {
    selectFeature,
    selectAsyncState,
    selectData: createSelector(selectAsyncState, (state) => state.data),
    selectIsLoading: createSelector(selectAsyncState, (state) => state.isLoading),
    selectError: createSelector(selectAsyncState, (state) => state.error),
  };
}

// Helper to create selectors for additional state properties
export function createPropertySelector<TState, TProperty>(
  featureName: string,
  propertyKey: keyof TState
) {
  const selectFeature = createFeatureSelector<TState>(featureName);
  return createSelector(
    selectFeature,
    (state) => state[propertyKey] as TProperty
  );
}

// ============================================================================
// 6. USAGE EXAMPLES
// ============================================================================

/* 
// ===== EXAMPLE 1: Simple Load-Only Feature with Multiple States =====

// models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

// store/app/app.state.ts
import { AsyncState, createAsyncState } from './generic-state.utils';

export interface AppState {
  users: AsyncState<User[]>;
  products: AsyncState<Product[]>;
  selectedUser: User | null;
  selectedProduct: Product | null;
  currentPageNumber: number;
}

export const initialAppState: AppState = {
  users: createAsyncState<User[]>([]),
  products: createAsyncState<Product[]>([]),
  selectedUser: null,
  selectedProduct: null,
  currentPageNumber: 1,
};

// store/app/app.actions.ts
import { createAction, props } from '@ngrx/store';
import { createLoadActions, createCrudActions } from './generic-state.utils';

// Load-only actions for users
export const UserActions = createLoadActions<User[]>('User');

// Full CRUD actions for products
export const ProductActions = createCrudActions<Product[], Partial<Product>, Partial<Product>>('Product');

// Additional custom actions
export const AppActions = {
  selectUser: createAction('[App] Select User', props<{ user: User | null }>()),
  selectProduct: createAction('[App] Select Product', props<{ product: Product | null }>()),
  setPageNumber: createAction('[App] Set Page Number', props<{ page: number }>()),
  clearSelections: createAction('[App] Clear Selections'),
};

// store/app/app.reducer.ts
import { createGenericReducer } from './generic-state.utils';
import { createReducer, on } from '@ngrx/store';

// Create reducer for users
const usersReducer = createGenericReducer<AppState, User[]>({
  actions: UserActions,
  initialState: initialAppState,
  stateKey: 'users',
});

// Create reducer for products with CRUD callbacks
const productsReducer = createGenericReducer<AppState, Product[]>({
  actions: ProductActions,
  initialState: initialAppState,
  stateKey: 'products',
  onAddSuccess: (state, item) => ({
    products: {
      ...state.products,
      data: state.products.data ? [...state.products.data, item] : [item],
    },
  }),
  onUpdateSuccess: (state, item) => ({
    products: {
      ...state.products,
      data: state.products.data 
        ? state.products.data.map(p => p.id === item.id ? item : p) 
        : state.products.data,
    },
  }),
  onDeleteSuccess: (state, id) => ({
    products: {
      ...state.products,
      data: state.products.data 
        ? state.products.data.filter(p => p.id !== id) 
        : state.products.data,
    },
  }),
  additionalActions: [
    {
      action: AppActions.selectProduct,
      reducer: (state, action) => ({
        ...state,
        selectedProduct: action.product,
      }),
    },
  ],
});

// Combine all reducers with additional actions
export const appReducer = createReducer(
  initialAppState,
  // Users handlers
  ...usersReducer.ɵhandlers,
  // Products handlers
  ...productsReducer.ɵhandlers,
  // Additional custom action handlers
  on(AppActions.selectUser, (state, { user }) => ({
    ...state,
    selectedUser: user,
  })),
  on(AppActions.setPageNumber, (state, { page }) => ({
    ...state,
    currentPageNumber: page,
  })),
  on(AppActions.clearSelections, (state) => ({
    ...state,
    selectedUser: null,
    selectedProduct: null,
  }))
);

// store/app/app.effects.ts - FUNCTIONAL EFFECTS
import { createLoadEffect, createAddEffect, createUpdateEffect, createDeleteEffect } from './generic-state.utils';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { inject } from '@angular/core';

// User effects
export const loadUsers = createLoadEffect<User[]>(
  UserActions,
  (params) => inject(UserService).getUsers(params)
);

// Product effects
export const loadProducts = createLoadEffect<Product[]>(
  ProductActions,
  () => inject(ProductService).getProducts()
);

export const addProduct = createAddEffect<Partial<Product>>(
  ProductActions,
  (payload) => inject(ProductService).addProduct(payload)
);

export const updateProduct = createUpdateEffect<Partial<Product>>(
  ProductActions,
  (id, payload) => inject(ProductService).updateProduct(id, payload)
);

export const deleteProduct = createDeleteEffect(
  ProductActions,
  (id) => inject(ProductService).deleteProduct(id)
);

// Export all effects
export const appEffects = {
  loadUsers,
  loadProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

// store/app/app.selectors.ts
import { createGenericSelectors, createPropertySelector } from './generic-state.utils';

// Selectors for users AsyncState
export const UserSelectors = createGenericSelectors<AppState, User[]>('app', 'users');

// Selectors for products AsyncState
export const ProductSelectors = createGenericSelectors<AppState, Product[]>('app', 'products');

// Selectors for additional properties
export const selectSelectedUser = createPropertySelector<AppState, User | null>('app', 'selectedUser');
export const selectSelectedProduct = createPropertySelector<AppState, Product | null>('app', 'selectedProduct');
export const selectCurrentPageNumber = createPropertySelector<AppState, number>('app', 'currentPageNumber');

// Component usage
export class UserProductComponent implements OnInit {
  // User data
  users$ = this.store.select(UserSelectors.selectData);
  usersLoading$ = this.store.select(UserSelectors.selectIsLoading);
  usersError$ = this.store.select(UserSelectors.selectError);
  
  // Product data
  products$ = this.store.select(ProductSelectors.selectData);
  productsLoading$ = this.store.select(ProductSelectors.selectIsLoading);
  productsError$ = this.store.select(ProductSelectors.selectError);
  
  // Additional state
  selectedUser$ = this.store.select(selectSelectedUser);
  selectedProduct$ = this.store.select(selectSelectedProduct);
  currentPage$ = this.store.select(selectCurrentPageNumber);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(UserActions.load({}));
    this.store.dispatch(ProductActions.load({}));
  }

  selectUser(user: User) {
    this.store.dispatch(AppActions.selectUser({ user }));
  }

  selectProduct(product: Product) {
    this.store.dispatch(AppActions.selectProduct({ product }));
  }

  addProduct(product: Partial<Product>) {
    this.store.dispatch(ProductActions.add({ payload: product }));
  }

  updateProduct(id: number, product: Partial<Product>) {
    this.store.dispatch(ProductActions.update({ id, payload: product }));
  }

  deleteProduct(id: number) {
    this.store.dispatch(ProductActions.delete({ id }));
  }

  changePage(page: number) {
    this.store.dispatch(AppActions.setPageNumber({ page }));
  }

  clearSelections() {
    this.store.dispatch(AppActions.clearSelections());
  }
}

// ===== EXAMPLE 2: Using Individual Action Creators =====

// If you only need specific operations, use individual creators
import { createLoadActions, createAddActions, createUpdateActions, createDeleteActions } from './generic-state.utils';

// Only load
export const CategoryActions = createLoadActions<Category[]>('Category');

// Only add
export const CommentActions = createAddActions<Partial<Comment>>('Comment');

// Only update
export const ProfileActions = createUpdateActions<Partial<Profile>>('Profile');

// Only delete
export const NotificationActions = createDeleteActions('Notification');

// Load and Add only
export const OrderActions = {
  ...createLoadActions<Order[]>('Order'),
  ...createAddActions<Partial<Order>>('Order'),
};

// ===== EXAMPLE 3: Register Effects in App Config =====

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducer } from './store/app/app.reducer';
import * as appEffects from './store/app/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ app: appReducer }),
    provideEffects(appEffects),
  ],
};
*/