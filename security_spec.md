# Security Specification - MADECC Executive Command System

## 1. Data Invariants
- **Command Keys**: Must belong to an assigned role. `hashed_key` is mandatory and immutable after creation. Only valid if `revoked` is false.
- **Projects**: Budgets must be non-negative. Titles and locations must not exceed 256 characters.
- **Security Logs**: Must include a timestamp, IP address, and threat level.
- **Users**: User profiles are linked to their Firebase Auth UID. Roles are strictly controlled.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

### T1: Identity Spoofing (Command Key)
Attempt to create a command key for yourself as a non-CEO user.
```json
{
  "hashed_key": "$2b$10$spoofed...",
  "assigned_role": "CEO",
  "status": "active",
  "created_at": "2026-05-15T20:21:33Z",
  "revoked": false
}
```
**Expected**: PERMISSION_DENIED

### T2: State Shortcutting (Project Status)
Attempt to approve a milestone phase without CEO authorization or proper role.
```json
{
  "milestones": [
    { "phase": "Structural Framing", "progress": 100, "approved_by_ceo": true }
  ]
}
```
**Expected**: PERMISSION_DENIED

### T3: Resource Poisoning (Giant ID)
Attempt to create a document with a 2MB string as ID.
**Expected**: PERMISSION_DENIED (isValidId check)

### T4: Orphaned Write (Project Reference)
Create a task linked to a non-existent project.
**Expected**: PERMISSION_DENIED (exists() check)

### T5: PII Leak (User Profiling)
Anonymous user attempting to list the `users` collection.
**Expected**: PERMISSION_DENIED

### T6: Field Injection (Verification Bypass)
Update user profile to set `system_status` to `authorized` without proper privilege.
```json
{
  "system_status": "authorized"
}
```
**Expected**: PERMISSION_DENIED

### T7: Temporal Inconsistency
Creating a project with a `created_at` timestamp in the future (managed by client).
**Expected**: PERMISSION_DENIED (request.time check)

### T8: Administrative Escalation
Updating a `command_key` and setting `revoked: false` on an expired key.
**Expected**: PERMISSION_DENIED

### T9: Denial of Wallet (Recursive Read)
Querying `projects` without any filters, forcing a full collection scan on a 1M doc collection (if rules didn't enforce filters).
**Expected**: Rejected by rule evaluation order if auth is missing.

### T10: Shadow Update
Adding `isVerifiedAdmin: true` to a standard project update.
**Expected**: PERMISSION_DENIED (affectedKeys().hasOnly check)

### T11: Unverified Email Access
Accessing sensitive executive data with an unverified email account.
**Expected**: PERMISSION_DENIED

### T12: IP Spoofing in Logs
Manually adding a security log with a forged IP or threat level.
**Expected**: PERMISSION_DENIED

## 3. Test Runner (Planned)
Rules will be tested against these payloads before final deployment.
