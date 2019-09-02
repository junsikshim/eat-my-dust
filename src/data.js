import { $r } from './utils';
import {
  ACTION_CORRECT,
  ACTION_FINISH,
  ACTION_INCORRECT
} from './scene/GameScene';

let data = [
  {
    id: 'the-hare-and-the-tortoise',
    title: 'The Hare and the Tortoise',
    text: `Once, a hare saw a tortoise walking slowly with a heavy shell on his back. The hare was very proud of himself and he asked the tortoise. "Shall we have a race?" The tortoise agreed. They started the running race. The hare ran very fast. But the tortoise walked very slowly. The proud hare rested under a tree and soon slept off. But the tortoise walked very fast, slowly and steadily and reached the goal. At last, the tortoise won the race.`
  }
  // {
  //   id: 'the-sick-lion',
  //   title: 'The Sick Lion',
  //   text: `A lion, unable from old age and infirmities to provide himself with food by force, resolved to do so by artifice. He returned to his den, and lying down there, pretended to be sick, taking care that his sickness should be publicly known. The beasts expressed their sorrow, and came one by one to his den, where the lion devoured them. After many of the beasts had thus disappeared, the fox discovered the trick and presenting himself to the lion, stood on the outside of the cave, at a respectful distance, and asked him how he was. "I am very middling," replied the Lion, "but why do you stand without? Pray enter within to talk with me." "No, thank you," said the Fox. "I notice that there are many prints of feet entering your cave, but I see no trace of any returning."`
  // },
  // {
  //   id: 'the-shepherds-boy-and-the-wolf',
  //   title: `The Shepherd's Boy and the Wolf`,
  //   text: `A shepherd-boy, who watched a flock of sheep near a village, brought out the villagers three or four times by crying out, "Wolf! Wolf!" and when his neighbors came to help him, laughed at them for their pains. The wolf, however, did truly come at last. The shepherd-boy, now really alarmed, shouted in an agony of terror: "Pray, do come and help me; the wolf is killing the sheep;" but no one paid any heed to his cries, nor rendered any assistance. The wolf, having no cause of fear, at his leisure lacerated or destroyed the whole flock.`
  // }
];

export let generateGhostData = len => {
  let list = [0, 1];

  for (let i = 0; i < len - 1; i++) {
    let diff = Math.floor($r() * 200) + 100;
    let action = $r() * 100 < 1 ? ACTION_INCORRECT : ACTION_CORRECT;

    list.push(diff, action);
  }

  list.push(0, ACTION_FINISH);

  return {
    d: -1,
    l: list,
    isBot: true
  };
};

export default data;
