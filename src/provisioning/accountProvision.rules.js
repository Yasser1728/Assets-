exports.validateProvision = (accounts) => {

  if (!accounts || accounts.length === 0) {
    throw new Error('No account types defined');
  }

};
