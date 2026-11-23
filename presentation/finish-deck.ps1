# Opens presentation/Tezera Viva.pptx in PowerPoint (Windows, PowerPoint installed), saves it again with the
# brand fonts embedded, and exports every slide as a PNG for checking.
# The fonts in presentation/fonts must be installed first (double-click each .ttf > Install), or PowerPoint
# swaps them for a default font and embeds nothing.
# Usage: powershell -File presentation/finish-deck.ps1 [-PngDir <folder>]
param([string]$PngDir = "")

$ErrorActionPreference = "Stop"
$deck = Join-Path $PSScriptRoot "Tezera Viva.pptx"
$tmp = Join-Path $env:TEMP ("tezera-viva-" + [guid]::NewGuid().ToString() + ".pptx")

$pp = New-Object -ComObject PowerPoint.Application
try {
    $p = $pp.Presentations.Open($deck, $true, $false, $false)  # read-only, untitled no, no window
    # 24 = ppSaveAsOpenXMLPresentation, -1 = msoTrue (embed TrueType fonts)
    $p.SaveAs($tmp, 24, -1)
    if ($PngDir) {
        New-Item -ItemType Directory -Force $PngDir | Out-Null
        Get-ChildItem $PngDir -Filter "slide-*.png" | Remove-Item -Force
        foreach ($s in $p.Slides) {
            $s.Export((Join-Path $PngDir ("slide-{0:D2}.png" -f $s.SlideIndex)), "PNG", 1600, 900)
        }
    }
    $p.Close()
} finally {
    $pp.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pp) | Out-Null
}
Move-Item -Force $tmp $deck
Write-Output ("Saved with embedded fonts: " + $deck)
