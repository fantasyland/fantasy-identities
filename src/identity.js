const daggy = require('daggy');
const {identity} = require('fantasy-combinators');

const Identity = daggy.tagged('x');

// Methods
Identity.of = Identity;
Identity.prototype.chain = function(f) {
    return f(this.x);
};

// Derived
Identity.prototype.map = function(f) {
    return this.chain((a) => Identity.of(f(a)));
};
Identity.prototype.ap = function(a) {
    return this.chain((f) => a.map(f));
};

Identity.prototype.sequence = function(p) {
    return this.traverse(identity, p);
};
Identity.prototype.traverse = function(f, p) {
    return f(this.x).map(Identity.of);
};

// Transformer
Identity.IdentityT = (M) => {
    const IdentityT = daggy.tagged('run');
    IdentityT.lift = IdentityT;
    IdentityT.of = (a) => IdentityT(M.of(a));
    IdentityT.prototype.chain = function(f) {
        return IdentityT(this.run.chain((x) => f(x).run));
    };
    IdentityT.prototype.map = function(f) {
        return this.chain((a) => IdentityT.of(f(a)));
    };
    IdentityT.prototype.ap = function(a) {
        return this.chain((f) => a.map(f));
    };
    return IdentityT;
};

// Export
if(typeof module != 'undefined')
    module.exports = Identity;
