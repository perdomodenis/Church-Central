# 🎉 Datos de Producción - Grace Community Church

La aplicación ahora está lista con datos reales de producción. Sigue estos pasos para ver la app en modo "live" con información realista.

## Pasos para Cargar Datos Reales

### 1️⃣ Inicia la Aplicación
```bash
cd frontend
npm start
```

### 2️⃣ Accede al Debug Screen
- Inicia sesión con cualquier cuenta
- Ve a **Settings** → **Debug** (última opción en el menú)

### 3️⃣ Carga los Datos de Producción
En el Debug Screen, haz clic en:
```
"Load Production Data (Grace Community Church)"
```

Esto agregará:
- ✅ Información completa de la iglesia
- ✅ 10 miembros reales con perfiles diversos
- ✅ 8 noticias/posts del feed
- ✅ 3 eventos de bautismo
- ✅ 9 eventos de la iglesia

### 4️⃣ Recarga la Página
Presiona `F5` o recarga manualmente para ver todos los datos

## 📊 Datos Agregados

### 🏢 Grace Community Church
- **Ubicación**: Denver, Colorado, USA
- **Servicios**: Domingos 10:00 AM
- **2 Campuses**: Main Campus & Downtown Campus
- **Fundada**: 2008

### 👥 Miembros (10 usuarios reales)
- **Senior Pastor**: James Peterson
- **Worship Pastor**: Rachel Thompson
- **Youth Director**: Juan Rivera
- **Community Outreach**: Sofia Garcia
- ...y 6 más con roles diversos

### 📰 Noticias (8 posts reales)
- Anuncios de servicios
- Eventos de la juventud
- Iniciativas comunitarias
- Solicitudes de oración
- Actividades educativas

### 🕊️ Bautismos (3 eventos)
- Junio (Main Campus)
- Julio (Downtown Campus)
- Junio (Youth Service)

### 📅 Eventos (9 actividades)
- Servicios de adoración (semanal)
- Grupos de oración (semanal)
- Escuela Bíblica de Verano
- Campamento de Juventud
- Drives comunitarios
- Y más...

## ✨ Características Activadas

Con los datos de producción, podrás ver:

- ✅ **Feed** con 8 posts reales con comentarios e interacciones
- ✅ **Schedule** con 9 eventos próximos
- ✅ **Baptism** con 3 eventos de bautismo
- ✅ **Members** con 10 perfiles reales y diversos
- ✅ **Settings** funcionando en 4 idiomas
- ✅ Información real de la iglesia en toda la app

## 🔄 Alternativas

Si quieres volver a datos de prueba, puedes hacer clic en:
```
"Add 5 Test Users (Demo Data)"
```

En el Debug Screen para restaurar los datos de prueba originales.

## 📱 Usuarios Predefinidos para Prueba

Después de cargar datos de producción, puedes iniciar sesión como:

| Email | Nombre | Rol |
|-------|--------|-----|
| pastor.james@gracecommunity.church | James Peterson | Senior Pastor |
| pastor.rachel@gracecommunity.church | Rachel Thompson | Worship Pastor |
| juan.rivera@email.com | Juan Rivera | Youth Director |
| sofia.garcia@email.com | Sofia Garcia | Outreach Coordinator |

**Nota**: Algunos emails pueden no funcionar para login si no están registrados en Firebase Auth. En ese caso, crea nuevas cuentas normalmente - aparecerán en la lista de miembros.

## 🎯 Pruebas Recomendadas

1. **Ver Noticias Reales**: Feed Screen → Verás 8 posts con comentarios reales
2. **Ver Eventos**: Schedule → 9 eventos programados
3. **Registrarse para Bautismo**: Baptism Screen → Registra a 3 eventos
4. **Buscar Miembros**: Members → Busca por nombre a los 10 miembros reales
5. **Cambiar Idioma**: Settings → Selecciona Español, Alemán o Francés
6. **Ver Perfil**: Click en cualquier miembro para ver su perfil completo

## 🛠️ Notas Técnicas

- Los datos se guardan en **Firebase Realtime Database** en `/feed`, `/events`, `/baptisms`, `/users`
- Los datos son **públicos** (accesibles a cualquier usuario autenticado)
- Puedes agregar, editar o eliminar datos directamente desde la app
- Los cambios se reflejan en tiempo real gracias a los listeners de Firebase

---

**La aplicación está lista para verse como una instalación en producción real.** 🚀
