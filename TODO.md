# Ball Game — TODO

## Twitch Integration
- [ ] Connect to Twitch chat via Twitch API (tmi.js or similar)
- [ ] Auto-assign pegs to chatters as they join/type in chat
- [ ] Map chat commands: `left`, `right`, `up`, `down` to peg movement
- [ ] Map chat command: `scream` to trigger scream sound effect
- [ ] Handle chatter disconnect / peg reassignment
- [ ] Display Twitch username on assigned pegs
- [ ] Streamer config panel (channel name, max chatters, etc.)

## Power-ups (Green Pegs)
- [ ] Multiball — ball splits into 3 on green peg hit
- [ ] Fireball — ball explodes on contact, clearing nearby pegs in a radius
- [ ] Guide line — show full trajectory prediction for the next shot
- [ ] Freeze — temporarily stop all chatter-controlled pegs from moving
- [ ] Spooky ball — ball returns to the top instead of falling off the bottom
- [ ] Power-up selection (random per round, or let streamer choose)

## Levels
- [ ] Multiple board layouts (not just staggered grid)
- [ ] Artistic/themed peg arrangements (spirals, shapes, patterns)
- [ ] Level progression — complete one board, advance to the next
- [ ] Difficulty scaling (more orange pegs, fewer balls, faster chatter movement)
- [ ] Level select screen

## Sound Effects
- [ ] Ball launch sound
- [ ] Peg hit sound (pitch increases with combo count like Peggle's "Ode to Joy")
- [ ] Peg removal / clear sound
- [ ] Win fanfare
- [ ] Lose sound
- [ ] Bucket catch sound
- [ ] Background music
- [ ] Volume controls

## Visual Polish
- [ ] Particle effects on peg hits
- [ ] Screen shake on big combos
- [ ] Score popup numbers floating up from hit pegs
- [ ] Better launcher visual (animated cannon)
- [ ] Background art / themes per level
- [ ] Peg hit combo counter display
- [ ] Smooth camera or zoom effects

## Gameplay Features
- [ ] Long shot bonus (ball travels far before first hit)
- [ ] Style shot detection (skillful bounces)
- [ ] Fever mode when last few orange pegs remain (like Peggle's Extreme Fever)
- [ ] Leaderboard / high score tracking
- [ ] Replay system — save and replay impressive shots
- [ ] Chatter scoring — track which chatters survived the longest

## Streamer Features
- [ ] OBS browser source optimization (transparent background option)
- [ ] Overlay mode (game renders on top of stream content)
- [ ] Chat voting for next level or power-up
- [ ] Streamer vs chat scoreboard
- [ ] Configurable game speed / difficulty
- [ ] Pause/resume controls

## Technical
- [ ] Mobile/touch input support
- [ ] Performance optimization for 100+ moving pegs
- [ ] Deployment (hosting, shareable URL)
- [ ] Automated testing
