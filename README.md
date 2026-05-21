# NeoDial
# 📥 Download APK

If you just want to try the app, download the APK from [Releases](https://github.com/smdevji/NeoDial/releases).


A modern Android call log editor built with:

- Expo
- React Native
- Expo Router
- Tailwind CSS via NativeWind

---

# ✨ Features

- Add call logs
- Edit existing logs
- Delete call logs
- Backup call logs
- Restore call logs
- Modern green-themed UI
- Native Android call log access
- Contact auto creation support

---

# 💾 Backup & Restore

NeoDial supports:

- Creating local backups of call logs
- Restoring previously saved backups
- Import/export backup files

This allows users to safely preserve and restore their call history anytime.

---

# ⚠️ Important

This app uses native Android modules.

You MUST run:

```bash
npx expo prebuild
```

before running the app.

Otherwise the native Java/Kotlin files will not exist.

---

# 📦 Installation

## 1. Install dependencies

```bash
npm install
```

---

## 2. Generate native folders

```bash
npx expo prebuild
```

This creates:

```txt
android/
```

---

## 3. Add Native Android Files from prebuild-files folder

After prebuild, add these files:

---

## 📄 Add File

### `android/app/src/main/java/com/anonymous/NeoDial/CallLogModule.java`

Contains:
- add call log
- update call log
- delete call log
- contact creation

---

### `android/app/src/main/java/com/anonymous/NeoDial/CallLogPackage.java`

Registers the native module package.

---

# ✏️ Modify Existing Files

---

## 📄 Modify

### `android/app/src/main/AndroidManifest.xml`

Add permissions:

```xml
<uses-permission android:name="android.permission.READ_CALL_LOG"/>
<uses-permission android:name="android.permission.WRITE_CALL_LOG"/>
<uses-permission android:name="android.permission.READ_CONTACTS"/>
<uses-permission android:name="android.permission.WRITE_CONTACTS"/>
```

Also add custom scheme:

```xml
<data android:scheme="neodial"/>
```

---

## 📄 Modify

### `android/app/src/main/java/com/anonymous/NeoDial/MainApplication.kt`

Add:

```kotlin
import com.anonymous.NeoDial.CallLogPackage
```

Then register package:

```kotlin
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        add(CallLogPackage())
    }
```

---

## 📄 MainActivity.kt

No major changes needed besides keeping Expo prebuild defaults intact.

---

# ▶️ Run App

## Android

```bash
npx expo run:android
```

---

# 🔐 Permissions

The app requires:

| Permission | Reason |
|---|---|
| READ_CALL_LOG | Read call history |
| WRITE_CALL_LOG | Modify call logs |
| READ_CONTACTS | Read contacts |
| WRITE_CONTACTS | Create contacts |

---

# 🧠 If Native Code Changes Later

Whenever you:

- add new Java/Kotlin files
- change package names
- modify AndroidManifest
- add native modules

Do this:

---

## Step 1

```bash
npx expo prebuild --clean
```

---

## Step 2

Re-add your custom native files because `--clean` can overwrite them.

Files to restore:

```txt
CallLogModule.java
CallLogPackage.java
```

---

## Step 3

Re-apply modifications to:

```txt
AndroidManifest.xml
MainApplication.kt
```

---

# 📱 Recommended Development Flow

```bash
npm install

npx expo prebuild

npx expo run:android
```

To create release build:

```bash
npx expo run:android --variant release
```

---

# 🛠 Tech Stack

| Tech | Usage |
|---|---|
| React Native | Mobile app |
| Expo | App tooling |
| Expo Router | Routing |
| NativeWind | Tailwind styling |
| Java/Kotlin | Android native modules |

---

# ⚠️ Android Only

This project currently supports:

✅ Android

Not supported:
- iOS
- Web

because iOS restricts direct call log access.