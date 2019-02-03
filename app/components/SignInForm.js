import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Image, Segment } from 'semantic-ui-react';

function SignIn(props) {
  const { handleChange, handleSubmit } = props;

  return (
    <div className="login-form">
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
      `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <div style={{padding: 10}}>
              <Image src={`file://${__dirname}/../resources/pressco-logo.png`} size='tiny' circular centered/>
            </div>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="username"
                  onChange={handleChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={handleSubmit}
                >
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
  );
}

SignIn.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default SignIn;