import { Header } from 'components';
import { Home, Rates } from 'pages';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  fetchBaseCurrency,
  setDefaultCurrency,
} from 'reduxState/currency/currencySlice';
import { exchangeCurrency } from './service';

export const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    };

    function success(pos) {
      const crd = pos.coords;
      dispatch(fetchBaseCurrency(crd));
      console.log(
        exchangeCurrency({
          to: 'UAH',
          from: 'USD',
          amount: 15,
        }),
      );
    }

    function error(err) {
      dispatch(setDefaultCurrency());
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};
