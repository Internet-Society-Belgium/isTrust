// @peculiar/x509 (used by the certificate checks) depends on tsyringe, which
// requires the reflect-metadata polyfill to be loaded first. The apps import it
// at their entrypoints; tests need the same.
import "reflect-metadata";
