import { createSlice } from '@reduxjs/toolkit';
import { fetchBaseCurrency, fetchCurrency, fetchRates } from './operations';

const handlePending = state => {
  state.isLoading = true;
  state.isError = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.isError = action.payload;
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    baseCurrency: '',
    exchangeInfo: null,
    isLoading: false,
    isError: null,
    rates: [],
  },
  reducers: {
    setBaseCurrency(state, action) {
      state.baseCurrency = action.payload;
    },
    setDefaultCurrency(state, action) {
      state.baseCurrency = 'USD';
    },
  },
  extraReducers: builder => {
    builder
      // Встановлення базової валюти
      .addCase(fetchBaseCurrency.pending, handlePending)
      .addCase(fetchBaseCurrency.fulfilled, (state, action) => {
        state.baseCurrency = action.payload;
      })
      .addCase(fetchBaseCurrency.rejected, handleRejected)
      // Додавання інформації по обмінному курсу
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
});

export default currencySlice.reducer;

export const { setBaseCurrency, setDefaultCurrency } = currencySlice.actions;
