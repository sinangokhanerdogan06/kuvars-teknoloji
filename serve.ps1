$port = if ($env:PORT) { $env:PORT } else { '3000' }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving at http://localhost:$port/"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.json' = 'application/json'
  '.woff2'= 'font/woff2'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $urlPath = $req.Url.LocalPath
    if ($urlPath -eq '/') { $urlPath = '/index.html' }

    # Strip query string from path
    $filePath = $urlPath.Split('?')[0] -replace '/', [System.IO.Path]::DirectorySeparatorChar
    $file = Join-Path $root $filePath.TrimStart([System.IO.Path]::DirectorySeparatorChar)

    if (Test-Path $file -PathType Leaf) {
      $ext  = [System.IO.Path]::GetExtension($file).ToLower()
      $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

      $bytes = [System.IO.File]::ReadAllBytes($file)
      $len   = [int64]$bytes.LongLength

      $res.StatusCode   = 200
      $res.ContentType  = $mime
      $res.ContentLength64 = $len
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $body  = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
      $res.StatusCode  = 404
      $res.ContentType = 'text/plain'
      $res.ContentLength64 = $body.LongLength
      $res.OutputStream.Write($body, 0, $body.Length)
    }

    $res.OutputStream.Flush()
    $res.OutputStream.Close()
  } catch {
    # silently continue on per-request errors
    try { $ctx.Response.OutputStream.Close() } catch {}
  }
}
