import {
  asyncThunkCreator,
  buildCreateSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { exchangeCurrency, latestRates } from 'service/exchangeAPI';
import { getUserInfo } from 'service/opencagedataApi';

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.isError = action.payload;
};

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

export const fetchRates = createAsyncThunk(
  'currency/fetchRates',
  async (baseCurrency, thunkAPI) => {
    try {
      const data = await latestRates(baseCurrency);
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
        pending: handlePending,
        fulfilled: (state, action) => {
          state.baseCurrency = action.payload;
        },
        rejected: handleRejected,
      },
    ),
    setDefaultCurrency: creator.reducer(state => {
      state.baseCurrency = 'USD';
    }),
  }),

  extraReducers: builder => {
    builder
      .addCase(fetchCurrency.pending, handlePending)
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exchangeInfo = action.payload;
      })
      .addCase(fetchCurrency.rejected, handleRejected)
      // Додавання курсів валют
      .addCase(fetchRates.pending, handlePending)
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rates = action.payload;
      })
      .addCase(fetchRates.rejected, handleRejected);
  },
  selectors: {
    selectBaseCurrency: state => state.baseCurrency,
    selectExchangeInfo: state => state.exchangeInfo,
    selectRates: state => state.rates,
    selectLoading: state => state.isLoading,
    selectError: state => state.isError,
  },
});

export default currencySlice.reducer;

export const {
  selectBaseCurrency,
  selectExchangeInfo,
  selectRates,
  selectLoading,
  selectError,
} = currencySlice.selectors;
export const { fetchBaseCurrency, setDefaultCurrency } = currencySlice.actions;
