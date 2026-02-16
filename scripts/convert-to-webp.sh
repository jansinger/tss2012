#!/bin/bash
# Convert JPEG images to WebP format for bandwidth savings.
# Converts _gr (gallery) and thumbnail images. Skips _orig (not served).
# Requires: cwebp (install via: brew install webp)
#
# Usage: ./scripts/convert-to-webp.sh [quality]
# Default quality: 80 (good balance of size and visual quality)

set -euo pipefail

IMAGES_DIR="static/images"
QUALITY="${1:-80}"
CONVERTED=0
SKIPPED=0
ERRORS=0

if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp not found. Install with: brew install webp"
    exit 1
fi

echo "Converting JPEGs to WebP (quality: ${QUALITY})..."
echo "Source: ${IMAGES_DIR}"
echo ""

# Convert all JPEGs except _orig files
while IFS= read -r jpg_file; do
    webp_file="${jpg_file%.jpg}.webp"

    # Skip if WebP already exists and is newer than JPEG
    if [ -f "$webp_file" ] && [ "$webp_file" -nt "$jpg_file" ]; then
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    if cwebp -q "$QUALITY" "$jpg_file" -o "$webp_file" -quiet 2>/dev/null; then
        CONVERTED=$((CONVERTED + 1))
    else
        echo "  Error converting: $jpg_file"
        ERRORS=$((ERRORS + 1))
    fi

    # Progress indicator every 100 files
    TOTAL=$((CONVERTED + SKIPPED + ERRORS))
    if [ $((TOTAL % 100)) -eq 0 ]; then
        echo "  Processed: ${TOTAL} files..."
    fi
done < <(find "$IMAGES_DIR" -name "*.jpg" -not -name "*_orig.jpg" -type f)

echo ""
echo "Done!"
echo "  Converted: ${CONVERTED}"
echo "  Skipped (up-to-date): ${SKIPPED}"
echo "  Errors: ${ERRORS}"

# Show size comparison
JPEG_SIZE=$(find "$IMAGES_DIR" -name "*.jpg" -not -name "*_orig.jpg" -type f -exec stat -f%z {} + | awk '{s+=$1} END {print s}')
WEBP_SIZE=$(find "$IMAGES_DIR" -name "*.webp" -type f -exec stat -f%z {} + 2>/dev/null | awk '{s+=$1} END {print s}')

if [ -n "$WEBP_SIZE" ] && [ "$WEBP_SIZE" -gt 0 ]; then
    SAVINGS=$(( (JPEG_SIZE - WEBP_SIZE) * 100 / JPEG_SIZE ))
    echo ""
    echo "Size comparison (excluding _orig):"
    echo "  JPEG total: $(echo "$JPEG_SIZE" | awk '{printf "%.1f MB", $1/1048576}')"
    echo "  WebP total: $(echo "$WEBP_SIZE" | awk '{printf "%.1f MB", $1/1048576}')"
    echo "  Savings: ${SAVINGS}%"
fi
