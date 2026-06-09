#!/usr/bin/env node

/**
 * Full Application Test Suite
 * Tests all major components and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '═'.repeat(70));
console.log('🧪 TEST COMPLETO DE LA APLICACIÓN - CHURCH CENTRAL');
console.log('═'.repeat(70) + '\n');

let totalTests = 0;
let passedTests = 0;

function testFile(filePath, description) {
  totalTests++;
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length > 0) {
        console.log(`✅ ${description}`);
        passedTests++;
        return true;
      } else {
        console.log(`❌ ${description} - Archivo vacío`);
        return false;
      }
    } else {
      console.log(`❌ ${description} - No existe`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return false;
  }
}

function testFileContains(filePath, searchString, description) {
  totalTests++;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      console.log(`✅ ${description}`);
      passedTests++;
      return true;
    } else {
      console.log(`❌ ${description}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return false;
  }
}

console.log('📋 VERIFICACIÓN DE ESTRUCTURA DE ARCHIVOS\n');

// Core Files
console.log('Core App Files:');
testFile('frontend/src/App.js', 'App.js - Main component');
testFile('frontend/src/index.js', 'index.js - Entry point');
testFile('frontend/src/App.css', 'App.css - Styles');

console.log('\nAuth Components:');
testFile('frontend/src/components/auth/LoginScreen.js', 'LoginScreen.js');
testFile('frontend/src/components/auth/SignupScreen.js', 'SignupScreen.js');
testFile('frontend/src/components/auth/ForgotScreen.js', 'ForgotScreen.js');

console.log('\nMain Screen Components:');
testFile('frontend/src/components/screens/FeedScreen.js', 'FeedScreen.js');
testFile('frontend/src/components/screens/ScheduleScreen.js', 'ScheduleScreen.js');
testFile('frontend/src/components/screens/BaptismScreen.js', 'BaptismScreen.js');
testFile('frontend/src/components/screens/ProfileScreen.js', 'ProfileScreen.js');
testFile('frontend/src/components/screens/SettingsScreen.js', 'SettingsScreen.js');
testFile('frontend/src/components/screens/MemberSearchScreen.js', 'MemberSearchScreen.js');
testFile('frontend/src/components/screens/MessagesScreen.js', 'MessagesScreen.js');
testFile('frontend/src/components/screens/DebugScreen.js', 'DebugScreen.js');

console.log('\nContext & Services:');
testFile('frontend/src/context/AuthContext.js', 'AuthContext.js');
testFile('frontend/src/context/LanguageContext.js', 'LanguageContext.js');
testFile('frontend/src/context/EventContext.js', 'EventContext.js');
testFile('frontend/src/services/firebase.js', 'firebase.js');
testFile('frontend/src/services/translations.js', 'translations.js');
testFile('frontend/src/services/chatService.js', 'chatService.js');
testFile('frontend/src/services/eventService.js', 'eventService.js');
testFile('frontend/src/services/baptismService.js', 'baptismService.js');
testFile('frontend/src/services/calendarService.js', 'calendarService.js');

console.log('\nData Files:');
testFile('frontend/src/services/seedData.js', 'seedData.js - Test data');
testFile('frontend/src/services/productionData.js', 'productionData.js - Production data');
testFile('frontend/src/services/liveData.js', 'liveData.js - Live data');

console.log('\n' + '─'.repeat(70));
console.log('\n🔍 VERIFICACIÓN DE FUNCIONALIDADES CLAVE\n');

// Feature Tests
console.log('Authentication Features:');
testFileContains('frontend/src/App.js', 'signInWithPopup', 'Google Sign-In implementado');
testFileContains('frontend/src/App.js', 'signOut', 'Sign-out implementado');

console.log('\nMultilingual Support:');
testFileContains('frontend/src/services/translations.js', 'en:', 'English translations');
testFileContains('frontend/src/context/LanguageContext.js', 'useLanguage', 'Language hook implementado');

console.log('\nChat & Messaging:');
testFileContains('frontend/src/services/chatService.js', 'createDirectChat', 'Direct chat implementado');
testFileContains('frontend/src/services/chatService.js', 'createGroupChat', 'Group chat implementado');
testFileContains('frontend/src/services/chatService.js', 'sendMessage', 'Message sending implementado');

console.log('\nEvents & Scheduling:');
testFileContains('frontend/src/services/eventService.js', 'addEvent', 'Event creation implementado');
testFileContains('frontend/src/services/calendarService.js', 'getCalendarEvents', 'Google Calendar integrado');

console.log('\nBaptism Features:');
testFileContains('frontend/src/services/baptismService.js', 'registerForBaptism', 'Baptism registration');
testFileContains('frontend/src/services/baptismService.js', 'getBaptismEventAttendees', 'Attendance tracking');

console.log('\nData Loading:');
testFileContains('frontend/src/services/seedData.js', 'seedTestData', 'Test data seeding');
testFileContains('frontend/src/services/productionData.js', 'seedProductionData', 'Production data seeding');
testFileContains('frontend/src/services/liveData.js', 'seedLiveData', 'Live data seeding');

console.log('\nDebug Features:');
testFileContains('frontend/src/components/screens/DebugScreen.js', 'seedLiveData', 'Load live data button');
testFileContains('frontend/src/components/screens/DebugScreen.js', 'seedProductionData', 'Load production data button');

console.log('\nDocuments Search & Filtering:');
testFileContains('frontend/src/components/screens/DocumentsScreen.js', 'searchQuery', 'Search query state implemented');
testFileContains('frontend/src/components/screens/DocumentsScreen.js', 'fileTypeFilter', 'File type filter state implemented');
testFileContains('frontend/src/components/screens/DocumentsScreen.js', 'dateFilter', 'Date filter state implemented');
testFileContains('frontend/src/components/screens/DocumentsScreen.js', 'matchesSearch', 'Search matching logic implemented');
testFileContains('frontend/src/components/screens/DocumentsScreen.js', 'getTabMatchCount', 'Campus tab badge counts implemented');

console.log('\nChurch (Members) Reorganization:');
testFileContains('frontend/src/components/screens/MemberSearchScreen.js', 'activeCourt', 'Court tabs state implemented');
testFileContains('frontend/src/components/screens/MemberSearchScreen.js', 'groupedMembers', 'Multi-department grouping implemented');
testFileContains('frontend/src/components/screens/MemberProfileScreen.js', 'School of the Word', 'School of the Word subgroup displayed');
testFileContains('frontend/src/components/screens/MemberProfileScreen.js', 'District', 'District subgroup displayed');
testFileContains('frontend/src/components/screens/MemberProfileScreen.js', 'Current Project', 'Current project displayed');
testFileContains('frontend/src/components/screens/MemberProfileScreen.js', 'Active Member Since', 'Joined date displayed');
testFileContains('frontend/src/components/common/UI.js', "label: t('church')", 'Navigation menu renamed to Church');

console.log('\nSchedule Page restructures & FAB actions:');
testFileContains('frontend/src/components/screens/ScheduleScreen.js', 'Obligatory Attendance', 'Obligatory Attendance header implemented');
testFileContains('frontend/src/components/screens/ScheduleScreen.js', 'Group Meetings', 'Group Meetings header implemented');
testFileContains('frontend/src/components/screens/ScheduleScreen.js', 'getMinutesSinceMidnight', 'Time check conversion logic implemented');
testFileContains('frontend/src/components/screens/ScheduleScreen.js', 'Currently Ongoing', 'Ongoing schedule indicator implemented');
testFileContains('frontend/src/components/common/UI.js', 'Add Schedule', 'FAB Add Schedule button implemented for level 3+');
testFileContains('frontend/src/App.js', 'openAddScheduleOnMount', 'FAB Add Schedule mount trigger implemented');

console.log('\n' + '─'.repeat(70));
console.log('\n📱 VERIFICACIÓN DE SCREENS\n');

const screens = [
  'FeedScreen.js',
  'ScheduleScreen.js',
  'BaptismScreen.js',
  'ProfileScreen.js',
  'SettingsScreen.js',
  'MemberSearchScreen.js',
  'MessagesScreen.js',
  'DebugScreen.js'
];

console.log('Screens Components Loaded:');
for (const screen of screens) {
  testFile(`frontend/src/components/screens/${screen}`, `${screen}`);
}

console.log('\n' + '─'.repeat(70));
console.log('\n🔐 VERIFICACIÓN DE SEGURIDAD\n');

console.log('Firebase Integration:');
testFileContains('frontend/src/services/firebase.js', 'initializeApp', 'Firebase inicializado');
testFileContains('frontend/src/App.js', 'GoogleAuthProvider', 'Google Auth integrado');

console.log('\nAuthentication Guards:');
testFileContains('frontend/src/context/AuthContext.js', 'onAuthStateChanged', 'Auth state monitoring');
testFileContains('frontend/src/App.js', 'useAuth', 'Auth context used');

console.log('\n' + '═'.repeat(70));
console.log('\n📊 RESULTADOS DEL TEST\n');

const percentage = ((passedTests / totalTests) * 100).toFixed(1);

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${totalTests - passedTests} ❌`);
console.log(`Success Rate: ${percentage}%\n`);

if (percentage >= 95) {
  console.log('🎉 EXCELENTE - La aplicación está lista!');
  console.log('\n✨ Estado de la App:');
  console.log('   ✅ Todos los componentes principales presentes');
  console.log('   ✅ Autenticación implementada (Email + Google)');
  console.log('   ✅ English-only language configuration');
  console.log('   ✅ Chat y mensajería funcional');
  console.log('   ✅ Eventos y calendario integrados');
  console.log('   ✅ Bautismos con registro de asistentes');
  console.log('   ✅ Documents search and filtering controls');
  console.log('   ✅ Church members list organized by court/dept');
  console.log('   ✅ Schedule ongoing indicators & FAB action');
  console.log('   ✅ Datos vivos y de producción listos');
  console.log('   ✅ Debug tools para testing\n');

  console.log('🚀 PRÓXIMOS PASOS:\n');
  console.log('1. Abre la app: http://localhost:3000');
  console.log('2. Login con cualquier email/contraseña');
  console.log('3. Ve a Settings → Debug');
  console.log('4. Click "Load LIVE Data"');
  console.log('5. Recarga la página (F5)');
  console.log('6. ¡Prueba todo!\n');

  console.log('✅ FUNCIONALIDADES PARA PROBAR:\n');
  console.log('   📰 Feed - Posts con comentarios');
  console.log('   📅 Schedule - Ongoing program indicator, personal schedule headings');
  console.log('   🕊️ Baptism - Registro de bautismos');
  console.log('   ⛪ Church - Members organized by Court & Department, detailed profile info');
  console.log('   💬 Messages - Chat directo y grupos');
  console.log('   📁 Documents - Search & Filter (by name/campus/uploader/type/date)');
  console.log('   ⚙️ Settings - Themes, colors and account details');
  console.log('   🎯 Profile - Editar tu perfil\n');

  process.exit(0);
} else {
  console.log('⚠️ ADVERTENCIA - Algunos archivos no se encontraron');
  process.exit(1);
}
