$extensions = @("*.tsx", "*.ts", "*.css", "*.scss")
$files = Get-ChildItem src -Recurse -Include $extensions

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'sd-') {
        Write-Host "Refactoring: $($file.FullName)"
        $content = $content -replace 'sd-', 'sd_'
        $content | Set-Content $file.FullName
    }
}
