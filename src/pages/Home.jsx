import {
  Container,
  ExchangeForm,
  ExchangeInfo,
  Heading,
  Loader,
  Section,
} from 'components';
import { useSelector } from 'react-redux';
import {
  selectError,
  selectExchangeInfo,
  selectLoading,
} from 'reduxState/currency/currencySlice';

export const Home = () => {
  const exchangeInfo = useSelector(selectExchangeInfo);
  const isError = useSelector(selectError);
  const isLoading = useSelector(selectLoading);

  return (
    <Section>
      <Container>
        <ExchangeForm />
        {exchangeInfo && <ExchangeInfo exchangeInfo={exchangeInfo} />}
        {isLoading && <Loader />}
        {isError === true && (
          <Heading
            error
            title="Something went wrong...😐 Check the data validity and try again!"
          />
        )}
      </Container>
    </Section>
  );
};
