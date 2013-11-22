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

function run(a) {
    return a.run;
}

λ = λ
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    });

exports.identity = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λ)(Identity, identity),
    'Identity (Applicative)': applicative.identity(λ)(Identity, identity),
    'Composition (Applicative)': applicative.composition(λ)(Identity, identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Identity, identity),
    'Interchange (Applicative)': applicative.interchange(λ)(Identity, identity),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Identity.of, identity),
    'Identity (Functor)': functor.identity(λ)(Identity.of, identity),
    'Composition (Functor)': functor.composition(λ)(Identity.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Identity, identity),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Identity, identity),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Identity, identity),
    'Associativity (Monad)': monad.associativity(λ)(Identity, identity),

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
    'All (Applicative)': applicative.laws(λ)(Identity.IdentityT(Identity), run),
    'Identity (Applicative)': applicative.identity(λ)(Identity.IdentityT(Identity), run),
    'Composition (Applicative)': applicative.composition(λ)(Identity.IdentityT(Identity), run),
    'Homomorphism (Applicative)': applicative.homomorphism(λ)(Identity.IdentityT(Identity), run),
    'Interchange (Applicative)': applicative.interchange(λ)(Identity.IdentityT(Identity), run),

    // Functor tests
    'All (Functor)': functor.laws(λ)(Identity.IdentityT(Identity).of, run),
    'Identity (Functor)': functor.identity(λ)(Identity.IdentityT(Identity).of, run),
    'Composition (Functor)': functor.composition(λ)(Identity.IdentityT(Identity).of, run),

    // Monad tests
    'All (Monad)': monad.laws(λ)(Identity.IdentityT(Identity), run),
    'Left Identity (Monad)': monad.leftIdentity(λ)(Identity.IdentityT(Identity), run),
    'Right Identity (Monad)': monad.rightIdentity(λ)(Identity.IdentityT(Identity), run),
    'Associativity (Monad)': monad.associativity(λ)(Identity.IdentityT(Identity), run)
};
