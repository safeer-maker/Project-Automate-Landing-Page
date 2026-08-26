$assetsDir = "c:\Users\Safeer\dev\PA-LP\public\assets"
$imagesDir = "$assetsDir\images"
$logosDir = "$assetsDir\logos"

New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null
New-Item -ItemType Directory -Force -Path $logosDir | Out-Null

$downloads = @(
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/07/PROJECT_automate_Logo-removebg-preview.png"
        Path = "$logosDir\logo-static.png"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2025/05/output-onlinegiftools.gif"
        Path = "$logosDir\logo-animated.gif"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2025/05/logoi-300x300.png"
        Path = "$logosDir\favicon.png"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/image.webp"
        Path = "$imagesDir\hero-og-image.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/Add_a_heading-e1786377268913.webp"
        Path = "$imagesDir\form-side-banner.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/magnific_turn-off-the-light-from-t_xSglCzqjfW.webp"
        Path = "$imagesDir\gallery-pathway-lighting.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/magnific_create-a-photo-realistic-_CqHFoSnEEy.webp"
        Path = "$imagesDir\gallery-patio-ambiance.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/magnific_add-one-uplight-in-every-_ksLsgcS16B-scaled.webp"
        Path = "$imagesDir\gallery-tree-uplighting.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/magnific_add-more-landscape-light-_s7wUadDl8e.webp"
        Path = "$imagesDir\gallery-villa-exterior.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/magnific_remove-that-white-image-i_fHFHbUYCDY-2-scaled.webp"
        Path = "$imagesDir\gallery-evening-luxury.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/08/ChatGPT_Image_Aug_11_2026_12_28_37_PM.webp"
        Path = "$imagesDir\consultation-direct.webp"
    },
    # Menu preview images
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/05/9d8dbabfae34b6c5a817e01405eb193c15d6fed1.webp"
        Path = "$imagesDir\menu-core-services.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/05/c28a92145dbbeabf4a16a1a37201d05f0d370b34.webp"
        Path = "$imagesDir\menu-about-us.webp"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/07/stylish-living-room-with-fireplace-contemporary-decor-elegant-touches_848676-7995.jpeg"
        Path = "$imagesDir\menu-design-partner.jpeg"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/07/the-ultimate-guide-to-remote-control-lighting-and-bulbs-image.jpg"
        Path = "$imagesDir\menu-blogs.jpg"
    },
    @{
        Url = "https://projectautomate.com/wp-content/uploads/2026/07/modern-living-room-interior-with-large-tv-screen-displaying-home-automation-system-scaled.jpg"
        Path = "$imagesDir\menu-contact-us.jpg"
    }
)

Write-Output "Downloading $($downloads.Count) media assets..."

foreach ($d in $downloads) {
    try {
        Write-Output "Fetching: $($d.Url) -> $($d.Path)"
        Invoke-WebRequest -Uri $d.Url -OutFile $d.Path -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -TimeoutSec 30
        Write-Output "  Saved successfully ($((Get-Item $d.Path).Length) bytes)"
    } catch {
        Write-Warning "  Failed to download $($d.Url): $_"
    }
}
