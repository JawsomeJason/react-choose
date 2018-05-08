import React from 'react';
import Choose from '../components/Choose';

const ACCORD = { label: 'Accord', value: 'accord' };
const CAMRY = { label: 'Camry', value: 'camry' };
const CIVIC = { label: 'Civic', value: 'civic' };
const TUNDRA = { label: 'Tundra', value: 'tundra' };

const CARS = [ACCORD, CAMRY, CIVIC, TUNDRA];

const HONDA = {
  label: 'Honda',
  options: [ACCORD, CIVIC],
};

const TOYOTA = {
  label: 'Toyota',
  options: [CAMRY, TUNDRA]
}

const CARS_BY_MAKE = [
  HONDA,
  TOYOTA,
];

export default () => (
  <div>
    <h1>{'<Choose>'}</h1>

    <p>
      Below are two examples of the same set of options rendered as different input types.
      Each input is an example of different attributes for `type`, `multiple`, and `value`
    </p>


    <h2>Cars</h2>

    <p>Uses the following options</p>
    <pre><code>{JSON.stringify(CARS, null, '  ')}</code></pre>

    <h3><code>{'<Choose type="select" options={CARS} value="accord" />'}</code></h3>
    <Choose name="cars-select" options={CARS} value={ACCORD.value} />

    <h3><code>{'<Choose type="select" multiple options={CARS} value={[\'accord\', \'camry\']} />'}</code></h3>
    <Choose name="cars-multi-select" multiple options={CARS} value={[ACCORD.value, CAMRY.value]} />

    <h3><code>{'<Choose type="text" options={CARS} />'}</code></h3>
    <Choose name="cars-input" type="text" options={CARS} />

    <h3><code>{'<Choose type="list" options={CARS} />'}</code></h3>
    <Choose name="cars-list" type="list" options={CARS} />

    <h3><code>{'<Choose name="cars-multi-list" type="list" multiple options={CARS} value="civic" />'}</code></h3>
    <Choose name="cars-multi-list" type="list" multiple options={CARS} value="civic" />

    <h2>Cars By Make</h2>
    
    <p>Uses the following <code>options=CARS_BY_MAKE</code></p>
    <pre><code>{JSON.stringify(CARS_BY_MAKE, null, '  ')}</code></pre>

    <h3><code>{'<Choose type="select" options={CARS_BY_MAKE} value="accord" />'}</code></h3>
    <Choose name="cars-select" options={CARS_BY_MAKE} value={ACCORD.value} />

    <h3><code>{'<Choose type="select" multiple options={CARS_BY_MAKE} value={[\'accord\', \'camry\']} />'}</code></h3>
    <Choose name="cars-multi-select" multiple options={CARS_BY_MAKE} value={[ACCORD.value, CAMRY.value]} />

    <h3><code>{'<Choose type="text" options={CARS_BY_MAKE} />'}</code></h3>
    <Choose name="cars-input" type="text" options={CARS_BY_MAKE} />

    <h3><code>{'<Choose type="list" options={CARS_BY_MAKE} />'}</code></h3>
    <Choose name="cars-list" type="list" options={CARS_BY_MAKE} />

    <h3><code>{'<Choose name="cars-multi-list" type="list" multiple options={CARS_BY_MAKE} value="civic" />'}</code></h3>
    <Choose name="cars-multi-list" type="list" multiple options={CARS_BY_MAKE} value="civic" />
  </div>
);