require('dotenv').config();
const admin = require('firebase-admin');
const { ethers } = require('ethers');

// Configuración de Firebase
const serviceAccount = require('../credentials/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://buildathon1-default-rtdb.firebaseio.com'
});

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/5f3bec6a892e41a79f4d4194800661ces');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x7be1122077bd8a5ca929b7fa34852d4cd21809593fac1346b2cf75e7ac65c527', provider);
const contractAddress = process.env.CONTRACT_ADDRESS || '0x48aB02Ac1a1a72556bfFFc1672B5608dDB6decE4';
// ABI del contrato
const contractABI = require('../out/COData.sol/COData.json').abi;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Escuchar cambios en Firebase
const db = admin.database();
const ref = db.ref('/santacruz/ppm');

ref.on('value', async (snapshot) => {
  const co_ugm3 = snapshot.val();
  if (co_ugm3 !== null) {
    console.log(`Nuevo valor de CO: ${co_ugm3} µg/m³`);

    try {
      const tx = await contract.addReading(Math.floor(co_ugm3));
      console.log('Transacción enviada. Hash:', tx.hash);
      await tx.wait();
      console.log('Transacción confirmada');
    } catch (error) {
      console.error('Error al enviar transacción:', error);
    }
  }
}, (error) => {
  console.error('Error al escuchar Firebase:', error);
});