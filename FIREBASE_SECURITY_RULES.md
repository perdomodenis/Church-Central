# Firebase Security Rules Configuration

Para que la aplicación funcione correctamente, necesitas actualizar las reglas de seguridad en Firebase Realtime Database.

## ¿Cómo Actualizar las Reglas?

### 1. Ve a Firebase Console
- Abre: https://console.firebase.google.com
- Selecciona tu proyecto
- Ve a **Realtime Database** → **Rules**

### 2. Reemplaza las Reglas Actuales

Copia y pega las siguientes reglas:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid"
      }
    },
    "feed": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$postId": {
        ".read": true,
        ".write": "root.child('feed').child($postId).child('authorId').val() === auth.uid || !root.child('feed').child($postId).exists()"
      }
    },
    "events": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$eventId": {
        ".read": true,
        ".write": "root.child('events').child($eventId).child('createdBy').val() === auth.uid || !root.child('events').child($eventId).exists()"
      }
    },
    "baptisms": {
      ".read": "auth != null",
      ".write": "auth != null",
      "events": {
        ".read": true,
        ".write": "auth != null"
      },
      "registrations": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "chats": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    },
    "groups": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$groupId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "messages": {
          ".read": "auth != null",
          ".write": "auth != null"
        }
      }
    },
    "churchInfo": {
      ".read": true,
      ".write": false
    },
    ".read": false,
    ".write": false
  }
}
```

### 3. Haz Click en "Publicar"

Una vez que pegues las reglas, haz clic en el botón **"Publish"** para aplicarlas.

---

## ¿Qué Permiten Estas Reglas?

✅ **Users**: Cada usuario puede leer/escribir solo su propia información
✅ **Feed**: Usuarios autenticados pueden leer y crear posts
✅ **Events**: Usuarios autenticados pueden crear/modificar eventos
✅ **Baptisms**: Usuarios autenticados pueden registrarse para bautismos
✅ **Chats**: Usuarios autenticados pueden crear y enviar mensajes
✅ **Groups**: Usuarios autenticados pueden crear grupos y mensajes
✅ **Church Info**: Todos pueden leer información pública de la iglesia

---

## Pasos para Aplicar las Reglas

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. Click en **Realtime Database** en el menú izquierdo
4. Click en la pestaña **Rules**
5. **Borra el contenido actual** (Ctrl+A, Delete)
6. **Pega las nuevas reglas** (Ctrl+V)
7. Click en **Publish** (botón azul arriba a la derecha)
8. Espera a que aparezca el mensaje "✓ Rules updated"

---

## Verificación

Después de actualizar las reglas, la app debe funcionar sin errores de permiso:

✅ Puedes crear chats
✅ Puedes enviar mensajes
✅ Puedes crear eventos
✅ Puedes registrarte para bautismos
✅ Puedes cargar los datos de producción

---

## ⚠️ Importante

- **NO hagas `.read: true` y `.write: true` para todo** - Eso permitiría que cualquiera (incluso sin autenticar) lea y escriba datos
- Las reglas actuales requieren autenticación para la mayoría de operaciones
- Esto es seguro para una app en producción

---

## Si Seguirás Teniendo Errores

Si después de actualizar las reglas seguirás teniendo errores, verifica:

1. **Autenticación**: ¿Estás logueado en la app?
2. **Console**: Abre Developer Tools → Console para ver el error exacto
3. **Firebase Status**: Verifica que Firebase esté funcionando en https://status.firebase.google.com

---

**Una vez hagas estos cambios, todo debería funcionar correctamente.** ✅
