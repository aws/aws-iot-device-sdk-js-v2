cp ../../../samples/node/gg_ipc/artifacts/com.amazon.RpcTest/1.0.0/index.ts .
cp ../../../utils/run_in_ci.py .
cp ../../../.github/workflows/ci_run_greengrass_ipc_cfg.json .
cp -r ../../../samples/util .

npm install @types/ws@8.5.4
npm install --install-links
npm pack
