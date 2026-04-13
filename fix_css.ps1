Get-ChildItem src -Recurse -Filter *.css | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace '--sd-', '--sd_'
    $content = $content -replace 'var\(--sd-', 'var(--sd_'
    $content | Set-Content $_.FullName
}
