// Debug script untuk memeriksa konfigurasi Firebase
// Jalankan dengan: node debug-firebase.js

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Firebase Configuration Debug');
console.log('================================');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = value ? 
    (varName.includes('API_KEY') ? `${value.substring(0, 10)}...` : value) : 
    'NOT SET';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!value) allSet = false;
});

console.log('\n📋 Summary:');
if (allSet) {
  console.log('✅ All Firebase environment variables are set!');
  console.log('🔗 Next step: Verify HTTP referrers in Google Cloud Console');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('📝 Please update your .env.local file');
}

console.log('\n🌐 Current Environment:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('Current URL: Check your Firebase Studio URL');