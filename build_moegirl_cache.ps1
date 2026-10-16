$ErrorActionPreference = 'Stop'
$domain = 'moegirl.uk'
$inputFile = Join-Path $PSScriptRoot 'character_table.json'
$outputFile = Join-Path $PSScriptRoot 'moegirl_tags.json'
$classCodes = @('PIONEER','WARRIOR','TANK','SNIPER','CASTER','MEDIC','SUPPORT','SPECIAL')
$titleOverrides = @{ '陈' = '陈晖洁'; '麒麟R夜刀' = '夜刀'; '斯卡蒂' = '斯卡蒂(明日方舟)' }

function Get-OperatorRows {
  $game = Get-Content -LiteralPath $inputFile -Raw | ConvertFrom-Json
  @($game.PSObject.Properties | ForEach-Object {
    $op = $_.Value
    $rarity = if ([string]$op.rarity -match '(\d+)') { [int]$Matches[1] } else { 0 }
    if ($op.name -and $classCodes -contains $op.profession -and $rarity -ge 1 -and -not $op.isNotObtainable -and -not ([string]$op.name).StartsWith('预')) {
      [PSCustomObject]@{ name = [string]$op.name; rarity = $rarity }
    }
  })
}

function Get-Candidates([string]$Name) {
  $base = if ($titleOverrides.ContainsKey($Name)) { $titleOverrides[$Name] } else { $Name }
  @($base, ($Name + '(明日方舟)'), ($Name + '(明日方舟干员)')) | Select-Object -Unique
}

function Get-ApiPages([string[]]$Titles) {
  $pages = @{}
  $unique = @($Titles | Where-Object { $_ } | Sort-Object -Unique)
  for ($offset = 0; $offset -lt $unique.Count; $offset += 40) {
    $batch = @($unique | Select-Object -Skip $offset -First 40)
    $query = [uri]::EscapeDataString(($batch -join '|'))
    $uri = "https://$domain/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&redirects=1&titles=$query&format=json"
    $response = Invoke-RestMethod -Uri $uri -TimeoutSec 45
    foreach ($page in $response.query.pages.PSObject.Properties) {
      $value = $page.Value
      $body = ''
      $revision = $null
      $modified = $null
      if ($value.revisions -and $value.revisions.Count) {
        $body = [string]$value.revisions[0].slots.main.'*'
        $revision = [long]$value.revisions[0].revid
        $modified = [string]$value.revisions[0].timestamp
      }
      $pages[[string]$value.title] = [PSCustomObject]@{ title = [string]$value.title; missing = ($null -ne $value.missing); body = $body; revision = $revision; modified = $modified }
    }
    Write-Host "已读取条目 $([Math]::Min($offset + 40, $unique.Count))/$($unique.Count)"
  }
  return $pages
}

function Get-MoegirlTags([string]$Wikitext) {
  $field = [regex]::Match($Wikitext, '(?im)(?:^|\r?\n)\s*\|\s*(?:萌点|萌属性)\s*=\s*([\s\S]*?)(?=\r?\n\s*\|\s*[^|\r\n]+\s*=|\r?\n\s*}}|\r?\n----|$)')
  if (-not $field.Success) { return @() }
  $raw = $field.Groups[1].Value
  $raw = [regex]::Replace($raw, '<!--([\s\S]*?)-->', '')
  $raw = [regex]::Replace($raw, '<ref\b[^>]*>[\s\S]*?</ref>', '')
  $raw = [regex]::Replace($raw, '<br\s*/?>', '、')
  $raw = [regex]::Replace($raw, '\[\[([^\]|]+)\|([^\]]+)\]\]', '$2')
  $raw = [regex]::Replace($raw, '\[\[([^\]]+)\]\]', '$1')
  $raw = [regex]::Replace($raw, '\[https?://[^\s\]]+\s+([^\]]+)\]', '$1')
  $raw = [regex]::Replace($raw, '\{\{\s*(?:萌点|萌属性)\s*\|', '')
  $raw = [regex]::Replace($raw, '\{\{[^{}]*\}\}', ' ')
  $raw = [regex]::Replace($raw, '<[^>]*>', ' ')
  $raw = $raw -replace "'{2,}|[{}]", ''
  @($raw -split '[，,；;、/|\r\n]+' | ForEach-Object {
    ([regex]::Replace($_, '[（(].*?[）)]', '')).Trim()
  } | Where-Object { $_ -and $_.Length -le 18 -and $_ -notmatch '^(萌点|萌属性|无|暂无|不明)$' } | Select-Object -Unique)
}

