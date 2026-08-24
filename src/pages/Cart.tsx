import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, createOrder, user } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.precio_final_aprobado || 0), 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para finalizar tu compra.');
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    try {
      await createOrder(user.id, user.email, `${user.name} ${user.lastName || ''}`.trim());
      setOrderComplete(true);
      // Simulate Email sending
      console.log(`Email enviado a admin@metalrescue.org y ${user.email} con los detalles de la orden.`);
    } catch (error) {
      console.error(error);
      alert('Hubo un error procesando tu orden.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-4">¡ORDEN RECIBIDA!</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          Tus prendas han sido reservadas exitosamente. Hemos enviado un correo a ti y al administrador con los detalles de la compra y los pasos para el pago/entrega.
        </p>
        <Link 
          to="/catalogo"
          className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-8 py-3 rounded-md font-bold transition-colors inline-flex items-center gap-2"
        >
          Volver al Catálogo <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      <div className="border-b border-sabbath-800 pb-4">
        <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-sabbath-500" />
          TU CARRITO
        </h1>
        <p className="text-zinc-400">Revisa las prendas antes de finalizar la reserva.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-sabbath-900 border border-sabbath-800 rounded-xl">
          <ShoppingCart className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg mb-6">Tu carrito está vacío.</p>
          <Link 
            to="/catalogo"
            className="bg-sabbath-600 hover:bg-sabbath-500 text-white px-6 py-2 rounded-md font-bold transition-colors inline-block"
          >
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex bg-sabbath-900 border border-sabbath-800 rounded-xl overflow-hidden p-4 gap-4 items-center">
                <img src={item.imagen_url} alt={item.banda_artista} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white uppercase">{item.banda_artista}</h3>
                  <p className="text-zinc-400 text-sm">{item.tipo_prenda} {item.talla ? `• ${item.talla}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-display font-bold text-sabbath-400">Q{item.precio_final_aprobado}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-500 hover:text-red-500 text-sm flex items-center gap-1 justify-end w-full mt-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-80">
            <div className="bg-sabbath-900 border border-sabbath-800 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-sabbath-800 pb-4">Resumen de Orden</h3>
              <div className="flex justify-between items-center mb-6 text-lg">
                <span className="text-zinc-400">Total a donar:</span>
                <span className="font-display font-bold text-2xl text-sabbath-400">Q{total}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-sabbath-600 hover:bg-sabbath-500 disabled:bg-sabbath-800 disabled:text-zinc-500 text-white py-3 rounded-md font-bold transition-colors flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Procesando...' : 'Finalizar Reserva'}
              </button>
              <p className="text-xs text-zinc-500 mt-4 text-center">
                Al finalizar, se enviará un correo con los detalles para el pago y entrega.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
