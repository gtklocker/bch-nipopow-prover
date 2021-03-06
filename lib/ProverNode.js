const bcash = require('bcash');
const {fromRev, revHex} = require('bcash/lib/utils/util');
const pEvent = require('p-event');

const Interlink = require('./Interlink');
const Prover = require('./Prover');

const MARKED_BLOCK_HASH =
  fromRev('00000000000001934669a81ecfaa64735597751ac5ca78c4d8f345f11c2237cf');
const VELVET_FORK_MARKER = 'interlink';
const RESET_HEIGHT = 1257602;

module.exports = class ProverNode extends bcash.SPVNode {
  constructor(opts) {
    super(opts);
    this.prover = new Prover();
  }

  async connect() {
    this.pool.watch(Buffer.from(VELVET_FORK_MARKER));
    await super.connect();
  }

  async startProving() {
    this._setCallbacks();
    if (this.chain.height > RESET_HEIGHT) {
      await this.chain.reset(RESET_HEIGHT);
      console.log('chain height reset to %d', RESET_HEIGHT);
    }
  }

  _setCallbacks() {
    this.on('block', this.prover.onBlock);
    this.on('error', err => { console.log('fuck this', err); });
  }
};
