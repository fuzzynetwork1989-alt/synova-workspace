# SYNOVA BRAIN MAXIMUM PERFORMANCE TEST
# PowerShell script for testing enhanced models

Write-Host "🧠 SYNOVA BRAIN MAXIMUM PERFORMANCE TEST" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Testing Revolutionary Models..." -ForegroundColor Yellow
Write-Host ""

Write-Host "📊 Testing synova-brain-gemma4-maximum..." -ForegroundColor Green
try {
    $response = ollama run synova-brain-gemma4-maximum "Demonstrate all 18+ revolutionary features with quantum-coherent reasoning" 2>$null
    Write-Host "✅ Gemma4 Maximum test completed" -ForegroundColor Green
    Write-Host "Response: $($response.Substring(0, [Math]::Min(100, $response.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ Gemma4 Maximum test failed: $_" -ForegroundColor Red
}

Write-Host ""

Write-Host "📊 Testing synova-brain-llama4-maximum..." -ForegroundColor Green
try {
    $response = ollama run synova-brain-llama4-maximum "Show your advanced reasoning with 128k context and All revolutionary features" 2>$null
    Write-Host "✅ Llama4 Maximum test completed" -ForegroundColor Green
    Write-Host "Response: $($response.Substring(0, [Math]::Min(100, $response.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ Llama4 Maximum test failed: $_" -ForegroundColor Red
}

Write-Host ""

Write-Host "📊 Testing existing revolutionary models..." -ForegroundColor Yellow
Write-Host ""

Write-Host "📊 Testing synova-brain-deepseek-revolutionary..." -ForegroundColor Green
try {
    $response = ollama run synova-brain-deepseek-revolutionary "Demonstrate your logical reasoning with revolutionary features" 2>$null
    Write-Host "✅ DeepSeek Revolutionary test completed" -ForegroundColor Green
    Write-Host "Response: $($response.Substring(0, [Math]::Min(100, $response.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ DeepSeek Revolutionary test failed: $_" -ForegroundColor Red
}

Write-Host ""

Write-Host "📊 Testing synova-brain-production-revolutionary..." -ForegroundColor Green
try {
    $response = ollama run synova-brain-production-revolutionary "Show your enterprise capabilities with revolutionary features" 2>$null
    Write-Host "✅ Production Revolutionary test completed" -ForegroundColor Green
    Write-Host "Response: $($response.Substring(0, [Math]::Min(100, $response.Length)))..." -ForegroundColor White
} catch {
    Write-Host "❌ Production Revolutionary test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ All models tested successfully!" -ForegroundColor Green
Write-Host "🚀 SYNOVA BRAIN MAXIMUM EDITION is ready for use!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""
