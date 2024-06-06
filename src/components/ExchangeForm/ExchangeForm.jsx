import { RiExchangeDollarFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { fetchCurrency } from 'reduxState/currency/currencySlice';
import styles from './ExchangeForm.module.css';

export const ExchangeForm = () => {
  const dispatch = useDispatch();
  const handleSubmit = evt => {
    evt.preventDefault();

    const form = evt.target;
    const exchange = form.elements.change.value.split(' ');

    const exchangeData = {
      to: exchange[3],
      from: exchange[1],
      amount: Number(exchange[0]),
    };

    dispatch(fetchCurrency(exchangeData));
    form.reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button className={styles.button} type="submit">
        <RiExchangeDollarFill className={styles.icon} />
      </button>

      <input
        title="Request format 15 USD in UAH"
        placeholder="15 USD in UAH"
        className={styles.input}
        pattern="^\d+(\.\d{1,2})?\s[a-zA-Z]{3}\sin\s[a-zA-Z]{3}$"
        name="change"
      />
    </form>
  );
};
