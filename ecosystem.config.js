module.exports = {
  apps : [{
    name: "logicalreconfigurator",
    script: "./backend.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
