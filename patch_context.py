import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# 1. Import Ally
content = content.replace("import { GoldenSetEvaluation, Product, ShelterDelivery, Event, User, AppNotification, AuthenticityStatus, Order } from '../types';", "import { GoldenSetEvaluation, Product, ShelterDelivery, Event, User, AppNotification, AuthenticityStatus, Order, Ally } from '../types';")

# 2. Add to AppState interface
interface_target = "  deliveries: ShelterDelivery[];"
content = content.replace(interface_target, interface_target + "\n  allies: Ally[];")

methods_target = "  cancelEvent: (id: string) => Promise<void>;"
new_methods = """  cancelEvent: (id: string) => Promise<void>;
  
  // Deliveries Admin
  addDelivery: (delivery: Omit<ShelterDelivery, 'id'>) => Promise<void>;
  editDelivery: (id: string, updated: Partial<ShelterDelivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  
  // Allies Admin
  addAlly: (ally: Omit<Ally, 'id'>) => Promise<void>;
  editAlly: (id: string, updated: Partial<Ally>) => Promise<void>;
  deleteAlly: (id: string) => Promise<void>;"""
content = content.replace(methods_target, new_methods)

# 3. Add to provider state
state_target = "  const [deliveries, setDeliveries] = useState<ShelterDelivery[]>([]);"
content = content.replace(state_target, state_target + "\n  const [allies, setAllies] = useState<Ally[]>([]);")

# 4. Add snapshot listener for allies
snapshot_target = """    const unsubDeliveries = onSnapshot(collection(db, 'deliveries'), (snapshot) => {
      setDeliveries(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShelterDelivery)));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'deliveries'));"""

new_snapshot = snapshot_target + """

    const unsubAllies = onSnapshot(collection(db, 'allies'), (snapshot) => {
      setAllies(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Ally)));
    }, (err) => handleFirestoreError(err, OperationType.GET, 'allies'));"""
content = content.replace(snapshot_target, new_snapshot)

# And add unsubAllies to the return array
unsub_target = "return () => {\n      unsubProducts();\n      unsubDeliveries();"
content = content.replace(unsub_target, unsub_target + "\n      unsubAllies();")

# 5. Add CRUD methods
crud_target = """  const cancelEvent = async (id: string) => {
    try {
      await updateDoc(doc(db, 'events', id), { estado: 'cancelado' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `events/${id}`);
    }
  };"""

new_crud = crud_target + """

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
  };"""
content = content.replace(crud_target, new_crud)

# 6. Add to context provider value
value_target = "user, products, deliveries, events, notifications, allUsers, cart, orders,"
content = content.replace(value_target, value_target + " allies,")

value_methods_target = "addEvent, editEvent, deleteEvent, cancelEvent,"
content = content.replace(value_methods_target, value_methods_target + "\n      addDelivery, editDelivery, deleteDelivery,\n      addAlly, editAlly, deleteAlly,")

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)

