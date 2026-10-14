# Preview Deployment Check

This file exists only to test the PlotMix development workflow.

## Purpose

Confirm that a pull request automatically gets its own Vercel preview
deployment, separate from production, before any real code changes are made.

## What this change does

- Adds this one Markdown file.
- Changes no game code, assets, package files or settings.
- Does not affect how the game looks or plays.

## Baseline

- Tag: `baseline-2026-10-14`
- Commit: `b01ebc7d64388686f2c37d57f20b294ac7d53cd3`

## Expected result

1. Vercel builds a preview for this pull request.
2. The preview build succeeds.
3. The production site stays on the baseline commit.

This pull request is a draft and is not meant to be merged.
