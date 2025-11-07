#!/usr/bin/env bash
set -euo pipefail

# Clean MongoDB data: drop DB or wipe collections.
# Works with:
# - direct URI (--uri)
# - Kubernetes (exec into pod labeled app=mongodb)
# - Docker (exec into container named 'mongodb' or any mongo ancestor)

DB="purchases"
URI=""
NAMESPACE="default"
DROP_DB=false
COLLECTIONS=()

usage() {
  cat <<'EOF'
Usage:
  clean-mongo.sh [--db DBNAME] [--uri MONGODB_URI] [--namespace NS] (--drop-db | --collections c1[,c2...])

Examples:
  # Drop entire DB (auto-detect k8s/docker)
  ./clean-mongo.sh --drop-db

  # Wipe a collection
  ./clean-mongo.sh --collections purchases

  # Use direct URI
  ./clean-mongo.sh --uri mongodb://localhost:27017 --db purchases --drop-db
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db) DB=${2:-purchases}; shift 2;;
    --uri) URI=${2:-}; shift 2;;
    --namespace|-n) NAMESPACE=${2:-default}; shift 2;;
    --drop-db) DROP_DB=true; shift;;
    --collections)
      [[ $# -ge 2 ]] || { echo "--collections requires value" >&2; exit 1; }
      IFS=',' read -r -a COLLECTIONS <<< "$2"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1;;
  esac
done

if [[ "$DROP_DB" = false && ${#COLLECTIONS[@]} -eq 0 ]]; then
  echo "Specify --drop-db or --collections" >&2; usage; exit 1
fi

build_js() {
  if [[ "$DROP_DB" = true ]]; then
    echo "db.getSiblingDB('${DB}').dropDatabase();"
  else
    for c in "${COLLECTIONS[@]}"; do
      [[ -z "$c" ]] && continue
      echo "db.getSiblingDB('${DB}').getCollection('${c}').deleteMany({});"
    done
  fi
}

run_with_uri() {
  local js; js=$(build_js)
  echo "Running against URI: $URI, DB: $DB" >&2
  mongosh "$URI" --quiet --eval "$js"
}

run_in_k8s() {
  command -v kubectl >/dev/null 2>&1 || return 1
  local pod
  pod=$(kubectl get pods -n "$NAMESPACE" -l app=mongodb -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || true)
  [[ -n "$pod" ]] || pod=$(kubectl get pods -n "$NAMESPACE" -o name | grep -E 'pod/mongodb(-|$)' | head -n1 | sed 's#pod/##' || true)
  [[ -n "$pod" ]] || return 1
  local js; js=$(build_js)
  echo "Running in k8s pod: $pod (ns=$NAMESPACE), DB: $DB" >&2
  kubectl exec -n "$NAMESPACE" "$pod" -- sh -lc "printf %s \"$js\" | mongosh --quiet"
}

run_in_docker() {
  command -v docker >/dev/null 2>&1 || return 1
  local cid
  cid=$(docker ps --filter "name=^/mongodb$" --format '{{.ID}}')
  [[ -n "$cid" ]] || cid=$(docker ps --filter "ancestor=mongo" --format '{{.ID}}' | head -n1)
  [[ -n "$cid" ]] || return 1
  local js; js=$(build_js)
  echo "Running in docker container: $cid, DB: $DB" >&2
  docker exec -i "$cid" sh -lc "printf %s \"$js\" | mongosh --quiet"
}

main() {
  if [[ -n "$URI" ]]; then run_with_uri; exit 0; fi
  if run_in_k8s; then exit 0; fi
  if run_in_docker; then exit 0; fi
  echo "No target found. Provide --uri or ensure Kubernetes/Docker mongodb is reachable." >&2
  exit 2
}

main "$@"


