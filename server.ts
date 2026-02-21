import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("restaurant.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    name TEXT,
    description TEXT,
    price TEXT
  );

  CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    alt TEXT,
    title TEXT
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    date TEXT,
    guests TEXT,
    requirements TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const menuCount = db.prepare("SELECT COUNT(*) as count FROM menu_items").get() as { count: number };
if (menuCount.count === 0) {
  const insertMenu = db.prepare("INSERT INTO menu_items (category, name, description, price) VALUES (?, ?, ?, ?)");
  insertMenu.run("Entrées", "Smoked Atlantic Scallops", "With fermented parsnip purée and brown butter emulsion", "28");
  insertMenu.run("Plats Principaux", "Wagyu Beef Rossini", "Foie gras, truffle jus, and local heritage carrots", "64");
  insertMenu.run("Plats Principaux", "Roasted Wild Sea Bass", "Champagne velouté, caviar, and sea succulents", "48");
}

const galleryCount = db.prepare("SELECT COUNT(*) as count FROM gallery_images").get() as { count: number };
if (galleryCount.count === 0) {
  const insertGallery = db.prepare("INSERT INTO gallery_images (url, alt, title) VALUES (?, ?, ?)");
  insertGallery.run("https://lh3.googleusercontent.com/aida-public/AB6AXuBgfW82niTFxVqPjDWA4M90BNMM_gBK4B4-49VTMqvydcALqWZ5ribPD_78VPU_RlZ69ld1rNaR9WpR7hnVkyuqUGZMT8Acf_rOjL3LGUY_Bn76zDhIyWURFFO-4RC2VrnuE8Xbch8jk7NdGo9ZBNxdACGEKV9WR-hmQuyArlKPEgbS2Z3I2rgmfBgZC6g_0-klyIknMU1f1P-dKWTJAf4y0HC0YlL6xj1KRo8kuvMdMgJaolcxk19MvgpjaiRn4j7870vJA3-0UTsE", "Gourmet dish presentation", "Signature Sea Bass");
  insertGallery.run("https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6tnjdHZT7fp-suIXFoaJasIol7zbGoO695N9yupDvzDOqKgQOtYbFcz8nz2E2CfqRBy17xKPMPk8k0exaPSYlAofRQwTHGe22-INOrekE3zEYC5tpF1X0VzhKoYITEennXqmduJo2SwfWGZA-boMbNkw7xgaQNyXEvAEm75i6oaU21vSnN4xwKMF2Vef4KRy4Hb5ILXtaFXNsWAJFdtPhct0yDyroMPoO6-O300BxkEuWXVukAA5avm8_7iwZvuOJHwumiKr46bX", "Restaurant interior seating", "");
  insertGallery.run("https://lh3.googleusercontent.com/aida-public/AB6AXuD5RUptQJCmqc1KTW9TXQP027wdLHNTIhiu8O8g9l47Ly7GlRcLOhBidflrJk_B1NEa_nxZmInrioQwK_eEuHXUIgjztL4u2sO898dtK6R4tt0nMTygcvfA6b5F0fH1EZmP3_rg4zYwKaHcAG2BH7ZVP7u3FzIWrFhquhhbD0lKn5Mfxw15rbUr_C4mHMhIQ1AUd4K22KMp_tvwOn6BUgadNNyqHpT18mxC0zSoQ-BhKZhXo4RxaqoJRTI7Th8_sr5ibhVMp6t_Ewds", "Chef plating food", "");
  insertGallery.run("https://lh3.googleusercontent.com/aida-public/AB6AXuB0FDxe4lGS8ef940eqXVBbpZtardqbe1HfI4sz45fxYzy_N2u19USe0uytat3V3qxPCQ3fFsMmd2r5eKF6YsMVXBoffw_64kuClSed4g_AqSigJi0mgp4ds8zeN1w8XfwQtSTh_X2DMjmgqugVFSNFjViPAynrXBv7Ezh20Q96-aZ1S0SK1za2iAAMphYyChdEMdEv5DqQaAAXbS6NZBJFD5NyCsUkJnimxvTLW-FIQT6IVxigc-wf7x4lcpYSkCusZR6jDZdecEO_", "Cocktails at the bar", "");
}

const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("address", "128 Noir Boulevard, Gastronomy District, Paris 75001");
  insertSetting.run("phone", "+33 (0) 1 23 45 67 89");
  insertSetting.run("email", "contact@easternoriental.com");
  insertSetting.run("hours_mon_thu", "17:00 - 23:00");
  insertSetting.run("hours_fri_sat", "17:00 - 01:00");
  insertSetting.run("hours_sun", "Closed");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "password123";

    if (username === adminUser && password === adminPass) {
      res.json({ success: true, token: "fake-jwt-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.get("/api/menu", (req, res) => {
    const items = db.prepare("SELECT * FROM menu_items").all();
    res.json(items);
  });

  app.post("/api/menu", (req, res) => {
    const { category, name, description, price } = req.body;
    const info = db.prepare("INSERT INTO menu_items (category, name, description, price) VALUES (?, ?, ?, ?)").run(category, name, description, price);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/menu/:id", (req, res) => {
    const { category, name, description, price } = req.body;
    db.prepare("UPDATE menu_items SET category = ?, name = ?, description = ?, price = ? WHERE id = ?").run(category, name, description, price, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/menu/:id", (req, res) => {
    db.prepare("DELETE FROM menu_items WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/gallery", (req, res) => {
    const items = db.prepare("SELECT * FROM gallery_images").all();
    res.json(items);
  });

  app.get("/api/reservations", (req, res) => {
    const items = db.prepare("SELECT * FROM reservations ORDER BY created_at DESC").all();
    res.json(items);
  });

  app.post("/api/reservations", (req, res) => {
    const { name, email, date, guests, requirements } = req.body;
    const info = db.prepare("INSERT INTO reservations (name, email, date, guests, requirements) VALUES (?, ?, ?, ?, ?)").run(name, email, date, guests, requirements);
    res.json({ id: info.lastInsertRowid });
  });

  app.patch("/api/reservations/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const items = db.prepare("SELECT * FROM settings").all();
    const settings = (items as { key: string; value: string }[]).reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(settings);
  });

  app.put("/api/settings", (req, res) => {
    const settings = req.body;
    const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(settings)) {
      update.run(key, value);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
