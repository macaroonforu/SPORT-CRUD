#! /usr/bin/env node

console.log(
    'This script populates some test sports, coaches, teams and players to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Sport = require("./models/sport"); 
  const Coach = require("./models/coach"); 
  const Player = require("./models/player"); 
  const Team = require("./models/team"); 

  const sports = []; 
  const coaches = []; 
  const players = []; 
  const teams = [] 
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createSports();
    await createCoaches();
    await createTeams();
    await createPlayers();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function sportCreate(index, name) {
    const sport = new Sport({ name: name });
    await sport.save();
    sports[index] = sport;
    console.log(`Added sport: ${name}`);
  }
  
  async function coachCreate(index, first_name, family_name, email) {
    const coachdetail = { first_name: first_name, family_name: family_name, email: email};
  
    const coach = new Coach(coachdetail);
  
    await coach.save();
    coaches[index] = coach;
    console.log(`Added coach: ${first_name} ${family_name}`);
  }
  
  async function playerCreate(index, team, first_name, family_name, date_of_birth, email) {
    const playerdetail = {
      team: team,
      first_name: first_name,
      family_name: family_name,
      date_of_birth: date_of_birth,
      email: email 
    };
  
    const player = new Player(playerdetail);
    await player.save();
    players[index] = player;
    console.log(`Added Player: ${first_name} ${family_name}`);
  }
  
  async function teamCreate(index, sport, coach, size) {
    const teamdetail = {
      sport: sport,
      coach: coach,
      size: size 
    };
    const team = new Team(teamdetail);
    await team.save();
    teams[index] = team;
    console.log(`Added Team: ${size}`);
  }
  
  async function createSports() {
    console.log("Adding sports");
    await Promise.all([
      sportCreate(0, "Soccer"),
      sportCreate(1, "Basketball"),
      sportCreate(2, "Tennis"),
    ]);
  }
  
  async function createCoaches() {
    console.log("Adding Coaches");
    await Promise.all([
      coachCreate(0, "Patrick", "Rothfuss", "patrichRothfuss@gmail.com"),
      coachCreate(1, "Ben", "Bova", "Benbova@yahoo.com"),
      coachCreate(2, "Isaac", "Asimov", "isaacasimov@gmail.com"),
      coachCreate(3, "Bob", "Billings", "benbillings@yahoo.com"),
      coachCreate(4, "Jim", "Jones", "jimjones@gmail.com"),
    ]);
  }
  
  async function createTeams() {
    console.log("Adding Books");
    await Promise.all([
      teamCreate(0,sports[0], coaches[0], 10), 
      teamCreate(1,sports[1], coaches[2], 9),
      teamCreate(2,sports[2], coaches[4], 9),
    ]);
  }
  
  async function createPlayers() {
    console.log("Adding authors");
    await Promise.all([
      playerCreate(0, teams[0], "Claire", "Dimitriuc", "November 12 2003", "macaroonforu@gmail.com"),
      playerCreate(1, teams[1], "Jennifer", "Lopex", "November 12 2005", "bob@gmail.com"),
      playerCreate(2, teams[2], "Justin", "Bieber", "November 12 2009", "justin@gmail.com"),
    ]);
  }