<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- Stage gate list, phase names and DSP numbering come only from `STAGE_GATES` / `stageGatePhase` / `stageGateToDsp` in `src/lib/mock.ts`; pages must not hardcode their own gate lists, so adding a gate updates every page at once.
