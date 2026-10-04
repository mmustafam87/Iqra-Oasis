# Iqra Island: Google Play release kit

This folder turns Iqra Island into a **Google Play–ready Android App Bundle (.aab)**:

- Capacitor 8 targets **Android 16 / API 36**, which Google Play requires for new apps and updates from 31 Aug 2026.
- Package id: `au.mustafa.iqraisland`. App name: **Iqra Island**.
- GitHub Actions builds a **signed .aab** for Play, plus an .apk you can install on a phone to test.
- The listing text, graphics, screenshots, privacy policy and answers for the Play Console forms are all included.

```
www/                     the app itself (index.html + Qur'an audio)
assets/                  icon and splash sources (made into Android icons during the build)
scripts/                 build helpers (offline fonts, API 36, versioning, signing)
.github/workflows/       the cloud build that makes the .aab
store/                   Play listing: icon, feature graphic, screenshots, listing.md
privacy-policy.html      privacy policy to host publicly
```

> The upload key (`iqra-island-upload.jks`) and its passwords are delivered **separately** and must **never** be committed to GitHub.

---

## 1. Put the project on GitHub
1. Create a **new private repository** on github.com, for example `iqra-island-android`.
2. Upload **everything in this folder**, including the hidden `.github` folder. The easiest way is to drag the unzipped folder into GitHub's "uploading an existing file" page, or use GitHub Desktop.

## 2. Add the signing secrets
Go to the repo, then **Settings → Secrets and variables → Actions → New repository secret**, and add the four secrets listed in `UPLOAD-KEY-README.txt`:

| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | the whole content of `keystore-base64.txt` |
| `ANDROID_KEYSTORE_PASSWORD` | the password |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | the same password |

## 3. Build the .aab
1. Open the **Actions** tab, choose **Build Android App Bundle (Google Play)**, then **Run workflow**. You can type a version name such as `1.0.0`.
2. Wait about 6–10 minutes. When it finishes, scroll to **Artifacts** and download `iqra-island-release-N`. Inside are:
   - `iqra-island-N.aab`, which you **upload to Google Play**
   - `iqra-island-N.apk`, which you can **install on your own phone** to test first

Every run raises the version code automatically (it uses the run number), so each new upload to Play is accepted.

## 4. Create the app in Play Console
1. Go to <https://play.google.com/console> and sign up as a developer (one-time US$25). Then choose **Create app**.
   - App name: `Iqra Island: Arabic for Kids`, Language: English, App, Free.
2. **Setup → App signing:** keep **Google Play App Signing** (the default). Your upload key is what the workflow signs with.
3. Fill in **Store listing** and **App content** using `store/listing.md`, which has every answer. Upload the images from `store/`.

## 5. Testing, then production
- Upload the .aab to **Testing → Internal testing** first and install it from Play on your own devices.
- **New personal developer accounts must run a closed test before going public:** at least **12 testers** opted in for **14 days in a row**, using **Testing → Closed testing**. Family and friends with Android phones count. After that, Play unlocks **Production**.
- Then **Production → Create new release**, upload the latest .aab and roll out. The first review usually takes a few days. Apps for children are reviewed against the Families policy.

## 6. Publish the privacy policy (required)
Play needs a public URL. The simplest option is GitHub Pages:
- Make a small **public** repo (for example `iqra-island-privacy`), upload `privacy-policy.html` renamed to `index.html`, then go to **Settings → Pages → Deploy from branch (main)**.
- The URL will look like `https://YOUR-USERNAME.github.io/iqra-island-privacy/`. Paste it into Play Console.
- First replace `[your support email]` in the file with your support email.

## Updating the app later
Replace `www/index.html` (and `www/audio/` if audio changed) with the new build. Commit, then **Run workflow** again and upload the new .aab to Play.

## Building on your own computer instead (optional)
Needs Node 22+, JDK 21 and Android Studio (Otter 2025.2 or newer):
```bash
npm install
npm run fonts            # bundle fonts offline (optional)
npx cap add android
npm run android:assets
npx cap sync android
VERSION_CODE=1 VERSION_NAME=1.0.0 node scripts/prepare-android.mjs
npx cap open android     # then Build → Generate Signed App Bundle, using the upload key
```

## What the build changes for Play
- `compileSdk` and `targetSdk` are **36**, and `minSdk` is 24 (Android 7.0+).
- `allowBackup=false`, so children's progress isn't copied to cloud backups.
- Fonts are bundled inside the app, so it works offline and makes no requests to Google Fonts.
- Text-to-speech uses the device's built-in engine through `@capacitor-community/text-to-speech`.
- The Android **back button** closes pop-ups, goes back one screen, pauses games, and exits from the home screen.
- The layout respects notches and the edge-to-edge system bars on Android 15 and 16.

## Before you publish
- Check that you have permission to distribute the **Qur'an recitation audio** in `www/audio`. If it came from a recitation website, confirm its terms allow use inside an app.
- Test on at least one real phone and one tablet with an **Arabic text-to-speech voice** installed (Settings → Text-to-speech → Google → Install voice data → Arabic).
