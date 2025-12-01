
import { Property, BuyerInterest, LeadMatch, StorageData, User, PropertyStatus } from '../types';

const STORAGE_KEY = 'BARRA_BUSINESS_DB';

// Super Admin Credentials
const ADMIN_EMAIL = 'wgmimovel@gmail.com';
const ADMIN_PASS = 'Chupanas007!';

const getDB = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  let db: StorageData;

  if (!data) {
    db = { properties: [], interests: [], matches: [], users: [] };
  } else {
    db = JSON.parse(data);
    // Ensure users array exists for legacy data
    if (!db.users) db.users = [];
  }

  // Ensure Super Admin exists and credentials are up to date
  const adminIndex = db.users.findIndex(u => u.id === 'super-admin-001');
  
  if (adminIndex !== -1) {
    // Update existing admin credentials to match constants
    db.users[adminIndex].email = ADMIN_EMAIL;
    db.users[adminIndex].password = ADMIN_PASS;
  } else {
    // Create if doesn't exist
    db.users.push({
      id: 'super-admin-001',
      name: 'Administrador Master',
      email: ADMIN_EMAIL,
      password: ADMIN_PASS,
      role: 'ADMIN',
      createdAt: Date.now()
    });
  }
  
  // Persist the update immediately so Auth service sees the correct data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

  return db;
};

const saveDB = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// --- Properties ---
export const addProperty = (property: Property) => {
  const db = getDB();
  // Ensure status is set to PENDING for new registrations
  const newProperty = { ...property, status: 'PENDING' as PropertyStatus };
  db.properties.push(newProperty);
  saveDB(db);
};

export const getProperties = (): Property[] => {
  const db = getDB();
  // Map legacy properties (missing status) to APPROVED so they don't disappear
  return db.properties.map(p => ({
    ...p,
    status: p.status || 'APPROVED'
  }));
};

export const updatePropertyStatus = (id: string, status: PropertyStatus) => {
  const db = getDB();
  // Ensure we compare IDs as strings to avoid type mismatches
  const index = db.properties.findIndex(p => String(p.id) === String(id));
  if (index !== -1) {
    db.properties[index].status = status;
    saveDB(db);
  } else {
    console.error(`Property with ID ${id} not found.`);
  }
};

export const removeProperty = (id: string) => {
  const db = getDB();
  db.properties = db.properties.filter(p => String(p.id) !== String(id));
  saveDB(db);
};

export const togglePropertyFeatured = (id: string) => {
  const db = getDB();
  const index = db.properties.findIndex(p => String(p.id) === String(id));
  if (index !== -1) {
    // Toggle boolean, defaulting to false if undefined
    const current = !!db.properties[index].isFeatured;
    db.properties[index].isFeatured = !current;
    saveDB(db);
  }
};

// --- Interests ---
export const addInterest = (interest: BuyerInterest) => {
  const db = getDB();
  db.interests.push(interest);
  saveDB(db);
  return interest.id;
};

export const getInterests = (): BuyerInterest[] => {
  return getDB().interests;
};

// --- Matches ---
export const addMatch = (match: LeadMatch) => {
  const db = getDB();
  const exists = db.matches.some(m => m.propertyId === match.propertyId && m.buyerContact === match.buyerContact);
  if (!exists) {
    db.matches.push(match);
    saveDB(db);
  }
};

export const getMatches = (): LeadMatch[] => {
  return getDB().matches;
};

export const updateMatchStatus = (matchId: string, status: 'PENDING' | 'CONTACTED' | 'CLOSED') => {
  const db = getDB();
  const matchIndex = db.matches.findIndex(m => m.id === matchId);
  if (matchIndex !== -1) {
    db.matches[matchIndex].status = status;
    saveDB(db);
  }
};

// --- Users ---
export const getUsers = (): User[] => {
  return getDB().users;
};

export const addUser = (user: User) => {
  const db = getDB();
  // Check if email already exists
  if (db.users.some(u => u.email === user.email)) {
    throw new Error("E-mail já cadastrado.");
  }
  db.users.push(user);
  saveDB(db);
};

export const removeUser = (userId: string) => {
  const db = getDB();
  // Prevent deleting the super admin
  const userToDelete = db.users.find(u => u.id === userId);
  if (userToDelete && userToDelete.id === 'super-admin-001') {
    throw new Error("Não é possível remover o Administrador Principal.");
  }
  db.users = db.users.filter(u => u.id !== userId);
  saveDB(db);
};
