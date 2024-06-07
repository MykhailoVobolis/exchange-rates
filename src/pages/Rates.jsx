import { Wave } from 'react-animated-text';

import { Container, Heading, Loader, RatesList, Section } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRates } from 'reduxState/currency/operations';
import {
  selectBaseCurrency,
  selectError,
  selectLoading,
  selectRates,
} from 'reduxState/currency/selectors';
import { useEffect } from 'react';

export const Rates = () => {
  const dispatch = useDispatch();
  const isError = useSelector(selectError);
  const isLoading = useSelector(selectLoading);
  const baseCurrency = useSelector(selectBaseCurrency);
  const rates = useSelector(selectRates);

  useEffect(() => {
    dispatch(fetchRates(baseCurrency));
  }, [dispatch]);

  const convertEntriesToObjects = rates => {
    return rates
      .filter(([key]) => key !== baseCurrency)
      .map(([key, value]) => ({ key, value: (1 / value).toFixed(2) }));
  };

  const arrayObjectsRates = convertEntriesToObjects(rates);
  return (
    <Section>
      <Container>
        <Heading
          info
          bottom
          title={
            <Wave
              text={`$ $ $ Current exchange rate for 1 ${'UAH'} $ $ $`}
              effect="fadeOut"
              effectChange={4.0}
            />
          }
        />
        <RatesList rates={arrayObjectsRates} />
        {isLoading && <Loader />}
        {isError && (
          <Heading
            error
            title="Something went wrong...😐 We cannot show current rates!"
          />
        )}
      </Container>
    </Section>
  );
};
