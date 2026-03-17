function Show-Success {
    Param($Message)
    Write-Host $Message -ForegroundColor Black -BackgroundColor Green
}

Show-Success "Building..."
docker compose build

Show-Success "Up..."
docker compose up -d


Show-Success "Copy node_modules from container to this host..."
docker compose cp --archive node:/home/node/app/node_modules ./

Show-Success "Done!"