$oldText = "PAY ONLINE & SAVE `u{20B9}130 (10% OFF)"
$newText = "PAY ONLINE - SAVE 10%"

$files = Get-ChildItem -Path "sections" -Filter "*.liquid" -Recurse
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    if ($content.Contains($oldText)) {
        $newContent = $content.Replace($oldText, $newText)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
    }
}
Write-Host "Done."
