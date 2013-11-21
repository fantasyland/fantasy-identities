var λ = require('fantasy-check/src/adapters/nodeunit'),
    applicative = require('fantasy-check/src/laws/applicative'),
    functor = require('fantasy-check/src/laws/functor'),
    monad = require('fantasy-check/src/laws/monad'),

    helpers = require('fantasy-helpers'),
    combinators = require('fantasy-combinators'),
    Identity = require('../fantasy-identities'),

    identity = combinators.identity,

    equals = function(a) {
        return function(b) {
            return a.x === b.x;
        };
    },

    isIdentity = helpers.isInstanceOf(Identity),
    isIdentityOf = helpers.isInstanceOf(identityOf);

function identityOf(type) {
    var self = this.getInstance(this, identityOf);
    self.type = type;
    return self;
}

λ = λ
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    });

exports.identity = {

    // Applicative Functor tests
    'Identity (Applicative)': applicative.identity(λ)(Identity),
    'Composition (Applicative)': applicative.composition(λ)(Identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Identity),
    'Interchange (Applicative)': applicative.interchange(λ)(Identity),

    // Functor tests
    'Identity (Functor)': functor.identity(λ)(Identity.of),
    'Composition (Functor)': functor.composition(λ)(Identity.of),

    // Monad tests
    'Left Identity (Monad)': monad.leftIdentity(λ)(Identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Identity),
    'Associativity (Monad)': monad.associativity(λ)(Identity),

    // Manual tests    
    'when testing traverse should return correct value': λ.check(
        function(a) {
            return equals(a.traverse(identity, Identity))(a);
        },
        [λ.identityOf(Number)]
    ),
    'when testing sequence should return correct type': λ.check(
        function(a) {
            return isIdentity(a.sequence());
        },
        [λ.identityOf(λ.identityOf(Number))]
    ),
    'when testing sequence should return correct nested type': λ.check(
        function(a) {
            return isIdentity(a.sequence().x);
        },
        [λ.identityOf(λ.identityOf(Number))]
    ),
    'when testing sequence should return correct value': λ.check(
        function(a) {
            return a.sequence().x.x === a.x.x;
        },
        [λ.identityOf(λ.identityOf(Number))]
    )
};

exports.identityT = {

    // Applicative Functor tests
    'Identity (Applicative)': applicative.identity(λ)(Identity.IdentityT(Identity)),
    'Composition (Applicative)': applicative.composition(λ)(Identity.IdentityT(Identity)),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Identity.IdentityT(Identity)),
    'Interchange (Applicative)': applicative.interchange(λ)(Identity.IdentityT(Identity)),

    // Functor tests
    'Identity (Functor)': functor.identity(λ)(Identity.IdentityT(Identity).of),
    'Composition (Functor)': functor.composition(λ)(Identity.IdentityT(Identity).of),

    // Monad tests
    'Left Identity (Monad)': monad.leftIdentity(λ)(Identity.IdentityT(Identity)),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Identity.IdentityT(Identity)),
    'Associativity (Monad)': monad.associativity(λ)(Identity.IdentityT(Identity))
};
