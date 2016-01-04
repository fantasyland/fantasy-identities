const λ = require('fantasy-check/src/adapters/nodeunit');
const applicative = require('fantasy-check/src/laws/applicative');
const functor = require('fantasy-check/src/laws/functor');
const monad = require('fantasy-check/src/laws/monad');

const {isInstanceOf} = require('fantasy-helpers');
const {identity} = require('fantasy-combinators');
const {equals} = require('fantasy-equality');

const Identity = require('../fantasy-identities');

const isIdentity = isInstanceOf(Identity);
const isIdentityOf = isInstanceOf(identityOf);

function identityOf(type) {
    const self = this.getInstance(this, identityOf);
    self.type = type;
    return self;
}

function run(a) {
    return a.run;
}

const λʹ = λ
    .property('identityOf', identityOf)
    .method('arb', isIdentityOf, function(a, b) {
        return Identity.of(this.arb(a.type, b - 1));
    });

exports.identity = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λʹ)(Identity, identity),
    'Identity (Applicative)': applicative.identity(λʹ)(Identity, identity),
    'Composition (Applicative)': applicative.composition(λʹ)(Identity, identity),
    'Homomorphism (Applicative)': applicative.homomorphism(λʹ)(Identity, identity),
    'Interchange (Applicative)': applicative.interchange(λʹ)(Identity, identity),

    // Functor tests
    'All (Functor)': functor.laws(λʹ)(Identity.of, identity),
    'Identity (Functor)': functor.identity(λʹ)(Identity.of, identity),
    'Composition (Functor)': functor.composition(λʹ)(Identity.of, identity),

    // Monad tests
    'All (Monad)': monad.laws(λʹ)(Identity, identity),
    'Left Identity (Monad)': monad.leftIdentity(λʹ)(Identity, identity),
    'Right Identity (Monad)': monad.rightIdentity(λʹ)(Identity, identity),
    'Associativity (Monad)': monad.associativity(λʹ)(Identity, identity),

    // Manual tests    
    'when testing traverse should return correct value': λʹ.check(
        (a) => {
            return equals(a.traverse(identity, Identity), a);
        },
        [λʹ.identityOf(λʹ.identityOf(Number))]
    ),
    'when testing sequence should return correct type': λʹ.check(
        (a) => {
            return isIdentity(a.sequence());
        },
        [λʹ.identityOf(λʹ.identityOf(Number))]
    ),
    'when testing sequence should return correct nested type': λʹ.check(
        (a) => {
            return isIdentity(a.sequence().x);
        },
        [λʹ.identityOf(λʹ.identityOf(Number))]
    ),
    'when testing sequence should return correct value': λʹ.check(
        (a) => {
            return a.sequence().x.x === a.x.x;
        },
        [λʹ.identityOf(λʹ.identityOf(Number))]
    )
};

exports.identityT = {

    // Applicative Functor tests
    'All (Applicative)': applicative.laws(λʹ)(Identity.IdentityT(Identity), run),
    'Identity (Applicative)': applicative.identity(λʹ)(Identity.IdentityT(Identity), run),
    'Composition (Applicative)': applicative.composition(λʹ)(Identity.IdentityT(Identity), run),
    'Homomorphism (Applicative)': applicative.homomorphism(λʹ)(Identity.IdentityT(Identity), run),
    'Interchange (Applicative)': applicative.interchange(λʹ)(Identity.IdentityT(Identity), run),

    // Functor tests
    'All (Functor)': functor.laws(λʹ)(Identity.IdentityT(Identity).of, run),
    'Identity (Functor)': functor.identity(λʹ)(Identity.IdentityT(Identity).of, run),
    'Composition (Functor)': functor.composition(λʹ)(Identity.IdentityT(Identity).of, run),

    // Monad tests
    'All (Monad)': monad.laws(λʹ)(Identity.IdentityT(Identity), run),
    'Left Identity (Monad)': monad.leftIdentity(λʹ)(Identity.IdentityT(Identity), run),
    'Right Identity (Monad)': monad.rightIdentity(λʹ)(Identity.IdentityT(Identity), run),
    'Associativity (Monad)': monad.associativity(λʹ)(Identity.IdentityT(Identity), run)
};
