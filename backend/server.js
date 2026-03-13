const express = require('express');
const cors = require('cors');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes'); 
const busStopRoutes = require('./routes/busStopRoutes');
const routeStopRoutes = require('./routes/routeStopRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes); 
app.use('/api/bus-stops', busStopRoutes);
app.use('/api/route-stops', routeStopRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});