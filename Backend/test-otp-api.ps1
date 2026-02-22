# Test OTP Registration API
Write-Host "=== Testing OTP Registration API ===" -ForegroundColor Cyan
Write-Host ""

$body = @{
    fullName = "Nguyen Van A"
    email = "test@example.com"
    password = "123456"
    phoneNumber = "0987654321"
}

$json = $body | ConvertTo-Json
Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $json
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/users/request-register" `
        -Method POST `
        -Body $json `
        -ContentType "application/json"
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Result Code: $($response.resultCd)" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    
    if ($response.data) {
        Write-Host "Data: $($response.data | ConvertTo-Json)" -ForegroundColor Green
    }
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Status: $($errorDetails.status)" -ForegroundColor Red
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Red
    Write-Host "Message: $($errorDetails.message)" -ForegroundColor Red
    Write-Host "Path: $($errorDetails.path)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
