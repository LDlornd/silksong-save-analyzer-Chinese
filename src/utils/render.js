import collections from "@/data/Chinese_collections.json"

export const render = (user_save) => {
    const collections_by_act = {1: [], 2: [], 3: []};

    console.log(collections);

    collections.forEach(category => {
        category.items.forEach(item => {
            let act = item.whichAct; 
            if (act == 0) act = 1; // 默认放到 Act 1 里，因为游戏里没有真正的 "Act 0"
            collections_by_act[act].push({
                ...item, 
                category: {
                    name: category.name,
                    description: category.tooltip,
                    Chinese_name: category.Chinese_name
                }
            });
        });
    });

    console.log("collections_by_act: ", collections_by_act);

    const result = { 1: {}, 2: {}, 3: {} };

    Object.keys(collections_by_act).forEach(act_id => {
        console.log("act_id: ", act_id);
        collections_by_act[act_id].forEach(item => {
            const catName = item.category.name;
            if (!result[act_id][catName]) {
                result[act_id][catName] = {
                    description: item.category.description,
                    Chinese_name: item.category.Chinese_name,
                    items: []
                };
            }
            if (item.prereqs.length == 0) {
                item.prereqs = "无";
            } else {
                item.prereqs = item.prereqs.join(", ");
            }
            item.IsUnlocked = isItemUnlockedInPlayerSave(item.parsingInfo, user_save);
            if (item.IsUnlocked) {
                item.IsUnlocked = "已解锁";
            } else {
                item.IsUnlocked = "未解锁";
            }
            
            result[act_id][catName].items.push(item);
        });
    });

    return result;
}

const isItemUnlockedInPlayerSave = (itemParsingInfo, saveData) => {
	const playerData = saveData.playerData ?? {};
	const sceneData = saveData.sceneData?.persistentBools?.serializedList ?? [];

	const typeHandlers = {
		flag: (flagName) => !!playerData[flagName],

		tempintflag: ([flagName, reqValue]) => {
			return !!playerData[flagName] && playerData[flagName] >= reqValue;
		},

		quest: (questName) => {
			const questEntry = playerData.QuestCompletionData?.savedData?.find(
				(x) => x.Name === questName,
			);

			return questEntry?.Data?.IsCompleted ?? false;
		},

		sceneData: ([sceneName, Id]) => {
			const scene = sceneData.find(
				(x) => x.SceneName === sceneName && x.ID === Id,
			);
			return scene?.Value ?? false;
		},

		tool: (toolName) => {
			const toolEntry = playerData.Tools?.savedData?.find(
				(x) => x.Name === toolName,
			);
			return (
				!!toolEntry && toolEntry.Data.IsUnlocked && !toolEntry.Data.IsHidden
			);
		},

		upgradabletool: (listOfVariantNames) => {
			return listOfVariantNames.some((variantName) =>
				typeHandlers.tool(variantName),
			);
		},

		crest: (crestName) => {
			const crestEntry = playerData.ToolEquips?.savedData?.find(
				(x) => x.Name === crestName,
			);
			return !!crestEntry && crestEntry.Data.IsUnlocked;
		},

		collectable: (itemName) => {
			const collectableEntry = playerData.Collectables?.savedData?.find(
				(x) => x.Name === itemName,
			);
			return !!collectableEntry && collectableEntry.Data.Amount > 0;
		},
	};

	const handler = typeHandlers[itemParsingInfo.type];
	if (!handler)
		throw new Error(`Unknown ParsingInfo type:${itemParsingInfo.type}`);

	return handler(itemParsingInfo.internalId);
}