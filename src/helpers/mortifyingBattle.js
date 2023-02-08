const calcBattle = () => {
  try {
    let villainAttackValue = Math.floor(Math.random() * 100) + 1;
    let mortimerAttackValue = Math.floor(Math.random() * 100) + 1;
    mortimerAttackValue += 25;

    const arr = [
      {
        name: "Villain",
        attackValue: villainAttackValue,
      },
      {
        name: "Mortimer",
        attackValue: mortimerAttackValue,
      },
    ];
    return arr;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  calcBattle,
};
