# Firestore Security Specification — Desfrutar Frutas

## Data Invariants
1. Global default-deny: Every document path outside `/counters/solicitacoes` MUST deny all reads and writes.
2. Fixed counter document: Only the exact document ID `solicitacoes` inside `/counters/{counterId}` may be read (`get`), created, or updated. Listing (`/counters`) and deleting (`/counters/{counterId}`) MUST always return `PERMISSION_DENIED`.
3. Strict sequential monotonicity:
   - `create` on `/counters/solicitacoes` MUST enforce `lastNumber == 1` and `updatedAt == request.time`.
   - `update` on `/counters/solicitacoes` MUST enforce `incoming().lastNumber == existing().lastNumber + 1` and `updatedAt == request.time`.
4. Strict schema enforcement: Only keys `['lastNumber', 'updatedAt']` are allowed; no shadow/ghost fields, no wrong types, and `lastNumber` MUST be an integer within `1..1000000000`.
5. No PII is stored in Firestore.

## The Dirty Dozen Adversarial Payloads
1. **Shadow Field on Create**: `{ "lastNumber": 1, "updatedAt": "<serverTime>", "isAdmin": true }` -> MUST FAIL (`hasOnly`).
2. **Shadow Field on Update**: `{ "lastNumber": 2, "updatedAt": "<serverTime>", "reset": true }` -> MUST FAIL (`hasOnly` & `affectedKeys().hasOnly`).
3. **Counter Reset Attack**: Update `lastNumber` from `5` to `1` -> MUST FAIL (`incoming().lastNumber == existing().lastNumber + 1`).
4. **Counter Decrement Attack**: Update `lastNumber` from `5` to `4` -> MUST FAIL (`+ 1` invariant).
5. **Counter Jump / Skip Attack**: Update `lastNumber` from `5` to `100` -> MUST FAIL (`+ 1` invariant).
6. **Non-1 Initial Seed Attack**: Create `/counters/solicitacoes` with `lastNumber: 99` or `0` -> MUST FAIL (`lastNumber == 1`).
7. **Type / Value Poisoning**: Update `lastNumber` to `"02"` (string), `2.5` (float), or `true` (bool) -> MUST FAIL (`is int`).
8. **Client-Forged Timestamp**: Create/Update with `updatedAt` set to a past/future client timestamp instead of `serverTimestamp()` -> MUST FAIL (`updatedAt == request.time`).
9. **ID Poisoning / Arbitrary Counter Creation**: Create `/counters/fake_counter` or `/counters/<1KB-string>` -> MUST FAIL (`isValidId(counterId) && counterId == 'solicitacoes'`).
10. **Counter Deletion Attack**: `deleteDoc(doc(db, 'counters', 'solicitacoes'))` -> MUST FAIL (`allow delete: if false`).
11. **Collection Scraping / List Attack**: `getDocs(collection(db, 'counters'))` -> MUST FAIL (`allow list: if false`).
12. **Unauthorized Collection Write**: `setDoc(doc(db, 'users', 'attacker'), { role: 'admin' })` -> MUST FAIL (global catch-all default deny).
