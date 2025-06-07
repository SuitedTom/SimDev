const AUDIENCE_SEGMENTS = {
  casual: {
    name: "Casual Gamers",
    loyaltyGain: 1.2,
    preferences: {
      puzzle: 1.5,
      idle: 1.3,
      simulation: 1.1,
      sports: 1.0,
      adventure: 0.9,
      rpg: 0.7,
      fighting: 0.6,
      survival: 0.7,
      racing: 0.9,
      horror: 0.5
    }
  },
  hardcore: {
    name: "Hardcore Gamers",
    loyaltyGain: 0.8,
    preferences: {
      rpg: 1.5,
      fighting: 1.3,
      survival: 1.2,
      racing: 1.1,
      horror: 1.2,
      sports: 0.9,
      simulation: 0.8,
      puzzle: 0.7,
      idle: 0.6,
      adventure: 1.0
    }
  },
  critics: {
    name: "Game Critics",
    loyaltyGain: 1.0,
    preferences: {
      adventure: 1.3,
      horror: 1.2,
      racing: 1.1,
      rpg: 1.2,
      simulation: 1.0,
      fighting: 1.0,
      survival: 1.0,
      puzzle: 0.9,
      sports: 0.9,
      idle: 0.8
    }
  },
  all: {
    name: "All Audiences",
    loyaltyGain: 1.0,
    preferences: {
      puzzle: 1.0,
      idle: 1.0,
      simulation: 1.0,
      sports: 1.0,
      adventure: 1.0,
      rpg: 1.0,
      fighting: 1.0,
      survival: 1.0,
      racing: 1.0,
      horror: 1.0
    }
  }
};

const SOCIAL_MENTIONS = {
  positive: [
    "{company}'s new {genre} game is amazing! Must play!",
    "Can't stop playing the new release from {company}!",
    "Finally, a {genre} game done right! Great job {company}!"
  ],
  neutral: [
    "{company}'s new {genre} game is decent, worth checking out",
    "Interesting attempt at {genre} by {company}",
    "Not bad for {company}'s take on the {genre} genre"
  ],
  negative: [
    "Expected more from {company}'s new {genre} game",
    "The new {genre} game from {company} needs more work",
    "{company} should stick to what they know better"
  ]
};

// Make these available globally
window.AUDIENCE_SEGMENTS = AUDIENCE_SEGMENTS;
window.SOCIAL_MENTIONS = SOCIAL_MENTIONS;
