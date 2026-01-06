// Best-guess mapping based on `stuff` table columns/context
// LSPD, FBI, SAST, FMD, SANG, GOV, SCOTUS, NEWS, TAXI, SAPD
const FACTION_NAMES = [
  "Civilian", // 0
  "Los Santos Police Dept", // 1
  "Federal Bureau of Investigation", // 2
  "San Andreas National Guard", // 3 (SANG)
  "Fire & Medic Dept", // 4 (FMD)
  "La Cosa Nostra", // 5 (Guess - Mafia usually)
  "Yakuza", // 6 (Guess)
  "Government", // 7 (GOV)
  "Hitmen Agency", // 8 (Guess)
  "News Reporter", // 9 (NEWS)
  "Taxi Company", // 10 (TAXI)
  "Driving Instructors", // 11
  "Supreme Court (SCOTUS)", // 12
  "San Andreas Sheriff Dept", // 13 (SAST/RCSD?)
  "San Andreas Police Dept" // 14 (SAPD - maybe state park police?)
];

const FAMILY_NAMES = [
  "None", // 0
  "Grove Street Families", // 1
  "The Ballas", // 2
  "Los Santos Vagos", // 3
  "Varrios Los Aztecas", // 4
  "San Fierro Rifa", // 5
  "Da Nang Boys", // 6
  "Triads", // 7
  "Italian Mafia", // 8
  "Russian Mafia", // 9
  "Biker Gang" // 10
];

// Helper to safely get faction name
export const getFactionName = (id: number) => FACTION_NAMES[id] || `Faction #${id}`;

// Helper to safely get family name
export const getFamilyName = (id: number) => FAMILY_NAMES[id] || `Family #${id}`;

const GROUP_NAMES: Record<number, string> = {
    1: "Traffic Division",
    2: "S.W.A.T",
    3: "Investigative Services", 
    5: "Community Service",
    7: "Gang Intelligence",
    10: "Training Bureau",
    11: "Air Support",
    12: "Internal Affairs",
    14: "Unassigned / Civilian"
};

export const mapAffiliations = (row: any) => {
  const affiliations: any[] = [];
  const toNumber = (v: any) => Number(v) || 0;

  // 1. Group (Division) Logic
  const groupId = toNumber(row.Group);
  let groupName = "";
  let groupRank = 0;
  let isGroupValid = false;

  if (groupId > 0 && groupId !== 14 && groupId !== 255) {
      groupRank = toNumber(row.GroupRank);
      const dbNick = row.pGroupNick || row.GroupNick;
      groupName = (dbNick && dbNick !== 'None') ? dbNick : (GROUP_NAMES[groupId] || `Group #${groupId}`);
      isGroupValid = true;
  }

  // 2. Faction (Member/Leader)
  const memberId = toNumber(row.Member);
  const leaderId = toNumber(row.Leader);
  const factionId = leaderId > 0 ? leaderId : memberId;

  // Check if group should be merged as a division
  // Merge if user is in a faction AND has a valid group (that isn't Community Service/Punishment)
  const shouldMergeGroup = factionId > 0 && isGroupValid && groupId !== 5;

  if (factionId > 0) {
    const rankVal = toNumber(row.Rank);
    affiliations.push({
      id: factionId,
      name: getFactionName(factionId),
      type: 'Faction',
      rank: `Rank ${rankVal}`,
      rankId: rankVal,
      isLeader: leaderId > 0 || rankVal >= 6, // Treat Rank 6+ as management
      wage: 0,
      division: shouldMergeGroup ? groupName : undefined
    });
  }

  // 3. Family (FMember)
  const familyId = toNumber(row.FMember);
  if (familyId > 0 && familyId !== 255) { 
    const rankVal = toNumber(row.Rank); // Assuming simplified shared rank column for now
    affiliations.push({
      id: familyId,
      name: getFamilyName(familyId), 
      type: 'Family',
      rank: `Rank ${rankVal}`,
      rankId: rankVal,
      isLeader: row.HeadValue > 0 || rankVal >= 5, // Families often have Rank 5 as leader equivalent
    });
  }

  // 4. Group (Standalone)
  // Only add if NOT merged
  if (isGroupValid && !shouldMergeGroup) {
      affiliations.push({
          id: groupId,
          name: groupName,
          type: 'Group',
          rank: `Rank ${groupRank}`,
          rankId: groupRank,
          isLeader: groupRank >= 5 
      });
  }

  // 5. Agency (Job = 8 for Hitman)
  const jobId = toNumber(row.Job);
  if (jobId === 8) {
    const hitmanRank = toNumber(row.HitmanRank);
    const completedHits = toNumber(row.CHits);
    
    // Construct a descriptive rank string
    let rankStr = "Agent";
    if (hitmanRank > 0) rankStr = `Rank ${hitmanRank}`;
    if (completedHits > 0) rankStr += ` (${completedHits} Hits)`;

    affiliations.push({
      id: 8, // Using job ID as affiliation ID
      name: "Hitman Agency",
      type: 'Agency',
      rank: rankStr,
      rankId: hitmanRank || 0,
      isLeader: false // Job system typically doesn't track leadership directly
    });
  }

  return affiliations;
};
