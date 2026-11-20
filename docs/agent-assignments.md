# Agent assignments and worktrees

Native subagents ran five read-only role reviews in waves. This session has four concurrent slots including the coordinator. Threads share a filesystem; declaring a role does not isolate edits. Each approved implementation task must receive its own worktree path, branch, base SHA, owned paths and acceptance criteria. If using separate Codex threads, open the matching checkout and give it the corresponding assignment below.

| Branch | Assignment to give the thread after approval |
| --- | --- |
| codex/frontend | Extend existing components for the approved tickets. Preserve brand and routes. Include keyboard, responsive and saved-bag evidence. |
| codex/backend | Build the approved Express contract slice. Own HTTP services and middleware. Document request validation, ownership checks, errors and retry behavior. |
| codex/database | Implement the approved models, connection lifecycle, indexes and safe seed/migration procedures. Demonstrate rerun safety using test data. |
| codex/integration | Verify the agreed API fixtures and a combined candidate. Record compiler, build, contract, browser, conflict and regression results. Coordinate shared files. |
| codex/security-review | Independently inspect the exact candidate and base diff. Record evidence, impact, severity, remediation owner and retest results. Escalate Critical and High findings. |

## Setting up linked checkouts

Git CLI is available. Git status, branch and worktree inspection failed because the current folder has no Git metadata. First identify the canonical checkout and reconcile this working copy with it. If this is the sole authoritative copy, have the owner confirm a new local baseline. Review exclusions for node_modules, dist, Microsoft/Windows/PowerShell/ModuleAnalysisCache, private environment files, credentials and editor-local settings. Stage explicit reviewed paths, inspect the staged diff and record the approved base commit including the contributor guidance. Avoid wholesale staging. Uncommitted files do not automatically appear in linked checkouts.

After establishing the approved baseline, run this PowerShell procedure from its repository root. Supply the exact agreed SHA when prompted. Paths are sibling directories; confirm those locations are writable. Inspect existing branches and worktrees before rerunning a partially completed setup. Reuse an existing verified checkout deliberately, preserving its contents.

```powershell
git status --short --branch
git branch --list
git worktree list
$approvedBase = Read-Host 'Approved full base commit SHA'
if ($approvedBase -notmatch '^[a-fA-F0-9]{40}([a-fA-F0-9]{24})?$') { throw 'Expected a full commit SHA' }
git cat-file -e "${approvedBase}^{commit}"
if ($LASTEXITCODE -ne 0) { throw 'Base commit unavailable' }
$roles = 'frontend','backend','database','integration','security-review'
foreach ($role in $roles) {
    $path = "../kanagadhara-$role"
    git show-ref --verify --quiet "refs/heads/codex/$role"
    if ($LASTEXITCODE -eq 0 -or (Test-Path -LiteralPath $path)) { throw "Inspect existing branch or path for $role" }
}
foreach ($role in $roles) {
    git worktree add -b "codex/$role" "../kanagadhara-$role" $approvedBase
    if ($LASTEXITCODE -ne 0) { throw "Worktree setup stopped at $role" }
}
git worktree list --porcelain
```

Before starting each task, verify its working directory, current branch and HEAD. Before integration, compare `git diff --name-status BASE...CANDIDATE`, inspect full patches and run combined checks. Substitute actual reviewed SHAs. Bring planning files into the baseline before branching. No desktop UI action is required for the documented CLI procedure. [Git worktree reference](https://git-scm.com/docs/git-worktree)

## Required report for each task

```text
AGENT NAME:
TASK:
STATUS:
FILES MODIFIED:
IMPLEMENTATION SUMMARY:
TESTS EXECUTED:
TEST RESULTS:
SECURITY CONSIDERATIONS:
UNRESOLVED ISSUES:
BRANCH:
COMMIT HASH:
RECOMMENDED NEXT ACTION:
```

Use “Not executed” for skipped checks and “Not available” for missing evidence. Use “None” for a verified empty file-change list.
