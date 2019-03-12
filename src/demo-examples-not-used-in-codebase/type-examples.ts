
type Person = {
  name: string;
  age: number;
};

const people: Array<Person> = [
  { name: 'Matt', age: 22 },
  { name: 'Chris', age: 27 },
  { name: 'Conaill', age: 42 }
];

function pickPerson(persons: Array<Person>): Person {
  const index = Math.floor(Math.random() * (persons.length - 1));
  return persons[index];
}

function pickNumber(numbers: Array<number>): number {
  const index = Math.floor(Math.random() * (numbers.length - 1));
  return numbers[index];
}

const person = pickPerson(people);
const number = pickNumber([1, 2, 3]);

function pickElement<T>(input: Array<T>): T {
  const index = Math.floor(Math.random() * (input.length - 1));
  return input[index];
}

const stillAPerson = pickElement(people);
const nowItsANumber = pickElement([1, 2, 3]);


function pickPersonLike<T extends Person>(input: Array<T>): T {
  const index = Math.floor(Math.random() * (input.length - 1));
  return input[index];
}

const superheros = [
  { name: 'Matt', age: 22, superpower: 'charm' },
  { name: 'Chris', age: 27, superpower: 'looks' },
  { name: 'Conaill', age: 42, superpower: 'intellect' }
];

const randomSuperpower = pickPersonLike(superheros).superpower;

function giveItemToPerson<T extends Person, U>(input: Array<T>, item: U): T & { item: U } {
  const index = Math.floor(Math.random() * (input.length - 1));
  return {
    ...input[index],
    item,
  };
}

const superheroWithLaptop = giveItemToPerson(superheros, 'laptop');
console.log(`${superheroWithLaptop.name} has a ${superheroWithLaptop.item}`); // -> 'matt has a laptop'

const superheroWithSuperhero = giveItemToPerson(superheros, pickElement(superheros));
console.log(`${superheroWithSuperhero.name} has a ${superheroWithSuperhero.item.name}`); // -> 'chris has a conaill'


const superhero = pickPersonLike(superheros);

function pickProperty<T extends object>(object: T, properties: (keyof T)[]){
  return properties.map(prop => object[prop]);
} 

const [power, heroName] = pickProperty(superhero, ['superpower', 'name']);

type Useless<T> = {
  // for every key T has, it's value is T[key]
  [key in keyof T]: T[key];
};

// so Useless<T> is just T...

type Hero = Person & { superpower: string };

type PickProperties<TKeys extends keyof TObject, TObject> = {
  [key in TKeys]: TObject[key];
};

type NonIdentityRevealingProperties = 'superpower' | 'age';
type AnonymousSuperHero = PickProperties<NonIdentityRevealingProperties, Hero>;

// success
const spiderman: AnonymousSuperHero = { superpower: 'spider stuff', age: 30 };


type Lion = { meow: () => void; eat: (food: string) => void; age: number; }
type Zebra = { bark: () => void; eat: (food: string) => void; age: number; }
type Tiger = { meow: () => void; eat: (food: string) => void; age: number; }
type Shark = { splash: () => void; eat: (food: string) => void; age: number; }

type Animal = Lion | Zebra | Tiger | Shark;

type ExtractCat<T> = T extends { meow: () => void; } ? T : never;

type CatAnimals = ExtractCat<Animal>; // Tiger | Shark

// Evaluating ExtractCat under the hood

type CatAnimals1 =
  | ExtractCat<Lion>  // T extends { meow: () => void; } is true, so give us T (Lion)
  | ExtractCat<Zebra> // T extends { meow: () => void; } is false, so give us never
  | ExtractCat<Tiger> // T extends { meow: () => void; } is true, so give us T (Lion)
  | ExtractCat<Shark> // T extends { meow: () => void; } is false, so give us never

type CatAnimals2 =
  | Lion
  | never
  | Tiger
  | never;

type CatAnimals3 =
  | Lion
  | Tiger;


type ExcludeType<T, U> = T extends U ? never : T;

type NullablePrimitive = number | string | boolean | null | undefined;

// give us all the T's, unless they are assignable to null or undefined
type NotNullable<T> = ExcludeType<T, null | undefined>; 


type NonNullableNumber = NotNullable<NullablePrimitive>;

// Creating Subtract<T, U>
// Start by getting only the keys in T
type KeysOnlyInT<T, U> = Exclude<keyof T, keyof U>;

// Then iterate keys and map to T[key]
type SubtractVerbose<T, U> = {
  [key in KeysOnlyInT<T, U>]: T[key];
}

// Above is actualy just Pick<T, U>, so subtract can be written:
type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

type OnlyTheSuperPower = Subtract<Hero, Person>;

type OnlyTheSuperPower2 = {
  [key in Exclude<keyof Hero, keyof Person>]: Hero[key];
}

type OnlyTheSuperPower3 = {
  [key in (
      ('superpower' extends 'age' | 'name' ? never : 'superpower') // -> 'superpower'
    | ('name' extends 'age' | 'name'  ?  never : 'name') // -> never
    | ('age' extends 'age' | 'name'  ?  never : 'name') // -> never
  )]: Hero[key]
};

type OnlyTheSuperPower4 = {
  [key in 'superpower']: Hero[key]
};

type OnlyTheSuperPower5 = {
  'superpower': Hero['superpower']
};

export {};