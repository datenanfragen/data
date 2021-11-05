// Returns a type with all properties that `A` and `B` have in common.
// (I'd call that the "intersection" of the two types but TypeScript already uses that term for something else…)
// Taken from:
// https://stackoverflow.com/questions/62909816/how-to-pick-common-properties-from-two-types#comment111258834_62909906
export type Common<A, B> = Pick<A, keyof (A | B)>;
