module.exports = {
  apps : [{
    name: "logicalreconfigurator",
    script: "./serve-demo.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
