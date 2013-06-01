var daggy = require('daggy'),
    Identity = daggy.tagged('x');

// Methods
Identity.of = Identity;
Identity.prototype.chain = function(f) {
    return f(this.x);
};

// Derived
Identity.prototype.map = function(f) {
    return this.chain(function(a) {
        return Identity.of(f(a));
    });
};
Identity.prototype.ap = function(a) {
    return this.chain(function(f) {
        return a.map(f);
    });
};

// Transformer
Identity.IdentityT = function(M) {
    var IdentityT = daggy.tagged('run');
    IdentityT.lift = IdentityT;
    IdentityT.of = function(a) {
        return IdentityT(M.of(a));
    };
    IdentityT.prototype.chain = function(f) {
        return IdentityT(this.run.chain(function(x) {
            return f(x).run;
        }));
    };
    IdentityT.prototype.map = function(f) {
        return this.chain(function(a) {
            return IdentityT.of(f(a));
        });
    };
    IdentityT.prototype.ap = function(a) {
        return this.chain(function(f) {
            return a.map(f);
        });
    };
    return IdentityT;
};

// Export
if(typeof module != 'undefined')
    module.exports = Identity;
