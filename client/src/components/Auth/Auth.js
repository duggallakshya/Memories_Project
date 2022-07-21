import React, { useState, useEffect } from 'react';
import { Typography, Grid, Container, Avatar, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './Icon';
import { signin, signup } from '../../actions/auth';

import useStyles from './styles';

const clientId = "378440969497-mfuq5motqpnoinh4qioass8tb11jg87a.apps.googleusercontent.com";

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}

const Auth = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); 

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isSignUp){
      dispatch(signup(formData, navigate));
    } else{
      dispatch(signin(formData, navigate));
    }
  }

  const handleChange = (e) => {
    setFormData( { ...formData, [e.target.name]: e.target.value });
  }

  const handleShowPassword = () => setShowPassword( (prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
      setIsSignUp( (prevIsSignUp) => !prevIsSignUp );
      setShowPassword(false);
  }

  const googleSuccess = async(res) => {
    const result = res?.profileObj ;
    const token = res?.tokenId ;

    try{
      dispatch( { type: 'AUTH', data: { result, token }  } );
      navigate('/');
    } catch(error) {
      console.log(error);
    }

  }

  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccessful. Try again later")
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'} </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              isSignUp && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="First Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
              {
              isSignUp && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />
              }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              { isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleLogin 
          clientId={clientId}
          render={(renderProps) => ( //disabled={renderProps.disabled}
            <Button className={classes.googleButton} fullWidth color="primary" onClick={renderProps.onClick} startIcon={<Icon />} variant="contained"> 
              Google Sign In
            </Button>
          )} 
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
              <Grid item >
                  <Button onClick={switchMode}>
                    {
                      isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"
                    }
                  </Button>
              </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth
