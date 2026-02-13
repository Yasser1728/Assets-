class PaymentStateService {
  async validateTransition(fromState, toState) {
    const allowed = {
      'pending': ['user_approved','server_approved','failed','cancelled','expired'],
      'user_approved': ['server_approved','failed','expired'],
      'server_approved': ['broadcasted'],
      'broadcasted': ['confirmed','failed'],
      'confirmed': [],
      'failed': [],
      'cancelled': [],
      'expired': []
    };
    return allowed[fromState]?.includes(toState);
  }

  async logTransition({ orderId, attemptId, fromState, toState, reason }) {
    // INSERT INTO payment_state_logs
  }

  async updateState(entity, toState, reason) {
    // UPDATE entity.status + log
  }
}

module.exports = new PaymentStateService();
