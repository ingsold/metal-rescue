import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoldenSetEvaluation, Product, ShelterDelivery, Event, User, AppNotification, AuthenticityStatus, Order, Ally, OrderStatus } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, writeBatch, deleteField } from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';

interface AppState {
  user: User | null;
deliveries: ShelterDelivery[];
  allies: Ally[];
  events: Event[];
  notifications: AppNotification[];
  allUsers: User[]; // Admin only
  cart: Product[];
  orders: Order[];
  
  // Auth methods
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, lastName: string, email: string, username: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Profile
  updateProfile: (data: { name: string; lastName: string; username: string; direccion?: string; telefono?: string }) => Promise<void>;
  
  // Admin User Management
  fetchAllUsers: () => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'disabled') => Promise<void>;
  updateUserRole: (userId: string, role: 'donante' | 'administrador') => Promise<void>;
  
  // App Methods
  addGoldenSetEvaluation: (evalData: Omit<GoldenSetEvaluation, "id_muestra" | "fecha_evaluacion">) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => Promise<string>;
  updateProductStatus: (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => Promise<void>;
deleteProduct: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'estado'>) => Promise<void>;
  editEvent: (id: string, updatedEvent: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  cancelEvent: (id: string) => Promise<void>;
  
  // Deliveries Admin
  addDelivery: (delivery: Omit<ShelterDelivery, 'id'>) => Promise<void>;
  editDelivery: (id: string, updated: Partial<ShelterDelivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  
  // Allies Admin
  addAlly: (ally: Omit<Ally, 'id'>) => Promise<void>;
  editAlly: (id: string, updated: Partial<Ally>) => Promise<void>;
  deleteAlly: (id: string) => Promise<void>;
  markNotificationsAsRead: (userId: string) => Promise<void>;
  
  // Cart & Orders
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (userId: string, userEmail: string, userName: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentReceiptUrl?: string) => Promise<void>;
  submitPaymentReceipt: (orderId: string, receiptUrl: string) => Promise<void>;
  
  isLoading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
const [deliveries, setDeliveries] = useState<ShelterDelivery[]>([]);
  const [allies, setAllies] = useState<Ally[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            // Check if disabled
            if (userData.status === 'disabled') {
              console.error("User is disabled");
              await signOut(auth);
              setUser(null);
            } else {
              setUser({ id: userDoc.id, ...userData });
            }
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Usuario',
              email: firebaseUser.email || '',
              role: 'donante',
              status: 'active'
            });
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, 'users');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Listeners
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    unsubs.push(
      onSnapshot(collection(db, 'events'), (snapshot) => {
        setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Event)));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'events'))
    );
    unsubs.push(
      onSnapshot(collection(db, 'deliveries'), (snapshot) => {
        setDeliveries(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShelterDelivery)));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'deliveries'))
    );

    unsubs.push(
      onSnapshot(collection(db, 'allies'), (snapshot) => {
        setAllies(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ally)));
      }, (err) => handleFirestoreError(err, OperationType.GET, 'allies'))
    );
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  // Products Listener (Separated by role for Security Rules)
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(collection(db, 'notifications'), where('userId', '==', user.id));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'notifications'));
    return () => unsub();
  }, [user]);

  // Auth Methods
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        let generatedUsername = firebaseUser.email?.split('@')[0] || `user_${Date.now()}`;
        const usernameRef = doc(db, 'usernames', generatedUsername);
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
          generatedUsername = `${generatedUsername}_${Math.floor(Math.random()*10000)}`;
        }

        const newUser: Omit<User, 'id'> & { createdAt: string } = {
          name: firebaseUser.displayName || 'Usuario',
          lastName: '',
          username: generatedUsername,
          email: firebaseUser.email || '',
          role: firebaseUser.email === 'admin@metalrescue.org' ? 'administrador' : 'donante',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newUser);
        await setDoc(doc(db, 'usernames', generatedUsername), { uid: firebaseUser.uid });
      } else {
        if (userDoc.data().status === 'disabled') {
          await signOut(auth);
          throw new Error('Tu cuenta ha sido deshabilitada.');
        }
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userRef = doc(db, 'users', cred.user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().status === 'disabled') {
        await signOut(auth);
        throw new Error('Tu cuenta ha sido deshabilitada.');
      }
    } catch (error) {
      console.error("Email login failed", error);
      throw error;
    }
  };

  const registerWithEmail = async (name: string, lastName: string, email: string, username: string, pass: string) => {
    try {
      // Check username uniqueness
      const usernameRef = doc(db, 'usernames', username);
      const usernameSnap = await getDoc(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser: Omit<User, 'id'> & { createdAt: string } = {
        name,
        lastName,
        username,
        email,
        role: email === 'admin@metalrescue.org' ? 'administrador' : 'donante',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), newUser);
      await setDoc(doc(db, 'usernames', username), { uid: cred.user.uid });
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Reset password failed", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data: { name: string; lastName: string; username: string; direccion?: string; telefono?: string }) => {
    if (!user) return;
    try {
      // Check username uniqueness if changed
      if (data.username !== user.username) {
        const usernameRef = doc(db, 'usernames', data.username);
        const usernameSnap = await getDoc(usernameRef);
        if (usernameSnap.exists()) {
          throw new Error('El nombre de usuario ya está en uso');
        }
      }

      await updateDoc(doc(db, 'users', user.id), data);
      
      // Update username in collection if changed
      if (data.username !== user.username) {
        if (user.username) {
          await deleteDoc(doc(db, 'usernames', user.username));
        }
        await setDoc(doc(db, 'usernames', data.username), { uid: user.id });
      }

      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Update profile failed", error);
      throw error;
    }
  };

  // Admin User Management
  const fetchAllUsers = async () => {
    if (user?.role !== 'administrador') return;
    try {
      const q = collection(db, 'users');
      const snapshot = await getDocs(q);
      setAllUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    } catch (error) {
      console.error("Fetch users failed", error);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'disabled') => {
    if (user?.role !== 'administrador') return;
    try {
      await updateDoc(doc(db, 'users', userId), { status });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch (error) {
      console.error("Update status failed", error);
    }
  };

  const updateUserRole = async (userId: string, role: 'donante' | 'administrador') => {
    if (user?.role !== 'administrador') return;
    try {
      await updateDoc(doc(db, 'users', userId), { role });
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (error) {
      console.error("Update role failed", error);
    }
  };

  // Content Methods
  const addGoldenSetEvaluation = async (evalData: Omit<GoldenSetEvaluation, "id_muestra" | "fecha_evaluacion">) => {
    try {
      const docRef = doc(collection(db, "evaluaciones_golden_set"));
      const id_muestra = docRef.id;
      await setDoc(docRef, {
        ...evalData,
        id_muestra,
        fecha_evaluacion: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving Golden Set Evaluation", e);
    }
  };
  const addProduct = async (newProdData: Omit<Product, 'id' | 'estado_publicacion' | 'fecha_donacion' | 'usuario_donante_id' | 'usuario_donante_nombre'> & { usuario_donante_id?: string, usuario_donante_nombre?: string }) => {
    if (!user) return;
    
    const newProduct: Omit<Product, 'id'> = {
      ...newProdData,
      estado_publicacion: 'borrador_pendiente',
      fecha_donacion: new Date().toISOString(),
      usuario_donante_id: newProdData.usuario_donante_id || user.id,
      usuario_donante_nombre: newProdData.usuario_donante_nombre || user.name,
    };
    const id = `p_${Date.now()}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
      return id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'products');
      throw e;
    }
  };

  
  const updateProductStatus = async (id: string, status: Product['estado_publicacion'], finalPrice?: number, marketingDesc?: string) => {
    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) return;
      const product = productSnap.data() as Product;

      const updates: any = { estado_publicacion: status };
      if (finalPrice !== undefined) updates.precio_final_aprobado = finalPrice;
      if (marketingDesc !== undefined) updates.descripcion_marketing = marketingDesc;
      if (status === 'vendido') updates.fecha_venta = new Date().toISOString();

      await updateDoc(productRef, updates);

      if (finalPrice !== undefined) {
        try {
          const evalQuery = query(collection(db, 'evaluaciones_golden_set'), where('producto_id', '==', id));
          const evalDocs = await getDocs(evalQuery);
          if (!evalDocs.empty) {
            await updateDoc(evalDocs.docs[0].ref, { precio_final_aprobado: finalPrice });
          }
        } catch (err) {
          console.error("Error updating Golden Set final price", err);
        }
      }

      if (status === 'vendido' && product.estado_publicacion !== 'vendido') {
        const notifId = `n_${Date.now()}`;
        const newNotif: Omit<AppNotification, 'id'> = {
          userId: product.usuario_donante_id,
          message: `¡Tu prenda "${product.banda_artista}" se ha vendido por Q${finalPrice || product.precio_final_aprobado}! Has ayudado a un refugio.`,
          read: false,
          date: new Date().toISOString()
        };
        await setDoc(doc(db, 'notifications', notifId), newNotif);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'products');
    }
  };

  const addEvent = async (newEventData: Omit<Event, 'id' | 'estado'>) => {
    const id = `e_${Date.now()}`;
    try {
      await setDoc(doc(db, 'events', id), { ...newEventData, estado: 'activo' });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'events');
    }
  };

  const editEvent = async (id: string, updatedEvent: Partial<Event>) => {
    try {
      await updateDoc(doc(db, 'events', id), updatedEvent);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'events');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'events');
    }
  };

  const cancelEvent = async (id: string) => {
    try {
      await updateDoc(doc(db, 'events', id), { estado: 'cancelado' });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'events');
    }
  };

  const addDelivery = async (delivery: Omit<ShelterDelivery, 'id'>) => {
    try {
      const id = `del_${Date.now()}`;
      await setDoc(doc(db, 'deliveries', id), delivery);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'deliveries');
    }
  };

  const editDelivery = async (id: string, updated: Partial<ShelterDelivery>) => {
    try {
      await updateDoc(doc(db, 'deliveries', id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `deliveries/${id}`);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'deliveries', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `deliveries/${id}`);
    }
  };

  const addAlly = async (ally: Omit<Ally, 'id'>) => {
    try {
      const id = `ally_${Date.now()}`;
      await setDoc(doc(db, 'allies', id), ally);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'allies');
    }
  };

  const editAlly = async (id: string, updated: Partial<Ally>) => {
    try {
      await updateDoc(doc(db, 'allies', id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `allies/${id}`);
    }
  };

  const deleteAlly = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'allies', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `allies/${id}`);
    }
  };

  const markNotificationsAsRead = async (userId: string) => {
    try {
      const unread = notifications.filter(n => n.userId === userId && !n.read);
      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'notifications');
    }
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    if (!cart.find(p => p.id === product.id)) {
      setCart(prev => [...prev, product]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Orders Logic
  const createOrder = async (userId: string, userEmail: string, userName: string) => {
    try {
      const orderId = `o_${Date.now()}`;
      const total = cart.reduce((sum, item) => sum + (item.precio_final_aprobado || 0), 0);
      
      const newOrder: Order = {
        id: orderId,
        userId,
        userEmail,
        userName,
        items: cart,
        total,
        status: 'pendiente',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'orders', orderId), newOrder);

      // Update products status to 'reservada'
      for (const item of cart) {
        await updateDoc(doc(db, 'products', item.id), { estado_publicacion: 'reservada' });
      }

      clearCart();
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'orders');
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      let q: any = collection(db, 'orders');
      if (user.role !== 'administrador') {
        q = query(q, where('userId', '==', user.id));
      }
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(d => d.data() as Order).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Fetch orders failed", error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentReceiptUrl?: string) => {
    if (user?.role !== 'administrador') {
      throw new Error('No tienes permisos de administrador.');
    }
    try {
      const updateData: any = { status };
      if (paymentReceiptUrl) {
        updateData.paymentReceiptUrl = paymentReceiptUrl;
      }
      await updateDoc(doc(db, 'orders', orderId), updateData);
      
      const order = orders.find(o => o.id === orderId);
      if (order) {
        if (status === 'lista') {
          for (const item of order.items) {
            await updateProductStatus(item.id, 'vendido', item.precio_final_aprobado);
          }
        } else if (status === 'cancelada') {
          for (const item of order.items) {
            await updateProductStatus(item.id, 'aprobado_publicado');
          }
        }
      }
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o));
    } catch (error: any) {
      console.error("Update order status failed", error);
      throw error;
    }
  };

  const submitPaymentReceipt = async (orderId: string, receiptUrl: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión');
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: 'verificando_pago',
        paymentReceiptUrl: receiptUrl
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'verificando_pago', paymentReceiptUrl: receiptUrl } : o));
    } catch (error) {
      console.error("Error al subir boleta:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, deliveries, events, notifications, allUsers, cart, orders, allies,
      loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword, logout,
      updateProfile, fetchAllUsers, updateUserStatus, updateUserRole,
      addGoldenSetEvaluation,
      addProduct, updateProductStatus, deleteProduct, addEvent, editEvent, deleteEvent, cancelEvent,
      addDelivery, editDelivery, deleteDelivery,
      addAlly, editAlly, deleteAlly, markNotificationsAsRead, 
      addToCart, removeFromCart, clearCart, createOrder, fetchOrders, updateOrderStatus, submitPaymentReceipt,
      isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
