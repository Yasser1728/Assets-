const axios = require("axios");
const config = require("../config/pi.config");

class PiPayoutService {

  async sendPayment({ userUid, amount, memo }) {

    const response = await axios.post(
      `${config.baseURL}/payments`,
      {
        amount,
        memo,
        uid: userUid
      },
      {
        headers: {
          Authorization: `Key ${config.apiKey}`
        }
      }
    );

    return response.data;
  }

  async checkPayment(paymentId) {
    const response = await axios.get(
      `${config.baseURL}/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Key ${config.apiKey}`
        }
      }
    );

    return response.data;
  }

}

module.exports = new PiPayoutService();
