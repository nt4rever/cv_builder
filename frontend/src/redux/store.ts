import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import snackBarReducer from './SnackBar/slice';
import userSlice from './userSlice';
import informationCv from './AddCv/slice';
import editReducer from './EditCV/slice';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const __prod__ = process.env.NODE_ENV === 'production';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user'],
    stateReconciler: autoMergeLevel2,
};

const rootReducer = (): Reducer =>
    combineReducers({
        user: userSlice,
        snackBar: snackBarReducer,
        edit: editReducer,
        informationCv: informationCv,
    });

const persistedReducer = persistReducer(persistConfig, rootReducer());

const store = configureStore({
    reducer: persistedReducer,
    devTools: !__prod__,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

let persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
