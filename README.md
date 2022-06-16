# Blog do código - Auth with tokens

Implementation of a API in NodeJs, using authentication system and tokens, during the course of Alura, aim at the learning.

Aiming for a more scalable token validation system than session authentication.

Concepts seen and practiced:

* Used Lib bcrypt for generate passwords hash with salt.
* Used Lib passport, passport-local and passport-http-bearer to middlawares of the authentication. 
* Used Lib jsonwebtoken for generate access tokens with time expiration and returns to user.
* Custom authentication errors.
* Logout using tokens with blocklist and redis.
* Routes protected by authentication middleware.
* Authentication with acess tokens and refresh tokens.
* Allow List to refresh tokens.
* Used lib nodemailer to send verification email to user. 
