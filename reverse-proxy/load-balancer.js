class loadBalancer {
  constructor(node) {
    this.node = node;
  }

  getAddress() {
    this.node.lbCounter++;
    if (this.node.lbCounter > this.node.proxy_to.length - 1) {
      this.node.lbCounter = 0;
    }
    return this.node.proxy_to[this.node.lbCounter];
  }
}

module.exports = loadBalancer;
