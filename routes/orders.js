// src/routes/orders.js
const express  = require('express');
const router   = express.Router();
const admin    = require('../config/firebase'); // firebase-admin ya inicializado
const authMiddleware  = require('../middlewares/AuthMiddleware');
const ownerMiddleware = require('../middlewares/OwnerMiddleware');
const { notifyOrderStatus } = require('../services/PushService');

const db = admin.firestore();

const VALID_STATUSES = ['NUEVO', 'ACCEPTED', 'PREPARING', 'DELIVERY', 'COMPLETE', 'CANCELLED'];

// ── PATCH /orders/:businessId/:orderId/status ──────────────────────────────────
// El dueño cambia el estado → actualiza Firestore → push al cliente
router.patch('/:businessId/:orderId/status', authMiddleware, ownerMiddleware, async (req, res) => {
    const { businessId, orderId } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Status inválido. Válidos: ${VALID_STATUSES.join(', ')}` });
    }

    // Verificar que el negocio pertenece al owner autenticado
    if (req.user.restaurantId?.toString() !== businessId) {
        return res.status(403).json({ error: 'No tienes permiso sobre este negocio' });
    }

    try {
        const orderRef = db
            .collection('businesses').doc(businessId)
            .collection('orders').doc(orderId);

        const snap = await orderRef.get();
        if (!snap.exists) return res.status(404).json({ error: 'Pedido no encontrado' });

        const order = snap.data();

        // Actualizar Firestore
        await orderRef.update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Enviar push — no bloqueante, un fallo aquí no rompe la respuesta
        if (order.expoPushToken) {
            notifyOrderStatus(order.expoPushToken, status, {
                businessId,
                orderId,
                customerToken: order.customerToken,
            }).catch(err => console.warn('[Push] Fallo no crítico:', err.message));
        }

        res.json({ ok: true, status });

    } catch (error) {
        console.error('Error actualizando pedido:', error);
        res.status(500).json({ error: error.message });
    }
});

// ── GET /orders/:businessId — pedidos del negocio (para el panel del dueño) ───
router.get('/:businessId', authMiddleware, ownerMiddleware, async (req, res) => {
    const { businessId } = req.params;

    if (req.user.restaurantId?.toString() !== businessId) {
        return res.status(403).json({ error: 'No tienes permiso sobre este negocio' });
    }

    try {
        const snap = await db
            .collection('businesses').doc(businessId)
            .collection('orders')
            .orderBy('createdAt', 'desc')
            .get();

        const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;