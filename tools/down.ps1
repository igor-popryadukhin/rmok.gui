
Clear-Host

docker compose down

if (Test-Path ./node_modules) {
    Remove-Item -r -fo ./node_modules
}

Write-Host "Operation completed successfully!" -ForegroundColor Black -BackgroundColor Green
