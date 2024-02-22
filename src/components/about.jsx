import React from 'react';

const About = () => {
  return (
    <div className="about-container bg-gray-800 text-white p-4">
      <h2 className="text-3xl font-bold">About Boids Algorithm</h2>
      <p className="text-lg mt-4">
        The Boids algorithm, developed by Craig Reynolds in 1986, simulates the flocking behavior of birds. It is a
        simple but effective model for creating natural-looking animations of group motion.
      </p>
      <p className="text-lg mt-4">
        The key principles behind the Boids algorithm are separation, alignment, and cohesion:
      </p>
      <ul className="list-disc pl-8 text-lg mt-2">
        <li><strong>Separation:</strong> Boids try to maintain a minimum distance between themselves and their neighbors to avoid collisions.</li>
        <li><strong>Alignment:</strong> Boids try to align their velocity with the average velocity of their neighbors.</li>
        <li><strong>Cohesion:</strong> Boids try to move towards the center of mass of their neighbors.</li>
      </ul>
      <p className="text-lg mt-4">
        By combining these three principles, the Boids algorithm produces emergent behavior that resembles the flocking
        behavior seen in birds, schools of fish, and herds of animals in nature.
      </p>
      <p className="text-lg mt-4">
        In this simulation, each "boid" (bird) follows these rules based on the positions and velocities of nearby boids,
        resulting in a mesmerizing display of collective motion.
      </p>
    </div>
  );
};

export default About;
