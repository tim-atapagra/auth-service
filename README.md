# auth-service

### To start application

1. Clone and create an empty `.env` file in the root of application. Provide the creds you received from me

2. Run

`npm install` 

Then run

`npm start`

3. Head to Postman or any api testing tool you use. The following endpoints are exposed: signup, validate and login.

4. Sign up for an account with the `/signup` endpoint and example body like so:
` 
  {
    "userName";: "test",
    "password";: "test@test.com",
    "email": "test@test.com",
    "phoneNumber": "1234567890"
  }
`

5. After signup, use the `/validate` endpoint to authenticate your account with a code that'll be sent to the phone number you provided.
Provide the following format to the body of the validate endpoint

`
  {
    "userName": "test",
    "otpCode": "12345";
  }
`

6. Proceed to sign `/signin` in with your username and password.


7. All methods are `POST` 



Test with

`npm test`
