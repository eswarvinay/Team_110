// Mock In-Memory Database for testing when MongoDB is unavailable
class MockDB {
  constructor() {
    this.users = new Map();
    this.counter = 1;
  }

  async findUserByEmail(email) {
    return this.users.get(email) || null;
  }

  async saveUser(email, userData) {
    if (!userData._id) {
      userData._id = `mock-${this.counter++}`;
    }
    const user = { ...userData, email, createdAt: new Date(), updatedAt: new Date() };
    this.users.set(email, user);
    return user;
  }

  async updateUser(email, updates) {
    const user = this.users.get(email);
    if (!user) return null;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(email, updated);
    return updated;
  }

  async getUserById(id) {
    for (let user of this.users.values()) {
      if (user._id === id || user._id?.toString() === id) return user;
    }
    return null;
  }

  async updateUserById(id, updates) {
    for (let [email, user] of this.users) {
      if (user._id === id || user._id?.toString() === id) {
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.users.set(email, updated);
        return updated;
      }
    }
    return null;
  }
}

module.exports = new MockDB();
