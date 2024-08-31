const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'sample-data.json');

async function readDataFile() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

app.get('/api/products', async (req, res) => {
  try {
    const products = await readDataFile();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/search', async (req, res) => {
  const { name, type } = req.query;
  try {
    const products = await readDataFile();
    const filteredProducts = products.filter(product => {
      const nameMatch = !name || product.name.toLowerCase().includes(name.toLowerCase());
      const typeMatch = !type || product.type === type;
      return nameMatch && typeMatch;
    });
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));