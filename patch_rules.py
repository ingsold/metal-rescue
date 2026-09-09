import re

with open('firestore.rules', 'r') as f:
    content = f.read()

old_orders = """    match /orders/{orderId} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if isSignedIn() && incoming().userId == request.auth.uid;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }"""

new_orders = """    match /orders/{orderId} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if isSignedIn() && incoming().userId == request.auth.uid;
      allow update: if isAdmin() || (
        isOwner(resource.data.userId) &&
        incoming().diff(existing()).affectedKeys().hasOnly(['status', 'paymentReceiptUrl']) &&
        incoming().status == 'verificando_pago' &&
        incoming().paymentReceiptUrl is string
      );
      allow delete: if isAdmin();
    }"""

content = content.replace(old_orders, new_orders)

with open('firestore.rules', 'w') as f:
    f.write(content)
