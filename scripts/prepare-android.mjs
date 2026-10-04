// Runs after `npx cap add android` + `npx cap sync android`.
// - Forces compileSdk/targetSdk >= 36 (Google Play requirement from 31 Aug 2026)
// - Sets versionCode / versionName from the environment
// - Adds a release signing config that reads the upload key from environment variables
// - Locks down the manifest (no backup of children's data, TTS engine visibility)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const MIN_TARGET = 36;
const vc = parseInt(process.env.VERSION_CODE || "1", 10);
const vn = (process.env.VERSION_NAME || "1.0.0").replace(/^v/, "");

// 1) SDK levels
const varsPath = "android/variables.gradle";
let vars = readFileSync(varsPath, "utf8");
for (const key of ["compileSdkVersion", "targetSdkVersion"]) {
  vars = vars.replace(new RegExp(`(${key}\\s*=\\s*)(\\d+)`), (all, p, n) => (+n < MIN_TARGET ? p + MIN_TARGET : all));
}
writeFileSync(varsPath, vars);
console.log(vars.match(/(compileSdkVersion|targetSdkVersion|minSdkVersion)\s*=\s*\d+/g).join("\n"));

// 2) version + signing (appended block; Gradle merges multiple android {} blocks)
const gPath = "android/app/build.gradle";
let g = readFileSync(gPath, "utf8");
if (!g.includes("// IQRA-RELEASE-CONFIG")) {
  g += `
// IQRA-RELEASE-CONFIG
android {
    defaultConfig {
        versionCode ${vc}
        versionName "${vn}"
    }
    signingConfigs {
        release {
            storeFile file(System.getenv("IQRA_KEYSTORE_FILE") ?: "upload.jks")
            storePassword System.getenv("IQRA_KEYSTORE_PASSWORD")
            keyAlias System.getenv("IQRA_KEY_ALIAS") ?: "upload"
            keyPassword System.getenv("IQRA_KEY_PASSWORD") ?: System.getenv("IQRA_KEYSTORE_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
`;
  writeFileSync(gPath, g);
}
console.log(`versionCode ${vc}, versionName ${vn}`);

// 3) manifest tweaks
const mPath = "android/app/src/main/AndroidManifest.xml";
let mf = readFileSync(mPath, "utf8");
if (!mf.includes("TTS_SERVICE")) {
  mf = mf.replace(/<application/, `<queries>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n    </queries>\n\n    <application`);
}
mf = mf.replace(/android:allowBackup="true"/, 'android:allowBackup="false"');
writeFileSync(mPath, mf);
console.log("Manifest prepared.");
if (!existsSync("android/app/src/main/assets/public/index.html")) { console.error("Web app not copied into Android project!"); process.exit(1); }
