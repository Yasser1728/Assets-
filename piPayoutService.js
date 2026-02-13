const axios = require("axios");

class PiPayoutService {

  constructor() {
    this.baseURL = "https://api.minepi.com/v2";
    this.apiKey = process.env.PI_API_KEY;
  }

  async sendPayment({ userUid, amount, memo }) {

    try {

      const response = await axios.post(
        `${this.baseURL}/payments`,
        {
          amount,
          memo,
          uid: userUid
        },
        {
          headers: {
            Authorization: `Key ${this.apiKey}`
          }
        }
      );

      return response.data;

    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }

  }

}

module.exports = new PiPayoutService();
