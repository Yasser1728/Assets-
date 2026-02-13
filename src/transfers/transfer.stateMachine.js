module.exports = {
  created: ['processing', 'cancelled'],
  processing: ['broadcasted', 'completed', 'failed'],
  broadcasted: ['confirmed', 'failed'],
  confirmed: ['completed']
};
