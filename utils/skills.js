import { getItemId } from "./mcdata.js";
import pf from 'mineflayer-pathfinder';


/**
 * Attempt to craft the given item.
 * @param {MinecraftBot} bot, reference to the minecraft bot.
 * @param {string} item_name, the item name to craft.
 * @returns {Promise<boolean>} true if the item was crafted, false otherwise.
 * @example
 * await skills.CraftItem(bot, "wooden_pickaxe");
 **/
export async function CraftItem(bot, itemName) {
    let recipes = bot.recipesFor(getItemId(itemName), null, 1, null);  // TODO add crafting table as final arg
    await bot.craft(recipes[0], 1, null);
    return true;
}


/**
 * Navigate to the given player.
 * @param {MinecraftBot} bot, reference to the minecraft bot.
 * @param {string} username, the username of the player to navigate to.
 * @returns {Promise<boolean>} true if the player was found, false otherwise.
 * @example
 * await skills.GoToPlayer(bot, "player");
 **/
export async function GoToPlayer(bot, username) {
    let player = bot.players[username].entity
    if (!player)
        return false;

    bot.pathfinder.setMovements(new pf.Movements(bot));
    let pos = player.position;
    bot.pathfinder.setGoal(new pf.goals.GoalNear(pos.x, pos.y, pos.z, 3));
    return true;
}