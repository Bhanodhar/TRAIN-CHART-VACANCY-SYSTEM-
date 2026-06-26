const generatePNR = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 9000 + 1000).toString();
  return timestamp + random;
};

module.exports = generatePNR;