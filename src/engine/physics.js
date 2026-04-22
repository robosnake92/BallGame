import Matter from 'matter-js';

const { Engine, World, Bodies, Body, Events } = Matter;

let engine;
let world;

export function initPhysics() {
  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 1;
  return { engine, world };
}

export function stepPhysics(delta) {
  Engine.update(engine, delta);
}

export function addBody(body) {
  World.add(world, body);
}

export function removeBody(body) {
  World.remove(world, body);
}

export function onCollision(callback) {
  Events.on(engine, 'collisionStart', callback);
}

export function getEngine() {
  return engine;
}

export function getWorld() {
  return world;
}

export { Bodies, Body, Matter };
