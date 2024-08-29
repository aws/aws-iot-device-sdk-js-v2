cp ../../../samples/node/basic_discovery/index.ts .
cp ../../../utils/run_in_ci.py .
cp ../../../.github/workflows/ci_run_greengrass_discovery_cfg.json .

npm install --install-links
npm pack
