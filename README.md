# auth-service

### To start application

1. Create an empty env file and provide the creds you received from me

2. Run

`npm install` 

Then run

`npm start`

3. The following endpoints are exposed: signup, validate and login.

4. Sign up for an account with an example body like so:
` 
  {
    "username";: "test",
    "password";: "test@test.com",
    "email": "test@test.com",
    "phonenumber": "+10000000000"
  }
`

5. After signup, use the validate endpoint to authenticate your account with a code that'll be sent to the phone number you provided.
Provide the following format to the body of the validate endpoint

`
  {
    "username": "test",
    "otpCode": "12345";
  }
`

6. Proceed to sign in with your username and password.



Test with

`npm test`
