const express = require('express');
const cors = require('cors');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes'); 
const busStopRoutes = require('./routes/busStopRoutes');
const routeStopRoutes = require('./routes/routeStopRoutes');
const staffRoutes = require('./routes/staffRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const issueRoutes = require('./routes/issueRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes); 
app.use('/api/bus-stops', busStopRoutes);
app.use('/api/route-stops', routeStopRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/issues', issueRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});