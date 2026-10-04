IQRA ISLAND: GOOGLE PLAY UPLOAD KEY
===================================
KEEP THIS FILE AND iqra-island-upload.jks PRIVATE. Do NOT put them in GitHub or share them.
Save a copy somewhere safe (for example a password manager plus a USB stick).

Keystore file : iqra-island-upload.jks
Key alias     : upload
Store password: obU5b56BKmW36C2Wmw1sYc
Key password  : obU5b56BKmW36C2Wmw1sYc   (same as the store password)
Certificate   : CN=Mohamed Mustafa, O=Iqra Island, L=Brisbane, ST=Queensland, C=AU
Valid until   : Wed Sep 27 07:49:41 AEST 2056
SHA-256       : 64:72:3D:CF:FA:40:FB:12:AE:3F:30:5D:A5:CA:66:15:B6:97:F3:83:1E:C9:6F:F3:13:B2:21:07:CF:1D:84:BD

GITHUB SECRETS (repo > Settings > Secrets and variables > Actions > New repository secret)
  ANDROID_KEYSTORE_BASE64   = the whole content of keystore-base64.txt (one long line)
  ANDROID_KEYSTORE_PASSWORD = obU5b56BKmW36C2Wmw1sYc
  ANDROID_KEY_ALIAS         = upload
  ANDROID_KEY_PASSWORD      = obU5b56BKmW36C2Wmw1sYc

This is your UPLOAD key. Google Play App Signing keeps the real app-signing key.
If you ever lose this upload key, Play Console lets you request an upload key reset
(Setup > App signing), so the app itself is never lost.
