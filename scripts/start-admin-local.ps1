$ErrorActionPreference = 'Stop'
$env:ADMIN_USERNAME = 'hariharasudhan'
$env:NODE_ENV = 'development'
$secret = Read-Host 'Choose the local admin password for this run (8 to 256 characters)' -AsSecureString
try {
    if ($secret.Length -lt 8 -or $secret.Length -gt 256) {
        throw 'Use a password between 8 and 256 characters.'
    }
    $env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $secret).Password
    $env:HOST = '127.0.0.1'
    $env:PORT = '3001'
    Write-Host "Admin username is $env:ADMIN_USERNAME. Keep this terminal open while using the panel."
    npm.cmd run dev:api
    exit $LASTEXITCODE
} finally {
    Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
    $secret.Dispose()
}
