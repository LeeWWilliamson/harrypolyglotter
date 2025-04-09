const express = require('express');
const app = express();
const indexRoutes = require('./routes/index');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', indexRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
