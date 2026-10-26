param([string]$Workspace = 'D:\Project\LearnPython')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$sourcePath = Join-Path $Workspace 'assets\img\full frame.png'
$outputDir = Join-Path $Workspace 'assets\img\rabbit-mascot\source-frames'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
$sheet = [System.Drawing.Bitmap]::FromFile($sourcePath)
try {
    if ($sheet.Width -ne 1450 -or $sheet.Height -ne 1085) { throw 'Unexpected source dimensions; recheck the crop grid.' }
    $columns = @(0, 362, 725, 1087, 1450)
    $rows = @(0, 542, 1085)
    $directions = @('n','ne','e','se','s','sw','w','nw-original-error')
    for ($index = 0; $index -lt 8; $index++) {
        $column = $index % 4
        $row = [math]::Floor($index / 4)
        $rect = [System.Drawing.Rectangle]::new($columns[$column], $rows[$row],
            $columns[$column+1] - $columns[$column], $rows[$row+1] - $rows[$row])
        $frame = $sheet.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try { $frame.Save((Join-Path $outputDir ($directions[$index] + '.png')), [System.Drawing.Imaging.ImageFormat]::Png) }
        finally { $frame.Dispose() }
    }
} finally { $sheet.Dispose() }
Write-Output 'Eight lossless source crops saved; original sheet unchanged.'
