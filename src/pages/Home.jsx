import { Container, ExchangeForm, Heading, Section } from 'components';

export const Home = () => {
  const isError = false;

  return (
    <Section>
      <Container>
        <ExchangeForm/>

        {isError && (
          <Heading
            error
            title="Something went wrong...😐 Check the data validity and try again!"
          />
        )}
      </Container>
    </Section>
  );
};