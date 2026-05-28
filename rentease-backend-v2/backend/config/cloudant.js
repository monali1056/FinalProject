const { CloudantV1 }     = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

// ── Cloudant client ───────────────────────────────────────────────────────────
const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_API_KEY }),
  serviceUrl:    process.env.CLOUDANT_URL,
});

// ── Database names ─────────────────────────────────────────────────────────────
const DB = {
  USERS:         "rentease_users",
  PRODUCTS:      "rentease_products",
  BOOKINGS:      "rentease_bookings",
  NOTIFICATIONS: "rentease_notifications",
  PAYMENTS:      "rentease_payments",
  CONTACTS:      "rentease_contacts",
};

// ── Create index helper ───────────────────────────────────────────────────────
async function createIndex(db, fields) {
  try {
    await cloudant.postIndex({
      db,
      index: { fields },
      type: "json",
    });
  } catch (err) {
    // Ignore if index already exists
  }
}

// ── Auto-create DBs and indexes on startup ────────────────────────────────────
async function initDatabases() {
  for (const db of Object.values(DB)) {
    try {
      await cloudant.getDatabaseInformation({ db });
      console.log(`✅ IBM Cloudant DB ready: ${db}`);
    } catch (err) {
      if (err.status === 404) {
        await cloudant.putDatabase({ db });
        console.log(`✅ IBM Cloudant DB created: ${db}`);
      } else {
        console.error(`❌ Cloudant error (${db}):`, err.message);
      }
    }
  }

  // Create indexes for all databases so queries don't fail
  await createIndex(DB.USERS,         ["type", "email"]);
  await createIndex(DB.PRODUCTS,      ["type", "category"]);
  await createIndex(DB.BOOKINGS,      ["type", "userId", "status"]);
  await createIndex(DB.NOTIFICATIONS, ["type", "userId"]);
  await createIndex(DB.PAYMENTS,      ["type", "userId"]);
  await createIndex(DB.CONTACTS,      ["type"]);
  console.log("✅ Cloudant indexes ready");
}

initDatabases();

// ── CRUD helpers ──────────────────────────────────────────────────────────────

/** Save (create or update) a document */
async function saveDoc(db, doc) {
  const result = await cloudant.postDocument({ db, document: doc });
  return { ...doc, _id: result.result.id, _rev: result.result.rev };
}

/** Get a document by _id */
async function getDoc(db, id) {
  const result = await cloudant.getDocument({ db, docId: id });
  return result.result;
}

/** Delete a document */
async function deleteDoc(db, id, rev) {
  await cloudant.deleteDocument({ db, docId: id, rev });
}

/** Query documents with a Mango selector */
async function findDocs(db, selector, options = {}) {
  try {
    const result = await cloudant.postFind({
      db,
      selector,
      limit: options.limit || 100,
      skip:  options.skip  || 0,
      sort:  options.sort  || undefined,
      fields: options.fields || undefined,
    });
    return result.result.docs;
  } catch (err) {
    // Fallback to getAllDocs if postFind fails
    console.warn(`postFind failed for ${db}, falling back to getAllDocs:`, err.message);
    const all = await getAllDocs(db);
    return all.filter(doc => {
      return Object.entries(selector).every(([k, v]) => doc[k] === v);
    });
  }
}

/** Get all docs from a DB */
async function getAllDocs(db) {
  const result = await cloudant.postAllDocs({ db, includeDocs: true });
  return result.result.rows
    .map((r) => r.doc)
    .filter((d) => d && !d._id.startsWith("_"));
}

module.exports = { cloudant, DB, saveDoc, getDoc, deleteDoc, findDocs, getAllDocs };
