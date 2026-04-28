# Synova AI Token Setup Script (PowerShell)
Write-Host "=== Synova AI Token Setup ===" -ForegroundColor Green
Write-Host ""

$railway_token = Read-Host "1. Railway Token (railway.app/account/tokens)"
$vercel_token = Read-Host "2. Vercel Token (vercel.com/account/tokens)"
$vercel_org = Read-Host "3. Vercel Org ID"
$vercel_project = Read-Host "4. Vercel Project ID"
$expo_token = Read-Host "5. Expo Token (expo.dev/accounts/[username]/access-tokens)"
$github_token = Read-Host "6. GitHub Token (github.com/settings/tokens)"
$openai_key = Read-Host "7. OpenAI API Key (platform.openai.com/api-keys)"
$anthropic_key = Read-Host "8. Anthropic API Key (console.anthropic.com)"
# Sentry DSN is optional - press Enter to skip
$sentry_dsn = Read-Host "9. Sentry DSN (optional - press Enter to skip)"

# Backup original file
Copy-Item ".env.production" ".env.production.bak" -Force

# Read and update file
$content = Get-Content ".env.production"
$content = $content -replace "railway_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $railway_token
$content = $content -replace "vercel_token_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $vercel_token
$content = $content -replace "org_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $vercel_org
$content = $content -replace "prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $vercel_project
$content = $content -replace "exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $expo_token
$content = $content -replace "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $github_token
$content = $content -replace "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $openai_key
$content = $content -replace "sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", $anthropic_key
# Only replace Sentry DSN if provided
if ($sentry_dsn -ne "") {
    $content = $content -replace "https://xxxxxxxxxxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx", $sentry_dsn
} else {
    $content = $content -replace "SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx", "# SENTRY_DSN=disabled"
}

# Write updated content
Set-Content ".env.production" -Value $content -Force

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host "Your .env.production file has been updated with your tokens."
Write-Host "Backup saved as .env.production.bak"
