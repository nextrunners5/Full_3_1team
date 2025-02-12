export const requestPayment = async (paymentData: PaymentRequest) => {
  const response = await axios.post('/api/payments/request', paymentData);
  return response.data;
};
