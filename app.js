/**
 * Namecheap / cPanel Node.js Application Wrapper
 * This file acts as the primary entry point for Phusion Passenger on Namecheap.
 * It delegates execution directly to the compiled server within the /dist folder.
 */

// Import and execute the compiled production server
require('./dist/server.cjs');
