

import { nebulaConnect, addTray, addSlip } from 'nebula-db1';

const main = async () => {
    // MongoDB connection URI
    const uri = 'your-mongodb-connection-uri';

    // Connect to MongoDB
    await nebulaConnect(uri);
    console.log('Connected to MongoDB');

    // Define a tray (collection) schema
    const traySchemaDefinition = {
        name: { type: String, required: true },
        description: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    };

    // Add a new tray (collection)
    const trayName = 'TestTray';
    addTray(trayName, traySchemaDefinition);
    console.log(`Tray ${trayName} added`);

    // Add a new slip (document) to the tray (collection)
    const slipData = { name: 'Test Slip', description: 'This is a test slip' };
    const newSlip = await addSlip(trayName, slipData);
    console.log('New slip added:', newSlip);
};

// Execute the main function
main().catch(error => {
    console.error('Error:', error);
});
