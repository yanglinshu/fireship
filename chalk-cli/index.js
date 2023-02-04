#!/usr/bin/env node

import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";

let playerName;

const sleep = (ms = 2000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleAnswer = async (isCorrect) => {
  const spinner = createSpinner("Checking your answer...").start();
  await sleep(1000);

  if (isCorrect) {
    spinner.success({
      text: `🎉 Congratulations ${playerName}! You are still alive! 🎉`,
    });
  } else {
    spinner.error({
      text: `💀 Game Over, stay at home and wait to be arrested 💀 ${playerName}`,
    });
    process.exit(1);
  }
};

await (async () => {
  const rainbowTitle = chalkAnimation.rainbow(
    "Who Wants To Be The Chairman of the Party? \n"
  );

  await sleep(2000);
  rainbowTitle.stop();

  console.log(`
I am the Chairman of the Party. I will ask you some questions.
If you get any question wrong, you will be ${chalk.bgRed("eliminated")}.
So get all the questions right...
    `);
})();

await (async () => {
  const anwsers = await inquirer.prompt({
    name: "player_name",
    type: "input",
    message: "What is your name?",
    default() {
      return "Prime Minister of the Party";
    },
  });

  playerName = anwsers.player_name;
})();

await (async () => {
  const anwsers = await inquirer.prompt({
    name: "question_1",
    type: "list",
    message: "Who eliminated the corrupt officials in the government?",
    choices: [
      "The Chairman of the Party",
      "Former Chairman of the Party",
      "Founder of the Party",
      "The People",
    ],
  });

  handleAnswer(anwsers.question_1 === "The Chairman of the Party");
})();

await (async () => {
  await sleep(2000);

  console.clear();
  const msg = `Congratulations ${playerName}!`;

  figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  console.log(`You are still alive! Now you are the Chairman of the Party!`);
})();
