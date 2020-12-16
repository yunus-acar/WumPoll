const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const oneLine = require("common-tags").oneLine;

module.exports = class VoteCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "vote",
      group: "polls",
      memberName: "vote",
      description: "Yes / no / don't care",
      examples: ['.wum vote "Do you want to vote?" "Let`s see who`s right!" 5'],
      args: [
        {
          key: "question",
          prompt: "What is the voting question?",
          type: "string",
          validate: (question) => {
            if (question.length < 101 && question.length > 11) return true;
            return "Survey questions must be between 10 and 100 characters in length.";
          },
        },
        {
          key: "detail",
          prompt: "(Optional) Any more details?",
          type: "string",
          default: " ",
          validate: (detail) => {
            if (detail.length < 201 && detail.length > 11) return true;
            return "Survey questions must be between 10 and 200 characters long.";
          },
        },
        {
          key: "time",
          prompt: "(Optional) How long should the vote take? (Minutes)",
          type: "float",
          default: 0,
          validate: (time) => {
            if (time >= 0 && time <= 60) return true;
            return "Voting time must be between 0 and 60 (min).";
          },
        },
      ],
    });
  }
  run(msg, { question, detail, time }) {
    var emojiList = ["👍", "👎", "🤷"];
    var embed = new Discord.MessageEmbed()
      .setTitle(question)
      .setDescription(detail)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL)
      .setColor(0xb80cc8) // #B80CC8 mor
      .setTimestamp();

    if (time) {
      embed.setFooter(`The voting has started and will continue ${time} minute `);
    } else {
      embed.setFooter(`Voting started and no end time`);
    }

    
    msg.channel.send({ embed }).then(async function (message) {
      var reactionArray = [];
      reactionArray[0] = await message.react(emojiList[0]);
      reactionArray[0] = await message.react(emojiList[1]);
      reactionArray[2] = await message.react(emojiList[2]);
      if (time) {
        setTimeout(() => {
            // Re-fetch the message and get reaction counts
          message.channel.messages.fetch(message.id)
                .then(async function (message) {
                    var reactionCountsArray = [];                               
                    for (var i = 0; i < reactionArray.length; i++) {
                        reactionCountsArray[i] = message.reactions.cache.get(emojiList[i]).count-1;
                    }
            //Kazananları bulun
            var max = -Infinity,
              indexMax = [];
            for (var i = 0; i < reactionCountsArray.length; ++i)
              if (reactionCountsArray[i] > max)
                (max = reactionCountsArray[i]), (indexMax = [i]);
              else if (reactionCountsArray[i] === max) indexMax.push[i];

            // Kazananları görüntüleyin
            console.log(reactionCountsArray);
            var winnersText = "";
            if (reactionCountsArray[indexMax[0]] == 0) {
              winnersText = "Nobody voted!";
            } else {
              for (var i = 0; i < indexMax.length; i++) {
                winnersText +=
                  emojiList[indexMax[i]] +

               reactionCountsArray[indexMax[i]]  + "vote\n";
              }

            }
            embed.addField("**Result(s)", winnersText);
            embed.setFooter(`The vote is now closed! ${time} it took minutes `);
            embed.setTimestamp();
            message.edit("", embed);
          });
        }, time * 60 * 1000);
      }
    }).catch(console.error);
  }
};


