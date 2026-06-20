# Vault Index Cadence

FTS indexing is cheap enough to refresh after normal content changes.

Semantic vector indexing should run as a weekly batch, not on every `/rrr` or small note write. Treat launchd automation as Phase 4 so the manual cadence stays explicit while the vault sync fixes settle.
