# 1. Limpia la caché y los archivos de build
rm -rf node_modules
rm -rf package-lock.json
rm -rf android/build
rm -rf android/.gradle
rm -rf android/app/build

# 2. Limpia la caché de npm
npm cache clean --force

# 3. Configura las variables de entorno
export NODE_ENV=production
# CHANGE THIS ANDROID_NDK_HOME
export ANDROID_NDK_HOME=/Users/admin/Library/Android/sdk/ndk/28.0.12916984 

# 4. Reinstala las dependencias
npm install --legacy-peer-deps

# 5. Agrega el flag para saltar la verificación de fingerprint
export EAS_SKIP_AUTO_FINGERPRINT=1

# 6. Intenta el build nuevamente
npm run build:local:android:apk