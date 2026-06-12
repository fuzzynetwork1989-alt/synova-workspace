# Install dependencies for all Synova Nexxus Ecosystem packages

param(
    [Parameter(Mandatory = $true)]
    [string]$PackagePath = "packages"
)

# Colors for output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$NC = "`e[0m"

function Write-ColorOutput {
    param([string]$Color)
    Write-Host $Color -NoNewline
}

function Write-Step {
    param([string]$Message)
    Write-Host "$(Write-ColorOutput $Yellow)📋 $Message$NC"
}

function Write-Success {
    param([string]$Message)
    Write-Host "$(Write-ColorOutput $Green)✅ $Message$NC"
}

function Write-Error {
    param([string]$Message)
    Write-Host "$(Write-ColorOutput $Red)❌ $Message$NC"
}

Write-Step "Installing dependencies for all Synova packages..."

# List of all packages
$Packages = @(
    "synova-nexxus",
    "synova-packages-supanova-sdk",
    "synova-packages-ui",
    "synova-app-template",
    "synova-app-task-manager",
    "synova-automation"
)

# Install dependencies for each package
foreach ($Package in $Packages) {
    $PackageDir = Join-Path -Path $PackagePath -ChildPath $Package

    if (Test-Path $PackageDir) {
        Write-Step "Installing dependencies for $Package..."

        Set-Location $PackageDir

        # Check if package.json exists
        if (Test-Path "package.json") {
            # Install dependencies
            $Result = npm install --silent

            if ($LASTEXITCODE -eq 0) {
                Write-Success "Dependencies installed for $Package"
            } else {
                Write-Error "Failed to install dependencies for $Package"
                exit 1
            }
        } else {
            Write-Error "package.json not found in $PackageDir"
            exit 1
        }

        Set-Location $PSScriptRoot
    } else {
        Write-Error "Package directory $PackageDir not found"
        exit 1
    }
}

Write-Host ""
Write-Host "$(Write-ColorOutput $Green)🎉 All remaining dependencies installed successfully!$NC"
Write-Host ""
Write-Host "$(Write-ColorOutput $Yellow)📋 Next steps:$NC"
Write-Host "   1. Start development servers:"
Write-Host "      - synova-nexxus: cd packages/synova-nexxus && npm run dev"
Write-Host "   2. Build packages:"
Write-Host "      - Supanova SDK: cd packages/synova-packages-supanova-sdk && npm run build"
Write-Host "      - UI Components: cd packages/synova-packages-ui && npm run build"
Write-Host "   3. Set up databases and test services"
Write-Host ""   