# Publishing Blightmarch to GitHub → installing in Foundry

This repo is already committed and tagged **v1.10.0**. You just need to put it on GitHub and let it cut a release. Pick one of the two paths below. (I can't do this step for you — it needs to run under *your* GitHub account.)

Once released, the install URL you paste into Foundry is:

```
https://github.com/<YOUR-USERNAME>/blightmarch/releases/latest/download/system.json
```

---

## Path A — one command with the GitHub CLI (easiest)

Requires the GitHub CLI (`gh`) installed and logged in (`gh auth login`).

```bash
cd blightmarch-repo

# 1. Create the repo on your account and push everything (code + the v1.10.0 tag)
gh repo create blightmarch --public --source=. --remote=origin --push
git push origin v1.10.0

# 2. That tag push triggers the included GitHub Action, which builds and
#    publishes the release with system.json + blightmarch.zip attached.
#    Watch it finish:
gh run watch
```

That's it. When the Action goes green, your manifest URL is live.

---

## Path B — manual, through the website

1. On github.com, create a new **public** repository named `blightmarch` (empty — no README).
2. Push this folder to it:
   ```bash
   cd blightmarch-repo
   git remote add origin https://github.com/<YOUR-USERNAME>/blightmarch.git
   git push -u origin main
   git push origin v1.10.0
   ```
3. The tag push fires the **Release Blightmarch to Foundry** workflow (see the *Actions* tab). It attaches `system.json` and `blightmarch.zip` to a new release automatically.

**If you'd rather not use the Action**, make the release by hand instead:
- Edit `system.json` and replace `YOUR-GH-USERNAME` with your username in the `manifest`/`download` URLs, commit.
- Zip the system with files at the archive root:
  ```bash
  cd blightmarch-repo && zip -r ../blightmarch.zip . -x '.git/*' '.github/*'
  ```
- On GitHub: **Releases → Draft a new release**, tag `v1.10.0`, and upload **both** `system.json` and `blightmarch.zip` as assets.

---

## Installing in Foundry VTT

1. Foundry setup screen → **Game Systems → Install System**.
2. In **Manifest URL**, paste:
   ```
   https://github.com/<YOUR-USERNAME>/blightmarch/releases/latest/download/system.json
   ```
3. Click **Install**. Create a world and choose **Blightmarch** as the system.
4. Open the Compendium sidebar — the eight Blightmarch packs are there. (Foundry migrates the NeDB packs to LevelDB on first load; the one-time notice is normal.)

Because `manifest` points at `releases/latest`, Foundry will also offer updates automatically whenever you push a new `v*` tag.

---

## Cutting future releases

Bump the version and tag — the Action does the rest:

```bash
# edit "version" in system.json to e.g. 1.11.0, commit, then:
git tag v1.11.0
git push origin main v1.11.0
```
