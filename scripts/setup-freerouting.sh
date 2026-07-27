#!/usr/bin/env bash
set -euo pipefail

readonly VERSION="2.2.4"
readonly EXPECTED_SHA256="d712dd0dc1f51c8bab4868d8435d90e8cbba00e0c4bab45837334b17b382578f"
readonly CACHE_ROOT=".cache/freerouting"
readonly INSTALL_ROOT="${CACHE_ROOT}/runtime/freerouting-${VERSION}-linux-x64"
readonly DOWNLOAD_URL="https://github.com/freerouting/freerouting/releases/download/v${VERSION}/freerouting-${VERSION}-linux-x64.zip"

if [[ -x "${INSTALL_ROOT}/bin/freerouting" ]]; then
  echo "Freerouting ${VERSION} is already installed in the project cache."
  exit 0
fi

mkdir -p "${CACHE_ROOT}"
readonly TEMP_ROOT="$(mktemp -d)"
readonly ARCHIVE="${TEMP_ROOT}/freerouting.zip"

cleanup() {
  gio trash "${TEMP_ROOT}" 2>/dev/null || true
}
trap cleanup EXIT

curl -L --fail --show-error --output "${ARCHIVE}" "${DOWNLOAD_URL}"
printf '%s  %s\n' "${EXPECTED_SHA256}" "${ARCHIVE}" | sha256sum --check --status
mkdir -p "${CACHE_ROOT}/runtime"
unzip -q "${ARCHIVE}" -d "${CACHE_ROOT}/runtime"

test -x "${INSTALL_ROOT}/bin/freerouting"
echo "Installed Freerouting ${VERSION} in the project cache."
