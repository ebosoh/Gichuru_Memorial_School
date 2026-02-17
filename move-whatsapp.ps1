$files = Get-ChildItem -Path "c:\Users\USER\Desktop\TechBrain Projects\Gichuru Memorial School" -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # 1. Remove floating WhatsApp button
    # The pattern matches the link and the img inside, across lines
    $content = $content -replace '<a href="https://wa.me/254790268040" target="_blank" class="whatsapp-float"[\s\S]*?</a>', ''

    # 2. Add WhatsApp icon to navbar
    $contactLink = '<li><a href="contact.html" class="nav-link">Contact</a></li>'
    if ($content -match '<li><a href="contact.html" class="nav-link">Contact</a></li>') {
        $whatsappLink = '<li><a href="contact.html" class="nav-link">Contact</a></li>' + "`n" + 
                        '                <li><a href="https://wa.me/254790268040" target="_blank" class="nav-link" aria-label="WhatsApp" style="display: flex; align-items: center;"><img src="whatsapp.png" alt="WhatsApp" style="width: 24px; height: 24px;"></a></li>'
        $content = $content.Replace($contactLink, $whatsappLink)
    } elseif ($content -match '<li><a href="\.\./contact.html" class="nav-link">Contact</a></li>') {
         # Handle relative paths if any (subpages might use dots?) 
         # Wait, pages in root use contact.html.
         # Checked file list: all pages are in root. So href="contact.html" is likely consistent.
    }

    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated $($file.Name)"
}
