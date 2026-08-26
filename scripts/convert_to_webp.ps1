$ffmpeg = "C:\Users\Safeer\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
$assetsDir = "c:\Users\Safeer\dev\PA-LP\public\assets"

$images = Get-ChildItem -Path $assetsDir -Include *.jpeg, *.jpg, *.png -Recurse

Write-Output "Found $($images.Count) images to convert to .webp"

foreach ($img in $images) {
    $webpPath = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    Write-Output "Converting: $($img.Name) -> $([System.IO.Path]::GetFileName($webpPath))"
    & $ffmpeg -y -i $img.FullName -c:v libwebp -quality 85 $webpPath
    if (Test-Path $webpPath) {
        Write-Output "  Created: $webpPath ($((Get-Item $webpPath).Length) bytes)"
    }
}