$operators = @(Get-OperatorRows)
$candidateByName = @{}
$allTitles = [System.Collections.Generic.List[string]]::new()
foreach ($operator in $operators) {
  $candidates = @(Get-Candidates $operator.name)
  $candidateByName[$operator.name] = $candidates
  $allTitles.AddRange([string[]]$candidates)
}

$pages = Get-ApiPages -Titles $allTitles.ToArray()
$unresolved = @($operators | Where-Object {
  $found = $false
  foreach ($title in $candidateByName[$_.name]) {
    $page = $pages[[string]$title]
    if ($page -and -not $page.missing -and (Get-MoegirlTags $page.body).Count) { $found = $true; break }
  }
  -not $found
})

if ($unresolved.Count) {
  Write-Host "站内搜索补查 $($unresolved.Count) 位未匹配干员…"
  $searchTitles = $unresolved | ForEach-Object -Parallel {
    $name = $_.name
    $query = [uri]::EscapeDataString(('"' + $name + '" 明日方舟'))
    $uri = "https://moegirl.uk/api.php?action=query&list=search&srsearch=$query&srlimit=8&format=json"
    try {
      $response = Invoke-RestMethod -Uri $uri -TimeoutSec 30
      foreach ($result in $response.query.search) {
        if ($result.title.Contains($name) -and ($result.snippet -match '明日方舟')) {
          [PSCustomObject]@{ name = $name; title = [string]$result.title }
        }
      }
    } catch {}
  } -ThrottleLimit 5
  foreach ($result in $searchTitles) {
    if (-not $candidateByName[$result.name].Contains($result.title)) { $candidateByName[$result.name] += $result.title }
  }
  $additionalPages = Get-ApiPages -Titles @($searchTitles | ForEach-Object { $_.title })
  foreach ($entry in $additionalPages.GetEnumerator()) { $pages[$entry.Key] = $entry.Value }
}

$cache = [ordered]@{}
foreach ($operator in $operators) {
  $selected = $null
  $tags = @()
  foreach ($title in $candidateByName[$operator.name]) {
    $page = $pages[[string]$title]
    if (-not $page -or $page.missing) { continue }
    $candidateTags = @(Get-MoegirlTags $page.body)
    if ($candidateTags.Count) { $selected = $page; $tags = $candidateTags; break }
  }
  $resolvedTitle = if ($selected) { $selected.title } else { Get-Candidates $operator.name | Select-Object -First 1 }
  $cache[$operator.name] = [ordered]@{
    tags = @($tags)
    title = [string]$resolvedTitle
    url = "https://moegirl.uk/index.php?title=$([uri]::EscapeDataString([string]$resolvedTitle))"
    candidates = @(Get-Candidates $operator.name)
    revision = if ($selected) { $selected.revision } else { $null }
    modified = if ($selected) { $selected.modified } else { $null }
    status = if ($tags.Count) { 'found' } else { 'no-tagged-page' }
  }
}

$document = [ordered]@{
  source = '萌娘百科公开 MediaWiki API'
  generatedAt = [DateTime]::UtcNow.ToString('o')
  operatorCount = $operators.Count
  operators = $cache
}
$json = $document | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($outputFile, $json, [System.Text.UTF8Encoding]::new($false))
$foundCount = @($cache.Values | Where-Object status -eq 'found').Count
Write-Host "缓存已写入 $outputFile；干员 $($operators.Count) 位，有萌点 $foundCount 位，无匹配萌点条目 $($operators.Count - $foundCount) 位。"
