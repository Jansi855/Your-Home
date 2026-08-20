$publicDir = "c:\Users\ravi2\Desktop\Your-Home\public"
$files = Get-ChildItem -Path $publicDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    # Replace href="index.html" with href="/" (Home links in navbars and footers)
    $newContent = $content -replace 'href="index\.html"', 'href="/"'
    
    # Replace href="index.html#something" with href="/#something" (anchored links)
    $newContent = $newContent -replace 'href="index\.html#', 'href="/#'
    
    # Replace href="#" class="nav-link">Home with href="/" for the EMI calculator page nav 
    $newContent = $newContent -replace 'href="#" class="nav-link">Home', 'href="/" class="nav-link">Home'

    if ($content -ne $newContent) {
        Set-Content -Path $f.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($f.Name)"
    } else {
        Write-Host "No changes: $($f.Name)"
    }
}

Write-Host "`nDone updating all HTML files."
