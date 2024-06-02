import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { getUserInfo } from 'service/opencagedataApi';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    baseCurrency: '',
  },
  reducers: creator => ({
    fetchBaseCurrency: creator.asyncThunk(
      async (coords, { rejectWithValue, getState }) => {
        const state = getState();
        const { baseCurrency } = state.currency;

        if (baseCurrency) {
          return rejectWithValue('We already have base currency!');
        }
        try {
          const userInfo = await getUserInfo(coords);
          console.log(userInfo);
          return userInfo.results[0].annotations.currency.iso_code;
        } catch (error) {
          return rejectWithValue(error.message);
        }
      },
      {
        // pending: (state, action) => {
        // },
        fulfilled: (state, action) => {
          state.baseCurrency = action.payload;
        },
        // rejected: (state, action) => {
        // },
      },
    ),
    setDefaultCurrency: creator.reducer(state => {
      state.baseCurrency = 'USD';
    }),
  }),
  selectors: {
    selectBaseCurrency: state => state.baseCurrency,
  },
});

export default currencySlice.reducer;

export const { selectBaseCurrency } = currencySlice.selectors;
export const { fetchBaseCurrency, setDefaultCurrency } = currencySlice.actions;
