import {
  asyncThunkCreator,
  buildCreateSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { exchangeCurrency } from 'service/exchangeAPI';
import { getUserInfo } from 'service/opencagedataApi';

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const fetchCurrency = createAsyncThunk(
  'currency/fetchCurrency',
  async (exchangeData, thunkAPI) => {
    try {
      const data = await exchangeCurrency(exchangeData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    baseCurrency: '',
    exchangeInfo: null,
    isLoading: false,
    isError: null,
    rates: [],
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
          return userInfo.results[0].annotations.currency.iso_code;
        } catch (error) {
          return rejectWithValue(error.message);
        }
      },
      {
        pending: (state, action) => {
          state.isLoading = true;
          state.isError = null;
        },
        fulfilled: (state, action) => {
          state.baseCurrency = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.isError = action.payload;
        },
      },
    ),
    setDefaultCurrency: creator.reducer(state => {
      state.baseCurrency = 'USD';
    }),
  }),

  extraReducers: builder => {
    builder
      .addCase(fetchCurrency.pending, state => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exchangeInfo = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
  selectors: {
    selectBaseCurrency: state => state.baseCurrency,
    selectExchangeInfo: state => state.exchangeInfo,
    selectLoading: state => state.isLoading,
    selectError: state => state.isError,
  },
});

export default currencySlice.reducer;

export const {
  selectBaseCurrency,
  selectExchangeInfo,
  selectLoading,
  selectError,
} = currencySlice.selectors;
export const { fetchBaseCurrency, setDefaultCurrency } = currencySlice.actions;
