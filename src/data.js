const data = [
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

const defaultGhostData = {
  'the-hare-and-the-tortoise': `[{"d":"285.90","l":[0,1,281,1,135,1,169,1,180,1,157,1,383,1,191,1,214,1,112,1,248,1,123,1,259,1,180,1,260,1,55,1,405,1,259,1,191,1,203,1,124,1,90,1,213,1,68,1,349,1,168,1,360,1,181,1,123,1,146,1,225,1,147,1,270,1,101,1,112,1,113,1,428,1,135,1,225,1,124,1,168,1,225,1,158,1,236,1,124,1,226,1,134,1,247,1,247,1,225,1,237,1,135,1,214,1,213,1,113,1,191,1,214,1,101,1,135,1,146,1,215,1,201,1,226,1,192,1,168,1,236,1,135,1,158,1,123,1,270,1,214,1,259,1,112,1,214,1,192,1,326,1,269,1,124,1,158,1,315,1,146,1,113,1,146,1,225,1,157,1,214,1,202,1,214,1,214,1,214,1,79,1,203,1,202,1,168,1,147,1,123,1,113,1,270,1,236,1,259,1,169,1,214,1,179,1,180,1,135,1,225,1,214,1,191,1,146,1,158,1,225,1,147,1,247,1,214,1,180,1,146,1,157,1,214,1,193,1,223,2,147,1,135,1,247,1,383,1,191,1,79,1,112,1,181,1,280,1,158,1,147,1,213,1,67,1,225,1,270,1,293,1,225,1,281,1,293,1,326,1,281,1,169,1,146,1,180,1,147,1,281,1,203,1,179,1,214,1,124,1,225,1,202,1,169,1,248,1,180,1,269,1,113,1,157,1,237,1,382,1,372,1,292,1,248,1,293,1,100,1,237,1,328,1,88,1,135,1,214,1,90,1,225,1,134,1,148,1,201,1,225,1,180,1,248,1,113,1,202,1,191,1,169,1,259,1,292,1,191,1,124,1,158,1,135,1,314,1,203,1,203,1,90,1,326,1,180,1,249,1,167,1,191,1,147,1,135,1,202,1,113,1,146,1,293,1,258,1,46,1,247,1,169,1,146,1,247,2,237,1,135,1,213,1,180,1,191,1,192,1,270,1,214,1,168,1,135,1,237,1,146,1,169,1,135,1,236,1,337,1,147,1,180,1,225,1,1001,1,236,1,79,1,181,1,134,1,157,1,225,1,169,1,101,1,182,1,213,1,348,1,293,1,134,1,147,1,180,1,135,1,124,1,157,1,316,1,111,1,125,1,258,1,113,1,258,1,147,1,125,1,201,1,236,1,148,1,201,1,215,1,167,1,249,1,235,1,203,1,213,1,68,1,248,1,168,1,259,1,112,1,248,1,135,1,202,1,237,1,281,1,202,1,383,1,349,1,23,1,135,1,269,1,101,1,148,1,235,1,191,1,214,1,158,1,123,1,260,1,123,1,202,1,146,1,136,1,293,1,145,1,135,1,248,1,214,1,202,1,214,1,180,1,248,1,157,1,169,1,236,1,180,1,180,1,281,1,124,1,214,1,168,1,214,1,169,1,159,1,168,1,258,1,135,1,191,1,215,1,78,1,168,1,170,1,145,1,170,1,179,1,225,1,124,1,169,1,203,1,145,1,237,1,360,1,191,1,146,1,169,1,191,1,158,1,146,1,146,1,225,1,146,1,214,1,282,1,89,1,180,2,34,1,743,1,247,1,169,1,157,1,147,1,180,1,146,1,180,1,236,1,147,1,269,1,203,1,90,1,281,1,214,1,225,1,191,1,170,1,135,1,202,1,168,1,191,1,214,1,225,1,148,1,135,1,235,1,124,1,191,1,158,1,168,1,192,1,191,1,135,1,123,1,237,1,157,1,146,1,203,1,191,1,169,1,124,1,158,1,123,1,236,1,180,1,68,1,439,1,101,1,236,2,417,1,213,1,225,1,159,1,168,1,134,1,125,1,134,1,292,1,135,1,282,1,101,1,215,1,145,1,259,1,225,1,180,1,192,1,78,1,180,1,135,1,158,1,213,1,237,1,100,1,304,1,147,1,146,1,102,1,123,1,226,1,145,1,180,1,169,1,57,1,179,1,315,1,135,1,146,1,125,1,235,1,124,1,113,1,123,1,158,1,214,1,180,1,191,1,169,1,0,3],"n":"2019. 8. 31."}]`
};

export const getDefaultGhostData = id => JSON.parse(defaultGhostData[id]);

export default data;
