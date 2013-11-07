var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    daggy = require('daggy'),
    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Identity = require('../fantasy-identities'),

    identity = combinators.identity,

    inc = function(x) {
        return x + 1;
    },
    equals = function(a) {
        return function(b) {
            return a.x === b.x;
        };
    },

    /* Id is here *only* for testing purposes */
    Id = daggy.tagged('value'),

    isId = helpers.isInstanceOf(Id),
    isIdentity = helpers.isInstanceOf(Identity),
    isIdOf = helpers.isInstanceOf(idOf),
    isIdentityOf = helpers.isInstanceOf(identityOf);

Id.of = Id;
Id.prototype.traverse = function(f, p) {
    return p.of(f(this.value));
};

function idOf(type) {
    var self = this.getInstance(this, idOf);
    self.type = type;
    return self;
}

function identityOf(type) {
    var self = this.getInstance(this, identityOf);
    self.type = type;
    return self;
}

λ = λ
    .property('idOf', idOf)
    .method('arb', isIdOf, function(a, b) {
        return Id.of(this.arb(a.type, b - 1));
    })
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    });

// Applicative Functor tests
exports.applicative = {
    'Identity (Applicative)': applicative.identity(λ)(Identity),
    'Composition (Applicative)': applicative.composition(λ)(Identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Identity),
    'Interchange (Applicative)': applicative.interchange(λ)(Identity)
};

// Functor tests
exports.functor = {
    'Identity (Functor)': functor.identity(λ)(Identity.of),
    'Composition (Functor)': functor.composition(λ)(Identity.of)
};

// Monad tests
exports.monad = {
    'Left Identity (Monad)': monad.leftIdentity(λ)(Identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Identity),
    'Associativity (Monad)': monad.associativity(λ)(Identity)
};

// Manual tests
exports.identity = {
    'when testing traverse should return correct value': λ.check(
        function(a) {
            return equals(a.traverse(identity, Identity))(a);
        },
        [λ.identityOf(Number)]
    ),
    'when testing sequence should return correct type': λ.check(
        function(a) {
            return isId(a.sequence());
        },
        [λ.identityOf(λ.idOf(Number))]
    ),
    'when testing sequence should return correct nested type': λ.check(
        function(a) {
            return isIdentity(a.sequence().value);
        },
        [λ.identityOf(λ.idOf(Number))]
    ),
    'when testing sequence should return correct value': λ.check(
        function(a) {
            return a.sequence().value.x === a.x.value;
        },
        [λ.identityOf(λ.idOf(Number))]
    )
};
