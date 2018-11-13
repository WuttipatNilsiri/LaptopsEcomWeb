@echo off 
set list=express mongoose body-parser express-validator connect-flash express-session passport passport-local bcryptjs express-messages pug
(for %%a in (%list%) do ( 
   npm install --save %%a 
))
pause