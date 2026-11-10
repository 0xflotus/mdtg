# Test 1: Website available
GET https://0xflotus.github.io/mdtg/
HTTP 301

# Test 2: HTML-Content-Type
GET https://0xflotus.github.io/mdtg/
HTTP 301
[Asserts]
header "content-type" contains "text/html"

# Test 3: HTML-Structure
GET https://0xflotus.github.io/mdtg/
HTTP 301
[Asserts]
xpath "//html" exists
xpath "//head/title" exists
xpath "//body" exists
