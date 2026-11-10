# Test 1: Website available
GET https://0xflotus.is-a.dev/mdtg/
HTTP 200

# Test 2: HTML-Content-Type
GET https://0xflotus.is-a.dev/mdtg/
HTTP 200
[Asserts]
header "content-type" contains "text/html"

# Test 3: HTML-Structure
GET https://0xflotus.is-a.dev/mdtg/
HTTP 200
[Asserts]
xpath "//html" exists
xpath "//head/title" exists
xpath "//body" exists
