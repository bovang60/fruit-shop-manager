@echo off
echo Testing OTP Registration API...
echo.

curl -X POST http://localhost:8080/api/users/request-register ^
  -H "Content-Type: application/json" ^
  -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"123456\",\"phoneNumber\":\"09876543 21\"}"

echo.
echo.
echo Test completed!
pause
