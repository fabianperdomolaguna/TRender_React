// COnfiguracion e inicializacion de la base de datos
import { initializeApp } from 'firebase/app'
// Referencia a la base de datos
import { getFirestore } from 'firebase/firestore'
// Referencia al paquete de autenticacion
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// Metodos de interaccion con la base de datos
import { addDoc, collection, getDocs, query, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDf5UIMl-yWAgMAMxVNodeh2mOcQf6R5dM",
    authDomain: "trender-8bed4.firebaseapp.com",
    projectId: "trender-8bed4",
    storageBucket: "trender-8bed4.appspot.com",
    messagingSenderId: "777425251936",
    appId: "1:777425251936:web:c6bd4adf8823049cda1d05",
    measurementId: "G-BMEV2H4T6M"
};

initializeApp(firebaseConfig);
const database = getFirestore();
export const auth = getAuth();
export let usuario;

// Guardar base de datos
export const guardarDatabase = async (nombreColeccion, data) => {

  try {
    const respuesta = await addDoc(collection(database, nombreColeccion), data)
    //console.log(respuesta);
    return respuesta
  } catch (e) {
    throw new Error(e)
  }
}
  
// getAll()
export const consultarDatabase = async (nombreColeccion) => {
  try {
    const respuesta = await getDocs(query(collection(database, nombreColeccion)))
    // console.log(respuesta);
  
    const coleccionDatos = respuesta.docs.map((documento) => {
      // console.log(documento);
      // console.log(documento.data());
      const documentoTemporal = {
        id: documento.id,
        ...documento.data()
      }
      // console.log(documentoTemporal);
      return documentoTemporal
    })
  
    return coleccionDatos
  } catch (e) {
    throw new Error(e)
  }
}
  
// gteDocumentById()
// Consultar un documento
export const consultarDocumentoDatabase = async (nombreColeccion, id) => {
  try {
    const respuesta = await getDoc(doc(database, nombreColeccion, id))
    // console.log(respuesta);
  
    const documentoTemporal = {
      id: respuesta.id,
      ...respuesta.data()
    }
  
    //console.log(documentoTemporal);
    return documentoTemporal
  } catch (e) {
    throw new Error(e)
  }
}
  
  // Edicion de un documento
export const actualizarDocumentoDatabase = async (nombreColeccion, id, data) => {
  try {
    const respuesta = await updateDoc(doc(database, nombreColeccion, id), data)
    console.log(respuesta);
  } catch (e) {
    throw new Error(e)
  }
}
  
// Eliminacion de un documento
export const eliminarDocumentoDatabase = async (nombreColeccion, id) => {
  try {
    const respuesta = await deleteDoc(doc(database, nombreColeccion, id))
    console.log(respuesta);
  } catch (e) {
    throw new Error(e)
  }
}
  
// CrearUsuarios
export const crearUsuario = async (email, password, nombre,rol,estado) => {
  try {
    const credencialesUsuario = await createUserWithEmailAndPassword(auth, email, password)
    const user = {
      correo: credencialesUsuario.user.email,
      nombre,
      rol,
      estado
    }
    guardarDatabase('usuarios', user)
    return user
  } catch (e) {
    throw new Error(e)
  }
}
  
// Login Usuarios
export const loginUsuario = async (email, password) => {
  try {
    const credencialesUsuario = await signInWithEmailAndPassword(auth, email, password)
    // console.log(credencialesUsuario);
    // console.log(credencialesUsuario.user);
    // console.log(credencialesUsuario.user.uid);
    // const user = {
    //   id: credencialesUsuario.user.uid,
    //   email: credencialesUsuario.user.email
    // }
    // usuario = user
  
    return credencialesUsuario.user
  } catch (e) {
    throw new Error(e)
  }
}
  
  
// LogOut -> salir
export const logOutUsuario = async () => {
  try {
    const respuesta = await signOut(auth)
    console.log(respuesta);
    console.log('Me sali...!');
  } catch (e) {
    throw new Error(e)
  }
}
  
//  datos usuario
export const datosUsuario = async () => {
  try {
    const user = auth.currentUser
    console.log(user);
  
    if (user) {
      console.log(user);
      return user
    } else {
      console.log('datos usuario:', user);
      return undefined
    }
  
  } catch (e) {
    throw new Error(e)
  }
}

// el.addEventListener('click', function)
// Usuario Activo
onAuthStateChanged(auth, (user) => {

  if (user) {
    usuario = user
    console.log('El usuario logueado');
  } else {
    console.log('El usuario ya no esta logueado');
    usuario = undefined
  }

})